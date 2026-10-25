import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TranscriptViewer from '../components/TranscriptViewer';

function VideoInterpretation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const initialDuration = location.state?.duration_minutes || 30;
  const language = location.state?.language || 'Mandarin Chinese';
  const interpreterName = location.state?.interpreter_name || 'Li Wei';

  const [timeLeft, setTimeLeft] = useState(initialDuration * 60);
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // NEW: State to toggle transcript visibility
  const [showTranscript, setShowTranscript] = useState(true);

  const [liveTranscript, setLiveTranscript] = useState([
    { time: '00:00', speaker: 'System', text: 'Session started. Connecting to interpreter...' }
  ]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 || isSessionEnded) {
      if (timeLeft <= 0 && !isSessionEnded) {
        setIsSessionEnded(true);
      }
      return;
    }

    const countdown = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timeLeft, isSessionEnded]);

  useEffect(() => {
    if (isSessionEnded || loading) return;

    const mockLiveUpdates = [
      { time: '00:05', speaker: 'Interpreter (Li Wei)', text: 'Hello, I am connected and ready to begin. Can you hear me clearly?' },
      { time: '00:12', speaker: 'Client', text: 'Yes, I can hear you perfectly. Let us begin the discussion.' },
      { time: '00:20', speaker: 'Interpreter (Li Wei)', text: 'Understood. I will provide simultaneous interpretation. Please proceed at a normal pace.' },
      { time: '00:35', speaker: 'Client', text: 'We need to discuss the new supply chain logistics for the Shanghai office and the Q3 financial results.' }
    ];

    let updateIndex = 0;
    const interval = setInterval(() => {
      if (updateIndex < mockLiveUpdates.length) {
        setLiveTranscript(prev => [...prev, mockLiveUpdates[updateIndex]]);
        updateIndex++;
      } else {
        clearInterval(interval);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isSessionEnded, loading]);

  const handleEndCall = () => {
    setIsSessionEnded(true);
  };

  const handleExtendSession = () => {
    alert("Redirecting to wallet to purchase additional minutes...");
    navigate('/wallet');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-brand-royal border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold">Connecting to secure room...</h2>
        <p className="text-gray-400 mt-2">Please allow camera and microphone access.</p>
      </div>
    );
  }

  if (isSessionEnded) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-brand-navy mb-2">Session Ended</h2>
            <p className="text-gray-500 mb-6">
              Your {Math.floor(initialDuration)}-minute interpretation session with {interpreterName} has concluded.
            </p>
            <div className="space-y-3">
              <button onClick={handleExtendSession} className="w-full bg-brand-royal hover:bg-brand-navy text-white font-bold py-3 rounded-xl transition shadow-lg">
                Purchase More Time
              </button>
              <button onClick={() => navigate('/client-dashboard', { state: { activeTab: 'calls' } })} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition">
                Return to Dashboard
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-brand-royal rounded-lg flex items-center justify-center font-black text-white">A</div>
          <span className="font-bold text-sm md:text-base">Secure Video Room</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-mono text-red-400">LIVE</span>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col lg:flex-row gap-4 p-4 relative max-w-[1600px] mx-auto w-full">
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="w-full aspect-video bg-gray-800 rounded-2xl overflow-hidden relative shadow-2xl border border-gray-700 mb-4">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="text-center">
                <div className="w-24 h-24 bg-brand-royal/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-brand-royal/50">
                  <span className="text-4xl font-bold text-brand-royal">{interpreterName.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-bold text-white">{interpreterName}</h3>
                <p className="text-gray-400 text-sm">{language} Interpreter</p>
              </div>
            </div>
            
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full font-mono font-bold text-lg border border-white/10 flex items-center space-x-2">
              <svg className="w-5 h-5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-white'}>
                {formatTime(timeLeft)}
              </span>
            </div>

            {timeLeft < 60 && timeLeft > 0 && (
              <div className="absolute top-4 left-4 bg-red-500/90 text-white px-4 py-2 rounded-full font-bold text-sm animate-pulse shadow-lg">
                Less than 1 minute remaining!
              </div>
            )}
          </div>

          <div className="absolute bottom-28 lg:bottom-32 right-4 md:right-10 w-32 md:w-48 aspect-video bg-gray-700 rounded-xl overflow-hidden border-2 border-gray-600 shadow-lg z-10">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            {isVideoOff && (
              <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 md:space-x-6 bg-gray-800/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-gray-700 z-10">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
            >
              {isMuted ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              )}
            </button>

            <button 
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition ${isVideoOff ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
            >
              {isVideoOff ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              )}
            </button>

            {/* NEW: Toggle Transcript Button */}
            <button 
              onClick={() => setShowTranscript(!showTranscript)}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition ${showTranscript ? 'bg-brand-royal text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
              title="Toggle AI Transcript"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>

            <button 
              onClick={handleEndCall}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition shadow-lg transform hover:scale-105"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
            </button>
          </div>
        </div>

        {/* RIGHT: AI Transcript Viewer (Conditionally Rendered) */}
        {showTranscript && (
          <div className="w-full lg:w-[400px] flex-shrink-0 h-[500px] lg:h-auto lg:max-h-[600px] animate-fadeIn">
            <TranscriptViewer 
              transcriptData={liveTranscript} 
              isLive={true} 
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default VideoInterpretation;