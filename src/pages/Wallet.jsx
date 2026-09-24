import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PaymentModal from '../components/PaymentModal';

function Wallet() {
  const [balance, setBalance] = useState(240.00);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState(0);

  // Mock Data for Call History (Automatic Deductions)
  const callHistory = [
    { id: 1, interpreter: "Maria Gonzalez", language: "Spanish", duration: "30 mins", cost: 30.00, date: "Sep 14, 2026", status: "Completed" },
    { id: 2, interpreter: "Jean Dupont", language: "French", duration: "15 mins", cost: 15.00, date: "Sep 10, 2026", status: "Completed" },
    { id: 3, interpreter: "Li Wei", language: "Mandarin", duration: "45 mins", cost: 45.00, date: "Sep 05, 2026", status: "Completed" }
  ];

  // Mock Data for Transactions
  const [transactions, setTransactions] = useState([
    { id: 1, desc: "Video Interpretation - Spanish", date: "Sep 14, 2026", amount: "-$30.00", type: "debit" },
    { id: 2, desc: "Wallet Top-up", date: "Sep 12, 2026", amount: "+$100.00", type: "credit" },
    { id: 3, desc: "Document Translation - French", date: "Sep 10, 2026", amount: "-$15.00", type: "debit" },
    { id: 4, desc: "Wallet Top-up", date: "Sep 05, 2026", amount: "+$200.00", type: "credit" },
  ]);

  const handleRecharge = (amount) => {
    setRechargeAmount(amount);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    // Update Balance
    setBalance(prev => prev + rechargeAmount);
    // Add to Transaction History
    const newTransaction = {
      id: transactions.length + 1,
      desc: "Wallet Top-up (Credits)",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: `+$${rechargeAmount.toFixed(2)}`,
      type: "credit"
    };
    setTransactions([newTransaction, ...transactions]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* Payment Modal for Recharging */}
      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        amount={rechargeAmount.toFixed(2)} 
        purpose="Wallet Credit Recharge" 
        onSuccess={handlePaymentSuccess} 
      />
      
      <main className="flex-grow py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-navy">My Wallet</h1>
            <p className="text-gray-500 mt-2">Manage your interpretation credits and view your history.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            
            {/* Balance Card */}
            <div className="md:col-span-2 bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-20 -translate-y-20"></div>
              <div className="relative z-10">
                <p className="text-blue-100 text-lg mb-2">Current Balance</p>
                <h2 className="text-5xl md:text-6xl font-black mb-8">${balance.toFixed(2)}</h2>
                
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => handleRecharge(50)}
                    className="bg-white text-brand-navy px-6 py-3 rounded-full font-bold hover:bg-brand-cyan hover:text-white transition shadow-lg"
                  >
                    Quick Recharge +$50
                  </button>
                  <button 
                    onClick={() => handleRecharge(100)}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-full font-bold hover:bg-white hover:text-brand-navy transition"
                  >
                    Recharge +$100
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-3xl p-8 shadow-lg flex flex-col justify-center">
              <h3 className="text-xl font-bold text-brand-navy mb-6">Monthly Usage</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Credits Used</span>
                    <span className="font-bold text-brand-royal">60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-brand-royal h-2.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Interpretation Hours</span>
                    <span className="font-bold text-brand-cyan">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-brand-cyan h-2.5 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call History (Automatic Deductions) */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-brand-navy mb-6">Recent Interpretation Calls</h3>
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <div className="divide-y divide-gray-100">
                {callHistory.map((call) => (
                  <div key={call.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition">
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      <div className="w-12 h-12 bg-brand-royal/10 text-brand-royal rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{call.interpreter} ({call.language})</p>
                        <p className="text-sm text-gray-500">{call.date} • {call.duration} • <span className="text-green-600 font-medium">{call.status}</span></p>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-red-500">
                      -${call.cost.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div>
            <h3 className="text-2xl font-bold text-brand-navy mb-6">Transaction History</h3>
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <div className="divide-y divide-gray-100">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition">
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {tx.type === 'credit' ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{tx.desc}</p>
                        <p className="text-sm text-gray-500">{tx.date}</p>
                      </div>
                    </div>
                    <div className={`text-xl font-bold ${
                      tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Wallet;