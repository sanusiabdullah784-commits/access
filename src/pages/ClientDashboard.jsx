import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile State
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 019-8372',
    memberId: 'MEM-84920',
    company: 'Freelance Consultant',
    photo: null
  });

  // Handle Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, photo: URL.createObjectURL(file) });
    }
  };

  // Mock Data
  const bookingHistory = [
    { id: 1, date: 'Sep 20, 2026', language: 'Spanish', type: 'Video Call', status: 'Upcoming' },
    { id: 2, date: 'Sep 14, 2026', language: 'French', type: 'Phone Call', status: 'Completed' },
    { id: 3, date: 'Aug 30, 2026', language: 'Mandarin', type: 'In-Person', status: 'Completed' },
  ];

  const callHistory = [
    { id: 1, date: 'Sep 15, 2026', interpreter: 'Maria G.', duration: '12 mins', cost: '$18.00' },
    { id: 2, date: 'Sep 10, 2026', interpreter: 'Jean D.', duration: '45 mins', cost: '$67.50' },
  ];

  const transactions = [
    { id: 1, date: 'Sep 12, 2026', desc: 'Wallet Top-up', amount: '+$100.00', type: 'credit' },
    { id: 2, date: 'Sep 15, 2026', desc: 'OPI Call - Spanish', amount: '-$18.00', type: 'debit' },
  ];

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'security', label: 'Password & Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'bookings', label: 'Booking History', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'calls', label: 'Call History', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
    { id: 'wallet', label: 'Wallet & Transactions', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-brand-navy mb-8">My Account</h1>
          
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
                    
                    {/* Photo Upload */}
                    <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-gray-100">
                      <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                        {profile.photo ? (
                          <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl font-bold text-gray-400">{profile.name.charAt(0)}</span>
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
                        <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal" />
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
                    <button className="mt-8 bg-brand-royal hover:bg-brand-navy text-white px-8 py-3 rounded-lg font-bold transition shadow-md">Save Changes</button>
                  </div>
                )}

                {/* SECURITY TAB */}
                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy mb-6">Password & Security</h2>
                    <div className="max-w-md space-y-4">
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
                            <th className="p-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {bookingHistory.map((b) => (
                            <tr key={b.id} className="hover:bg-gray-50">
                              <td className="p-4 text-gray-800">{b.date}</td>
                              <td className="p-4 text-gray-800">{b.language}</td>
                              <td className="p-4 text-gray-800">{b.type}</td>
                              <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${b.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{b.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* CALLS TAB */}
                {activeTab === 'calls' && (
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy mb-6">Authorised Call History</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                          <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Interpreter</th>
                            <th className="p-4">Duration</th>
                            <th className="p-4">Cost</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {callHistory.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50">
                              <td className="p-4 text-gray-800">{c.date}</td>
                              <td className="p-4 text-gray-800">{c.interpreter}</td>
                              <td className="p-4 text-gray-800">{c.duration}</td>
                              <td className="p-4 font-bold text-red-500">{c.cost}</td>
                            </tr>
                          ))}
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
                      <h3 className="text-4xl font-black mt-2">$240.00</h3>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Transactions</h3>
                    <div className="space-y-3">
                      {transactions.map((t) => (
                        <div key={t.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-bold text-gray-800">{t.desc}</p>
                            <p className="text-xs text-gray-500">{t.date}</p>
                          </div>
                          <span className={`font-bold ${t.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>{t.amount}</span>
                        </div>
                      ))}
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