import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [helpful, setHelpful] = useState({});

  // Brand-Aligned & Categorized FAQ Data
  // (Note: Hardcoded is perfect for Phase 1. We can move this to Supabase later if an Admin FAQ manager is requested).
  const faqs = [
    {
      id: 1,
      category: "General & Booking",
      question: "How do I book an interpreter?",
      answer: "You can book an interpreter directly through our 'Book an Interpreter' page. Simply fill out the form with your date, time, and language requirements, and we will match you with a certified professional from our core network."
    },
    {
      id: 2,
      category: "General & Booking",
      question: "What languages do you support?",
      answer: "Our primary expertise and major niche is our 4 core languages: English, Igbo, Mandarin Chinese, and Pidgin English. We also have an extended network for selective, on-demand support. If you need a specific dialect, contact our team and we will find an expert for you!"
    },
    {
      id: 3,
      category: "General & Booking",
      question: "Do you offer certified translations for legal documents?",
      answer: "While our primary expertise is live, spoken interpretation, we do have a specialized wing for selective, short-document translation. We are not a massive document translation factory, but we can absolutely handle your specific, high-quality translation needs."
    },
    {
      id: 4,
      category: "Security & Compliance",
      question: "Is the video interpretation service secure?",
      answer: "Absolutely. We use end-to-end encryption for all video and phone calls. Your privacy and confidentiality are our top priorities, and our platform is fully HIPAA and GDPR compliant."
    },
    {
      id: 5,
      category: "Billing & Wallet",
      question: "How does the wallet/credits system work?",
      answer: "You can purchase credits in advance. Every minute of interpretation is deducted from your wallet balance based on your plan. You can top up your wallet at any time from your dashboard, or enable auto-recharge for uninterrupted service."
    },
    {
      id: 6,
      category: "Billing & Wallet",
      question: "Can I cancel my subscription anytime?",
      answer: "Yes! Our subscription plans are completely flexible. You can upgrade, downgrade, or cancel your plan at any time from your account settings without any hidden fees or penalties."
    }
  ];

  const toggleFAQ = (id) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  const handleFeedback = (id, response) => {
    setHelpful(prev => ({ ...prev, [id]: response }));
  };

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    // FIXED: Added pt-36 to push content down below the fixed Navbar
    <div className="min-h-screen bg-white flex flex-col pt-36">
      <Navbar />
      
      <main className="flex-grow">
        {/* Page Header with Live Search */}
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Everything you need to know about Access Lingua.
            </p>
            
            {/* Live Search Filter */}
            <div className="max-w-xl mx-auto relative">
              <input 
                type="text" 
                placeholder="Search for a question (e.g., 'HIPAA', 'Billing')..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-full shadow-lg border-none focus:outline-none focus:ring-4 focus:ring-brand-cyan/30 text-gray-800 text-lg"
              />
              <svg className="w-6 h-6 text-gray-400 absolute right-6 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Categorized Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {['All', 'General & Booking', 'Billing & Wallet', 'Security & Compliance'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition ${
                    activeCategory === cat
                      ? 'bg-brand-royal text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <div key={faq.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                    <button 
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full px-8 py-6 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50 transition"
                    >
                      <span className="text-lg font-bold text-brand-navy pr-4">{faq.question}</span>
                      <svg 
                        className={`w-6 h-6 text-brand-royal flex-shrink-0 transform transition-transform duration-300 ${openIndex === faq.id ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {openIndex === faq.id && (
                      <div className="px-8 pb-6 text-gray-600 leading-relaxed animate-fadeIn">
                        <p className="mb-4">{faq.answer}</p>
                        
                        {/* "Was this helpful?" Feedback Loop */}
                        <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                          <span className="text-sm font-medium text-gray-500">Was this helpful?</span>
                          <button 
                            onClick={() => handleFeedback(faq.id, 'yes')}
                            className={`flex items-center space-x-1 text-sm font-bold px-3 py-1 rounded-full transition ${
                              helpful[faq.id] === 'yes' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            <span>👍</span> <span>Yes</span>
                          </button>
                          <button 
                            onClick={() => handleFeedback(faq.id, 'no')}
                            className={`flex items-center space-x-1 text-sm font-bold px-3 py-1 rounded-full transition ${
                              helpful[faq.id] === 'no' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            <span>👎</span> <span>No</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                  <p className="text-xl text-gray-500">No questions found matching your search.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                    className="mt-4 text-brand-royal font-bold hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {/* Quick-Link "Next Steps" Cards */}
            <div className="mt-16 grid md:grid-cols-3 gap-6">
              <Link to="/services" className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg hover:border-brand-royal/30 transition group text-center">
                <div className="w-12 h-12 bg-brand-royal/10 text-brand-royal rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-royal group-hover:text-white transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h4 className="font-bold text-brand-navy mb-2">View Our Services</h4>
                <p className="text-sm text-gray-500">Learn more about our core interpretation solutions.</p>
              </Link>
              
              <Link to="/plans" className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg hover:border-brand-royal/30 transition group text-center">
                <div className="w-12 h-12 bg-brand-cyan/10 text-brand-cyan rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-cyan group-hover:text-white transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h4 className="font-bold text-brand-navy mb-2">Explore Pricing</h4>
                <p className="text-sm text-gray-500">Find the perfect plan for your organization's needs.</p>
              </Link>

              <Link to="/book" className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg hover:border-brand-royal/30 transition group text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 group-hover:text-white transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <h4 className="font-bold text-brand-navy mb-2">Book an Interpreter</h4>
                <p className="text-sm text-gray-500">Ready to start? Schedule your session in minutes.</p>
              </Link>
            </div>

            {/* Still have questions? */}
            <div className="mt-16 text-center bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-brand-navy mb-4">Still have questions?</h3>
              <p className="text-gray-600 mb-6">Our support team is available 24/7 to help you out.</p>
              <Link to="/contact" className="inline-block bg-brand-royal hover:bg-brand-navy text-white px-8 py-3 rounded-full font-bold transition shadow-lg">
                Contact Support
              </Link>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default FAQ;