import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function InterpreterDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [availability, setAvailability] = useState('Online');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Interpreter Profile State
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    interpreterId: '',
    bio: '',
    photo: null,
    languages: [],
    certifications: []
  });

  // Real Data States
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [callHistory, setCallHistory] = useState([]);
  const [earningsData, setEarningsData] = useState([]);

  // Incoming Call Modal States
  const [incomingCall, setIncomingCall] = useState(null);
  const [callTimer, setCallTimer] = useState(15);

  // Smart Briefing Modal State
  const [showBriefingModal, setShowBriefingModal] = useState(false);
  const [selectedBriefing, setSelectedBriefing] = useState('');

  // Fetch Interpreter Data on Mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUser(user);

      // 1. Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, email, phone, bio, avatar_url, languages, certifications, availability_status, id')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile({
          name: profileData.full_name || '',
          email: profileData.email || user.email,
          phone: profileData.phone || '',
          interpreterId: `INT-${user.id.slice(0, 6).toUpperCase()}`,
          bio: profileData.bio || '',
          photo: profileData.avatar_url || null,
          languages: profileData.languages || ['Spanish', 'English'],
          certifications: profileData.certifications || ['HIPAA Trained']
        });
        setAvailability(profileData.availability_status || 'Online');
      }

      // 2. Fetch Upcoming Bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('id, client_id, booking_type, duration_minutes, scheduled_time, briefing_notes, status')
        .eq('interpreter_id', user.id)
        .in('status', ['scheduled', 'pending'])
        .order('scheduled_time', { ascending: true });
      
      setUpcomingBookings(bookingsData ? bookingsData.map(b => ({
        id: b.id,
        date: new Date(b.scheduled_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date(b.scheduled_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        client: 'Scheduled Client',
        type: b.booking_type || 'Video Call',
        duration: `${b.duration_minutes} mins`,
        briefing: b.briefing_notes
      })) : []);

      // 3. Fetch Call History
      const { data: callsData } = await supabase
        .from('calls')
        .select('id, user_id, duration_minutes, rating, cost, created_at')
        .eq('interpreter_id', user.id)
        .eq('status', 'Completed')
        .order('created_at', { ascending: false })
        .limit(10);

      setCallHistory(callsData ? callsData.map(c => ({
        id: c.id,
        date: new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        client: 'Individual Client',
        duration: `${c.duration_minutes || 0} mins`,
        earnings: `$${(c.cost || 0).toFixed(2)}`,
        rating: c.rating || 5
      })) : []);

      // 4. Calculate Earnings Data (Last 7 Days)
      const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return { day: date.toLocaleDateString('en-US', { weekday: 'short' }), amount: 0 };
      });

      if (callsData) {
        callsData.forEach(call => {
          const callDate = new Date(call.created_at);
          const daysAgo = Math.floor((new Date() - callDate) / (1000 * 60 * 60 * 24));
          if (daysAgo >= 0 && daysAgo < 7) {
            last7Days[6 - daysAgo].amount += call.cost || 0;
          }
        });
      }
      setEarningsData(last7Days);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Instantly update database when availability changes
  useEffect(() => {
    const updateAvailability = async () => {
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ availability_status: availability })
          .eq('id', user.id);
        
        if (error) console.error("Error updating availability status:", error);
      }
    };
    updateAvailability();
  }, [availability, user]);

  // Incoming Call Timer Logic
  useEffect(() => {
    if (!incomingCall || callTimer <= 0) {
      if (callTimer <= 0 && incomingCall) {
        setIncomingCall(null); // Auto-decline
      }
      return;
    }
    const timer = setInterval(() => setCallTimer((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [incomingCall, callTimer]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setProfile({ ...profile, photo: URL.createObjectURL(file) });
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.name,
        phone: profile.phone,
        bio: profile.bio,
        languages: profile.languages,
        certifications: profile.certifications
      })
      .eq('id', user.id);

    if (error) alert("Error saving profile: " + error.message);
    else alert("Profile updated successfully!");
  };

  const handleAcceptCall = () => {
    setIncomingCall(null);
    alert("Call accepted! Connecting you to the session...");
  };

  const handleDeclineCall = () => {
    setIncomingCall(null);
  };

  const handleViewBriefing = (briefingText) => {
    setSelectedBriefing(briefingText || "No specific briefing provided for this session.");
    setShowBriefingModal(true);
  };

  const tabs = [
    { id: 'profile', label: 'Profile & Certifications', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'availability', label: 'Availability Status', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'bookings', label: 'Bookings & Earnings', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'account', label: 'Account Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  const maxEarnings = Math.max(...earningsData.map(d => d.amount), 1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pt-36">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-brand-royal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Loading your interpreter portal...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-36">
      <Navbar />
      
      {/* Incoming Call Request Modal */}
      {incomingCall && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative border-t-4 border-brand-royal">
            <div className="w-20 h-20 bg-brand-royal/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-10 h-10 text-brand-royal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-brand-navy mb-2">Incoming Interpretation Request!</h2>
            <p className="text-gray-500 mb-6">{incomingCall.client} • {incomingCall.language}</p>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left text-sm">
              <p className="text-gray-600"><strong>Duration:</strong> ~{incomingCall.duration} mins</p>
              <p className="text-gray-600"><strong>Type:</strong> {incomingCall.type}</p>
              {incomingCall.briefing && <p className="text-gray-600 mt-2"><strong>Briefing:</strong> {incomingCall.briefing}</p>}
            </div>

            <div className="text-3xl font-black text-brand-royal mb-6 font-mono">
              {callTimer}s
            </div>

            <div className="flex space-x-4">
              <button onClick={handleDeclineCall} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl transition">
                Decline
              </button>
              <button onClick={handleAcceptCall} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition shadow-lg flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span>Accept Call</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Smart Briefing Viewer Modal */}
      {showBriefingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
            <button onClick={() => setShowBriefingModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-xl font-bold text-brand-navy mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-brand-royal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              Client Briefing
            </h3>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">{selectedBriefing}</p>
            </div>
            <p className="text-xs text-gray-500 mt-4">Please review this context before joining the session to ensure accurate and efficient interpretation.</p>
          </div>
        </div>
      )}
      
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* NEW: Prominent Header with Persistent Availability Toggle */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-brand-navy">Interpreter Portal</h1>
              <p className="text-sm text-gray-500 mt-1">Interpreter ID: <span className="font-mono font-bold text-brand-royal">{profile.interpreterId}</span></p>
            </div>
            
            {/* PROMINENT AVAILABILITY TOGGLE */}
            <div className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center shadow-sm transition-all duration-300 border-2 ${
              availability === 'Online' ? 'bg-green-50 border-green-200 text-green-700' : 
              availability === 'Busy' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-gray-50 border-gray-200 text-gray-600'
            }`}>
              <span className={`w-3 h-3 rounded-full mr-3 ${
                availability === 'Online' ? 'bg-green-500 animate-pulse' : 
                availability === 'Busy' ? 'bg-yellow-500' : 'bg-gray-400'
              }`}></span>
              <div className="flex flex-col items-start">
                <span className="text-[10px] uppercase tracking-wider opacity-70">Current Status</span>
                <span className="text-base leading-none mt-0.5">
                  {availability === 'Online' ? 'Available for Calls' : availability === 'Busy' ? 'Busy' : 'Offline'}
                </span>
              </div>
              <div className="ml-4 pl-4 border-l border-current/20">
                 <select 
                   value={availability}
                   onChange={(e) => setAvailability(e.target.value)}
                   className="bg-transparent font-bold text-sm focus:outline-none cursor-pointer appearance-none text-right pr-5"
                   style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                 >
                   <option value="Online">Go Online</option>
                   <option value="Busy">Set to Busy</option>
                   <option value="Offline">Go Offline</option>
                 </select>
              </div>
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
                
                {/* PROFILE & CERTIFICATIONS TAB */}
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy mb-6">Professional Profile</h2>
                    <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-gray-100">
                      <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                        {profile.photo ? (
                          <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl font-bold text-gray-400">{profile.name ? profile.name.charAt(0) : 'I'}</span>
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
                        <input type="email" value={profile.email} disabled className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-500" />
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

                    {/* Certifications & Badges */}
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Certifications & Badges</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {profile.certifications.map((cert, idx) => (
                          <span key={idx} className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-sm font-bold flex items-center border border-purple-200">
                            <svg className="w-4 h-4 mr-1.5 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            {cert}
                            <button onClick={() => setProfile({...profile, certifications: profile.certifications.filter((_, i) => i !== idx)})} className="ml-2 text-purple-600 hover:text-red-500 font-bold">×</button>
                          </span>
                        ))}
                      </div>
                      <input type="text" placeholder="Add certification (e.g., 'CMI') and press Enter..." 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.target.value) {
                            setProfile({...profile, certifications: [...profile.certifications, e.target.value]});
                            e.target.value = '';
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal" 
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Languages Spoken</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {profile.languages.map((lang, idx) => (
                          <span key={idx} className="bg-brand-cyan/10 text-brand-navy px-3 py-1.5 rounded-full text-sm font-bold flex items-center">
                            {lang}
                            <button onClick={() => setProfile({...profile, languages: profile.languages.filter((_, i) => i !== idx)})} className="ml-2 text-brand-cyan hover:text-red-500 font-bold">×</button>
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

                    <button onClick={handleSaveProfile} className="bg-brand-royal hover:bg-brand-navy text-white px-8 py-3 rounded-lg font-bold transition shadow-md">Save Profile Changes</button>
                  </div>
                )}

                {/* AVAILABILITY TAB */}
                {activeTab === 'availability' && (
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy mb-6">Availability Status</h2>
                    <p className="text-gray-500 mb-8">Set your current status. You will only receive instant call requests when you are <strong className="text-green-600">Online</strong>.</p>
                    
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

                    {/* Simulate Incoming Call Button for Testing */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-10">
                      <h3 className="font-bold text-brand-navy mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-brand-royal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Developer Testing Zone
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">In production, calls will route to you automatically via Supabase Realtime when you are "Online". Use this button to test the incoming call UI.</p>
                      <button 
                        onClick={() => {
                          setIncomingCall({
                            client: 'City General Hospital',
                            language: 'Spanish',
                            type: 'Video Call',
                            duration: 30,
                            briefing: 'Patient: John Doe. Topic: Discussing recent cardiology test results. Please be prepared for medical terminology.'
                          });
                          setCallTimer(15);
                        }}
                        className="w-full md:w-auto bg-brand-cyan text-white hover:bg-brand-royal font-bold py-3 px-6 rounded-xl transition flex items-center justify-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>Simulate Incoming Call</span>
                      </button>
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
                    
                    {/* Visual Earnings Analytics Chart */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
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

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-gradient-to-br from-brand-navy to-brand-royal rounded-2xl p-6 text-white">
                        <p className="text-blue-200 text-xs uppercase font-bold">Total Earnings (This Month)</p>
                        <h3 className="text-3xl font-black mt-2">${earningsData.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}</h3>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <p className="text-gray-500 text-xs uppercase font-bold">Completed Calls</p>
                        <h3 className="text-3xl font-black mt-2 text-brand-navy">{callHistory.length}</h3>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <p className="text-gray-500 text-xs uppercase font-bold">Average Rating</p>
                        <h3 className="text-3xl font-black mt-2 text-brand-navy">
                          {callHistory.length > 0 ? (callHistory.reduce((sum, c) => sum + c.rating, 0) / callHistory.length).toFixed(1) : '0.0'} ⭐
                        </h3>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-4">Upcoming Bookings</h3>
                    <div className="space-y-3 mb-8">
                      {upcomingBookings.length > 0 ? upcomingBookings.map((b) => (
                        <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl gap-4">
                          <div>
                            <p className="font-bold text-brand-navy">{b.client} • {b.type}</p>
                            <p className="text-xs text-gray-600">{b.date} at {b.time} ({b.duration})</p>
                          </div>
                          <div className="flex space-x-2">
                            {b.briefing && (
                              <button 
                                onClick={() => handleViewBriefing(b.briefing)}
                                className="bg-white text-brand-royal border border-brand-royal/20 hover:bg-brand-royal hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition flex items-center space-x-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                <span>Briefing</span>
                              </button>
                            )}
                            <button className="bg-brand-royal text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-navy transition">Join</button>
                          </div>
                        </div>
                      )) : (
                        <p className="text-center text-gray-500 py-4 bg-gray-50 rounded-xl">No upcoming bookings.</p>
                      )}
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
                          {callHistory.length > 0 ? callHistory.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50">
                              <td className="p-4 text-gray-800">{c.date}</td>
                              <td className="p-4 text-gray-800">{c.client}</td>
                              <td className="p-4 text-gray-800">{c.duration}</td>
                              <td className="p-4 text-yellow-500">{'⭐'.repeat(c.rating)}</td>
                              <td className="p-4 font-bold text-green-600">{c.earnings}</td>
                            </tr>
                          )) : (
                            <tr><td colSpan="5" className="p-8 text-center text-gray-500">No completed calls yet.</td></tr>
                          )}
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