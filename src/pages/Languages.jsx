import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Languages() {
  const [search, setSearch] = useState('');

  const languages = [
    { name: "Spanish", flag: "🇪🇸", region: "Europe/Americas" },
    { name: "French", flag: "🇫", region: "Europe/Africa" },
    { name: "Mandarin Chinese", flag: "🇨🇳", region: "Asia" },
    { name: "Arabic", flag: "🇸🇦", region: "Middle East" },
    { name: "Russian", flag: "🇷🇺", region: "Europe/Asia" },
    { name: "Portuguese", flag: "🇧🇷", region: "Europe/Americas" },
    { name: "German", flag: "🇩🇪", region: "Europe" },
    { name: "Japanese", flag: "🇯🇵", region: "Asia" },
    { name: "Korean", flag: "🇰🇷", region: "Asia" },
    { name: "Italian", flag: "🇮🇹", region: "Europe" },
    { name: "Hindi", flag: "🇮🇳", region: "Asia" },
    { name: "Turkish", flag: "🇹🇷", region: "Europe/Asia" },
    { name: "Vietnamese", flag: "🇻🇳", region: "Asia" },
    { name: "Polish", flag: "🇵🇱", region: "Europe" },
    { name: "Dutch", flag: "🇳🇱", region: "Europe" },
    { name: "Swahili", flag: "🇰", region: "Africa" }
  ];

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Languages We Support</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Breaking down barriers in over 150 languages and dialects worldwide.
            </p>
          </div>
        </section>

        {/* Search and Grid */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12 relative">
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

            {/* Languages Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredLanguages.map((lang, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col items-center text-center cursor-pointer border border-gray-100">
                  <div className="text-4xl mb-3">{lang.flag}</div>
                  <h3 className="font-bold text-brand-navy mb-1">{lang.name}</h3>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">{lang.region}</p>
                </div>
              ))}
            </div>

            {filteredLanguages.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">No languages found. Try a different search!</p>
              </div>
            )}

            {/* CTA */}
            <div className="mt-20 text-center bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-brand-navy mb-4">Don't see your language?</h3>
              <p className="text-gray-600 mb-6">We support over 150 languages. If you don't see it here, we can still find an expert for you!</p>
              <button className="bg-brand-royal hover:bg-brand-navy text-white px-8 py-3 rounded-full font-bold transition shadow-lg">
                Request a Language
              </button>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Languages;