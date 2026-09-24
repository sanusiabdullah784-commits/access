import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function CorporateDashboard() {
  const [employees] = useState([
    { id: 'EMP-001', name: 'Sarah Jenkins', role: 'CEO', department: 'Executive', status: 'Active', calls: 12 },
    { id: 'EMP-002', name: 'Michael Chen', role: 'Medical Director', department: 'Healthcare', status: 'Active', calls: 45 },
    { id: 'EMP-003', name: 'Elena Rodriguez', role: 'Legal Counsel', department: 'Legal', status: 'Active', calls: 28 },
    { id: 'EMP-004', name: 'David O\'Connor', role: 'HR Manager', department: 'Human Resources', status: 'Inactive', calls: 5 },
    { id: 'EMP-005', name: 'Aisha Patel', role: 'Procurement Lead', department: 'Operations', status: 'Active', calls: 19 },
  ]);

  const requestHistory = [
    { id: 'REQ-9921', employee: 'Michael Chen', language: 'Mandarin', type: 'Video Call', duration: '45 mins', date: 'Sep 14, 2026', status: 'Completed' },
    { id: 'REQ-9920', employee: 'Elena Rodriguez', language: 'French', type: 'Phone Call', duration: '30 mins', date: 'Sep 12, 2026', status: 'Completed' },
    { id: 'REQ-9918', employee: 'Sarah Jenkins', language: 'Spanish', type: 'In-Person', duration: '2 Hours', date: 'Sep 10, 2026', status: 'Completed' },
    { id: 'REQ-9915', employee: 'Aisha Patel', language: 'Arabic', type: 'Video Call', duration: '15 mins', date: 'Sep 08, 2026', status: 'Completed' },
  ];

  const billingSummaries = [
    { id: 'INV-2026-09', date: 'Sep 01, 2026', description: 'Monthly Enterprise Subscription + Overage', amount: '$1,250.00', status: 'Paid' },
    { id: 'INV-2026-08', date: 'Aug 01, 2026', description: 'Monthly Enterprise Subscription', amount: '$999.00', status: 'Paid' },
    { id: 'INV-2026-07', date: 'Jul 01, 2026', description: 'Monthly Enterprise Subscription', amount: '$999.00', status: 'Paid' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Company Header & Wallet */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-8 border-l-4 border-brand-navy">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm uppercase tracking-wider font-bold">Organization</p>
                  <h1 className="text-3xl font-black text-brand-navy mt-1">Global Tech Inc.</h1>
                  <p className="text-gray-600 mt-2">Enterprise Account • 5 Authorized Staff Members</p>
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-lg text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold">Company Code</p>
                  <p className="text-xl font-mono font-bold text-brand-royal tracking-widest">GT-8842-X</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-navy to-brand-royal rounded-2xl shadow-md p-8 text-white">
              <p className="text-blue-200 text-sm uppercase tracking-wider font-bold">Corporate Wallet</p>
              <h2 className="text-4xl font-black mt-2">$12,450.00</h2>
              <p className="text-blue-100 text-sm mt-2">Auto-renews on Oct 1, 2026</p>
              <button className="mt-4 bg-white text-brand-navy px-4 py-2 rounded-full text-sm font-bold hover:bg-brand-cyan hover:text-white transition">
                Manage Billing & Wallet
              </button>
            </div>
          </div>

          {/* Employee Management */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-10">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-brand-navy">Employee Management</h3>
                <p className="text-gray-500 text-sm">Manage staff access and view individual Member IDs.</p>
              </div>
              <button className="bg-brand-royal hover:bg-brand-navy text-white px-5 py-2.5 rounded-full font-bold transition shadow-md flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add Employee
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4 font-bold">Employee Name</th>
                    <th className="p-4 font-bold">Member ID</th>
                    <th className="p-4 font-bold">Department</th>
                    <th className="p-4 font-bold">Total Calls</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50 transition">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-brand-cyan/10 text-brand-cyan rounded-full flex items-center justify-center font-bold">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{emp.name}</p>
                            <p className="text-xs text-gray-500">{emp.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-sm text-brand-royal font-bold">{emp.id}</td>
                      <td className="p-4 text-gray-600">{emp.department}</td>
                      <td className="p-4 font-bold text-gray-800">{emp.calls}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="text-brand-royal hover:text-brand-navy font-medium text-sm">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly Usage & Billing Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-10">
            
            {/* Monthly Usage Reports */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold text-brand-navy mb-6">Monthly Usage Report (September)</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 font-medium">Total Interpretation Hours</span>
                    <span className="font-bold text-brand-navy">142 / 200 Hours</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-brand-royal h-3 rounded-full transition-all duration-500" style={{ width: '71%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 font-medium">Document Translation Pages</span>
                    <span className="font-bold text-brand-navy">850 / 1000 Pages</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-brand-cyan h-3 rounded-full transition-all duration-500" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-black text-brand-navy">109</p>
                    <p className="text-xs text-gray-500 uppercase font-bold">Total Sessions</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-black text-brand-navy">14</p>
                    <p className="text-xs text-gray-500 uppercase font-bold">Languages Used</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Summaries */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-brand-navy">Billing Summaries</h3>
                <button className="text-sm text-brand-royal font-bold hover:underline">View All Invoices</button>
              </div>
              <div className="space-y-4">
                {billingSummaries.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-brand-navy/10 text-brand-navy rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{invoice.id}</p>
                        <p className="text-xs text-gray-500">{invoice.date} • {invoice.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brand-navy">{invoice.amount}</p>
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">{invoice.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interpreter Request History */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-brand-navy">Authorized Call & Request History</h3>
              <p className="text-gray-500 text-sm">Recent interpreter requests made by your organization's staff.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4 font-bold">Request ID</th>
                    <th className="p-4 font-bold">Requested By</th>
                    <th className="p-4 font-bold">Language</th>
                    <th className="p-4 font-bold">Type & Duration</th>
                    <th className="p-4 font-bold">Date</th>
                    <th className="p-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {requestHistory.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-mono text-sm text-brand-royal font-bold">{req.id}</td>
                      <td className="p-4 font-medium text-gray-800">{req.employee}</td>
                      <td className="p-4 text-gray-600">{req.language}</td>
                      <td className="p-4 text-gray-600">{req.type} • {req.duration}</td>
                      <td className="p-4 text-gray-500 text-sm">{req.date}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CorporateDashboard;