import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend or email service (e.g., Resend)
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
    setTimeout(() => setSubmitted(false), 5000); // Show success message for 5 seconds
  };

  const handleCopyWeChat = () => {
    navigator.clipboard.writeText('AccessLinguaHQ');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col pt-36 transition-colors duration-300">
      <Navbar />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </section>

        <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Contact Info & WeChat */}
              <div className="md:col-span-1 space-y-6">
                
                {/* Contact Information */}
                <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-600">
                  <h3 className="text-xl font-bold text-brand-navy dark:text-white mb-4">Contact Information</h3>
                  <ul className="space-y-5">
                    <li className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-brand-royal flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">Phone & WhatsApp</p>
                        <p className="text-gray-600 dark:text-gray-400">0816 668 5270</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-brand-royal flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">Email</p>
                        <p className="text-gray-600 dark:text-gray-400">support@accesslingua.com</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* WECHAT SECTION */}
                <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-md p-6 border-t-4 border-green-500 border border-gray-100 dark:border-gray-600">
                  <h3 className="text-xl font-bold text-brand-navy dark:text-white mb-4 flex items-center">
                    <svg className="w-6 h-6 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8.5 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-5 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3.5-13C4.48 2 0 5.58 0 10c0 2.4 1.28 4.56 3.3 6.08L2 20l4.2-2.1c1.14.32 2.36.5 3.64.5.17 0 .34 0 .5-.01C10.16 18.13 10 17.83 10 17.5c0-4.14 4.03-7.5 9-7.5.34 0 .67.02 1 .05C19.36 5.63 15.28 2 10 2z"/></svg>
                    WeChat Support
                  </h3>
                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-500 flex-shrink-0">
                      {/* Replace this SVG with an actual <img> tag pointing to your WeChat QR code when available */}
                      <svg className="w-12 h-12 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Search or add ID:</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-lg font-mono font-bold text-gray-800 dark:text-gray-200 break-all">AccessLinguaHQ</p>
                        <button 
                          onClick={handleCopyWeChat}
                          className="text-brand-royal hover:text-brand-navy dark:hover:text-brand-cyan transition p-1"
                          title="Copy WeChat ID"
                        >
                          {copied ? (
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          )}
                        </button>
                      </div>
                      {copied && <p className="text-xs text-green-600 font-bold mt-1 animate-fadeIn">Copied!</p>}
                    </div>
                  </div>
                </div>

                {/* HELP CENTRE LINK */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
                  <h3 className="text-lg font-bold text-brand-navy dark:text-blue-300 mb-2">Need immediate help?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Check our Help Centre for quick answers to common questions.</p>
                  <a href="/faq" className="inline-block bg-brand-royal hover:bg-brand-navy text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-md">
                    Visit Help Centre
                  </a>
                </div>
              </div>

              {/* Contact Form */}
              <div className="md:col-span-2">
                <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-md p-8 border border-gray-100 dark:border-gray-600">
                  <h3 className="text-2xl font-bold text-brand-navy dark:text-white mb-6">Send us a Message</h3>
                  
                  {submitted ? (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center animate-fadeIn">
                      <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <h4 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">Message Sent Successfully!</h4>
                      <p className="text-green-600 dark:text-green-400">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Full Name</label>
                          <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal" placeholder="John Doe" />
                        </div>
                        <div>
                          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Email Address</label>
                          <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal" placeholder="john@example.com" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Subject</label>
                        <input type="text" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal" placeholder="How can we help?" />
                      </div>
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Message</label>
                        <textarea rows="5" required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal resize-none" placeholder="Tell us more about your inquiry..."></textarea>
                      </div>
                      <button type="submit" className="w-full bg-brand-royal hover:bg-brand-navy text-white font-bold py-4 rounded-lg transition shadow-lg text-lg flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        <span>Send Message</span>
                      </button>
                    </form>
                  )}
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

export default ContactUs;