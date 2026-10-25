import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ActivityCounters from '../components/ActivityCounters';
import Marquee from '../components/Marquee';
import FloatingBubbles from '../components/FloatingBubbles';

function HomePage() {
  // Core Languages Data
  const coreLanguages = [
    { 
      name: 'English', 
      flag: '🇬🇧',
      specialty: 'Global Business & Legal',
      description: 'Flawless interpretation for international corporate meetings and legal proceedings.'
    },
    { 
      name: 'Igbo', 
      flag: '🇳🇬',
      specialty: 'Healthcare & Community',
      description: 'Native-speaking experts ensuring accurate medical and community dialogue.'
    },
    { 
      name: 'Mandarin Chinese', 
      flag: '🇨🇳',
      specialty: 'Corporate & Technical',
      description: 'Bridging the gap for international trade, tech, and high-stakes negotiations.'
    },
    { 
      name: 'Pidgin English', 
      flag: '🇳🇬',
      specialty: 'Broad Accessibility',
      description: 'Connecting with everyday speakers through natural, culturally fluent communication.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col relative overflow-hidden pt-36 transition-colors duration-300">
      <Helmet>
        <title>Home | Access Lingua - Professional Interpretation Services</title>
        <meta name="description" content="Welcome to Access Lingua. Bridge spoken language barriers with our certified 24/7 video, phone, and in-person interpretation services." />
      </Helmet>

      <FloatingBubbles />
      <Navbar />
      <Marquee />
      
      <main className="flex-grow relative z-10">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Bridging Languages<br />
              <span className="text-brand-cyan">Connecting People</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto">
              Professional <strong>interpretation services</strong> that break down spoken language barriers and bring the world closer together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/call-interpreter" 
                className="bg-white text-brand-royal px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-cyan hover:text-white transition shadow-xl flex items-center justify-center space-x-2 group"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Phone an Interpreter Instantly</span>
              </Link>
              
              <Link 
                to="/book" 
                className="bg-brand-cyan text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-brand-royal transition shadow-xl flex items-center justify-center space-x-2 group"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Book an Appointment</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-brand-navy dark:text-white mb-16">Why Choose Access Lingua?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Interactive "Our Core Languages" Card */}
              <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition border-t-4 border-brand-cyan md:col-span-1">
                <div className="w-16 h-16 bg-brand-cyan rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-brand-navy dark:text-white mb-2">4 Core Languages</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Expert interpretation with native-speaking professionals.</p>
                
                {/* 2x2 Grid of Language Specialty Cards */}
                <div className="grid grid-cols-1 gap-3">
                  {coreLanguages.map((lang) => (
                    <div 
                      key={lang.name}
                      className="group flex items-start space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-600/50 hover:bg-brand-royal/5 dark:hover:bg-brand-royal/20 border border-transparent hover:border-brand-royal/20 transition-all duration-300"
                    >
                      <span className="text-2xl flex-shrink-0 mt-0.5">{lang.flag}</span>
                      <div>
                        <h4 className="font-bold text-brand-navy dark:text-white group-hover:text-brand-royal transition">
                          {lang.name}
                        </h4>
                        <p className="text-xs font-semibold text-brand-cyan uppercase tracking-wide mb-1">
                          {lang.specialty}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                          {lang.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition md:col-span-2 flex flex-col justify-center border border-gray-100 dark:border-gray-600">
                <div className="grid md:grid-cols-2 gap-8 h-full">
                  <div>
                    <div className="w-16 h-16 bg-brand-royal rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-brand-navy dark:text-white mb-3">Lightning Fast</h3>
                    <p className="text-gray-600 dark:text-gray-300">Instant connections to certified interpreters without compromising on quality and accuracy.</p>
                  </div>
                  
                  <div>
                    <div className="w-16 h-16 bg-brand-navy rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-brand-navy dark:text-white mb-3">Certified Accuracy</h3>
                    <p className="text-gray-600 dark:text-gray-300">Highly trained interpreters you can trust for legal, medical, and business conversations.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* SUBTLE TRANSLATION MENTION */}
            <div className="mt-16 text-center bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-8 max-w-3xl mx-auto">
              <h3 className="text-xl font-bold text-brand-navy dark:text-blue-300 mb-2">Do we do Translation? YES.</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                While our primary expertise and major niche is live, spoken interpretation, we do have a specialized wing for <strong>selective, short-document translation</strong>. 
              </p>
              <Link to="/contact" className="text-brand-royal dark:text-brand-cyan font-bold hover:underline inline-flex items-center">
                For further inquiries about translation or other services, contact us here.
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>

          </div>
        </section>

        {/* NEW: Customer Testimonials Section (Phase 13 Requirement) */}
        <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-brand-navy dark:text-white mb-4">What Our Clients Say</h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">Trusted by businesses and individuals worldwide for accurate, reliable, and compassionate interpretation services.</p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition">
                <div className="flex text-yellow-400 mb-4">
                  {'⭐'.repeat(5)}
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic mb-6">"Access Lingua saved our international merger meeting. The Mandarin interpreter was incredibly professional and captured every technical nuance perfectly."</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand-royal rounded-full flex items-center justify-center text-white font-bold">JD</div>
                  <div>
                    <p className="font-bold text-brand-navy dark:text-white">John Doe</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">CEO, Global Tech Inc.</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition">
                <div className="flex text-yellow-400 mb-4">
                  {'⭐'.repeat(5)}
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic mb-6">"The instant phone interpretation feature is a lifesaver for our hospital. We can connect with Igbo-speaking patients in seconds."</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand-cyan rounded-full flex items-center justify-center text-white font-bold">SA</div>
                  <div>
                    <p className="font-bold text-brand-navy dark:text-white">Dr. Sarah Adams</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">City General Hospital</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition">
                <div className="flex text-yellow-400 mb-4">
                  {'⭐'.repeat(5)}
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic mb-6">"Seamless video booking and the AI transcript feature afterwards made our legal depositions so much easier to manage."</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand-navy rounded-full flex items-center justify-center text-white font-bold">MJ</div>
                  <div>
                    <p className="font-bold text-brand-navy dark:text-white">Michael Johnson</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Legal Counsel</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link to="/reviews" className="inline-flex items-center text-brand-royal dark:text-brand-cyan font-bold hover:underline">
                Read more customer reviews
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Website Activity Counters (Phase 13 Requirement) */}
        <ActivityCounters />
        
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;