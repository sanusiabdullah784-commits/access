import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Languages() {
  const [search, setSearch] = useState('');
  const [activeRegion, setActiveRegion] = useState('All');
  const [playingLang, setPlayingLang] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interpreterCounts, setInterpreterCounts] = useState({});

  // Core languages (client's actual specialization)
  const coreLanguages = [
    { name: 'English', flag: '🇬🇧', region: 'Europe', greeting: 'Hello, welcome to Access Lingua.', langCode: 'en-US', isPrimary: false },
    { name: 'Igbo', flag: '🇳🇬', region: 'Africa', greeting: 'Kedu ka ị mere? Nnọọ na Access Lingua.', langCode: 'ig-NG', isPrimary: false },
    { name: 'Mandarin Chinese', flag: '🇨🇳', region: 'Asia', greeting: 'Nǐ hǎo, huānyíng lái dào Access Lingua.', langCode: 'zh-CN', isPrimary: true },
    { name: 'Pidgin English', flag: '🇳🇬', region: 'Africa', greeting: 'How far? Welcome to Access Lingua.', langCode: 'en-NG', isPrimary: false },
  ];

  // Extended languages (available on request)
  const extendedLanguages = [
    { name: 'Spanish', flag: '🇪🇸', region: 'Europe', greeting: 'Hola, bienvenido a Access Lingua.', langCode: 'es-ES' },
    { name: 'French', flag: '🇫🇷', region: 'Europe', greeting: 'Bonjour, bienvenue chez Access Lingua.', langCode: 'fr-FR' },
    { name: 'Arabic', flag: '🇸🇦', region: 'Middle East', greeting: 'Marhaban, ahlan wa sahlan.', langCode: 'ar-SA' },
    { name: 'Russian', flag: '🇷🇺', region: 'Europe', greeting: 'Zdravstvuyte, dobro pozhalovat.', langCode: 'ru-RU' },
    { name: 'Portuguese', flag: '🇧🇷', region: 'Americas', greeting: 'Olá, bem-vindo ao Access Lingua.', langCode: 'pt-BR' },
    { name: 'German', flag: '🇩🇪', region: 'Europe', greeting: 'Hallo, willkommen bei Access Lingua.', langCode: 'de-DE' },
    { name: 'Japanese', flag: '🇯🇵', region: 'Asia', greeting: 'Konnichiwa, Access Lingua e yōkoso.', langCode: 'ja-JP' },
    { name: 'Korean', flag: '🇰🇷', region: 'Asia', greeting: 'Annyeonghaseyo, Access Lingua-e oshin geoseul hwan-yeonghabnida.', langCode: 'ko-KR' },
    { name: 'Italian', flag: '🇮🇹', region: 'Europe', greeting: 'Ciao, benvenuto su Access Lingua.', langCode: 'it-IT' },
    { name: 'Hindi', flag: '🇮🇳', region: 'Asia', greeting: 'Namaste, Access Lingua mein aapka swagat hai.', langCode: 'hi-IN' },
    { name: 'Turkish', flag: '🇹🇷', region: 'Europe', greeting: 'Merhaba, Access Lingua\'ya hoş geldiniz.', langCode: 'tr-TR' },
    { name: 'Vietnamese', flag: '🇻🇳', region: 'Asia', greeting: 'Xin chào, chào mừng đến với Access Lingua.', langCode: 'vi-VN' },
    { name: 'Polish', flag: '🇵🇱', region: 'Europe', greeting: 'Cześć, witamy w Access Lingua.', langCode: 'pl-PL' },
    { name: 'Dutch', flag: '🇳🇱', region: 'Europe', greeting: 'Hallo, welkom bij Access Lingua.', langCode: 'nl-NL' },
    { name: 'Swahili', flag: '🇰🇪', region: 'Africa', greeting: 'Habari, karibu Access Lingua.', langCode: 'sw-KE' },
  ];

  const regions = ['All', 'Asia', 'Europe', 'Africa', 'Americas', 'Middle East'];

  // Fetch interpreter counts from Supabase
  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('profiles')
        .select('languages, availability_status')
        .eq('availability_status', 'Online');

      if (data) {
        const counts = {};
        data.forEach(profile => {
          if (profile.languages && Array.isArray(profile.languages)) {
            profile.languages.forEach(lang => {
              counts[lang] = (counts[lang] || 0) + 1;
            });
          }
        });
        setInterpreterCounts(counts);
      }
      setLoading(false);
    };

    fetchCounts();
  }, []);

  // Audio Preview Handler
  const handlePlayGreeting = (langName, text, langCode) => {
    window.speechSynthesis.cancel();
    if (playingLang === langName) {
      setPlayingLang(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => setPlayingLang(null);
    setPlayingLang(langName);
    window.speechSynthesis.speak(utterance);
  };

  // Filter extended languages
  const filteredExtended = extendedLanguages.filter(lang => {
    const matchesSearch = lang.name.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = activeRegion === 'All' || lang.region === activeRegion;
    return matchesSearch && matchesRegion;
  });

  const filteredCore = coreLanguages.filter(lang => {
    const matchesSearch = lang.name.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = activeRegion === 'All' || lang.region === activeRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Languages We Support</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Expert interpretation services in our core languages, with extended support available worldwide.
            </p>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8 relative">
              <input 
                type="text" 
                placeholder="Search for a language..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-6 py-4 rounded-full shadow-lg border-none focus:outline-none focus:ring-4 focus:ring-brand-cyan/30 text-lg"
              />
              <svg className="w-6 h-6 text-gray-400 absolute right-6 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Region Filter Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setActiveRegion(region)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition ${
                    activeRegion === region
                      ? 'bg-brand-royal text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>

            {/* CORE LANGUAGES SECTION */}
            {filteredCore.length > 0 && (
              <div className="mb-16">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-brand-navy mb-2">Our Core Languages</h2>
                  <p className="text-gray-500">Our primary specialization with the highest interpreter availability</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredCore.map((lang, index) => (
                    <div 
                      key={index} 
                      className={`relative bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col items-center text-center border-2 group ${
                        lang.isPrimary 
                          ? 'border-yellow-400 ring-2 ring-yellow-200' 
                          : 'border-gray-100'
                      }`}
                    >
                      {/* Primary Specialization Badge */}
                      {lang.isPrimary && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                          <span>Primary Specialization</span>
                        </div>
                      )}

                      <div className="text-5xl mb-3">{lang.flag}</div>
                      <h3 className="font-bold text-brand-navy text-lg mb-1">{lang.name}</h3>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">{lang.region}</p>

                      {/* Live Availability */}
                      <div className="flex items-center space-x-1.5 mb-3">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-bold text-green-600">
                          {loading ? '...' : (interpreterCounts[lang.name] || 0)} online
                        </span>
                      </div>

                      {/* Audio Preview Button */}
                      <button
                        onClick={() => handlePlayGreeting(lang.name, lang.greeting, lang.langCode)}
                        className={`w-full flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-bold transition mb-3 ${
                          playingLang === lang.name
                            ? 'bg-brand-cyan text-white animate-pulse'
                            : 'bg-gray-50 text-gray-600 hover:bg-brand-cyan/10 hover:text-brand-cyan'
                        }`}
                      >
                        {playingLang === lang.name ? (
                          <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
                            <span>Playing...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            <span>Hear Greeting</span>
                          </>
                        )}
                      </button>

                      {/* Quick Book Button */}
                      <Link 
                        to={`/book?language=${encodeURIComponent(lang.name)}`}
                        className="w-full bg-brand-royal hover:bg-brand-navy text-white text-sm font-bold py-2.5 rounded-lg transition"
                      >
                        Book {lang.name} Interpreter
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EXTENDED LANGUAGES SECTION */}
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-brand-navy mb-2">Also Available</h2>
                <p className="text-gray-500">Extended language support available on request</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredExtended.map((lang, index) => {
                  const count = interpreterCounts[lang.name] || 0;
                  const isPopular = count >= 3;
                  
                  return (
                    <div 
                      key={index} 
                      className="relative bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col items-center text-center border border-gray-100 group"
                    >
                      {/* Popularity Badge */}
                      {isPopular && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md flex items-center space-x-0.5">
                          <span>🔥</span>
                          <span>Popular</span>
                        </div>
                      )}

                      <div className="text-4xl mb-2">{lang.flag}</div>
                      <h3 className="font-bold text-brand-navy mb-1 text-sm">{lang.name}</h3>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{lang.region}</p>

                      {/* Live Availability */}
                      <div className="flex items-center space-x-1 mb-2">
                        <span className={`w-2 h-2 rounded-full ${count > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        <span className={`text-xs font-bold ${count > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                          {loading ? '...' : count} online
                        </span>
                      </div>

                      {/* Audio Preview */}
                      <button
                        onClick={() => handlePlayGreeting(lang.name, lang.greeting, lang.langCode)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition mb-2 ${
                          playingLang === lang.name
                            ? 'bg-brand-cyan text-white'
                            : 'bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-brand-cyan/10 hover:text-brand-cyan'
                        }`}
                        title="Hear greeting"
                      >
                        {playingLang === lang.name ? (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
                        ) : (
                          <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        )}
                      </button>

                      {/* Quick Book */}
                      <Link 
                        to={`/book?language=${encodeURIComponent(lang.name)}`}
                        className="w-full bg-gray-50 hover:bg-brand-royal hover:text-white text-gray-600 text-xs font-bold py-2 rounded-lg transition"
                      >
                        Book Now
                      </Link>
                    </div>
                  );
                })}
              </div>

              {filteredExtended.length === 0 && filteredCore.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-500">No languages found. Try a different search or region!</p>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="mt-20 text-center bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-brand-navy mb-4">Don't see your language?</h3>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                We are constantly expanding our network of certified interpreters. If you don't see your language here, we can still find an expert for you!
              </p>
              <Link 
                to="/contact"
                className="inline-block bg-brand-royal hover:bg-brand-navy text-white px-8 py-3 rounded-full font-bold transition shadow-lg"
              >
                Request a Language
              </Link>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Languages;