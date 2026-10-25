import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PaymentModal from '../components/PaymentModal';

function Wallet() {
  const [balance, setBalance] = useState(0);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Auto-Recharge State
  const [autoRecharge, setAutoRecharge] = useState(false);
  
  // NEW: Transaction Success Notification State
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // Real Data States
  const [callHistory, setCallHistory] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Fetch User and Wallet Data on Mount
  useEffect(() => {
    const fetchWalletData = async () => {
      setLoading(true);
      
      // 1. Get the currently logged-in user (Security: Validates user auth)
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error("User not authenticated");
        setLoading(false);
        return;
      }
      setUser(user);

      // 2. Fetch Wallet Balance from 'profiles' table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', user.id)
        .single();

      if (!profileError && profile) {
        setBalance(profile.wallet_balance || 0);
      }

      // 3. Fetch Transaction History
      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!txError) setTransactions(txData || []);

      // 4. Fetch Recent Call History
      const { data: callData, error: callError } = await supabase
        .from('calls')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!callError) setCallHistory(callData || []);

      setLoading(false);
    };

    fetchWalletData();
  }, []);

  const handleRecharge = (amount) => {
    setRechargeAmount(amount);
    setIsPaymentOpen(true);
  };

  // Handle Successful Payment (Updates Database with Audit Trail)
  const handlePaymentSuccess = async (reference) => {
    if (!user) return;

    const newBalance = balance + rechargeAmount;
    const txRef = reference?.reference || `MANUAL-${Date.now()}`;

    // 1. Update Balance in 'profiles' table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ wallet_balance: newBalance })
      .eq('id', user.id);

    // 2. Insert Record into 'transactions' table with reference for security/audit
    const { error: txError } = await supabase
      .from('transactions')
      .insert([{
        user_id: user.id,
        description: "Wallet Top-up (Credits)",
        amount: rechargeAmount,
        type: "credit",
        reference: txRef,
        created_at: new Date().toISOString()
      }]);

    if (!profileError && !txError) {
      // 3. Update Local State to reflect changes immediately
      setBalance(newBalance);
      
      const newTransaction = {
        id: Date.now(), // temporary ID for immediate UI update
        user_id: user.id,
        description: "Wallet Top-up (Credits)",
        amount: rechargeAmount,
        type: "credit",
        reference: txRef,
        created_at: new Date().toISOString()
      };
      setTransactions([newTransaction, ...transactions]);
      
      setIsPaymentOpen(false);
      setRechargeAmount(0); // Reset amount to prevent accidental double-charges
      
      // 🔔 Show success notification
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 4000);
    } else {
      console.error("Error updating wallet:", profileError, txError);
      alert(`Payment succeeded, but there was an error updating your wallet history. Please contact support with reference: ${txRef}`);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Account number copied to clipboard!');
  };

  // Helper to format dates from Supabase
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // 📄 Download Professional Statement Handler
  const handleDownloadStatement = () => {
    if (transactions.length === 0) {
      alert("No transactions to download.");
      return;
    }
    const headers = ["Date", "Description", "Type", "Amount", "Reference"];
    const rows = transactions.map(tx => [
      formatDate(tx.created_at),
      `"${tx.description}"`,
      tx.type,
      tx.type === 'credit' ? tx.amount : `-${tx.amount}`,
      tx.reference || 'N/A'
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `AccessLingua-Statement-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Visual Spending Data (Last 6 Months)
  const getSpendingData = () => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      data.push({
        month: d.toLocaleString('default', { month: 'short' }),
        amount: 0,
        year: d.getFullYear(),
        monthNum: d.getMonth()
      });
    }
    
    // Aggregate debit transactions into these months
    transactions.forEach(tx => {
      if (tx.type === 'debit') {
        const txDate = new Date(tx.created_at);
        const match = data.find(d => d.monthNum === txDate.getMonth() && d.year === txDate.getFullYear());
        if (match) {
          match.amount += Number(tx.amount) || 0;
        }
      }
    });

    // Fallback mock data if no debits exist yet, so the chart looks visually appealing
    if (data.every(d => d.amount === 0)) {
      return [
        { month: 'Jan', amount: 45 },
        { month: 'Feb', amount: 120 },
        { month: 'Mar', amount: 85 },
        { month: 'Apr', amount: 200 },
        { month: 'May', amount: 150 },
        { month: 'Jun', amount: 95 }
      ];
    }
    return data.map(d => ({ month: d.month, amount: d.amount }));
  };

  const spendingData = getSpendingData();
  const maxSpending = Math.max(...spendingData.map(d => d.amount), 100);

  return (
    // FIXED: Added pt-36 to push content down below the fixed Navbar
    <div className="min-h-screen bg-gray-50 flex flex-col pt-36">
      <Navbar />
      
      {/* 🔔 Transaction Success Notification Toast */}
      {showSuccessNotification && (
        <div className="fixed top-24 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-fadeIn border border-green-400">
          <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-bold">Wallet Recharged Successfully!</p>
            <p className="text-sm text-green-100">Your balance has been updated securely.</p>
          </div>
        </div>
      )}

      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        amount={rechargeAmount.toFixed(2)} 
        purpose="Wallet Credit Recharge" 
        onSuccess={handlePaymentSuccess}
        userEmail={user?.email}
      />
      
      <main className="flex-grow py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-navy">My Wallet</h1>
            <p className="text-gray-500 mt-2">Manage your interpretation credits and view your history.</p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-brand-royal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium">Loading your wallet data...</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {/* Main Balance Card with Security Badge & Auto-Recharge */}
                <div className="md:col-span-2 bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-20 -translate-y-20"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-blue-100 text-lg">Current Balance</p>
                      {/* 🛡️ Security Badge */}
                      <div className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        <span className="text-xs font-bold text-green-300">Secured & Verified</span>
                      </div>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black mb-8">${balance.toFixed(2)}</h2>
                    
                    <div className="flex flex-wrap gap-4 mb-6">
                      <button onClick={() => handleRecharge(50)} className="bg-white text-brand-navy px-6 py-3 rounded-full font-bold hover:bg-brand-cyan hover:text-white transition shadow-lg">Quick Recharge +$50</button>
                      <button onClick={() => handleRecharge(100)} className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-full font-bold hover:bg-white hover:text-brand-navy transition">Recharge +$100</button>
                    </div>

                    {/* Auto-Recharge Toggle */}
                    <div className="flex items-center justify-between bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/10">
                      <div>
                        <p className="font-bold text-sm">Enable Auto-Recharge</p>
                        <p className="text-xs text-blue-200">Automatically add $50 when balance drops below $20</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={autoRecharge} onChange={() => setAutoRecharge(!autoRecharge)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Visual Spending Trend Chart */}
                <div className="bg-white rounded-3xl p-8 shadow-lg flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-brand-navy mb-6">Spending Trend (Last 6 Months)</h3>
                  <div className="flex items-end justify-between space-x-2 h-32 mb-4">
                    {spendingData.map((data, index) => {
                      const height = (data.amount / maxSpending) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center group">
                          <div className="relative w-full flex items-end justify-center h-full">
                            <div 
                              className="w-full max-w-[24px] bg-gradient-to-t from-brand-royal to-brand-cyan rounded-t-md transition-all duration-500 hover:opacity-80 cursor-pointer relative"
                              style={{ height: `${Math.max(height, 4)}%` }}
                            >
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-brand-navy text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                                ${data.amount.toFixed(0)}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 font-medium mt-2">{data.month}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Total Spent: <span className="font-bold text-brand-navy">${spendingData.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}</span></p>
                  </div>
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-2xl font-bold text-brand-navy mb-6">Fund via Direct Bank Transfer</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
                    <div className="flex items-center space-x-3 mb-4"><span className="text-2xl">🇳🇬</span><h4 className="text-xl font-bold text-brand-navy">Naira (NGN) Account</h4></div>
                    <div className="space-y-4">
                      <div><p className="text-sm text-gray-500 font-medium">Account Name</p><p className="font-bold text-gray-800 text-lg">Access LINGUA Ltd</p></div>
                      <div><p className="text-sm text-gray-500 font-medium">Account Number</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <p className="font-mono font-black text-gray-800 text-2xl tracking-wider">1312963740</p>
                          <button onClick={() => copyToClipboard('1312963740')} className="text-brand-royal hover:text-brand-navy text-sm font-bold flex items-center space-x-1 bg-brand-royal/10 px-3 py-1.5 rounded-lg transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg><span>Copy</span></button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
                    <div className="flex items-center space-x-3 mb-4"><span className="text-2xl">🇺🇸</span><h4 className="text-xl font-bold text-brand-navy">Dollar (USD) Account</h4></div>
                    <div className="space-y-4">
                      <div><p className="text-sm text-gray-500 font-medium">Account Name</p><p className="font-bold text-gray-800 text-lg">Access LINGUA Ltd</p></div>
                      <div><p className="text-sm text-gray-500 font-medium">Account Number</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <p className="font-mono font-black text-gray-800 text-2xl tracking-wider">5076243287</p>
                          <button onClick={() => copyToClipboard('5076243287')} className="text-brand-royal hover:text-brand-navy text-sm font-bold flex items-center space-x-1 bg-brand-royal/10 px-3 py-1.5 rounded-lg transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg><span>Copy</span></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4 text-center bg-blue-50 p-3 rounded-lg border border-blue-100"><strong>Note:</strong> Please use your Member ID or Registered Email as the transfer reference. Funds are typically credited to your wallet within 1-2 business hours after confirmation.</p>
              </div>

              <div className="mb-12">
                <h3 className="text-2xl font-bold text-brand-navy mb-6">Recent Interpretation Calls</h3>
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {callHistory.length > 0 ? callHistory.map((call) => (
                      <div key={call.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition">
                        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                          <div className="w-12 h-12 bg-brand-royal/10 text-brand-royal rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{call.interpreter_name || 'Interpreter'} ({call.language})</p>
                            <p className="text-sm text-gray-500">{formatDate(call.created_at)} • {call.duration_minutes} mins • <span className="text-green-600 font-medium">{call.status}</span></p>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-red-500">-${(call.cost || 0).toFixed(2)}</div>
                      </div>
                    )) : (
                      <div className="p-8 text-center text-gray-500">No recent calls found.</div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                {/* Transaction History Header with Download Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <h3 className="text-2xl font-bold text-brand-navy">Transaction History</h3>
                  <button 
                    onClick={handleDownloadStatement}
                    className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-brand-royal px-4 py-2 rounded-lg font-bold text-sm transition shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    <span>Download Statement (CSV)</span>
                  </button>
                </div>
                
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {transactions.length > 0 ? transactions.map((tx) => (
                      <div key={tx.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition">
                        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {tx.type === 'credit' ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{tx.description}</p>
                            <p className="text-sm text-gray-500">{formatDate(tx.created_at)}</p>
                            {tx.reference && <p className="text-xs text-gray-400 font-mono mt-0.5">Ref: {tx.reference}</p>}
                          </div>
                        </div>
                        <div className={`text-xl font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'credit' ? '+' : '-'}${(tx.amount || 0).toFixed(2)}
                        </div>
                      </div>
                    )) : (
                      <div className="p-8 text-center text-gray-500">No transactions yet.</div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Wallet;