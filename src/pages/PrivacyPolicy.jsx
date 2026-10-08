import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function PrivacyPolicy() {
  const [currentDate, setCurrentDate] = useState('');
  const [activeSection, setActiveSection] = useState('');

  // Set dynamic current date and handle scroll spy for TOC
  useEffect(() => {
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    setCurrentDate(date);
    
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

  // Handle PDF download
  const handleDownloadPDF = () => {
    window.print();
  };

  // Table of Contents items
  const tocItems = [
    { id: 'introduction', label: '1. Introduction' },
    { id: 'information-collected', label: '2. Information We Collect' },
    { id: 'how-we-use', label: '3. How We Use Your Information' },
    { id: 'data-security', label: '4. Data Security' },
    { id: 'cookies', label: '5. Cookies & Tracking' },
    { id: 'your-rights', label: '6. Your Privacy Rights' },
    { id: 'contact', label: '7. Contact Us' }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <p className="text-xl text-blue-100">
                Last updated: {currentDate}
              </p>
              {/* Dynamic Version Badge */}
              <span className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-1.5 rounded-full text-sm font-bold flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Version 2.1</span>
              </span>
            </div>
          </div>
        </section>

        {/* NEW: Trust & Compliance Badges */}
        <section className="py-12 bg-gray-50 border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-bold text-gray-500 uppercase tracking-wider mb-8">Enterprise-Grade Security & Compliance</p>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
              {[
                { icon: "🏥", label: "HIPAA Compliant" },
                { icon: "🇪🇺", label: "GDPR Ready" },
                { icon: "🔒", label: "SOC 2 Type II" },
                { icon: "🛡️", label: "End-to-End Encrypted" }
              ].map((badge, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-2 opacity-80 hover:opacity-100 transition">
                  <span className="text-3xl md:text-4xl">{badge.icon}</span>
                  <span className="text-sm font-semibold text-gray-700">{badge.label}</span>
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
                    className="w-full mt-6 bg-brand-royal hover:bg-brand-navy text-white font-bold py-3 rounded-lg transition flex items-center justify-center space-x-2 print:hidden"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Policy Content */}
              <div className="flex-grow max-w-4xl text-gray-600 space-y-10">
                
                <div id="introduction" data-section="introduction" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">1. Introduction</h2>
                  {/* NEW: Brand-Aligned Copy */}
                  <p>
                    Welcome to Access Lingua ("we", "our", or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website and use our interpretation services as our primary expertise, with selective translation support available.
                  </p>
                </div>

                <div id="information-collected" data-section="information-collected" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">2. Information We Collect</h2>
                  <p>
                    We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, or otherwise contact us. This includes:
                  </p>
                  <ul className="list-disc pl-6 mt-4 space-y-2">
                    <li><strong>Personal Identifiers:</strong> Name, email address, phone number, and company name.</li>
                    <li><strong>Payment Data:</strong> Credit card numbers and billing details (processed securely via our encrypted payment providers).</li>
                    <li><strong>Usage Data:</strong> IP address, browser type, and pages visited to help us improve our services.</li>
                    <li><strong>Session Data:</strong> Audio, video, and transcript data generated during interpretation sessions (retained only as long as necessary for quality assurance and compliance).</li>
                  </ul>
                </div>

                <div id="how-we-use" data-section="how-we-use" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">3. How We Use Your Information</h2>
                  <p>
                    We use personal information collected via our website for a variety of business purposes described below. We process your personal information in reliance on our legitimate business interests, to perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                  </p>
                  <ul className="list-disc pl-6 mt-4 space-y-2">
                    <li>To facilitate account creation and secure logon processes.</li>
                    <li>To send you marketing and promotional communications (only with your explicit consent).</li>
                    <li>To protect our Services, prevent fraud, and ensure platform integrity.</li>
                    <li>To fulfill and manage your interpretation and selective translation orders.</li>
                  </ul>
                </div>

                <div id="data-security" data-section="data-security" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">4. Data Security</h2>
                  <p>
                    We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. All video and phone interpretations are encrypted end-to-end. However, please remember that we cannot guarantee that the internet itself is 100% secure.
                  </p>
                </div>

                <div id="cookies" data-section="cookies" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">5. Cookies and Tracking Technologies</h2>
                  <p>
                    We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                  </p>
                </div>

                {/* NEW: Actionable Privacy Rights Section */}
                <div id="your-rights" data-section="your-rights" className="scroll-mt-24 bg-brand-royal/5 border border-brand-royal/20 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">6. Your Privacy Rights</h2>
                  <p className="mb-6">
                    Depending on your location (e.g., GDPR in Europe, CCPA in California), you may have specific rights regarding your personal data. We make it easy for you to exercise these rights:
                  </p>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <a href="/contact?subject=Data Access Request" className="bg-white p-4 rounded-xl border border-gray-200 hover:border-brand-royal hover:shadow-md transition text-center group">
                      <div className="text-2xl mb-2 group-hover:scale-110 transition">📥</div>
                      <h4 className="font-bold text-brand-navy text-sm">Download My Data</h4>
                      <p className="text-xs text-gray-500 mt-1">Request a copy of your personal data.</p>
                    </a>
                    <a href="/contact?subject=Data Deletion Request" className="bg-white p-4 rounded-xl border border-gray-200 hover:border-red-400 hover:shadow-md transition text-center group">
                      <div className="text-2xl mb-2 group-hover:scale-110 transition">🗑️</div>
                      <h4 className="font-bold text-brand-navy text-sm">Request Deletion</h4>
                      <p className="text-xs text-gray-500 mt-1">Ask us to permanently delete your account.</p>
                    </a>
                    <a href="/contact?subject=Cookie Preferences" className="bg-white p-4 rounded-xl border border-gray-200 hover:border-brand-cyan hover:shadow-md transition text-center group">
                      <div className="text-2xl mb-2 group-hover:scale-110 transition">🍪</div>
                      <h4 className="font-bold text-brand-navy text-sm">Manage Cookies</h4>
                      <p className="text-xs text-gray-500 mt-1">Update your tracking preferences.</p>
                    </a>
                  </div>
                </div>

                <div id="contact" data-section="contact" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">7. Contact Us</h2>
                  <p>
                    If you have questions or comments about this policy, you may email our Data Protection Officer at <a href="mailto:privacy@accesslingua.com" className="text-brand-royal hover:underline font-medium">privacy@accesslingua.com</a> or by post to:
                  </p>
                  <div className="mt-4 bg-gray-50 p-6 rounded-xl border-l-4 border-brand-royal">
                    <p className="font-bold text-gray-800">Access Lingua Ltd.</p>
                    <p className="text-gray-600">Attn: Data Protection Officer</p>
                    <p className="text-gray-600">123 Global Plaza, Tech District</p>
                    <p className="text-gray-600">New York, NY 10001</p>
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

export default PrivacyPolicy;