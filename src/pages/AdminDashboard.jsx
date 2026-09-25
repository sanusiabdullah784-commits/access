import { useState } from 'react';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // NEW: Mobile menu state

  // Mock Data
  const stats = [
    { label: 'Total Revenue (MTD)', value: '$142,500', color: 'bg-green-500' },
    { label: 'Active Users', value: '1,240', color: 'bg-blue-500' },
    { label: 'Active Interpreters', value: '342', color: 'bg-purple-500' },
    { label: 'Calls Today', value: '89', color: 'bg-orange-500' },
  ];

  const users = [
    { id: 'CL-001', name: 'Alex Johnson', email: 'alex@example.com', plan: 'Professional', status: 'Active' },
    { id: 'CL-002', name: 'Sarah Smith', email: 'sarah@example.com', plan: 'Starter', status: 'Active' },
    { id: 'CL-003', name: 'John Doe', email: 'john@example.com', plan: 'Enterprise', status: 'Suspended' },
  ];

  const interpreters = [
    { id: 'INT-101', name: 'Maria Gonzalez', langs: 'Spanish, English', rating: 4.9, status: 'Online' },
    { id: 'INT-102', name: 'Jean Dupont', langs: 'French, English', rating: 4.8, status: 'Busy' },
    { id: 'INT-103', name: 'Li Wei', langs: 'Mandarin, English', rating: 5.0, status: 'Offline' },
  ];

  const companies = [
    { id: 'CO-001', name: 'Global Tech Inc.', code: 'GT-8842-X', employees: 5, balance: '$12,450' },
    { id: 'CO-002', name: 'City General Hospital', code: 'CGH-9921-A', employees: 45, balance: '$84,200' },
  ];

  const [reviews, setReviews] = useState([
    { id: 1, user: 'Alex Johnson', rating: 5, comment: 'Maria was absolutely fantastic! The video quality was great and the translation was flawless.', status: 'Pending' },
    { id: 2, user: 'Sarah Smith', rating: 4, comment: 'Very professional service. The interpreter arrived on time for our Zoom call.', status: 'Pending' },
    { id: 3, user: 'John Doe', rating: 2, comment: 'Had some audio issues during the call, but support fixed it quickly.', status: 'Pending' },
  ]);

  const handleModerate = (id, action) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: action } : r));
  };

  const tabs = [
    { id: 'overview', label: 'Platform Overview', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'users', label: 'Users & Members', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { id: 'interpreters', label: 'Interpreters', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
    { id: 'companies', label: 'Companies', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'bookings', label: 'Bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'wallets', label: 'Wallets & Payments', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'reviews', label: 'Reviews', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    { id: 'languages', label: 'Languages', icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129' },
    { id: 'ai-settings', label: 'AI Settings', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 'roles', label: 'Roles & Permissions', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-brand-navy text-white shadow-lg z-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* NEW: Mobile Hamburger Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-white focus:outline-none p-1 hover:bg-brand-royal/30 rounded-lg transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="w-8 h-8 bg-brand-cyan rounded-lg flex items-center justify-center font-black text-brand-navy">A</div>
            <h1 className="text-xl font-bold tracking-wide">ACCESS Lingua <span className="text-brand-cyan font-light">Admin</span></h1>
          </div>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-md">Secure Logout</button>
        </div>
      </header>

      {/* NEW: Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Sidebar Panel */}
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-2xl flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-gray-100 bg-gray-50">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Administration</p>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-700 p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-grow overflow-y-auto py-4">
              {tabs.map((tab) => (
                <button 
                  key={tab.id} 
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false); // Close menu on selection
                  }} 
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
        </div>
      )}

      <div className="flex-grow flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Desktop Sidebar (hidden on mobile) */}
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden sticky top-8">
            <div className="p-4 bg-gray-50 border-b border-gray-100"><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Administration</p></div>
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full text-left px-6 py-4 flex items-center space-x-3 transition border-l-4 ${activeTab === tab.id ? 'bg-brand-royal/5 border-brand-royal text-brand-royal font-bold' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-grow">
          <div className="bg-brand-navy text-white rounded-2xl p-6 mb-8 flex items-start space-x-4 shadow-lg">
            <svg className="w-8 h-8 text-brand-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <div>
              <h2 className="text-lg font-bold mb-1">Secure Admin Control Center</h2>
              <p className="text-blue-200 text-sm"><strong>Data Ownership:</strong> All data is the exclusive property of ACCESS Lingua Ltd, stored securely in our approved encrypted database.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-8">
            
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-6">Platform Overview & Reports</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <div className={`w-3 h-3 rounded-full ${stat.color} mb-4`}></div>
                      <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                      <h3 className="text-3xl font-black text-brand-navy mt-2">{stat.value}</h3>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                  <h3 className="font-bold text-brand-navy mb-2">System Health & Storage</h3>
                  <p className="text-sm text-gray-600">Database: <span className="font-bold text-green-600">Secure & Encrypted (AWS RDS)</span> • Third-party APIs: <span className="font-bold text-green-600">Operational</span> • Storage Used: 42GB / 1TB</p>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-6">Users & Members Management</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr><th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Plan</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((u) => (<tr key={u.id} className="hover:bg-gray-50"><td className="p-4 font-mono text-sm text-brand-royal">{u.id}</td><td className="p-4 font-bold">{u.name}</td><td className="p-4">{u.email}</td><td className="p-4">{u.plan}</td><td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.status}</span></td><td className="p-4"><button className="text-brand-royal font-bold text-sm hover:underline">Manage</button></td></tr>))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'interpreters' && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-6">Interpreter Management</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr><th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4">Languages</th><th className="p-4">Rating</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      {interpreters.map((i) => (<tr key={i.id} className="hover:bg-gray-50"><td className="p-4 font-mono text-sm text-brand-royal">{i.id}</td><td className="p-4 font-bold">{i.name}</td><td className="p-4">{i.langs}</td><td className="p-4 text-yellow-500 font-bold">{i.rating} ⭐</td><td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${i.status === 'Online' ? 'bg-green-100 text-green-700' : i.status === 'Busy' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>{i.status}</span></td><td className="p-4"><button className="text-brand-royal font-bold text-sm hover:underline">Manage</button></td></tr>))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'companies' && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-6">Corporate Accounts</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {companies.map((c) => (
                    <div key={c.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-brand-navy">{c.name}</h3>
                          <p className="text-sm text-gray-500 font-mono">Code: {c.code}</p>
                        </div>
                        <span className="bg-brand-royal/10 text-brand-royal px-3 py-1 rounded-full text-xs font-bold">Enterprise</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mb-4">
                        <span><strong>{c.employees}</strong> Active Employees</span>
                        <span>Balance: <strong className="text-green-600">{c.balance}</strong></span>
                      </div>
                      <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 rounded-lg transition">View Company Details</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-6">Bookings Management</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                      <tr><th className="p-4">Booking ID</th><th className="p-4">Client</th><th className="p-4">Interpreter</th><th className="p-4">Date & Time</th><th className="p-4">Type</th><th className="p-4">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50">
                        <td className="p-4 font-mono text-sm text-brand-royal">BK-9921</td>
                        <td className="p-4 font-bold">Global Tech Inc.</td>
                        <td className="p-4">Maria Gonzalez</td>
                        <td className="p-4">Sep 24, 2026 • 10:00 AM</td>
                        <td className="p-4">Video Call</td>
                        <td className="p-4"><span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Scheduled</span></td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-4 font-mono text-sm text-brand-royal">BK-9920</td>
                        <td className="p-4 font-bold">City Hospital</td>
                        <td className="p-4">Jean Dupont</td>
                        <td className="p-4">Sep 23, 2026 • 02:30 PM</td>
                        <td className="p-4">OPI Call</td>
                        <td className="p-4"><span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Completed</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'wallets' && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-6">Wallets & Payments</h2>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-brand-navy to-brand-royal rounded-2xl p-6 text-white">
                    <p className="text-blue-200 text-xs uppercase font-bold">Total Platform Balance</p>
                    <h3 className="text-3xl font-black mt-2">$1,240,500.00</h3>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <p className="text-gray-500 text-xs uppercase font-bold">Pending Payouts</p>
                    <h3 className="text-3xl font-black mt-2 text-brand-navy">$12,450.00</h3>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <p className="text-gray-500 text-xs uppercase font-bold">Transactions Today</p>
                    <h3 className="text-3xl font-black mt-2 text-brand-navy">342</h3>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
                  <strong>Admin Note:</strong> Developer access to payment gateways is restricted to read-only technical troubleshooting. All financial data is encrypted at rest.
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-2">Review Moderation</h2>
                <p className="text-gray-500 mb-6">Approve or reject customer testimonials before they appear on the public site.</p>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-brand-navy text-lg">{review.user}</h4>
                          <div className="flex text-yellow-400 text-sm">{'⭐'.repeat(review.rating)}</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${review.status === 'Approved' ? 'bg-green-100 text-green-700' : review.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {review.status}
                        </span>
                      </div>
                      <p className="text-gray-600 italic mb-4">"{review.comment}"</p>
                      {review.status === 'Pending' && (
                        <div className="flex space-x-3">
                          <button onClick={() => handleModerate(review.id, 'Approved')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition">Approve</button>
                          <button onClick={() => handleModerate(review.id, 'Rejected')} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition">Reject</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'languages' && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-6">Supported Languages</h2>
                <div className="grid md:grid-cols-4 gap-4">
                  {['Spanish', 'French', 'Mandarin', 'Arabic', 'Russian', 'Japanese', 'German', 'Portuguese', 'Italian', 'Korean', 'Hindi', 'Turkish'].map((lang) => (
                    <div key={lang} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                      <span className="font-bold text-gray-800">{lang}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'ai-settings' && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-6">AI Settings & Configuration</h2>
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-lg text-gray-800">AI Transcription Service</h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-royal"></div>
                      </label>
                    </div>
                    <p className="text-sm text-gray-500">Enable real-time speech-to-text and translation for OPI and Video calls.</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-lg text-gray-800">AI Call Routing</h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-royal"></div>
                      </label>
                    </div>
                    <p className="text-sm text-gray-500">Automatically match callers with the best available interpreter based on language and rating.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-6">System Notifications</h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <p className="font-bold text-blue-800">System Update</p>
                    <p className="text-sm text-blue-600">Scheduled maintenance on Sep 30, 2026 at 02:00 AM UTC.</p>
                  </div>
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                    <p className="font-bold text-yellow-800">Payment Gateway Alert</p>
                    <p className="text-sm text-yellow-600">Paystack API latency increased by 15% in the last hour.</p>
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                    <p className="font-bold text-green-800">New Milestone</p>
                    <p className="text-sm text-green-600">Platform reached 45,000 completed interpretations!</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'roles' && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-6">Role-Based Permissions</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                      <tr><th className="p-4">Role</th><th className="p-4">Data Access</th><th className="p-4">Permissions</th><th className="p-4">Users</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50">
                        <td className="p-4 font-bold text-brand-navy">Super Admin</td>
                        <td className="p-4 text-sm">Full Platform Access</td>
                        <td className="p-4 text-sm">Manage all users, payments, settings</td>
                        <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">2</span></td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-4 font-bold text-brand-navy">Support Staff</td>
                        <td className="p-4 text-sm">Bookings, Users, Reviews</td>
                        <td className="p-4 text-sm">View/Edit bookings, moderate reviews</td>
                        <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">5</span></td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-4 font-bold text-brand-navy">Interpreter</td>
                        <td className="p-4 text-sm">Own Profile, Assignments</td>
                        <td className="p-4 text-sm">Update availability, view earnings</td>
                        <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">342</span></td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-4 font-bold text-brand-navy">Client / Member</td>
                        <td className="p-4 text-sm">Own Account, Wallet</td>
                        <td className="p-4 text-sm">Book calls, manage wallet</td>
                        <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">1,240</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;