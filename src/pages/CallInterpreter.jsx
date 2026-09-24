import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function CallInterpreter() {
  const [callStatus, setCallStatus] = useState('idle'); 
  const [duration, setDuration] = useState(0);
  const [selectedLang, setSelectedLang] = useState('Spanish');
  const [callHistory, setCallHistory] = useState([]);
  
  // NEW: Transcription States
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showLegalConsent, setShowLegalConsent] = useState(false);
  const [targetLang, setTargetLang] = useState('English');
  const [transcriptLines, setTranscriptLines] = useState([]);

  const standbyInterpreters = 142; 

  // Simulated AI Transcript Data
  const mockTranscript = [
    { speaker: "Interpreter", text: "Hello, I am your certified interpreter. How can I assist you today?" },
    { speaker: "Client", text: "Hi, I need to discuss a contract with my partner in Madrid." },
    { speaker: "Interpreter", text: "Hola, soy su intérprete certificado. ¿Cómo puedo ayudarle hoy?" },
    { speaker: "Partner", text: "Encantado de conocerle. Hemos revisado los términos del acuerdo." },
    { speaker: "Interpreter", text: "Nice to meet you. We have reviewed the terms of the agreement." }
  ];

  useEffect(() => {
    let interval;
    if (callStatus === 'active') {
      interval = setInterval(() => setDuration((prev) => prev + 1), 1000);
      
      // Simulate live text appearing if transcribing is on
      if (isTranscribing && transcriptLines.length < mockTranscript.length) {
        const textInterval = setInterval(() => {
          setTranscriptLines(prev => {
            if (prev.length < mockTranscript.length) {
              return [...prev, mockTranscript[prev.length]];
            }
            clearInterval(textInterval);
            return prev;
          });
        }, 2500); // New line every 2.5 seconds
        return () => clearInterval(textInterval);
      }
    }
    return () => clearInterval(interval);
  }, [callStatus, isTranscribing, transcriptLines.length]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const initiateCall = () => {
    setCallStatus('connecting');
    setTranscriptLines([]); // Reset transcript
    setTimeout(() => setCallStatus('active'), 2500);
  };

  const endCall = () => {
    setCallStatus('ended');
    const cost = (duration / 60) * 1.5;
    setCallHistory([{
      id: Date.now(), lang: selectedLang, duration: formatTime(duration), 
      cost: cost.toFixed(2), time: new Date().toLocaleTimeString(), hasTranscript: isTranscribing
    }, ...callHistory]);
  };

  const resetCall = () => {
    setCallStatus('idle');
    setDuration(0);
    setIsTranscribing(false);
    setTranscriptLines([]);
  };

  // Handle Toggle with Legal Consent
  const handleTranscriptionToggle = () => {
    if (!isTranscribing) {
      setShowLegalConsent(true); // Show legal modal before turning on
    } else {
      setIsTranscribing(false);
    }
  };

  const confirmLegalConsent = () => {
    setIsTranscribing(true);
    setShowLegalConsent(false);
  };

  // Download Transcript Function
  const downloadTranscript = () => {
    const textContent = transcriptLines.map(line => `[${line.speaker}]: ${line.text}`).join('\n\n');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AccessLingua_Transcript_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* LEGAL CONSENT MODAL */}
      {showLegalConsent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-brand-navy mb-2">Enable AI Transcription?</h3>
            <p className="text-sm text-gray-600 mb-6">
              By enabling this feature, you consent to the recording and AI processing of this call for transcription and translation purposes. All parties will be notified. This is a premium feature.
            </p>
            <div className="flex space-x-4">
              <button onClick={() => setShowLegalConsent(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl transition">Cancel</button>
              <button onClick={confirmLegalConsent} className="flex-1 bg-brand-royal hover:bg-brand-navy text-white font-bold py-3 rounded-xl transition">I Consent</button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-5xl w-full">
          
          {/* IDLE STATE */}
          {callStatus === 'idle' && (
            <div className="bg-white rounded-3xl shadow-xl p-10 text-center animate-fadeIn">
              <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                {standbyInterpreters} Interpreters on 24/7 Standby
              </div>
              <h1 className="text-4xl font-black text-brand-navy mb-4">Direct Call an Interpreter</h1>
              <p className="text-gray-500 mb-10 max-w-2xl mx-auto">Connect instantly to a certified professional.</p>

              <div className="max-w-md mx-auto mb-8">
                <label className="block text-left text-gray-700 font-bold mb-2">Select Language</label>
                <select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)} className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-royal text-lg font-medium bg-white">
                  <option>Spanish</option><option>French</option><option>Mandarin Chinese</option><option>Arabic</option>
                </select>
              </div>

              <button onClick={initiateCall} className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 px-12 rounded-full transition shadow-lg flex items-center justify-center mx-auto space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span>Call {selectedLang} Interpreter Now</span>
              </button>
            </div>
          )}

          {/* CONNECTING STATE */}
          {callStatus === 'connecting' && (
            <div className="bg-brand-navy rounded-3xl shadow-xl p-16 text-center text-white animate-fadeIn">
              <div className="w-24 h-24 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
              <h2 className="text-3xl font-bold mb-2">Connecting Call...</h2>
              <p className="text-blue-200 text-lg">Routing to the next available {selectedLang} interpreter.</p>
            </div>
          )}

          {/* ACTIVE CALL STATE with AI TRANSCRIPTION */}
          {callStatus === 'active' && (
            <div className="grid lg:grid-cols-3 gap-6 animate-fadeIn">
              
              {/* Left: Call Controls */}
              <div className="lg:col-span-1 bg-gray-900 rounded-3xl shadow-2xl p-8 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-brand-royal rounded-full blur-3xl opacity-20"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-brand-royal rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <h2 className="text-xl font-bold mb-1">Certified Interpreter</h2>
                  <p className="text-green-400 text-sm font-medium mb-6 flex items-center justify-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span> Secure Call Active
                  </p>

                  <div className="text-4xl font-mono font-black tracking-widest mb-8 text-white">{formatTime(duration)}</div>

                  <button onClick={endCall} className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition shadow-lg mx-auto transform hover:scale-105">
                    <svg className="w-8 h-8 text-white transform rotate-[135deg]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </button>
                </div>
              </div>

              {/* Right: AI Transcription Panel */}
              <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-6 flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-xl font-bold text-brand-navy flex items-center">
                      <svg className="w-5 h-5 text-brand-royal mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                      AI Live Transcription
                      {isTranscribing && <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full animate-pulse">REC</span>}
                    </h3>
                    <p className="text-sm text-gray-500">Real-time speech-to-text & translation</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                    {isTranscribing && (
                      <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-royal">
                        <option>English</option><option>Spanish</option><option>French</option><option>Mandarin</option>
                      </select>
                    )}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={isTranscribing} onChange={handleTranscriptionToggle} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-royal"></div>
                    </label>
                  </div>
                </div>

                {/* Transcript Feed */}
                <div className="flex-grow bg-gray-50 rounded-xl p-4 overflow-y-auto max-h-[300px] space-y-4 mb-4">
                  {isTranscribing ? (
                    transcriptLines.length > 0 ? (
                      transcriptLines.map((line, idx) => (
                        <div key={idx} className={`flex ${line.speaker === 'Interpreter' ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${line.speaker === 'Interpreter' ? 'bg-white border border-gray-200 text-gray-800' : 'bg-brand-royal text-white'}`}>
                            <p className="text-xs font-bold opacity-70 mb-1">{line.speaker}</p>
                            <p>{line.text}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="ml-2 text-sm">Listening to audio...</span>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                      <p className="text-sm font-medium">Transcription is disabled.</p>
                      <p className="text-xs">Toggle the switch to enable AI transcription.</p>
                    </div>
                  )}
                </div>

                {/* Download Button */}
                <button 
                  onClick={downloadTranscript}
                  disabled={!isTranscribing || transcriptLines.length === 0}
                  className="w-full bg-brand-navy hover:bg-brand-royal disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  <span>Download Authorized Transcript (.txt)</span>
                </button>
              </div>

            </div>
          )}

          {/* ENDED STATE */}
          {callStatus === 'ended' && (
            <div className="bg-white rounded-3xl shadow-xl p-10 text-center animate-fadeIn max-w-lg mx-auto">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-brand-navy mb-2">Call Ended</h2>
              <p className="text-gray-500 mb-8">Your wallet has been automatically charged.</p>
              <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-4 mb-8">
                <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="font-bold">{formatTime(duration)}</span></div>
                <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                  <span className="font-bold">Total Deducted</span>
                  <span className="text-2xl font-black text-red-500">-${((duration / 60) * 1.5).toFixed(2)}</span>
                </div>
              </div>
              <button onClick={resetCall} className="w-full bg-brand-royal hover:bg-brand-navy text-white font-bold py-3 rounded-full transition shadow-lg">Make Another Call</button>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CallInterpreter;