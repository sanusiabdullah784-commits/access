import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function ClientPortal() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: '',
    walletBalance: 0,
  });
  const [recentCalls, setRecentCalls] = useState([]);
  const [upcomingBooking, setUpcomingBooking] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [usageData, setUsageData] = useState([]);

  // Fetch all dashboard data from Supabase
  useEffect(() => {
    const fetchPortalData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }
      setUser(user);

      // 1. Get profile & wallet balance
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, wallet_balance')
        .eq('id', user.id)
        .single();
      
      if (profileData) {
        setProfile({
          name: profileData.full_name || user.email?.split('@')[0] || 'Client',
          walletBalance: profileData.wallet_balance || 0,
        });
      }

      // 2. Get recent interpretation calls (last 5)
      const { data: callsData } = await supabase
        .from('calls')
        .select('id, interpreter_name, language, duration_minutes, status, created_at, category')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentCalls(callsData || []);

      // 3. Get next upcoming booking
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .eq('client_id', user.id)
        .in('status', ['scheduled', 'pending'])
        .order('created_at', { ascending: true })
        .limit(1);
      
      if (bookingsData && bookingsData.length > 0) {
        setUpcomingBooking(bookingsData[0]);
      }

      // 4. Generate last 7 days usage analytics from calls
      const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          minutes: 0,
        };
      });

      if (callsData) {
        callsData.forEach(call => {
          const callDate = new Date(call.created_at);
          const daysAgo = Math.floor((new Date() - callDate) / (1000 * 60 * 60 * 24));
          if (daysAgo >= 0 && daysAgo < 7) {
            last7Days[6 - daysAgo].minutes += call.duration_minutes || 0;
          }
        });
      }
      setUsageData(last7Days);

      setLoading(false);
    };

    fetchPortalData();
  }, []);

  // Live countdown timer for upcoming booking
  useEffect(() => {
    if (!upcomingBooking) return;

    const updateCountdown = () => {
      const now = new Date();
      const bookingTime = new Date(upcomingBooking.booking_time || upcomingBooking.created_at);
      const diff = bookingTime - now;

      if (diff <= 0) {
        setCountdown('Starting Now!');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 24) {
        setCountdown(`${Math.floor(hours / 24)}d ${hours % 24}h`);
      } else if (hours > 0) {
        setCountdown(`${hours}h ${minutes}m`);
      } else {
        setCountdown(`${minutes}m ${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [upcomingBooking]);

  // Calculate total minutes interpreted
  const totalMinutes = usageData.reduce((sum, day) => sum + day.minutes, 0);
  const maxMinutes = Math.max(...usageData.map(d => d.minutes), 1);

  // Loading State
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
      
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Up Next Live Countdown Banner (Only shows if there's an upcoming booking) */}
          {upcomingBooking && (
            <div className="mb-8 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden animate-pulse-slow">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-20 -translate-y-20"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-90">⏱️ Up Next</p>
                    <h3 className="text-lg md:text-xl font-bold">
                      {upcomingBooking.language} {upcomingBooking.booking_type || 'Interpretation'}
                    </h3>
                    <p className="text-sm opacity-90">
                      {new Date(upcomingBooking.booking_time || upcomingBooking.created_at).toLocaleString('en-US', { 
                        weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 w-full md:w-auto">
                  <div className="text-right">
                    <p className="text-xs opacity-90 uppercase tracking-wider">Starts in</p>
                    <p className="text-2xl font-black font-mono">{countdown}</p>
                  </div>
                  <Link 
                    to="/book" 
                    className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition shadow-md whitespace-nowrap"
                  >
                    Join Waiting Room
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Welcome Header + Instant Connect Widget */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-brand-navy">
                Welcome back, {profile.name}! 👋
              </h1>
              <p className="text-gray-500 mt-2">Here is what's happening with your interpretations today.</p>
            </div>
            
            {/* INSTANT CONNECT COMMAND WIDGET */}
            <div className="bg-gradient-to-r from-brand-navy to-brand-royal rounded-2xl p-5 text-white shadow-xl flex items-center space-x-4 w-full md:w-auto">
              <div className="relative flex-shrink-0">
                <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></span>
                <span className="relative block w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
              </div>
              <div className="flex-grow">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-200">7 Interpreters Online</p>
                <p className="text-sm font-semibold">Connect in under 30s</p>
              </div>
              <Link 
                to="/call-interpreter"
                className="bg-brand-cyan hover:bg-white hover:text-brand-navy text-white px-5 py-2.5 rounded-xl font-bold transition shadow-md whitespace-nowrap"
              >
                Call Now
              </Link>
            </div>
          </div>

          {/* Stats Grid (Rebranded for Interpretation) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-brand-cyan">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Wallet Balance</p>
              <h2 className="text-3xl font-black text-brand-navy mt-2">${profile.walletBalance.toFixed(2)}</h2>
              <Link to="/wallet" className="text-brand-royal text-sm mt-1 font-semibold hover:underline flex items-center">
                Top up now →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-brand-royal">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Active Bookings</p>
              <h2 className="text-3xl font-black text-brand-navy mt-2">
                {upcomingBooking ? '1' : '0'}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {upcomingBooking ? '1 upcoming session' : 'No scheduled sessions'}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-brand-navy">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Minutes Interpreted</p>
              <h2 className="text-3xl font-black text-brand-navy mt-2">{totalMinutes.toLocaleString()}</h2>
              <p className="text-gray-500 text-sm mt-1">Last 7 days</p>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Recent Activity + Usage Analytics */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Visual Usage Analytics - Mini Bar Charts */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-brand-navy">Interpretation Usage</h3>
                    <p className="text-sm text-gray-500">Minutes used over the last 7 days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-brand-navy">{totalMinutes}</p>
                    <p className="text-xs text-gray-500">Total mins</p>
                  </div>
                </div>
                <div className="flex items-end justify-between space-x-2 h-40 pt-4">
                  {usageData.map((day, index) => {
                    const height = (day.minutes / maxMinutes) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center group">
                        <div className="relative w-full flex items-end justify-center h-full">
                          <div 
                            className="w-full max-w-[40px] bg-gradient-to-t from-brand-royal to-brand-cyan rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer relative"
                            style={{ height: `${Math.max(height, 4)}%` }}
                          >
                            {day.minutes > 0 && (
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-brand-navy text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                {day.minutes}m
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 font-medium mt-2">{day.day}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity (Real Data from Supabase) */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-brand-navy">Recent Interpretations</h3>
                  <Link to="/client-dashboard" className="text-brand-royal text-sm font-semibold hover:underline">
                    View All →
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentCalls.length > 0 ? (
                    recentCalls.map((call) => {
                      const statusColors = {
                        'Completed': 'bg-green-100 text-green-700',
                        'In Progress': 'bg-blue-100 text-blue-700',
                        'Scheduled': 'bg-gray-100 text-gray-700',
                        'Cancelled': 'bg-red-100 text-red-700',
                      };
                      const statusColor = statusColors[call.status] || 'bg-gray-100 text-gray-700';
                      
                      return (
                        <div key={call.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                              <svg className="w-5 h-5 text-brand-royal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {call.language} Interpretation • {call.category || 'General'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {call.interpreter_name || 'Interpreter'} • {call.duration_minutes || 0} mins • {new Date(call.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                            {call.status}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-gray-500 font-medium">No recent interpretations</p>
                      <p className="text-sm text-gray-400 mt-1">Your call history will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions & Upgrade Card */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-bold text-brand-navy mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link 
                    to="/wallet"
                    className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-brand-cyan hover:text-white rounded-xl transition font-medium text-gray-700 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Top Up Wallet
                  </Link>
                  <Link 
                    to="/video"
                    className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-brand-royal hover:text-white rounded-xl transition font-medium text-gray-700 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    Start Video Interpretation
                  </Link>
                  <Link 
                    to="/book"
                    className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-brand-navy hover:text-white rounded-xl transition font-medium text-gray-700 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Book an Interpreter
                  </Link>
                  <Link 
                    to="/client-dashboard"
                    className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-200 rounded-xl transition font-medium text-gray-700 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Account Settings
                  </Link>
                </div>
              </div>

              <div className="bg-gradient-to-br from-brand-royal to-brand-navy rounded-2xl shadow-md p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Need Priority Support?</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Get 24/7 priority interpretation routing and dedicated account management.
                </p>
                <Link 
                  to="/contact"
                  className="w-full bg-white text-brand-navy font-bold py-2 rounded-lg hover:bg-brand-cyan hover:text-white transition text-center block"
                >
                  Contact Sales
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ClientPortal;