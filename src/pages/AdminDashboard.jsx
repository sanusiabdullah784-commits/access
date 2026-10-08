import { useState } from 'react';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // NEW: Search & Bulk Action States
  const [userSearch, setUserSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedReviews, setSelectedReviews] = useState([]);

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
    { id: 'CL-004', name: 'Emily Chen', email: 'emily@example.com', plan: 'Professional', status: 'Active' },
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
    { id: 1, user: 'Alex Johnson', rating: 5, comment: 'Maria was absolutely fantastic! The video quality was great.', status: 'Pending' },
    { id: 2, user: 'Sarah Smith', rating: 4, comment: 'Very professional service. The interpreter arrived on time.', status: 'Pending' },
    { id: 3, user: 'John Doe', rating: 2, comment: 'Had some audio issues during the call, but support fixed it.', status: 'Pending' },
  ]);

  // NEW: Live Activity Feed Data
  const recentActivities = [
    { id: 1, action: 'New User Registered', detail: 'emily@example.com', time: '2 mins ago', color: 'text-blue-500', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 2, action: 'Interpreter Went Online', detail: 'Maria Gonzalez', time: '5 mins ago', color: 'text-green-500', icon: 'M5 13l4 4L19 7' },
    { id: 3, action: 'Payment Processed', detail: 'Global Tech Inc. ($150.00)', time: '12 mins ago', color: 'text-purple-500', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 4, action: 'Review Submitted', detail: 'Sarah Smith (4 Stars)', time: '15 mins ago', color: 'text-yellow-500', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  ];

  // NEW: Visual Revenue Chart Data
  const revenueData = [
    { day: 'Mon', amount: 1200 }, { day: 'Tue', amount: 1900 }, { day: 'Wed', amount: 1500 },
    { day: 'Thu', amount: 2200 }, { day: 'Fri', amount: 2800 }, { day: 'Sat', amount: 1800 }, { day: 'Sun', amount: 2100 },
  ];
  const maxRevenue = Math.max(...revenueData.map(d => d.amount));

  const handleModerate = (id, action) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: action } : r));
    setSelectedReviews(selectedReviews.filter(revId => revId !== id));
  };

  // NEW: Bulk Action Helpers
  const toggleSelectUser = (id) => {
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]);
  };
  const toggleSelectReview = (id) => {
    setSelectedReviews(prev => prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]);
  };
  const handleBulkUserAction = (action) => {
    alert(`${action} applied to ${selectedUsers.length} users.`);
    setSelectedUsers([]);
  };
  const handleBulkReviewAction = (action) => {
    setReviews(reviews.map(r => selectedReviews.includes(r.id) ? { ...r, status: action } : r));
    setSelectedReviews([]);
  };

  // NEW: CSV Export Helper
  const exportToCSV = (data, filename) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()));

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
    // NEW: Full Dark Mode Support applied to root
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col transition-colors duration-300">
      <header className="bg-brand-navy dark:bg-gray-800 text-white shadow-lg z-20 relative border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-white focus:outline-none p-1 hover:bg-brand-royal/30 rounded-lg transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="w-8 h-8 bg-brand-cyan rounded-lg flex items-center justify-center font-black text-brand-navy">A</div>
            <h1 className="text-xl font-bold tracking-wide">ACCESS Lingua <span className="text-brand-cyan font-light">Admin</span></h1>
          </div>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-md">Secure Logout</button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-2xl flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Administration</p>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-grow overflow-y-auto py-4">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }} className={`w-full text-left px-6 py-4 flex items-center space-x-3 transition border-l-4 ${activeTab === tab.id ? 'bg-brand-royal/5 border-brand-royal text-brand-royal font-bold' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex-grow flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden sticky top-8 border border-gray-100 dark:border-gray-700">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700"><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Administration</p></div>
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full text-left px-6 py-4 flex items-center space-x-3 transition border-l-4 ${activeTab === tab.id ? 'bg-brand-royal/5 border-brand-royal text-brand-royal font-bold' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-grow">
          <div className="bg-brand-navy dark:bg-gray-800 text-white rounded-2xl p-6 mb-8 flex items-start space-x-4 shadow-lg border border-gray-700">
            <svg className="w-8 h-8 text-brand-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <div>
              <h2 className="text-lg font-bold mb-1">Secure Admin Control Center</h2>
              <p className="text-blue-200 dark:text-gray-400 text-sm"><strong>Data Ownership:</strong> All data is the exclusive property of ACCESS Lingua Ltd, stored securely in our approved encrypted database.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 border border-gray-100 dark:border-gray-700">
            
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy dark:text-white mb-6">Platform Overview & Reports</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-600">
                      <div className={`w-3 h-3 rounded-full ${stat.color} mb-4`}></div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
                      <h3 className="text-3xl font-black text-brand-navy dark:text-white mt-2">{stat.value}</h3>
                    </div>
                  ))}
                </div>

                {/* NEW: Visual Revenue Chart */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-600 mb-8">
                  <h3 className="font-bold text-brand-navy dark:text-white mb-6">Revenue Trend (Last 7 Days)</h3>
                  <div className="flex items-end justify-between space-x-2 h-40 pt-4">
                    {revenueData.map((data, index) => {
                      const height = (data.amount / maxRevenue) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center group">
                          <div className="relative w-full flex items-end justify-center h-full">
                            <div className="w-full max-w-[30px] bg-gradient-to-t from-brand-royal to-brand-cyan rounded-t-md transition-all duration-500 hover:opacity-80 cursor-pointer relative" style={{ height: `${Math.max(height, 5)}%` }}>
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-brand-navy dark:bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">${data.amount}</div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-2">{data.day}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* NEW: Live Activity Feed */}
                <div className="bg-blue-50 dark:bg-gray-700/50 border border-blue-100 dark:border-gray-600 rounded-xl p-6">
                  <h3 className="font-bold text-brand-navy dark:text-white mb-4 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Live Platform Activity
                  </h3>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 text-sm">
                        <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${activity.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={activity.icon} /></svg>
                        <div className="flex-grow">
                          <p className="font-medium text-gray-800 dark:text-gray-200">{activity.action} <span className="text-gray-600 dark:text-gray-400">- {activity.detail}</span></p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <h2 className="text-2xl font-bold text-brand-navy dark:text-white">Users & Members Management</h2>
                  <div className="flex space-x-3">
                    <input type="text" placeholder="Search users..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-royal text-sm" />
                    <button onClick={() => exportToCSV(users, 'users_export')} className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-bold transition flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* NEW: Bulk Action Bar */}
                {selectedUsers.length > 0 && (
                  <div className="bg-brand-royal/10 dark:bg-brand-royal/20 border border-brand-royal/20 rounded-lg p-3 mb-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-brand-royal">{selectedUsers.length} user(s) selected</span>
                    <div className="flex space-x-2">
                      <button onClick={() => handleBulkUserAction('Suspended')} className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded font-bold transition">Suspend</button>
                      <button onClick={() => handleBulkUserAction('Deleted')} className="text-xs bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded font-bold transition">Delete</button>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs uppercase">
                      <tr>
                        <th className="p-4"><input type="checkbox" onChange={(e) => setSelectedUsers(e.target.checked ? filteredUsers.map(u => u.id) : [])} checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0} className="rounded border-gray-300 text-brand-royal focus:ring-brand-royal" /></th>
                        <th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Plan</th><th className="p-4">Status</th><th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                          <td className="p-4"><input type="checkbox" checked={selectedUsers.includes(u.id)} onChange={() => toggleSelectUser(u.id)} className="rounded border-gray-300 text-brand-royal focus:ring-brand-royal" /></td>
                          <td className="p-4 font-mono text-sm text-brand-royal">{u.id}</td>
                          <td className="p-4 font-bold dark:text-white">{u.name}</td>
                          <td className="p-4 dark:text-gray-300">{u.email}</td>
                          <td className="p-4 dark:text-gray-300">{u.plan}</td>
                          <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.status}</span></td>
                          <td className="p-4"><button className="text-brand-royal font-bold text-sm hover:underline">Manage</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'interpreters' && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy dark:text-white mb-6">Interpreter Management</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs uppercase"><tr><th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4">Languages</th><th className="p-4">Rating</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {interpreters.map((i) => (<tr key={i.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"><td className="p-4 font-mono text-sm text-brand-royal">{i.id}</td><td className="p-4 font-bold dark:text-white">{i.name}</td><td className="p-4 dark:text-gray-300">{i.langs}</td><td className="p-4 text-yellow-500 font-bold">{i.rating} ⭐</td><td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${i.status === 'Online' ? 'bg-green-100 text-green-700' : i.status === 'Busy' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>{i.status}</span></td><td className="p-4"><button className="text-brand-royal font-bold text-sm hover:underline">Manage</button></td></tr>))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'companies' && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy dark:text-white mb-6">Corporate Accounts</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {companies.map((c) => (
                    <div key={c.id} className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 hover:shadow-lg transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-brand-navy dark:text-white">{c.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">Code: {c.code}</p>
                        </div>
                        <span className="bg-brand-royal/10 text-brand-royal px-3 py-1 rounded-full text-xs font-bold">Enterprise</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
                        <span><strong>{c.employees}</strong> Active Employees</span>
                        <span>Balance: <strong className="text-green-600">{c.balance}</strong></span>
                      </div>
                      <button className="w-full bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold py-2 rounded-lg transition">View Company Details</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy dark:text-white mb-6">Bookings Management</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs uppercase">
                      <tr><th className="p-4">Booking ID</th><th className="p-4">Client</th><th className="p-4">Interpreter</th><th className="p-4">Date & Time</th><th className="p-4">Type</th><th className="p-4">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                        <td className="p-4 font-mono text-sm text-brand-royal">BK-9921</td>
                        <td className="p-4 font-bold dark:text-white">Global Tech Inc.</td>
                        <td className="p-4 dark:text-gray-300">Maria Gonzalez</td>
                        <td className="p-4 dark:text-gray-300">Sep 24, 2026 • 10:00 AM</td>
                        <td className="p-4 dark:text-gray-300">Video Call</td>
                        <td className="p-4"><span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Scheduled</span></td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                        <td className="p-4 font-mono text-sm text-brand-royal">BK-9920</td>
                        <td className="p-4 font-bold dark:text-white">City Hospital</td>
                        <td className="p-4 dark:text-gray-300">Jean Dupont</td>
                        <td className="p-4 dark:text-gray-300">Sep 23, 2026 • 02:30 PM</td>
                        <td className="p-4 dark:text-gray-300">OPI Call</td>
                        <td className="p-4"><span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Completed</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'wallets' && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy dark:text-white mb-6">Wallets & Payments</h2>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-brand-navy to-brand-royal rounded-2xl p-6 text-white">
                    <p className="text-blue-200 text-xs uppercase font-bold">Total Platform Balance</p>
                    <h3 className="text-3xl font-black mt-2">$1,240,500.00</h3>
                  </div>
                  <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl p-6">
                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">Pending Payouts</p>
                    <h3 className="text-3xl font-black mt-2 text-brand-navy dark:text-white">$12,450.00</h3>
                  </div>
                  <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl p-6">
                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">Transactions Today</p>
                    <h3 className="text-3xl font-black mt-2 text-brand-navy dark:text-white">342</h3>
                  </div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Admin Note:</strong> Developer access to payment gateways is restricted to read-only technical troubleshooting. All financial data is encrypted at rest.
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy dark:text-white mb-2">Review Moderation</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Approve or reject customer testimonials before they appear on the public site.</p>
                
                {/* NEW: Bulk Action Bar for Reviews */}
                {selectedReviews.length > 0 && (
                  <div className="bg-brand-royal/10 dark:bg-brand-royal/20 border border-brand-royal/20 rounded-lg p-3 mb-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-brand-royal">{selectedReviews.length} review(s) selected</span>
                    <div className="flex space-x-2">
                      <button onClick={() => handleBulkReviewAction('Approved')} className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded font-bold transition">Approve All</button>
                      <button onClick={() => handleBulkReviewAction('Rejected')} className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded font-bold transition">Reject All</button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition bg-gray-50 dark:bg-gray-700/50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <input type="checkbox" checked={selectedReviews.includes(review.id)} onChange={() => toggleSelectReview(review.id)} className="rounded border-gray-300 text-brand-royal focus:ring-brand-royal mt-1" />
                          <div>
                            <h4 className="font-bold text-brand-navy dark:text-white text-lg">{review.user}</h4>
                            <div className="flex text-yellow-400 text-sm">{'⭐'.repeat(review.rating)}</div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${review.status === 'Approved' ? 'bg-green-100 text-green-700' : review.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {review.status}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 italic mb-4 pl-8">"{review.comment}"</p>
                      {review.status === 'Pending' && (
                        <div className="flex space-x-3 pl-8">
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
                <h2 className="text-2xl font-bold text-brand-navy dark:text-white mb-6">Supported Languages</h2>
                <div className="grid md:grid-cols-4 gap-4">
                  {['Spanish', 'French', 'Mandarin', 'Arabic', 'Russian', 'Japanese', 'German', 'Portuguese', 'Italian', 'Korean', 'Hindi', 'Turkish'].map((lang) => (
                    <div key={lang} className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-4 flex justify-between items-center">
                      <span className="font-bold text-gray-800 dark:text-white">{lang}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'ai-settings' && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy dark:text-white mb-6">AI Settings & Configuration</h2>
                <div className="space-y-6">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white">AI Transcription Service</h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-royal"></div>
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Enable real-time speech-to-text and interpretation for OPI and Video calls.</p>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white">AI Call Routing</h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-royal"></div>
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Automatically match callers with the best available interpreter based on language and rating.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy dark:text-white mb-6">System Notifications</h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <p className="font-bold text-blue-800 dark:text-blue-300">System Update</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Scheduled maintenance on Sep 30, 2026 at 02:00 AM UTC.</p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                    <p className="font-bold text-yellow-800 dark:text-yellow-300">Payment Gateway Alert</p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">Paystack API latency increased by 15% in the last hour.</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-r-lg">
                    <p className="font-bold text-green-800 dark:text-green-300">New Milestone</p>
                    <p className="text-sm text-green-600 dark:text-green-400">Platform reached 45,000 completed interpretations!</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'roles' && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy dark:text-white mb-6">Role-Based Permissions</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs uppercase">
                      <tr><th className="p-4">Role</th><th className="p-4">Data Access</th><th className="p-4">Permissions</th><th className="p-4">Users</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                        <td className="p-4 font-bold text-brand-navy dark:text-white">Super Admin</td>
                        <td className="p-4 text-sm dark:text-gray-300">Full Platform Access</td>
                        <td className="p-4 text-sm dark:text-gray-300">Manage all users, payments, settings</td>
                        <td className="p-4"><span className="bg-gray-100 dark:bg-gray-600 dark:text-white px-2 py-1 rounded text-xs font-bold">2</span></td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                        <td className="p-4 font-bold text-brand-navy dark:text-white">Support Staff</td>
                        <td className="p-4 text-sm dark:text-gray-300">Bookings, Users, Reviews</td>
                        <td className="p-4 text-sm dark:text-gray-300">View/Edit bookings, moderate reviews</td>
                        <td className="p-4"><span className="bg-gray-100 dark:bg-gray-600 dark:text-white px-2 py-1 rounded text-xs font-bold">5</span></td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                        <td className="p-4 font-bold text-brand-navy dark:text-white">Interpreter</td>
                        <td className="p-4 text-sm dark:text-gray-300">Own Profile, Assignments</td>
                        <td className="p-4 text-sm dark:text-gray-300">Update availability, view earnings</td>
                        <td className="p-4"><span className="bg-gray-100 dark:bg-gray-600 dark:text-white px-2 py-1 rounded text-xs font-bold">342</span></td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                        <td className="p-4 font-bold text-brand-navy dark:text-white">Client / Member</td>
                        <td className="p-4 text-sm dark:text-gray-300">Own Account, Wallet</td>
                        <td className="p-4 text-sm dark:text-gray-300">Book calls, manage wallet</td>
                        <td className="p-4"><span className="bg-gray-100 dark:bg-gray-600 dark:text-white px-2 py-1 rounded text-xs font-bold">1,240</span></td>
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