import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PaymentModal from '../components/PaymentModal';

function CallInterpreter() {
  const navigate = useNavigate();
  
  // Flow States: 'selection' | 'connecting' | 'in_call' | 'call_ended'
  const [step, setStep] = useState('selection');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [callId, setCallId] = useState(null);
  
  // Call Details State
  const [selectedLanguage, setSelectedLanguage] = useState('Mandarin Chinese');
  const [duration, setDuration] = useState(1); // Changed to 1 minute minimum
  const [customDuration, setCustomDuration] = useState(''); // For "Other" duration
  
  // Live Call State
  const [callSeconds, setCallSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [interpreterStatus, setInterpreterStatus] = useState('checking'); // 'checking', 'available', 'unavailable'
  const [hasAnnounced, setHasAnnounced] = useState(false); // For 1-minute voice warning

  // Hidden Per-Minute Pricing Logic
  const rateMap = {
    'Mandarin Chinese': 0.50,
    'Igbo': 0.40,
    'English': 0.50,
    'Pidgin English': 0.40
  };

  const currentRate = rateMap[selectedLanguage] || 0.50;
  const totalCost = duration * currentRate;

  // Fetch User & Check Interpreter Availability on Mount / Language Change
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    const checkAvailability = async () => {
      setInterpreterStatus('checking');
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .in('role', ['interpreter', 'admin'])
        .eq('status', 'Active');
      
      if (!error && count > 0) {
        setInterpreterStatus('available');
      } else {
        setInterpreterStatus('unavailable');
      }
    };
    checkAvailability();
  }, [selectedLanguage]);

  // Reset announcement flag when a new call starts
  useEffect(() => {
    if (step === 'in_call') {
      setHasAnnounced(false);
    }
  }, [step]);

  // Live Call Timer Logic & Voice Announcement
  useEffect(() => {
    let interval;
    if (step === 'in_call') {
      interval = setInterval(() => {
        setCallSeconds(prev => {
          const timeRemainingBeforeTick = duration * 60 - prev;
          
          // Trigger voice announcement when 1 minute (60 seconds) or less is remaining
          if (timeRemainingBeforeTick <= 60 && !hasAnnounced) {
            setHasAnnounced(true);
            const utterance = new SpeechSynthesisUtterance("You have 1 minute remaining just before the call ends.");
            utterance.rate = 1;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
          }

          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, duration, hasAnnounced]);

  // Auto-end call when paid time elapses
  useEffect(() => {
    if (step === 'in_call' && callSeconds >= duration * 60) {
      handleEndCall();
    }
  }, [callSeconds, duration, step]);

  const handleCustomDurationChange = (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) {
      setCustomDuration('');
      setDuration(1);
    } else {
      if (val < 1) val = 1; // Enforce strict 1-minute minimum
      setCustomDuration(val);
      setDuration(val);
    }
  };

  const handleProceedToPayment = () => {
    if (!user) {
      navigate('/login', { state: { from: '/call-interpreter' } });
      return;
    }
    if (interpreterStatus !== 'available') {
      alert("No interpreters are currently available. Please try again later or schedule a booking.");
      return;
    }
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = async (reference) => {
    setIsPaymentOpen(false);
    setStep('connecting');
    
    if (user) {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('wallet_balance')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        const currentBalance = profileData.wallet_balance || 0;
        const newBalance = Math.max(0, currentBalance - totalCost);

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ wallet_balance: newBalance })
          .eq('id', user.id);

        if (updateError) throw updateError;

        const { error: txError } = await supabase.from('transactions').insert([{
          user_id: user.id,
          type: 'debit',
          amount: totalCost,
          description: `Instant ${selectedLanguage} Interpretation (${duration} mins)`,
          reference: reference?.reference || `INSTANT-${Date.now()}`,
          created_at: new Date().toISOString()
        }]);

        if (txError) throw txError;

        const { data: callData, error: callError } = await supabase.from('calls').insert([{
          user_id: user.id,
          interpreter_name: 'Instant Match Interpreter',
          language: selectedLanguage,
          category: 'Individual',
          duration_minutes: duration,
          cost: totalCost,
          status: 'In Progress',
          created_at: new Date().toISOString()
        }]).select().single();

        if (callError) throw callError;
        setCallId(callData.id);
        
        setTimeout(() => {
          setStep('in_call');
        }, 2500);

      } catch (err) {
        console.error("Error processing payment and updating wallet:", err);
        alert("Payment was successful, but there was an error updating your wallet. Please contact support with your transaction reference.");
        setStep('selection');
      }
    }
  };

  const handleEndCall = async () => {
    if (step === 'call_ended') return; // Prevent multiple executions
    setStep('call_ended');
    if (callId) {
      await supabase.from('calls').update({ status: 'Completed' }).eq('id', callId);
    }
    setTimeout(() => {
      navigate('/client-dashboard', { 
        state: { message: `Successfully completed ${selectedLanguage} interpretation call.`, activeTab: 'calls' } 
      });
    }, 3000);
  };

  // --- LIVE CALL STATE ---
  if (step === 'in_call') {
    const mins = Math.floor(callSeconds / 60).toString().padStart(2, '0');
    const secs = (callSeconds % 60).toString().padStart(2, '0');
    const remainingMins = Math.max(0, Math.floor((duration * 60 - callSeconds) / 60));
    const remainingSecs = Math.max(0, (duration * 60 - callSeconds) % 60);

    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/50 to-brand-royal/30 pointer-events-none"></div>
        
        <div className="relative z-10 text-center w-full max-w-md">
          <div className="w-32 h-32 bg-brand-royal/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-brand-royal/50 animate-pulse">
            <svg className="w-16 h-16 text-brand-royal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </div>
          
          <h2 className="text-3xl font-bold mb-2">Connected</h2>
          <p className="text-gray-300 text-lg mb-8">{selectedLanguage} Interpreter</p>
          
          <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 mb-8 border border-gray-700">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">Live Call Duration</p>
            <div className="text-5xl font-mono font-bold text-brand-cyan tracking-widest mb-2">
              {mins}:{secs}
            </div>
            <p className={`text-sm font-bold ${remainingMins === 0 && remainingSecs <= 60 ? 'text-red-400 animate-pulse' : 'text-gray-400'}`}>
              Remaining: {remainingMins}m {remainingSecs.toString().padStart(2, '0')}s
            </p>
          </div>

          <div className="flex items-center justify-center space-x-8 mb-8">
            <button onClick={() => setIsMuted(!isMuted)} className={`w-16 h-16 rounded-full flex items-center justify-center transition shadow-lg ${isMuted ? 'bg-white text-gray-900' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
              {isMuted ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              )}
            </button>
            
            <button onClick={handleEndCall} className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition transform hover:scale-105 shadow-xl">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" /></svg>
            </button>
            
            <button onClick={() => setIsSpeakerOn(!isSpeakerOn)} className={`w-16 h-16 rounded-full flex items-center justify-center transition shadow-lg ${isSpeakerOn ? 'bg-white text-gray-900' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
              {isSpeakerOn ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
              )}
            </button>
          </div>
          
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-center justify-center space-x-2">
            <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-xs text-yellow-200">Note: Actual VoIP audio stream integration is pending the client's chosen 3rd-party provider.</p>
          </div>
        </div>
      </div>
    );
  }

  // --- CALL ENDED STATE ---
  if (step === 'call_ended') {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-white">
        <div className="bg-white text-gray-900 rounded-3xl shadow-2xl p-10 max-w-md w-full text-center animate-fadeIn">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-brand-navy mb-2">Call Ended</h2>
          <p className="text-gray-500 mb-6">Your interpretation session has been successfully completed and billed.</p>
          <div className="bg-gray-50 p-4 rounded-xl mb-6">
            <p className="text-sm text-gray-500">Total Duration</p>
            <p className="text-2xl font-bold text-brand-navy">{Math.floor(callSeconds / 60)}m {callSeconds % 60}s</p>
          </div>
          <p className="text-sm text-gray-400 animate-pulse">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  // --- CONNECTING STATE ---
  if (step === 'connecting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan flex flex-col pt-36">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-2xl w-full text-center animate-fadeIn">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-brand-royal/10 rounded-full mb-6 relative animate-pulse">
              <svg className="w-12 h-12 text-brand-royal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </div>
            
            <h1 className="text-4xl font-black text-brand-navy dark:text-white mb-2 tracking-wide">PHONING AN INTERPRETER</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">Please hold while we connect you to a certified {selectedLanguage} interpreter.</p>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-8 max-w-sm mx-auto">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600 dark:text-gray-400">Language:</span>
                <span className="font-bold text-brand-navy dark:text-white">{selectedLanguage}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                <span className="font-bold text-brand-navy dark:text-white">{duration} minutes</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                <span className="text-gray-600 dark:text-gray-400">Total Paid:</span>
                <span className="font-bold text-2xl text-brand-royal">${totalCost.toFixed(2)}</span>
              </div>
            </div>

            <div className="animate-pulse">
              <p className="text-brand-royal font-bold text-lg">Establishing secure connection...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- SELECTION & PAYMENT SCREEN ---
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col pt-36 transition-colors duration-300">
      <Navbar />
      
      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        amount={totalCost.toFixed(2)} 
        purpose={`Instant ${selectedLanguage} Interpretation (${duration} mins)`} 
        onSuccess={handlePaymentSuccess}
        userEmail={user?.email}
      />

      <main className="flex-grow">
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Instant Phone Interpretation</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              No forms. No waiting. Just select your duration, pay securely, and connect in under 60 seconds.
            </p>
          </div>
        </section>

        <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {step === 'selection' && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-brand-navy dark:text-white mb-8">Configure Your Instant Call</h2>
                
                <div className="space-y-8">
                  {/* Language Selection */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-bold mb-3">1. Select Language</label>
                    <select 
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-royal text-lg font-medium"
                    >
                      <option value="Mandarin Chinese">🇨🇳 Mandarin Chinese</option>
                      <option value="Igbo">🇳🇬 Igbo</option>
                      <option value="English">🇬🇧 English</option>
                      <option value="Pidgin English">🇳🇬 Pidgin English</option>
                    </select>
                  </div>

                  {/* Availability Status */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center space-x-3">
                    {interpreterStatus === 'checking' && (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-gray-500">Checking interpreter availability...</p>
                      </>
                    )}
                    {interpreterStatus === 'available' && (
                      <>
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                        <p className="text-sm text-green-600 font-bold">Interpreters are currently online and ready.</p>
                      </>
                    )}
                    {interpreterStatus === 'unavailable' && (
                      <>
                        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                        <p className="text-sm text-red-500 font-bold">No interpreters are currently available. Please try again later or schedule a booking.</p>
                      </>
                    )}
                  </div>

                  {/* Duration Selection (UPDATED: 1 minute minimum) */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-bold mb-3">2. Select Duration (Minimum 1 min)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      {[1, 5, 10, 30].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => { setDuration(mins); setCustomDuration(''); }}
                          className={`py-4 rounded-xl font-bold transition border-2 flex flex-col items-center ${
                            duration === mins && customDuration === ''
                              ? 'bg-brand-navy text-white border-brand-navy dark:bg-brand-royal dark:border-brand-royal' 
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-brand-royal'
                          }`}
                        >
                          <span className="text-2xl">{mins}</span>
                          <span className="text-sm opacity-80">Minutes</span>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setCustomDuration('1')}
                        className={`py-4 rounded-xl font-bold transition border-2 flex flex-col items-center justify-center ${
                          customDuration !== ''
                            ? 'bg-brand-navy text-white border-brand-navy dark:bg-brand-royal dark:border-brand-royal' 
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-brand-royal'
                        }`}
                      >
                        <span className="text-2xl">Other</span>
                      </button>
                    </div>
                    
                    {/* Custom Duration Input */}
                    {customDuration !== '' && (
                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center space-x-3 animate-fadeIn">
                        <svg className="w-6 h-6 text-brand-royal flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <div className="flex-grow">
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Enter Custom Duration (mins)</label>
                          <input 
                            type="number" 
                            min="1" 
                            value={customDuration} 
                            onChange={handleCustomDurationChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal font-bold text-lg"
                            placeholder="e.g., 45"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Billed per minute. Minimum 1 minute.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quote Summary */}
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                    <h3 className="font-bold text-brand-navy dark:text-white text-sm uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Your Quote</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Language:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{selectedLanguage}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Duration:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{duration} minutes</span>
                      </div>
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Rate:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">${currentRate.toFixed(2)} / min</span>
                      </div>
                      <div className="flex justify-between text-brand-navy dark:text-white font-bold text-2xl pt-3 border-t border-gray-200 dark:border-gray-700 mt-3">
                        <span>Total Due Now:</span>
                        <span>${totalCost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={handleProceedToPayment}
                    disabled={interpreterStatus !== 'available'}
                    className={`w-full font-bold py-4 rounded-xl transition shadow-lg text-lg flex items-center justify-center space-x-2 ${
                      interpreterStatus === 'available'
                        ? 'bg-brand-royal hover:bg-brand-navy dark:bg-brand-cyan dark:hover:bg-brand-royal dark:text-brand-navy text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <span>{interpreterStatus === 'available' ? 'Pay & Connect Instantly' : 'Interpreters Unavailable'}</span>
                  </button>
                  
                  <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                    By clicking above, you agree to our Terms of Service. Unused minutes are non-refundable.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default CallInterpreter;