import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Services() {
  const [activeIndustry, setActiveIndustry] = useState('Healthcare');

  // Focused strictly on Interpretation as the primary niche
  const interpretationServices = [
    {
      id: 'opi',
      title: "Over-the-Phone Interpretation (OPI)",
      desc: "On-demand, 24/7 telephone interpretation connecting you instantly with certified linguists for urgent and everyday communication needs.",
      price: "Starting at $1.50/min",
      icon: "📞"
    },
    {
      id: 'vri',
      title: "Video Remote Interpretation (VRI)",
      desc: "Real-time, face-to-face video interpretation via our secure, crystal-clear platform, bringing expert linguists directly to your screen.",
      price: "Starting at $2.50/min",
      isVRI: true // Flag to render the special mockup
    },
    {
      id: 'inperson',
      title: "In-Person Interpretation",
      desc: "Highly qualified, on-site interpreters for conferences, medical appointments, legal proceedings, and critical business meetings.",
      price: "Custom hourly rates",
      icon: "🤝"
    },
    {
      id: 'corporate',
      title: "Corporate Interpretation Solutions",
      desc: "Tailored, scalable spoken language solutions for enterprise businesses, including dedicated account management and priority routing.",
      price: "Enterprise pricing",
      icon: "🏢"
    }
  ];

  const howItWorksSteps = [
    { 
      step: "01", 
      title: "Select Your Language", 
      desc: "Choose from our 4 core specialized languages or request from our extended network of 150+ global languages.", 
      icon: "🌍" 
    },
    { 
      step: "02", 
      title: "Connect Instantly", 
      desc: "Reach a certified, vetted interpreter in under 30 seconds via Phone, Video, or schedule an On-site visit.", 
      icon: "⚡" 
    },
    { 
      step: "03", 
      title: "Communicate Seamlessly", 
      desc: "Engage in clear, accurate, and culturally sensitive communication with total confidentiality and compliance.", 
      icon: "🛡️" 
    }
  ];

  const industryUseCases = {
    Healthcare: [
      "HIPAA-compliant VRI for patient intakes and telehealth consultations.",
      "Certified medical interpreters for informed consent and complex diagnoses.",
      "24/7 on-demand OPI access for emergency room triage and urgent care."
    ],
    Legal: [
      "Court-certified consecutive interpretation for depositions and hearings.",
      "Confidential, encrypted OPI for attorney-client privileged calls.",
      "Simultaneous interpretation for international arbitrations and trials."
    ],
    Corporate: [
      "Dedicated interpreters for multinational board meetings and negotiations.",
      "Real-time VRI for global HR, employee onboarding, and training sessions.",
      "Custom glossaries built for your industry-specific terminology."
    ],
    Government: [
      "Federally compliant interpretation for public services and community outreach.",
      "Secure, end-to-end encrypted communication channels for sensitive data.",
      "Rapid deployment of on-site interpreters for public events and hearings."
    ]
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Interpretation Services</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              We are a premier language services company specializing in professional, real-time spoken interpretation.
            </p>
          </div>
        </section>

        {/* NEW: Interactive "How It Works" Step-by-Step Guide */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-navy mb-16">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting Line (Desktop Only) */}
              <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-brand-cyan via-brand-royal to-brand-navy opacity-20"></div>
              
              {howItWorksSteps.map((item, index) => (
                <div key={index} className="relative bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition text-center z-10">
                  <div className="w-16 h-16 bg-brand-royal/10 text-brand-royal rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border-4 border-white shadow-sm">
                    {item.icon}
                  </div>
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-navy text-white text-xs font-bold px-3 py-1 rounded-full">
                    Step {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-brand-navy mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interpretation Services Grid */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-navy mb-12">How We Connect You</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {interpretationServices.map((service, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 border border-gray-100 relative overflow-hidden">
                  {/* NEW: Transparent Pricing Indicator */}
                  <div className="absolute top-0 right-0 bg-brand-cyan/10 text-brand-cyan text-xs font-bold px-4 py-1.5 rounded-bl-xl border-l border-b border-brand-cyan/20">
                    {service.price}
                  </div>

                  <div className="text-5xl mb-4">{service.icon || '🎥'}</div>
                  <h3 className="text-2xl font-bold text-brand-navy mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.desc}</p>

                  {/* NEW: VRI Platform "Sneak Peek" Mockup */}
                  {service.isVRI && (
                    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-inner mt-4">
                      <div className="aspect-video bg-gray-800 relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/40 to-brand-royal/40"></div>
                        <div className="z-10 text-center">
                          <div className="w-16 h-16 bg-brand-cyan/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-brand-cyan/50 animate-pulse">
                            <svg className="w-8 h-8 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          </div>
                          <p className="text-white text-sm font-medium">Connecting to Interpreter...</p>
                        </div>
                        
                        {/* Mock Controls */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                          <button className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition shadow-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                          </button>
                          <button className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-gray-600 transition shadow-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          </button>
                          <button className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-gray-600 transition shadow-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                          </button>
                        </div>
                        
                        {/* Live Captions Badge */}
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center space-x-2 border border-white/10">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          <span>Live Captions: ON</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <Link 
                    to="/book" 
                    className="mt-6 inline-flex items-center text-brand-royal font-bold hover:text-brand-navy transition group"
                  >
                    Learn more 
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NEW: Industry-Specific Use Case Tabs */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-navy mb-4">Tailored for Your Industry</h2>
            <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">We understand that every sector has unique compliance and communication needs. Our solutions are built to meet them.</p>
            
            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {Object.keys(industryUseCases).map((industry) => (
                <button
                  key={industry}
                  onClick={() => setActiveIndustry(industry)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition ${
                    activeIndustry === industry
                      ? 'bg-brand-navy text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-gray-50 rounded-2xl p-8 md:p-10 border border-gray-100 shadow-inner min-h-[200px] transition-all duration-300">
              <h3 className="text-2xl font-bold text-brand-royal mb-6 flex items-center">
                <span className="w-2 h-8 bg-brand-cyan rounded-full mr-3"></span>
                {activeIndustry} Solutions
              </h3>
              <ul className="space-y-4">
                {industryUseCases[activeIndustry].map((useCase, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700 text-lg">{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Selective Translation Note (Exactly as requested by client) */}
        <section className="py-16 bg-blue-50 border-y border-blue-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-4">Do we also do Translation? YES.</h2>
            <p className="text-lg text-gray-700 mb-6">
              While our primary expertise and major niche is live, spoken interpretation, we do have a specialized wing for <strong>selective, short-document translation</strong>. 
              We are not a massive document translation factory, but we can absolutely handle your specific, high-quality translation needs.
            </p>
            <p className="text-gray-600 mb-8">
              For further inquiries about selective translation services or any other custom language solutions, please contact our team.
            </p>
            <Link to="/contact" className="inline-block bg-brand-royal hover:bg-brand-navy text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-xl">
              Contact Us for Further Inquiries
            </Link>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-6">Ready to Break Spoken Language Barriers?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Connect with a certified interpreter today and discover how Access Lingua can help you communicate with the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/call-interpreter" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-xl flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span>Phone an Interpreter Instantly</span>
              </Link>
              <Link to="/book" className="bg-brand-royal hover:bg-brand-navy text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-xl flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span>Book an Appointment</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Services;