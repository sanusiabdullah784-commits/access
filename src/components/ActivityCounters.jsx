import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

// Custom hook for smooth number counting animation
const useCountUp = (end, duration = 2000, isVisible) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!isVisible || hasStarted) return;
    setHasStarted(true);
    let startTime = null;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOut * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, hasStarted]);

  return count;
};

function ActivityCounters() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const [playingLang, setPlayingLang] = useState(null);
  const [voices, setVoices] = useState([]);

  // State for live stats
  const [stats, setStats] = useState({
    clients: 1240,
    interpretations: 45800,
    countries: 85,
  });

  // Scroll-triggered visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Load voices properly
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      console.log('Available voices:', availableVoices.map(v => `${v.name} (${v.lang})`));
    };

    // Load voices immediately
    loadVoices();

    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Retry loading voices after a delay (for Safari)
    setTimeout(loadVoices, 1000);
  }, []);

  // Live Supabase Data
  useEffect(() => {
    const fetchStats = async () => {
      const { count: clientCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      const { count: callCount } = await supabase
        .from('calls')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Completed');

      setStats({
        clients: clientCount || 1240,
        interpretations: callCount || 45800,
        countries: 85,
      });
    };
    fetchStats();
  }, []);

  const clientCount = useCountUp(stats.clients, 2000, isVisible);
  const interpretationCount = useCountUp(stats.interpretations, 2500, isVisible);
  const countryCount = useCountUp(stats.countries, 2000, isVisible);

  // ROBUST Audio Playback with Fallback
  const handlePlayGreeting = (langName, text, langCode) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    if (playingLang === langName) {
      setPlayingLang(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find the best voice for this language
    const bestVoice = findBestVoice(langCode);
    if (bestVoice) {
      utterance.voice = bestVoice;
      console.log(`Using voice: ${bestVoice.name} for ${langName}`);
    } else {
      console.warn(`No voice found for ${langCode}, using default voice`);
    }
    
    utterance.lang = langCode;
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setPlayingLang(langName);
    };

    utterance.onend = () => {
      setPlayingLang(null);
    };

    utterance.onerror = (event) => {
      console.error(`Speech error for ${langName}:`, event);
      setPlayingLang(null);
      // Try with default voice as last resort
      if (event.error === 'no-speech') {
        alert(`Sorry, your browser doesn't support audio for ${langName}. Try Mandarin Chinese instead.`);
      }
    };

    // Speak the text
    window.speechSynthesis.speak(utterance);
  };

  // Helper function to find the best voice
  const findBestVoice = (langCode) => {
    if (voices.length === 0) return null;

    const baseLang = langCode.split('-')[0].toLowerCase();
    
    // 1. Try exact match first
    const exactMatch = voices.find(voice => 
      voice.lang.toLowerCase() === langCode.toLowerCase()
    );
    if (exactMatch) return exactMatch;

    // 2. Try base language match (e.g., 'en' for 'en-NG')
    const baseMatch = voices.find(voice => 
      voice.lang.toLowerCase().startsWith(baseLang)
    );
    if (baseMatch) return baseMatch;

    // 3. For Igbo, try any African voice or English as fallback
    if (baseLang === 'ig') {
      const africanVoice = voices.find(voice => 
        voice.lang.includes('NG') || voice.lang.includes('ZA') || voice.lang.includes('KE')
      );
      if (africanVoice) return africanVoice;
    }

    // 4. Return default voice as last resort
    return voices[0] || null;
  };

  const languageData = [
    { name: 'English', text: 'Hello, welcome to Access Lingua.', langCode: 'en-US' },
    { name: 'Igbo', text: 'Kedu ka ị mere? Nnọọ na Access Lingua.', langCode: 'ig-NG' },
    { name: 'Mandarin Chinese', text: 'Nǐ hǎo, huānyíng lái dào Access Lingua.', langCode: 'zh-CN' },
    { name: 'Pidgin English', text: 'How far? Welcome to Access Lingua.', langCode: 'en-NG' }
  ];

  const counters = [
    { 
      label: 'Happy Clients', 
      value: clientCount, 
      suffix: '+',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' 
    },
    { 
      label: 'Interpretations Completed', 
      value: interpretationCount, 
      suffix: '+',
      icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' 
    },
    { 
      label: 'Countries Reached', 
      value: countryCount, 
      suffix: '+',
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' 
    },
    { 
      label: 'Supported Languages', 
      icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129',
      languages: languageData
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-brand-navy text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-royal/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-cyan/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-12 transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Global Impact</h2>
          <p className="text-blue-200 max-w-2xl mx-auto">Connecting the world through seamless, professional language services.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {counters.map((counter, idx) => (
            <div 
              key={idx} 
              className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 hover:bg-white/20 transition-all duration-700 transform flex flex-col items-center justify-center ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <div className="w-16 h-16 bg-brand-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={counter.icon} />
                </svg>
              </div>
              
              {counter.languages ? (
                <div className="w-full">
                  <h3 className="text-xl font-bold text-white mb-4">4 Core Languages</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {counter.languages.map((lang, langIdx) => (
                      <button
                        key={langIdx}
                        onClick={() => handlePlayGreeting(lang.name, lang.text, lang.langCode)}
                        disabled={voices.length === 0}
                        className={`flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-bold border border-white/20 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          playingLang === lang.name ? 'bg-brand-cyan/30 border-brand-cyan' : ''
                        }`}
                        title={`Hear greeting in ${lang.name}`}
                      >
                        {voices.length === 0 ? (
                          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                        ) : playingLang === lang.name ? (
                          <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
                        ) : (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        )}
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                  {voices.length === 0 && (
                    <p className="text-xs text-blue-200 mt-2">Loading voices...</p>
                  )}
                </div>
              ) : (
                <>
                  <h3 className="text-4xl font-black text-white mb-2">
                    {counter.value.toLocaleString()}{counter.suffix}
                  </h3>
                  <p className="text-blue-200 font-medium">{counter.label}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ActivityCounters;