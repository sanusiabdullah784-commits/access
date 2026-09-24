import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I book an interpreter?",
      answer: "You can book an interpreter directly through our 'Book an Interpreter' page. Simply fill out the form with your date, time, and language requirements, and we will match you with a certified professional."
    },
    {
      question: "What languages do you support?",
      answer: "We support over 150 languages worldwide, including Spanish, French, Mandarin, Arabic, Russian, and many more. If you need a rare dialect, contact our support team and we will find an expert for you!"
    },
    {
      question: "Is the video interpretation service secure?",
      answer: "Absolutely. We use end-to-end encryption for all video and phone calls. Your privacy and confidentiality are our top priorities, and we are fully HIPAA and GDPR compliant."
    },
    {
      question: "How does the wallet/credits system work?",
      answer: "You can purchase credits in advance. Every minute of interpretation or word translated is deducted from your wallet balance. You can top up your wallet at any time from your dashboard."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes! Our subscription plans are completely flexible. You can upgrade, downgrade, or cancel your plan at any time from your account settings without any hidden fees."
    },
    {
      question: "Do you offer certified translations for legal documents?",
      answer: "Yes, we provide ISO-certified translations that are legally recognized for court documents, immigration papers, contracts, and academic transcripts."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Everything you need to know about Access Lingua.
            </p>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                  <button 
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-8 py-6 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50 transition"
                  >
                    <span className="text-lg font-bold text-brand-navy">{faq.question}</span>
                    <svg 
                      className={`w-6 h-6 text-brand-royal transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {openIndex === index && (
                    <div className="px-8 pb-6 text-gray-600 leading-relaxed animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Still have questions? */}
            <div className="mt-16 text-center bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-brand-navy mb-4">Still have questions?</h3>
              <p className="text-gray-600 mb-6">Our support team is available 24/7 to help you out.</p>
              <a href="/contact" className="inline-block bg-brand-royal hover:bg-brand-navy text-white px-8 py-3 rounded-full font-bold transition shadow-lg">
                Contact Support
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default FAQ;