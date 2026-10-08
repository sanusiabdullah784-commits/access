import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function TermsConditions() {
  const [accepted, setAccepted] = useState(false);
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [activeSection, setActiveSection] = useState('');

  // Set current date on mount
  useEffect(() => {
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    setCurrentDate(date);
    
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // Handle scroll spy for TOC
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute('data-section');
        }
      });
      
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle acceptance tracking
  const handleAcceptTerms = async () => {
    if (!user) {
      alert("Please log in to accept the terms.");
      return;
    }

    setSaving(true);
    
    const { error } = await supabase
      .from('terms_acceptance')
      .insert([{
        user_id: user.id,
        version: '2.1',
        accepted_at: new Date().toISOString()
      }]);

    if (error) {
      console.error("Error saving acceptance:", error);
      alert("Error recording acceptance. Please try again.");
    } else {
      setAccepted(true);
      alert("Thank you! Your acceptance has been recorded.");
    }
    
    setSaving(false);
  };

  // Handle PDF download
  const handleDownloadPDF = () => {
    window.print();
  };

  // TOC items
  const tocItems = [
    { id: 'agreement', label: '1. Agreement to Terms' },
    { id: 'services', label: '2. Description of Services' },
    { id: 'accounts', label: '3. Accounts & Registration' },
    { id: 'payments', label: '4. Payments & Subscriptions' },
    { id: 'ip', label: '5. Intellectual Property' },
    { id: 'liability', label: '6. Limitation of Liability' },
    { id: 'governing', label: '7. Governing Law' }
  ];

  // Quick summary cards
  const summaryCards = [
    {
      icon: "🔄",
      title: "30-Day Cancellation",
      desc: "Cancel anytime within 30 days for a full refund."
    },
    {
      icon: "🛡️",
      title: "HIPAA Compliant",
      desc: "Enterprise-grade security for healthcare clients."
    },
    {
      icon: "💰",
      title: "No Hidden Fees",
      desc: "Transparent pricing with no surprise charges."
    },
    {
      icon: "🔒",
      title: "Data Protection",
      desc: "GDPR & SOC 2 Type II certified infrastructure."
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <p className="text-xl text-blue-100">
                Last updated: {currentDate}
              </p>
              {/* NEW: Version History Badge */}
              <span className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-1.5 rounded-full text-sm font-bold flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Version 2.1</span>
              </span>
            </div>
          </div>
        </section>

        {/* NEW: Quick Summary Cards */}
        <section className="py-12 bg-gray-50 border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center text-brand-navy mb-8">Key Terms at a Glance</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {summaryCards.map((card, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 text-center hover:shadow-lg transition">
                  <div className="text-4xl mb-3">{card.icon}</div>
                  <h3 className="font-bold text-brand-navy mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-600">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content with Sticky TOC */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12">
              
              {/* NEW: Sticky Table of Contents */}
              <div className="lg:w-64 flex-shrink-0">
                <div className="lg:sticky lg:top-24 bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="font-bold text-brand-navy mb-4 text-sm uppercase tracking-wider">Table of Contents</h3>
                  <nav className="space-y-2">
                    {tocItems.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-sm font-medium transition ${
                          activeSection === item.id
                            ? 'text-brand-royal font-bold'
                            : 'text-gray-600 hover:text-brand-royal'
                        }`}
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                  
                  {/* NEW: Download PDF Button */}
                  <button
                    onClick={handleDownloadPDF}
                    className="w-full mt-6 bg-brand-royal hover:bg-brand-navy text-white font-bold py-3 rounded-lg transition flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Terms Content */}
              <div className="flex-grow max-w-4xl">
                <div className="text-gray-600 space-y-8">
                  
                  <div id="agreement" data-section="agreement" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold text-brand-navy mb-4">1. Agreement to Terms</h2>
                    <p>
                      By accessing or using the Access Lingua website and services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time, and your continued use of the service constitutes acceptance of those changes.
                    </p>
                  </div>

                  <div id="services" data-section="services" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold text-brand-navy mb-4">2. Description of Services</h2>
                    {/* NEW: Brand-Aligned Copy */}
                    <p>
                      Access Lingua provides professional interpretation services as our primary expertise, with selective translation support available for short documents. We act as a platform connecting clients with certified linguists and interpreters. We strive for the highest accuracy, but we do not guarantee that interpretations will be 100% error-free in every context.
                    </p>
                  </div>

                  <div id="accounts" data-section="accounts" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold text-brand-navy mb-4">3. Accounts and Registration</h2>
                    <p>
                      To access certain features of the platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process. You are responsible for safeguarding your password and for all activities that occur under your account.
                    </p>
                  </div>

                  <div id="payments" data-section="payments" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold text-brand-navy mb-4">4. Payments and Subscriptions</h2>
                    <p>
                      Certain services require payment. By purchasing credits or subscribing to a plan, you agree to pay all fees in accordance with the pricing displayed at the time of purchase. 
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li><strong>Subscriptions:</strong> Automatically renew at the end of each billing cycle unless canceled at least 24 hours before the renewal date.</li>
                      <li><strong>Refunds:</strong> Unused credits are non-refundable, except as required by law or at our sole discretion.</li>
                    </ul>
                  </div>

                  <div id="ip" data-section="ip" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold text-brand-navy mb-4">5. Intellectual Property</h2>
                    <p>
                      The Access Lingua logo, design, and content are the exclusive property of Access Lingua. You may not reproduce, distribute, or create derivative works from our materials without our express written permission.
                    </p>
                  </div>

                  <div id="liability" data-section="liability" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold text-brand-navy mb-4">6. Limitation of Liability</h2>
                    <p>
                      To the maximum extent permitted by law, Access Lingua shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of our services. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
                    </p>
                  </div>

                  <div id="governing" data-section="governing" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold text-brand-navy mb-4">7. Governing Law</h2>
                    <p>
                      These Terms shall be governed and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions.
                    </p>
                  </div>

                  {/* NEW: Acceptance Checkbox */}
                  {user && !accepted && (
                    <div className="bg-brand-royal/5 border-2 border-brand-royal/20 rounded-2xl p-6 mt-12">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={accepted}
                          onChange={(e) => setAccepted(e.target.checked)}
                          className="w-5 h-5 text-brand-royal rounded border-gray-300 focus:ring-brand-royal mt-1"
                        />
                        <div className="flex-grow">
                          <p className="font-bold text-brand-navy mb-1">I have read and agree to these Terms & Conditions</p>
                          <p className="text-sm text-gray-600">By checking this box, you acknowledge that you have read, understood, and agree to be bound by these terms.</p>
                        </div>
                      </label>
                      <button
                        onClick={handleAcceptTerms}
                        disabled={!accepted || saving}
                        className="w-full mt-4 bg-brand-royal hover:bg-brand-navy disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition"
                      >
                        {saving ? 'Recording...' : 'Accept Terms'}
                      </button>
                    </div>
                  )}

                  {accepted && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mt-12 text-center">
                      <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <p className="font-bold text-green-700">You have accepted these terms.</p>
                      <p className="text-sm text-green-600 mt-1">Your acceptance was recorded on {currentDate}.</p>
                    </div>
                  )}

                  <div className="bg-gray-50 p-6 rounded-2xl border-l-4 border-brand-royal mt-12">
                    <h3 className="text-xl font-bold text-brand-navy mb-2">Have Questions?</h3>
                    <p className="mb-4">If you have any questions about these Terms, please contact our legal team.</p>
                    <a href="/contact" className="inline-block bg-brand-royal hover:bg-brand-navy text-white px-6 py-2 rounded-full font-bold transition">
                      Contact Us
                    </a>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default TermsConditions;