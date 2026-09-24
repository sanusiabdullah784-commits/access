import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function InterpreterDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [availability, setAvailability] = useState('Online'); // Online, Offline, Busy
  
  // Interpreter Profile State
  const [profile, setProfile] = useState({
    name: 'Maria Gonzalez',
    email: 'maria.g@accesslingua.com',
    phone: '+1 (555) 987-6543',
    interpreterId: 'INT-10293',
    bio: 'Certified medical and legal interpreter with 8 years of experience. Specializing in Spanish-English and Portuguese-English pairs.',
    photo: null,
    languages: ['Spanish', 'English', 'Portuguese']
  });

  // Handle Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setProfile({ ...profile, photo: URL.createObjectURL(file) });
  };

  // Mock Data
  const upcomingBookings = [
    { id: 1, date: 'Sep 18, 2026', time: '10:00 AM', client: 'Global Tech Inc.', type: 'Video Call', duration: '60 mins' },
    { id: 2, date: 'Sep 19, 2026', time: '02:30 PM', client: 'City General Hospital', type: 'Phone Call', duration: '30 mins' },
  ];

  const callHistory = [
    { id: 1, date: 'Sep 15, 2026', client: 'Legal Firm LLC', duration: '45 mins', earnings: '$67.50', rating: 5 },
    { id: 2, date: 'Sep 14, 2026', client: 'Private Client', duration: '20 mins', earnings: '$30.00', rating: 5 },
    { id: 3, date: 'Sep 12, 2026', client: 'Global Tech Inc.', duration: '90 mins', earnings: '$135.00', rating: 4 },
  ];

  const tabs = [
    { id: 'profile', label: 'Profile & Languages', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'availability', label: 'Availability Status', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'bookings', label: 'Bookings & Earnings', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'account', label: 'Account Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-brand-navy">Interpreter Portal</h1>
            <div className={`px-4 py-2 rounded-full font-bold text-sm flex items-center ${
              availability === 'Online' ? 'bg-green-100 text-green-700' : 
              availability === 'Busy' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${
                availability === 'Online' ? 'bg-green-500' : 
                availability === 'Busy' ? 'bg-yellow-500' : 'bg-gray-500'
              }`}></span>
              Currently: {availability}
            </div>
          </div>
          
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
                
                {/* PROFILE & LANGUAGES TAB */}
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy mb-6">Professional Profile</h2>
                    
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
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
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
                        <label className="block text-sm font-bold text-gray-700 mb-2">Interpreter ID (Read Only)</label>
                        <input type="text" value={profile.interpreterId} disabled className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 font-mono" />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Languages Spoken</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {profile.languages.map((lang, idx) => (
                          <span key={idx} className="bg-brand-cyan/10 text-brand-navy px-3 py-1 rounded-full text-sm font-bold flex items-center">
                            {lang}
                            <button onClick={() => setProfile({...profile, languages: profile.languages.filter((_, i) => i !== idx)})} className="ml-2 text-brand-cyan hover:text-red-500">×</button>
                          </span>
                        ))}
                      </div>
                      <input type="text" placeholder="Add a language and press Enter..." 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.target.value) {
                            setProfile({...profile, languages: [...profile.languages, e.target.value]});
                            e.target.value = '';
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal" 
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Professional Information / Bio</label>
                      <textarea rows="4" value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal"></textarea>
                    </div>

                    <button className="bg-brand-royal hover:bg-brand-navy text-white px-8 py-3 rounded-lg font-bold transition shadow-md">Save Profile Changes</button>
                  </div>
                )}

                {/* AVAILABILITY TAB */}
                {activeTab === 'availability' && (
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy mb-6">Availability Status</h2>
                    <p className="text-gray-500 mb-8">Set your current status. You will only receive call requests when you are Online.</p>
                    
                    <div className="grid md:grid-cols-3 gap-6 mb-10">
                      {['Online', 'Busy', 'Offline'].map((status) => (
                        <button
                          key={status}
                          onClick={() => setAvailability(status)}
                          className={`p-6 rounded-2xl border-2 transition flex flex-col items-center justify-center ${
                            availability === status 
                              ? status === 'Online' ? 'border-green-500 bg-green-50' 
                                : status === 'Busy' ? 'border-yellow-500 bg-yellow-50' 
                                : 'border-gray-400 bg-gray-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full mb-3 ${
                            status === 'Online' ? 'bg-green-500' : status === 'Busy' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}></span>
                          <span className={`text-xl font-bold ${
                            status === 'Online' ? 'text-green-700' : status === 'Busy' ? 'text-yellow-700' : 'text-gray-600'
                          }`}>{status}</span>
                        </button>
                      ))}
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="font-bold text-gray-800 mb-4">Weekly Schedule (Operational Info)</h3>
                      <div className="grid grid-cols-7 gap-2 text-center text-sm">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                          <div key={day} className="bg-white p-3 rounded-lg border border-gray-200">
                            <p className="font-bold text-gray-500 mb-2">{day}</p>
                            <p className="text-brand-navy font-medium">9am - 5pm</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* BOOKINGS & EARNINGS TAB */}
                {activeTab === 'bookings' && (
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy mb-6">Bookings & Earnings</h2>
                    
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-gradient-to-br from-brand-navy to-brand-royal rounded-2xl p-6 text-white">
                        <p className="text-blue-200 text-xs uppercase font-bold">Total Earnings (This Month)</p>
                        <h3 className="text-3xl font-black mt-2">$2,450.00</h3>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <p className="text-gray-500 text-xs uppercase font-bold">Completed Calls</p>
                        <h3 className="text-3xl font-black mt-2 text-brand-navy">142</h3>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <p className="text-gray-500 text-xs uppercase font-bold">Average Rating</p>
                        <h3 className="text-3xl font-black mt-2 text-brand-navy">4.9 ⭐</h3>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-4">Upcoming Bookings</h3>
                    <div className="space-y-3 mb-8">
                      {upcomingBookings.map((b) => (
                        <div key={b.id} className="flex justify-between items-center p-4 bg-blue-50 border border-blue-100 rounded-xl">
                          <div>
                            <p className="font-bold text-brand-navy">{b.client} • {b.type}</p>
                            <p className="text-xs text-gray-600">{b.date} at {b.time} ({b.duration})</p>
                          </div>
                          <button className="bg-brand-royal text-white px-4 py-2 rounded-lg text-sm font-bold">Join</button>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-4">Authorised Call History</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                          <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Client</th>
                            <th className="p-4">Duration</th>
                            <th className="p-4">Rating</th>
                            <th className="p-4">Earnings</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {callHistory.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50">
                              <td className="p-4 text-gray-800">{c.date}</td>
                              <td className="p-4 text-gray-800">{c.client}</td>
                              <td className="p-4 text-gray-800">{c.duration}</td>
                              <td className="p-4 text-yellow-500">{'⭐'.repeat(c.rating)}</td>
                              <td className="p-4 font-bold text-green-600">{c.earnings}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ACCOUNT SETTINGS TAB */}
                {activeTab === 'account' && (
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy mb-6">Account & Profile Management</h2>
                    <div className="max-w-md space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                        <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                        <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal" />
                      </div>
                      <button className="bg-brand-royal hover:bg-brand-navy text-white px-8 py-3 rounded-lg font-bold transition shadow-md">Update Password</button>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Payout Settings (Operational Info)</h3>
                      <div className="bg-gray-50 p-6 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="font-bold text-gray-800">Bank Account (Chase)</p>
                          <p className="text-sm text-gray-500">Ending in •••• 4829</p>
                        </div>
                        <button className="text-brand-royal font-bold hover:underline">Edit</button>
                      </div>
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

export default InterpreterDashboard;