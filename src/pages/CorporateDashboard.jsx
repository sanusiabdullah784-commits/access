import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function CorporateDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [liveActivity, setLiveActivity] = useState([]);
  const [requestHistory, setRequestHistory] = useState([]);
  const [billingSummaries, setBillingSummaries] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeSection, setActiveSection] = useState('overview');
  const [usageStats, setUsageStats] = useState({ hours: 0, sessions: 0, languages: 0 });
  const fileInputRef = useRef(null);

  // Fetch all corporate data from Supabase
  useEffect(() => {
    const fetchCorporateData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUser(user);

      // 1. Get user's profile to find their company
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id, full_name, role')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) { setLoading(false); return; }

      // 2. Get company details
      const { data: companyData } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profile.company_id)
        .single();
      setCompany(companyData);

      // 3. Get all employees in this company
      const { data: employeesData } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, department, status, created_at')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false });
      setEmployees(employeesData || []);

      // 4. Get live activity (calls currently in progress by company employees)
      const employeeIds = (employeesData || []).map(e => e.id);
      if (employeeIds.length > 0) {
        const { data: liveData } = await supabase
          .from('calls')
          .select('id, user_id, interpreter_name, language, duration_minutes, status, created_at, category')
          .eq('status', 'In Progress')
          .in('user_id', employeeIds);
        setLiveActivity(liveData || []);
      }

      // 5. Get request history (recent calls by company employees)
      if (employeeIds.length > 0) {
        const { data: callsData } = await supabase
          .from('calls')
          .select('id, user_id, interpreter_name, language, duration_minutes, status, created_at, category, cost')
          .in('user_id', employeeIds)
          .order('created_at', { ascending: false })
          .limit(10);
        setRequestHistory(callsData || []);

        // Calculate usage stats
        const allCalls = callsData || [];
        const totalMinutes = allCalls.reduce((sum, c) => sum + (c.duration_minutes || 0), 0);
        const uniqueLangs = new Set(allCalls.map(c => c.language)).size;
        setUsageStats({
          hours: Math.round(totalMinutes / 60),
          sessions: allCalls.length,
          languages: uniqueLangs
        });
      }

      // 6. Get billing summaries
      const { data: invoicesData } = await supabase
        .from('invoices')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false })
        .limit(10);
      setBillingSummaries(invoicesData || []);

      // 7. Get audit logs
      const { data: logsData } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false })
        .limit(20);
      setAuditLogs(logsData || []);

      setLoading(false);
    };

    fetchCorporateData();
  }, []);

  // Helper: Add audit log entry
  const addAuditLog = async (action, details) => {
    if (!user || !company) return;
    await supabase.from('audit_logs').insert([{
      company_id: company.id,
      user_id: user.id,
      user_email: user.email,
      action,
      details
    }]);
    // Refresh audit logs
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('company_id', company.id)
      .order('created_at', { ascending: false })
      .limit(20);
    setAuditLogs(data || []);
  };

  // Helper: Get employee name by ID
  const getEmployeeName = (userId) => {
    const emp = employees.find(e => e.id === userId);
    return emp?.full_name || 'Unknown Employee';
  };

  // CSV Export
  const handleExportCSV = () => {
    if (employees.length === 0) {
      alert('No employees to export.');
      return;
    }
    const headers = ['Name', 'Email', 'Role', 'Department', 'Status'];
    const rows = employees.map(e => [
      `"${e.full_name || ''}"`,
      `"${e.email || ''}"`,
      `"${e.role || ''}"`,
      `"${e.department || ''}"`,
      `"${e.status || ''}"`
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees-${company?.code || 'export'}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addAuditLog('EXPORT_CSV', `Exported ${employees.length} employees to CSV`);
  };

  // CSV Import
  const handleImportCSV = async (e) => {
    const file = e.target.files[0];
    if (!file || !company) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const rows = text.split('\n').filter(r => r.trim());
        if (rows.length < 2) {
          alert('CSV file is empty or has no data rows.');
          return;
        }
        const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
        
        const newEmployees = [];
        for (let i = 1; i < rows.length; i++) {
          const values = rows[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          const row = {};
          headers.forEach((h, idx) => { row[h] = values[idx]; });
          if (row.name || row.email) {
            newEmployees.push({
              full_name: row.name || '',
              email: row.email || '',
              role: row.role || 'Staff',
              department: row.department || 'General',
              company_id: company.id,
              status: 'Active'
            });
          }
        }

        if (newEmployees.length === 0) {
          alert('No valid employee records found in CSV.');
          return;
        }

        const { error } = await supabase.from('profiles').insert(newEmployees);
        if (error) {
          alert('Error importing employees: ' + error.message);
        } else {
          alert(`✅ Successfully imported ${newEmployees.length} employees!`);
          addAuditLog('BULK_IMPORT', `Imported ${newEmployees.length} employees from CSV`);
          // Refresh employee list
          const { data } = await supabase
            .from('profiles')
            .select('id, full_name, email, role, department, status, created_at')
            .eq('company_id', company.id)
            .order('created_at', { ascending: false });
          setEmployees(data || []);
        }
      } catch (err) {
        alert('Error parsing CSV: ' + err.message);
      }
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', { 
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pt-36">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-brand-royal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Loading corporate dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Fallback if no company found
  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pt-36">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-8">
          <div className="bg-white rounded-2xl shadow-md p-10 text-center max-w-md">
            <div className="w-16 h-16 bg-brand-royal/10 text-brand-royal rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-brand-navy mb-2">No Corporate Account Found</h2>
            <p className="text-gray-500 mb-6">Your account is not linked to a corporate organization. Please contact support to upgrade to an Enterprise account.</p>
            <a href="/contact" className="inline-block bg-brand-royal hover:bg-brand-navy text-white px-6 py-3 rounded-full font-bold transition">Contact Support</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const activeEmployees = employees.filter(e => e.status === 'Active').length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-36">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Tabs */}
          <div className="flex space-x-2 mb-8 bg-white rounded-xl p-2 shadow-sm overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
              { id: 'employees', label: 'Employees', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
              { id: 'billing', label: 'Billing', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
              { id: 'audit', label: 'Audit Logs', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-bold transition whitespace-nowrap ${
                  activeSection === tab.id
                    ? 'bg-brand-royal text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* OVERVIEW SECTION */}
          {activeSection === 'overview' && (
            <>
              {/* Company Header & Wallet */}
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-8 border-l-4 border-brand-navy">
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                      <p className="text-gray-500 text-sm uppercase tracking-wider font-bold">Organization</p>
                      <h1 className="text-3xl font-black text-brand-navy mt-1">{company.name}</h1>
                      <p className="text-gray-600 mt-2">Enterprise Account • {activeEmployees} Authorized Staff Members</p>
                    </div>
                    <div className="bg-gray-100 px-4 py-2 rounded-lg text-center">
                      <p className="text-xs text-gray-500 uppercase font-bold">Company Code</p>
                      <p className="text-xl font-mono font-bold text-brand-royal tracking-widest">{company.code}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-brand-navy to-brand-royal rounded-2xl shadow-md p-8 text-white">
                  <p className="text-blue-200 text-sm uppercase tracking-wider font-bold">Corporate Wallet</p>
                  <h2 className="text-4xl font-black mt-2">${(company.wallet_balance || 0).toFixed(2)}</h2>
                  <p className="text-blue-100 text-sm mt-2">Enterprise billing cycle</p>
                  <button 
                    onClick={() => setActiveSection('billing')}
                    className="mt-4 bg-white text-brand-navy px-4 py-2 rounded-full text-sm font-bold hover:bg-brand-cyan hover:text-white transition"
                  >
                    Manage Billing
                  </button>
                </div>
              </div>

              {/* Live Employee Activity Feed */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-10 border-l-4 border-green-500">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-brand-navy">Live Employee Activity</h3>
                      <p className="text-gray-500 text-sm">Staff currently on interpretation calls</p>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    {liveActivity.length} Active
                  </span>
                </div>
                <div className="p-6">
                  {liveActivity.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {liveActivity.map((call) => (
                        <div key={call.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                                {getEmployeeName(call.user_id).charAt(0)}
                              </div>
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 text-sm">{getEmployeeName(call.user_id)}</p>
                              <p className="text-xs text-gray-500">{call.language} • {call.interpreter_name || 'Interpreter'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase font-bold">Duration</p>
                            <p className="font-mono font-bold text-green-600">{call.duration_minutes || 0}m</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                      <p className="text-gray-500 font-medium">No employees currently on calls</p>
                      <p className="text-sm text-gray-400 mt-1">Live activity will appear here in real-time</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Monthly Usage & Billing Grid */}
              <div className="grid lg:grid-cols-2 gap-8 mb-10">
                {/* Monthly Usage Reports */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-brand-navy mb-6">Monthly Usage Report</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 font-medium">Total Interpretation Hours</span>
                        <span className="font-bold text-brand-navy">{usageStats.hours} Hours</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-brand-royal h-3 rounded-full transition-all duration-500" style={{ width: `${Math.min((usageStats.hours / 200) * 100, 100)}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 font-medium">Interpretation Sessions</span>
                        <span className="font-bold text-brand-navy">{usageStats.sessions} Sessions</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-brand-cyan h-3 rounded-full transition-all duration-500" style={{ width: `${Math.min((usageStats.sessions / 150) * 100, 100)}%` }}></div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <p className="text-2xl font-black text-brand-navy">{usageStats.sessions}</p>
                        <p className="text-xs text-gray-500 uppercase font-bold">Total Sessions</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <p className="text-2xl font-black text-brand-navy">{usageStats.languages}</p>
                        <p className="text-xs text-gray-500 uppercase font-bold">Languages Used</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Billing Summaries Preview */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-brand-navy">Recent Billing Summaries</h3>
                    <button onClick={() => setActiveSection('billing')} className="text-sm text-brand-royal font-bold hover:underline">View All</button>
                  </div>
                  <div className="space-y-4">
                    {billingSummaries.length > 0 ? billingSummaries.slice(0, 3).map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-brand-navy/10 text-brand-navy rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{invoice.invoice_number || `INV-${invoice.id.slice(0, 8).toUpperCase()}`}</p>
                            <p className="text-xs text-gray-500">{formatDate(invoice.created_at)} • {invoice.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-brand-navy">${(invoice.amount || 0).toFixed(2)}</p>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            invoice.status === 'Paid' ? 'text-green-600 bg-green-100' : 
                            invoice.status === 'Pending' ? 'text-yellow-600 bg-yellow-100' : 
                            'text-red-600 bg-red-100'
                          }`}>{invoice.status}</span>
                        </div>
                      </div>
                    )) : (
                      <p className="text-center text-gray-500 py-8">No invoices yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Request History */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-brand-navy">Authorized Call History</h3>
                  <p className="text-gray-500 text-sm">Recent interpretation requests made by your organization's staff.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="p-4 font-bold">Requested By</th>
                        <th className="p-4 font-bold">Language</th>
                        <th className="p-4 font-bold">Category</th>
                        <th className="p-4 font-bold">Duration</th>
                        <th className="p-4 font-bold">Date</th>
                        <th className="p-4 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {requestHistory.length > 0 ? requestHistory.map((req) => (
                        <tr key={req.id} className="hover:bg-gray-50 transition">
                          <td className="p-4 font-medium text-gray-800">{getEmployeeName(req.user_id)}</td>
                          <td className="p-4 text-gray-600">{req.language}</td>
                          <td className="p-4 text-gray-600">{req.category || 'General'}</td>
                          <td className="p-4 text-gray-600">{req.duration_minutes || 0} mins</td>
                          <td className="p-4 text-gray-500 text-sm">{formatDate(req.created_at)}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              req.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              req.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="6" className="p-8 text-center text-gray-500">No call history yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* EMPLOYEES SECTION */}
          {activeSection === 'employees' && (
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-brand-navy">Employee Management</h3>
                  <p className="text-gray-500 text-sm">Manage staff access and view individual Member IDs.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <label className="cursor-pointer bg-white border-2 border-brand-cyan text-brand-cyan hover:bg-brand-cyan hover:text-white px-5 py-2.5 rounded-full font-bold transition shadow-md flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    Import CSV
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept=".csv" 
                      onChange={handleImportCSV} 
                      className="hidden" 
                    />
                  </label>
                  <button 
                    onClick={handleExportCSV}
                    className="bg-white border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white px-5 py-2.5 rounded-full font-bold transition shadow-md flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Export CSV
                  </button>
                  <button 
                    onClick={() => alert('This would open a modal to invite a new employee via email and assign them a Member ID.')}
                    className="bg-brand-royal hover:bg-brand-navy text-white px-5 py-2.5 rounded-full font-bold transition shadow-md flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Employee
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4 font-bold">Employee Name</th>
                      <th className="p-4 font-bold">Member ID</th>
                      <th className="p-4 font-bold">Department</th>
                      <th className="p-4 font-bold">Role</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {employees.length > 0 ? employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-gray-50 transition">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-brand-cyan/10 text-brand-cyan rounded-full flex items-center justify-center font-bold">
                              {(emp.full_name || 'U').charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800">{emp.full_name || 'Unnamed'}</p>
                              <p className="text-xs text-gray-500">{emp.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-sm text-brand-royal font-bold">MEM-{emp.id.slice(0, 8).toUpperCase()}</td>
                        <td className="p-4 text-gray-600">{emp.department || 'General'}</td>
                        <td className="p-4 text-gray-600">{emp.role || 'Staff'}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {emp.status || 'Active'}
                          </span>
                        </td>
                        <td className="p-4">
                          <button className="text-brand-royal hover:text-brand-navy font-medium text-sm">Edit</button>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="6" className="p-8 text-center text-gray-500">No employees found. Use "Import CSV" to add multiple employees at once.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BILLING SECTION */}
          {activeSection === 'billing' && (
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-brand-navy flex items-center">
                    <svg className="w-6 h-6 mr-2 text-brand-royal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    Billing Summaries & Wallet Management
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">Track corporate spending, manage wallet balance, and download invoices.</p>
                </div>
                <button className="bg-brand-royal hover:bg-brand-navy text-white px-5 py-2.5 rounded-full font-bold transition shadow-md flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Top Up Wallet
                </button>
              </div>
              <div className="p-6">
                {billingSummaries.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="p-4 font-bold">Invoice Number</th>
                          <th className="p-4 font-bold">Date</th>
                          <th className="p-4 font-bold">Description</th>
                          <th className="p-4 font-bold">Amount</th>
                          <th className="p-4 font-bold">Status</th>
                          <th className="p-4 font-bold">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {billingSummaries.map((invoice) => (
                          <tr key={invoice.id} className="hover:bg-gray-50 transition">
                            <td className="p-4 font-mono text-sm text-brand-royal font-bold">
                              {invoice.invoice_number || `INV-${invoice.id.slice(0, 8).toUpperCase()}`}
                            </td>
                            <td className="p-4 text-gray-600">{formatDate(invoice.created_at)}</td>
                            <td className="p-4 text-gray-600">{invoice.description || 'Monthly Interpretation Services'}</td>
                            <td className="p-4 font-bold text-gray-800">${(invoice.amount || 0).toFixed(2)}</td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                invoice.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                                invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                                'bg-red-100 text-red-700'
                              }`}>
                                {invoice.status}
                              </span>
                            </td>
                            <td className="p-4">
                              <button className="text-brand-royal hover:text-brand-navy font-medium text-sm flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Download PDF
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <p className="text-gray-500 font-medium">No billing history found.</p>
                    <p className="text-sm text-gray-400 mt-1">Invoices will be generated automatically at the end of each billing cycle.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AUDIT LOGS SECTION */}
          {activeSection === 'audit' && (
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-brand-navy flex items-center">
                    <svg className="w-6 h-6 mr-2 text-brand-royal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    Audit Logs & Compliance Tracking
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">Complete history of all administrative actions for HIPAA/GDPR compliance.</p>
                </div>
                <span className="bg-brand-royal/10 text-brand-royal px-3 py-1 rounded-full text-xs font-bold">
                  {auditLogs.length} Entries
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4 font-bold">Timestamp</th>
                      <th className="p-4 font-bold">User</th>
                      <th className="p-4 font-bold">Action</th>
                      <th className="p-4 font-bold">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {auditLogs.length > 0 ? auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 text-gray-500 text-sm font-mono">{formatDateTime(log.created_at)}</td>
                        <td className="p-4 text-gray-800 text-sm">{log.user_email}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            log.action === 'BULK_IMPORT' ? 'bg-blue-100 text-blue-700' :
                            log.action === 'EXPORT_CSV' ? 'bg-purple-100 text-purple-700' :
                            log.action === 'ADD_EMPLOYEE' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600 text-sm">{log.details}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan="4" className="p-8 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          <p>No audit logs yet. Actions like importing employees or exporting data will be logged here.</p>
                        </div>
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CorporateDashboard;