import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PaymentModal from '../components/PaymentModal';

function CallInterpreter() {
  const navigate = useNavigate();
  
  // Flow States: 'selection' | 'connecting'
  const [step, setStep] = useState('selection');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  // Call Details State
  const [selectedLanguage, setSelectedLanguage] = useState('Mandarin Chinese');
  const [duration, setDuration] = useState(15); // Minimum 15 mins for instant calls

  // Hidden Per-Minute Pricing Logic
  const rateMap = {
    'Mandarin Chinese': 0.50,
    'Igbo': 0.40,
    'English': 0.50,
    'Pidgin English': 0.40
  };

  const currentRate = rateMap[selectedLanguage] || 0.50;
  const totalCost = duration * currentRate;

  // Fetch User on Mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleProceedToPayment = () => {
    // If not logged in, redirect to login page
    if (!user) {
      navigate('/login', { state: { from: '/call-interpreter' } });
      return;
    }
    // If logged in, open the payment gateway
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = async () => {
    setIsPaymentOpen(false);
    setStep('connecting');
    
    // Save call record to Supabase so it appears in the Client Dashboard Call History
    if (user) {
      const { error } = await supabase.from('calls').insert([{
        user_id: user.id,
        interpreter_name: 'Instant Match Interpreter',
        language: selectedLanguage,
        category: 'Individual',
        duration_minutes: duration,
        cost: totalCost,
        status: 'Completed',
        created_at: new Date().toISOString()
      }]);
      
      if (error) {
        console.error("Error saving call record:", error);
      }
    }

    // Show connecting state briefly, then redirect to dashboard
    setTimeout(() => {
      navigate('/client-dashboard', { 
        state: { 
          message: `Successfully connected to ${selectedLanguage} interpreter for ${duration} minutes.`,
          activeTab: 'calls' // Automatically opens the Calls tab
        } 
      });
    }, 2000);
  };

  // --- CONNECTING STATE ---
  if (step === 'connecting') {
    return (
      // FIXED: Added pt-36 to push content down below the fixed Navbar
      <div className="min-h-screen bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan flex flex-col pt-36">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-2xl w-full text-center animate-fadeIn">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-royal/10 rounded-full mb-6 relative">
              <span className="w-4 h-4 bg-brand-royal rounded-full animate-ping absolute"></span>
              <span className="w-4 h-4 bg-brand-royal rounded-full relative"></span>
            </div>
            
            <h1 className="text-3xl font-bold text-brand-navy dark:text-white mb-2">Connecting Your Call...</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Matching you with the best available {selectedLanguage} interpreter.</p>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600 dark:text-gray-400">Language:</span>
                <span className="font-bold text-brand-navy dark:text-white">{selectedLanguage}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                <span className="font-bold text-brand-navy dark:text-white">{duration} minutes</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                <span className="text-gray-600 dark:text-gray-400">Total Paid:</span>
                <span className="font-bold text-2xl text-brand-royal">${totalCost.toFixed(2)}</span>
              </div>
            </div>

            <div className="animate-pulse">
              <p className="text-brand-royal font-medium">Please wait while we establish a secure connection...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- SELECTION & PAYMENT SCREEN ---
  return (
    // FIXED: Added pt-36 to push content down below the fixed Navbar
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col pt-36 transition-colors duration-300">
      <Navbar />
      
      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        amount={totalCost.toFixed(2)} 
        purpose={`Instant ${selectedLanguage} Interpretation (${duration} mins)`} 
        onSuccess={handlePaymentSuccess}
      />

      <main className="flex-grow">
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Instant Phone Interpretation</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Pay securely and connect to a certified native interpreter in under 60 seconds.
            </p>
          </div>
        </section>

        <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Selection State */}
            {step === 'selection' && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-brand-navy dark:text-white mb-8">Configure Your Instant Call</h2>
                
                <div className="space-y-8">
                  {/* Language Selection */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-bold mb-3">1. Select Language</label>
                    <select 
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-royal text-lg font-medium"
                    >
                      <option value="Mandarin Chinese">🇨🇳 Mandarin Chinese</option>
                      <option value="Igbo">🇳🇬 Igbo</option>
                      <option value="English">🇬🇧 English</option>
                      <option value="Pidgin English">🇳🇬 Pidgin English</option>
                    </select>
                  </div>

                  {/* Duration Selection */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-bold mb-3">2. Select Duration (Minimum 15 mins)</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[15, 30, 60].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setDuration(mins)}
                          className={`py-4 rounded-xl font-bold transition border-2 flex flex-col items-center ${
                            duration === mins 
                              ? 'bg-brand-navy text-white border-brand-navy dark:bg-brand-royal dark:border-brand-royal' 
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-brand-royal'
                          }`}
                        >
                          <span className="text-2xl">{mins}</span>
                          <span className="text-sm opacity-80">Minutes</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quote Summary */}
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                    <h3 className="font-bold text-brand-navy dark:text-white text-sm uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Your Quote</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Language:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{selectedLanguage}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Duration:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{duration} minutes</span>
                      </div>
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Rate:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">${currentRate.toFixed(2)} / min</span>
                      </div>
                      <div className="flex justify-between text-brand-navy dark:text-white font-bold text-2xl pt-3 border-t border-gray-200 dark:border-gray-700 mt-3">
                        <span>Total Due Now:</span>
                        <span>${totalCost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={handleProceedToPayment}
                    className="w-full bg-brand-royal hover:bg-brand-navy dark:bg-brand-cyan dark:hover:bg-brand-royal dark:text-brand-navy text-white font-bold py-4 rounded-xl transition shadow-lg text-lg flex items-center justify-center space-x-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <span>Pay & Connect Instantly</span>
                  </button>
                  
                  <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                    By clicking above, you agree to our Terms of Service. Unused minutes are non-refundable.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default CallInterpreter;