import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [callFilter, setCallFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // --- NEW: Hidden Per-Minute Pricing Logic for Dashboard Transparency ---
  const rateMap = {
    'Mandarin Chinese': 0.50,
    'Igbo': 0.40,
    'English': 0.50,
    'Pidgin English': 0.40
  };

  // Profile State
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    memberId: '',
    company: '',
    photo: null,
    walletBalance: 0
  });

  // Real Data States
  const [bookingHistory, setBookingHistory] = useState([]);
  const [callHistory, setCallHistory] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Rating Modal States
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingCallId, setRatingCallId] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingFeedback, setRatingFeedback] = useState('');

  // Fetch User and Dashboard Data on Mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // 1. Get the currently logged-in user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error("User not authenticated");
        setLoading(false);
        return;
      }
      setUser(user);

      // 2. Fetch Profile Data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email, phone, company, avatar_url, wallet_balance, id')
        .eq('id', user.id)
        .single();

      if (!profileError && profileData) {
        setProfile({
          name: profileData.full_name || '',
          email: profileData.email || user.email,
          phone: profileData.phone || '',
          memberId: profileData.id ? `MEM-${profileData.id.slice(0, 8).toUpperCase()}` : 'MEM-XXXXX',
          company: profileData.company || '',
          photo: profileData.avatar_url || null,
          walletBalance: profileData.wallet_balance || 0
        });
      }

      // 3. Fetch Booking History
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });
      setBookingHistory(bookingsData || []);

      // 4. Fetch Call History
      const { data: callsData } = await supabase
        .from('calls')
        .select('id, user_id, interpreter_name, language, category, duration_minutes, cost, status, created_at, rating, feedback')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setCallHistory(callsData || []);

      // 5. Fetch Recent Transactions
      const { data: txData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      setTransactions(txData || []);

      setLoading(false);
    };

    fetchData();
  }, []);

  // Handle Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, photo: URL.createObjectURL(file) });
    }
  };

  // Handle Profile Save to Database
  const handleSaveProfile = async () => {
    if (!user) return;
    
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.name,
        phone: profile.phone,
        company: profile.company
      })
      .eq('id', user.id);

    if (error) {
      alert("Error saving profile: " + error.message);
    } else {
      alert("Profile updated successfully!");
    }
  };

  // Handle Interpreter Rating Submission
  const handleRateInterpreter = async (callId, rating, feedback) => {
    const { error } = await supabase
      .from('calls')
      .update({ 
        rating: rating, 
        feedback: feedback 
      })
      .eq('id', callId);

    if (error) {
      console.error("Error saving rating:", error);
      alert("Failed to save rating.");
    } else {
      setCallHistory(prev => prev.map(c => 
        c.id === callId ? { ...c, rating, feedback } : c
      ));
      setShowRatingModal(false);
      setRatingCallId(null);
      setRatingValue(0);
      setRatingFeedback('');
      alert("Thank you for your feedback!");
    }
  };

  // NEW: Handle Invoice Download
  const handleDownloadInvoice = (transaction) => {
    const invoiceContent = `
ACCESS LINGUA - TRANSACTION RECEIPT
===================================
Transaction ID: ${transaction.id}
Date: ${formatDate(transaction.created_at)}
Description: ${transaction.description}
Type: ${transaction.type === 'credit' ? 'Wallet Top-up (Credit)' : 'Service Charge (Debit)'}
Amount: ${transaction.type === 'credit' ? '+' : '-'}$${(transaction.amount || 0).toFixed(2)}
===================================
Thank you for using Access Lingua!
For support, contact: support@accesslingua.com
    `.trim();

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `access-lingua-receipt-${transaction.id}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter logic for calls
  const filteredCalls = callFilter === 'All' 
    ? callHistory 
    : callHistory.filter(call => call.category === callFilter);

  // Helper to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Find the next upcoming scheduled session
  const nextSession = bookingHistory.find(b => b.status === 'scheduled' || b.status === 'pending');

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'security', label: 'Password & Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'bookings', label: 'Booking History', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'calls', label: 'Call History', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
    { id: 'wallet', label: 'Wallet & Transactions', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  ];

  // Show Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-brand-royal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Loading your dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative">
            <button 
              onClick={() => { setShowRatingModal(false); setRatingCallId(null); setRatingValue(0); setRatingFeedback(''); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <h2 className="text-2xl font-bold text-brand-navy mb-2">Rate Your Interpreter</h2>
            <p className="text-gray-500 mb-6">How was your interpretation session?</p>

            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRatingValue(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <svg 
                    className={`w-10 h-10 ${star <= ratingValue ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </button>
              ))}
            </div>

            <textarea
              value={ratingFeedback}
              onChange={(e) => setRatingFeedback(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal resize-none mb-6"
              rows="3"
              placeholder="Optional: Tell us more about your experience..."
            ></textarea>

            <button 
              onClick={() => handleRateInterpreter(ratingCallId, ratingValue, ratingFeedback)}
              disabled={ratingValue === 0}
              className="w-full bg-brand-royal hover:bg-brand-navy disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-full transition shadow-lg text-lg"
            >
              Submit Rating
            </button>
          </div>
        </div>
      )}

      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-brand-navy mb-4">My Account</h1>
          
          {/* Next Upcoming Session Quick-Action Widget */}
          {nextSession && (
            <div className="bg-gradient-to-r from-brand-royal to-brand-cyan rounded-2xl p-6 text-white mb-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Next Upcoming Session</p>
                  <h3 className="text-xl font-bold">{nextSession.language} Interpretation</h3>
                  <p className="text-blue-100 text-sm mt-1 flex items-center space-x-2">
                    <span>{formatDate(nextSession.created_at)}</span>
                    <span>•</span>
                    <span>{nextSession.booking_time || '10:00 AM'}</span>
                    <span>•</span>
                    <span>{nextSession.booking_type}</span>
                  </p>
                </div>
              </div>
              <div className="flex space-x-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none bg-white text-brand-royal px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition shadow-md flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  <span>Join Call</span>
                </button>
                <button className="flex-1 md:flex-none bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition">
                  View Details
                </button>
              </div>
            </div>
          )}
          
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Sidebar Navigation */}
            <div className="md:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-6 py-4 flex items-center space-x-3 transition border-l-4 ${
                      activeTab === tab.id 
                        ? 'bg-brand-royal/5 border-brand-royal text-brand-royal font-bold' 
                        : 'border-transparent text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-grow">
              <div className="bg-white rounded-2xl shadow-md p-8">
                
                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy mb-6">Profile Information</h2>
                    <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-gray-100">
                      <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                        {profile.photo ? (
                          <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl font-bold text-gray-400">{profile.name ? profile.name.charAt(0) : 'U'}</span>
                        )}
                      </div>
                      <div>
                        <label className="bg-brand-royal hover:bg-brand-navy text-white px-4 py-2 rounded-lg font-medium cursor-pointer transition inline-block">
                          Upload Photo
                          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. Max size 2MB.</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                        <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <input type="email" value={profile.email} disabled className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                        <input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Company / Organization</label>
                        <input type="text" value={profile.company} onChange={(e) => setProfile({...profile, company: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Member ID (Read Only)</label>
                        <input type="text" value={profile.memberId} disabled className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 font-mono" />
                      </div>
                    </div>
                    <button onClick={handleSaveProfile} className="mt-8 bg-brand-royal hover:bg-brand-navy text-white px-8 py-3 rounded-lg font-bold transition shadow-md">Save Changes</button>
                  </div>
                )}

                {/* SECURITY TAB */}
                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy mb-6">Password & Security</h2>
                    <div className="max-w-md space-y-4">
                      <p className="text-sm text-gray-500 mb-4">Password management is securely handled by our authentication provider.</p>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                        <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                        <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                        <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal" />
                      </div>
                      <button className="bg-brand-royal hover:bg-brand-navy text-white px-8 py-3 rounded-lg font-bold transition shadow-md">Update Password</button>
                    </div>
                  </div>
                )}

                {/* BOOKINGS TAB */}
                {activeTab === 'bookings' && (
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy mb-6">Booking History</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                          <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Language</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Duration</th>
                            <th className="p-4">Est. Cost</th>
                            <th className="p-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {bookingHistory.length > 0 ? bookingHistory.map((b) => {
                            const rate = rateMap[b.language] || 0.50;
                            const estCost = (b.duration_minutes || 60) * rate;
                            return (
                              <tr key={b.id} className="hover:bg-gray-50">
                                <td className="p-4 text-gray-800">{formatDate(b.created_at)}</td>
                                <td className="p-4 text-gray-800">{b.language}</td>
                                <td className="p-4 text-gray-800">{b.booking_type}</td>
                                <td className="p-4 text-gray-800">{b.duration_minutes || 60} mins</td>
                                <td className="p-4 font-bold text-brand-navy">${estCost.toFixed(2)}</td>
                                <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${b.status === 'scheduled' || b.status === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{b.status}</span></td>
                              </tr>
                            );
                          }) : (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-500">No bookings found.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* CALLS TAB */}
                {activeTab === 'calls' && (
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                      <h2 className="text-2xl font-bold text-brand-navy">Authorised Call History</h2>
                      <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                        <select 
                          value={callFilter} 
                          onChange={(e) => setCallFilter(e.target.value)}
                          className="bg-transparent text-sm font-bold text-gray-700 focus:outline-none cursor-pointer"
                        >
                          <option value="All">All Calls</option>
                          <option value="General">General Calls</option>
                          <option value="Individual">Individual Calls</option>
                          <option value="Organisation">Organisation Calls</option>
                        </select>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                          <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Language</th>
                            <th className="p-4">Interpreter</th>
                            <th className="p-4">Duration</th>
                            <th className="p-4">Rate</th>
                            <th className="p-4">Cost</th>
                            <th className="p-4">Rating</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredCalls.length > 0 ? filteredCalls.map((c) => {
                            const rate = rateMap[c.language] || (c.cost && c.duration_minutes ? (c.cost / c.duration_minutes) : 0.50);
                            return (
                              <tr key={c.id} className="hover:bg-gray-50 transition">
                                <td className="p-4 text-gray-800 font-medium">{formatDate(c.created_at)}</td>
                                <td className="p-4 text-gray-800">{c.language || 'N/A'}</td>
                                <td className="p-4 text-gray-800">{c.interpreter_name || 'Interpreter'}</td>
                                <td className="p-4 text-gray-800 font-mono font-medium">{c.duration_minutes || 0} mins</td>
                                <td className="p-4 text-gray-600 font-medium">${rate.toFixed(2)}/min</td>
                                <td className="p-4 font-bold text-red-500">-${(c.cost || 0).toFixed(2)}</td>
                                <td className="p-4">
                                  {c.status === 'Completed' && !c.rating ? (
                                    <button 
                                      onClick={() => {
                                        setRatingCallId(c.id);
                                        setShowRatingModal(true);
                                      }}
                                      className="text-brand-royal hover:text-brand-navy font-bold text-sm flex items-center space-x-1 transition"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                                      <span>Rate</span>
                                    </button>
                                  ) : c.rating ? (
                                    <span className="text-yellow-500 font-bold flex items-center space-x-1">
                                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                      <span>{c.rating}.0</span>
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 text-sm">N/A</span>
                                  )}
                                </td>
                              </tr>
                            );
                          }) : (
                            <tr><td colSpan="7" className="p-8 text-center text-gray-500">No calls found for this category.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* WALLET TAB */}
                {activeTab === 'wallet' && (
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy mb-6">Wallet & Transactions</h2>
                    <div className="bg-gradient-to-r from-brand-navy to-brand-royal rounded-2xl p-8 text-white mb-8">
                      <p className="text-blue-200 text-sm uppercase font-bold">Current Balance</p>
                      <h3 className="text-4xl font-black mt-2">${profile.walletBalance.toFixed(2)}</h3>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Transactions</h3>
                    <div className="space-y-3">
                      {transactions.length > 0 ? transactions.map((t) => (
                        <div key={t.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-xl gap-4">
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${t.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                              {t.type === 'credit' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800">{t.description}</p>
                              <p className="text-xs text-gray-500">{formatDate(t.created_at)}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                            <span className={`font-bold text-lg ${t.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                              {t.type === 'credit' ? '+' : '-'}${(t.amount || 0).toFixed(2)}
                            </span>
                            <button 
                              onClick={() => handleDownloadInvoice(t)}
                              className="text-brand-royal hover:text-brand-navy hover:bg-brand-royal/10 p-2 rounded-lg transition flex items-center space-x-1 text-sm font-semibold"
                              title="Download Invoice"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                              <span className="hidden sm:inline">Invoice</span>
                            </button>
                          </div>
                        </div>
                      )) : (
                        <p className="text-center text-gray-500 py-4">No recent transactions.</p>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ClientDashboard;