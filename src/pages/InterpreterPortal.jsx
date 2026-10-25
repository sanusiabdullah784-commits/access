import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function InterpreterPortal() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ name: 'Interpreter', availability: 'Online' });
  
  const [upcomingJobs, setUpcomingJobs] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [stats, setStats] = useState({ earnings: 0, sessions: 0, rating: 0 });
  const [earningsData, setEarningsData] = useState([]);
  const [languageStats, setLanguageStats] = useState([]);

  // Instant Call State
  const [incomingCall, setIncomingCall] = useState(null);
  const [callTimer, setCallTimer] = useState(15);

  // Briefing State
  const [showBriefing, setShowBriefing] = useState(false);
  const [selectedBriefing, setSelectedBriefing] = useState('');

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUser(user);

      // 1. Profile & Availability
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, availability_status')
        .eq('id', user.id)
        .single();
      
      if (profileData) {
        setProfile({
          name: profileData.full_name || 'Interpreter',
          availability: profileData.availability_status || 'Online'
        });
      }

      // 2. Upcoming Jobs (Scheduled bookings for this interpreter)
      const { data: upcomingData } = await supabase
        .from('bookings')
        .select('id, client_name, language, type, scheduled_time, briefing_notes')
        .eq('interpreter_id', user.id)
        .in('status', ['scheduled', 'pending'])
        .order('scheduled_time', { ascending: true })
        .limit(5);
      
      setUpcomingJobs(upcomingData ? upcomingData.map(b => ({
        id: b.id,
        client: b.client_name,
        language: b.language,
        time: new Date(b.scheduled_time).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
        type: b.type,
        briefing: b.briefing_notes
      })) : []);

      // 3. Available Jobs (Open requests)
      const { data: availableData } = await supabase
        .from('bookings')
        .select('id, client_name, language, duration_minutes, estimated_rate')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(5);

      setAvailableJobs(availableData ? availableData.map(j => ({
        id: j.id,
        client: j.client_name,
        language: j.language,
        duration: `${j.duration_minutes} mins`,
        rate: `$${(j.estimated_rate || 45).toFixed(0)}/hr`
      })) : []);

      // 4. Stats & Analytics (Completed calls)
      const { data: callsData } = await supabase
        .from('calls')
        .select('cost, rating, language, created_at')
        .eq('interpreter_id', user.id)
        .eq('status', 'Completed');

      if (callsData) {
        const totalEarnings = callsData.reduce((sum, c) => sum + (c.cost || 0), 0);
        const avgRating = callsData.length > 0 
          ? (callsData.reduce((sum, c) => sum + (c.rating || 5), 0) / callsData.length).toFixed(1) 
          : '5.0';
        
        setStats({
          earnings: totalEarnings,
          sessions: callsData.length,
          rating: avgRating
        });

        // Earnings last 7 days
        const last7Days = Array.from({ length: 7 }).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return { day: date.toLocaleDateString('en-US', { weekday: 'short' }), amount: 0 };
        });
        callsData.forEach(call => {
          const daysAgo = Math.floor((new Date() - new Date(call.created_at)) / (1000 * 60 * 60 * 24));
          if (daysAgo >= 0 && daysAgo < 7) {
            last7Days[6 - daysAgo].amount += call.cost || 0;
          }
        });
        setEarningsData(last7Days);

        // Language stats
        const langCounts = {};
        callsData.forEach(c => { langCounts[c.language] = (langCounts[c.language] || 0) + 1; });
        const totalCalls = callsData.length || 1;
        const langStats = Object.entries(langCounts)
          .map(([lang, count]) => ({ lang, percentage: Math.round((count / totalCalls) * 100) }))
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 3);
        setLanguageStats(langStats);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // Incoming Call Timer
  useEffect(() => {
    if (!incomingCall || callTimer <= 0) {
      if (callTimer <= 0 && incomingCall) setIncomingCall(null);
      return;
    }
    const timer = setInterval(() => setCallTimer(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [incomingCall, callTimer]);

  const handleToggleAvailability = async (newStatus) => {
    setProfile(prev => ({ ...prev, availability: newStatus }));
    if (user) {
      await supabase.from('profiles').update({ availability_status: newStatus }).eq('id', user.id);
    }
  };

  const handleAcceptCall = () => {
    setIncomingCall(null);
    alert("Call accepted! Connecting you to the session...");
  };

  const handleDeclineCall = () => {
    setIncomingCall(null);
  };

  const handleViewBriefing = (text) => {
    setSelectedBriefing(text || "No specific briefing provided for this session.");
    setShowBriefing(true);
  };

  const maxEarnings = Math.max(...earningsData.map(d => d.amount), 1);

  if (loading) {
    return (
      // FIXED: Added pt-36 to push content down below the fixed Navbar
      <div className="min-h-screen bg-gray-50 flex flex-col pt-36">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-brand-royal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Loading your portal...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    // FIXED: Added pt-36 to push content down below the fixed Navbar
    <div className="min-h-screen bg-gray-50 flex flex-col pt-36">
      <Navbar />
      
      {/* NEW: Instant Call Banner */}
      {incomingCall && (
        <div className="fixed top-20 left-0 right-0 z-40 px-4 animate-fadeIn">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl shadow-2xl p-4 text-white flex flex-col md:flex-row items-center justify-between gap-4 border-2 border-white/20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <span className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping"></span>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
              </div>
              <div>
                <p className="font-bold text-lg">Incoming Request: {incomingCall.language}</p>
                <p className="text-sm opacity-90">{incomingCall.client} • ~{incomingCall.duration} mins</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="text-2xl font-black font-mono bg-black/20 px-3 py-1 rounded-lg">{callTimer}s</div>
              <button onClick={handleDeclineCall} className="flex-1 md:flex-none bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-bold transition">Decline</button>
              <button onClick={handleAcceptCall} className="flex-1 md:flex-none bg-white text-red-600 hover:bg-gray-100 px-6 py-2 rounded-lg font-bold transition shadow-lg flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span>Accept</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Briefing Modal */}
      {showBriefing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
            <button onClick={() => setShowBriefing(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-xl font-bold text-brand-navy mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-brand-royal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              Session Briefing
            </h3>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">{selectedBriefing}</p>
            </div>
          </div>
        </div>
      )}
      
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Welcome Header with Smart Availability Toggle */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-brand-navy">Welcome back, {profile.name}! 👋</h1>
              <p className="text-gray-500 mt-2">You have {upcomingJobs.length} upcoming sessions. Keep up the great work!</p>
            </div>
            
            {/* Smart Availability Toggle */}
            <div className="bg-white p-1.5 rounded-full shadow-md border border-gray-200 inline-flex">
              {[
                { status: 'Online', color: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50' },
                { status: 'Busy', color: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50' },
                { status: 'Offline', color: 'bg-gray-400', text: 'text-gray-600', bg: 'bg-gray-50' }
              ].map((opt) => (
                <button
                  key={opt.status}
                  onClick={() => handleToggleAvailability(opt.status)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition flex items-center space-x-2 ${
                    profile.availability === opt.status 
                      ? `${opt.bg} ${opt.text} shadow-sm` 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${opt.color}`}></span>
                  <span>{opt.status}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-green-500">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Earnings</p>
              <h2 className="text-3xl font-black text-brand-navy mt-2">${stats.earnings.toFixed(2)}</h2>
              <p className="text-green-500 text-sm mt-1">Lifetime total</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-brand-royal">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Completed Sessions</p>
              <h2 className="text-3xl font-black text-brand-navy mt-2">{stats.sessions}</h2>
              <p className="text-gray-500 text-sm mt-1">All time</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-yellow-400">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Average Rating</p>
              <h2 className="text-3xl font-black text-brand-navy mt-2">{stats.rating} / 5.0</h2>
              <p className="text-yellow-500 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                Top Rated Interpreter
              </p>
            </div>
          </div>

          {/* Visual Analytics Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-10">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-brand-navy mb-4">Earnings (Last 7 Days)</h3>
              <div className="flex items-end justify-between space-x-2 h-32 pt-4">
                {earningsData.map((day, index) => {
                  const height = (day.amount / maxEarnings) * 100;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center group">
                      <div className="relative w-full flex items-end justify-center h-full">
                        <div 
                          className="w-full max-w-[30px] bg-gradient-to-t from-brand-royal to-brand-cyan rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer relative"
                          style={{ height: `${Math.max(height, 5)}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-brand-navy text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                            ${day.amount.toFixed(0)}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mt-2">{day.day}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-brand-navy mb-4">Top Languages Interpreted</h3>
              <div className="space-y-4">
                {languageStats.length > 0 ? languageStats.map((stat, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{stat.lang}</span>
                      <span className="text-sm font-bold text-brand-navy">{stat.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-brand-cyan h-2.5 rounded-full transition-all duration-500" style={{ width: `${stat.percentage}%` }}></div>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-sm">No language data available yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Upcoming Jobs */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold text-brand-navy mb-6">Upcoming Sessions</h3>
              <div className="space-y-4">
                {upcomingJobs.length > 0 ? upcomingJobs.map((job) => (
                  <div key={job.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-800">{job.client}</h4>
                      <span className="bg-brand-cyan/10 text-brand-cyan text-xs font-bold px-2 py-1 rounded-full">{job.type}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{job.language}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {job.time}
                    </div>
                    <div className="flex space-x-2">
                      {job.briefing && (
                        <button 
                          onClick={() => handleViewBriefing(job.briefing)}
                          className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm font-bold py-2 rounded-lg transition flex items-center justify-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                          <span>Briefing</span>
                        </button>
                      )}
                      <button className="flex-1 bg-brand-navy hover:bg-brand-royal text-white text-sm font-bold py-2 rounded-lg transition">
                        Join Session
                      </button>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-gray-500 py-8">No upcoming sessions scheduled.</p>
                )}
              </div>
            </div>

            {/* Available Jobs */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold text-brand-navy mb-6">Available Jobs</h3>
              <div className="space-y-4">
                {availableJobs.length > 0 ? availableJobs.map((job) => (
                  <div key={job.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-800">{job.client}</h4>
                      <span className="text-green-600 font-bold text-sm">{job.rate}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{job.language} • {job.duration}</p>
                    <button className="mt-3 w-full bg-white border-2 border-brand-royal text-brand-royal hover:bg-brand-royal hover:text-white text-sm font-bold py-2 rounded-lg transition">
                      Accept Job
                    </button>
                  </div>
                )) : (
                  <p className="text-center text-gray-500 py-8">No open job requests at the moment.</p>
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

export default InterpreterPortal;