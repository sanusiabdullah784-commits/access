import { Helmet } from 'react-helmet-async'; // <-- ADDED SEO IMPORT
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ActivityCounters from '../components/ActivityCounters';

function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ADDED DYNAMIC SEO META TAGS */}
      <Helmet>
        <title>Home | Access Lingua - Professional Translation Services</title>
        <meta name="description" content="Welcome to Access Lingua. Bridge language barriers with our certified 24/7 video, phone, and in-person interpretation services." />
      </Helmet>

      {/* Top Lego Block */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Bridging Languages<br />
              <span className="text-brand-cyan">Connecting People</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto">
              Professional translation services that break down barriers and bring the world closer together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-brand-royal px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-cyan hover:text-white transition shadow-xl">
                Start Translating
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-brand-navy transition">
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-brand-navy mb-16">Why Choose Access Lingua?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition">
                <div className="w-16 h-16 bg-brand-cyan rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-brand-navy mb-3">100+ Languages</h3>
                <p className="text-gray-600">Expert translation in over 100 languages with native speakers worldwide.</p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition">
                <div className="w-16 h-16 bg-brand-royal rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-brand-navy mb-3">Lightning Fast</h3>
                <p className="text-gray-600">Quick turnaround times without compromising on quality and accuracy.</p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition">
                <div className="w-16 h-16 bg-brand-navy rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-brand-navy mb-3">Certified Accuracy</h3>
                <p className="text-gray-600">ISO-certified translations you can trust for legal and business documents.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ADDED ACTIVITY COUNTERS SECTION */}
        <ActivityCounters />
      </main>

      {/* Bottom Lego Block */}
      <Footer />
    </div>
  );
}

export default HomePage;