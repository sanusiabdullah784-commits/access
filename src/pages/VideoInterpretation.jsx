import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Calendar from '../components/Calendar';
import PaymentModal from '../components/PaymentModal';

function VideoBooking() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [duration, setDuration] = useState(60);
  const [isPremium, setIsPremium] = useState(false); 
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  // NEW: Core 4 Languages & Briefing States
  const [selectedLanguage, setSelectedLanguage] = useState('Mandarin Chinese');
  const [briefingContext, setBriefingContext] = useState('');
  const [secureRoomId, setSecureRoomId] = useState('');

  // --- NEW: DYNAMIC PER-MINUTE PRICING LOGIC (Hidden from public, used for Quote) ---
  const rateMap = {
    'Mandarin Chinese': 0.50,
    'Igbo': 0.40,
    'English': 0.50,
    'Pidgin English': 0.40
  };
  
  const currentRate = rateMap[selectedLanguage] || 0.50;
  const premiumMultiplier = isPremium ? 1.20 : 1.00;
  
  const subtotal = duration * currentRate;
  const premiumFee = isPremium ? subtotal * 0.20 : 0;
  const totalCost = subtotal + premiumFee;

  const bookedSlots = ['10:00', '14:00'];
  const allSlots = [];
  for (let i = 9; i <= 17; i++) {
    allSlots.push(`${i.toString().padStart(2, '0')}:00`);
    if (i !== 17) allSlots.push(`${i.toString().padStart(2, '0')}:30`);
  }

  // Matched Interpreter Profiles
  const interpreterProfiles = {
    'English': { name: 'Sarah Jenkins', rating: 4.9, sessions: 342, specialty: 'Business & Legal' },
    'Igbo': { name: 'Chidi Okafor', rating: 5.0, sessions: 128, specialty: 'Medical & Community' },
    'Mandarin Chinese': { name: 'Li Wei', rating: 4.9, sessions: 512, specialty: 'Corporate & Technical' },
    'Pidgin English': { name: 'Emeka Nwosu', rating: 4.8, sessions: 215, specialty: 'General & Community' }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        setUserEmail(user.email || '');
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      setIsPaymentOpen(true);
    } else {
      alert("Please select a date and time!");
    }
  };

  const handlePaymentSuccess = async () => {
    setIsPaymentOpen(false);
    
    // Supabase Integration - Save Booking to Database
    if (user && selectedDate && selectedTime) {
      const scheduledTime = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();
      const roomId = Math.random().toString(36).substring(2, 10).toUpperCase();
      setSecureRoomId(roomId);

      const { error } = await supabase.from('bookings').insert([{
        client_id: user.id,
        language: selectedLanguage,
        booking_type: 'Video Call',
        duration_minutes: duration,
        scheduled_time: scheduledTime,
        briefing_notes: briefingContext,
        is_premium: isPremium,
        status: 'scheduled',
        estimated_rate: totalCost
      }]);

      if (error) {
        console.error("Error saving booking:", error);
        alert("Payment succeeded, but there was an error saving your booking. Please contact support.");
      }
    } else {
      setSecureRoomId(Math.random().toString(36).substring(2, 10).toUpperCase());
    }

    setShowSuccess(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-brand-royal border-t-transparent rounded-full animate-spin"></div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- SUCCESS STATE ---
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-12 px-4">
          <div className="bg-white rounded-3xl shadow-xl p-10 max-w-2xl w-full text-center animate-fadeIn">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </div>
            <h1 className="text-3xl font-black text-brand-navy mb-2">Video Appointment Confirmed!</h1>
            <p className="text-gray-500 mb-8">Your secure meeting room has been generated.</p>

            {/* Proprietary Secure Room Link */}
            <div className="bg-brand-navy/5 border border-brand-royal/20 rounded-2xl p-6 text-left mb-8">
              <p className="text-xs text-brand-royal font-bold uppercase tracking-wider mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Your Secure Access Lingua Room
              </p>
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-brand-royal/20">
                <span className="text-brand-navy font-mono font-bold truncate">https://accesslingua.com/room/{secureRoomId}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(`https://accesslingua.com/room/${secureRoomId}`)}
                  className="ml-4 text-brand-royal hover:text-brand-navy font-bold text-sm whitespace-nowrap flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  Copy
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                <strong>Interpreter:</strong> {interpreterProfiles[selectedLanguage].name} &nbsp;|&nbsp; <strong>Language:</strong> {selectedLanguage}
              </p>
            </div>

            <button 
              onClick={() => window.location.href = '/'} 
              className="w-full bg-brand-royal hover:bg-brand-navy text-white font-bold py-3 rounded-full transition shadow-lg"
            >
              Return to Home
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- BOOKING FORM STATE ---
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        amount={totalCost.toFixed(2)} 
        purpose={`Video Interpretation Quote (${selectedLanguage})`} 
        onSuccess={handlePaymentSuccess} 
      />

      <main className="flex-grow">
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Schedule Video Interpretation</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Connect face-to-face with certified interpreters via our secure, proprietary HD video platform.
            </p>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
              <h2 className="text-2xl font-bold text-brand-navy mb-8">Book Your Video Session</h2>
              
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Left Column: Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal" 
                      placeholder="john@example.com" 
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-4">Select Date</label>
                    <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                  </div>

                  {selectedDate && (
                    <div>
                      <label className="block text-gray-700 font-medium mb-4">Select Time</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {allSlots.map((time) => {
                          const isBooked = bookedSlots.includes(time);
                          const isSelected = selectedTime === time;
                          return (
                            <button
                              key={time}
                              type="button"
                              disabled={isBooked}
                              onClick={() => setSelectedTime(time)}
                              className={`py-2 px-3 rounded-lg font-medium text-sm transition ${
                                isBooked ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through' : isSelected ? 'bg-brand-royal text-white shadow-md' : 'bg-white border border-gray-300 text-gray-700 hover:border-brand-royal hover:text-brand-royal'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Options & Quote Summary */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Language Needed</label>
                    <select 
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal bg-white"
                    >
                      <option>Mandarin Chinese</option>
                      <option>Igbo</option>
                      <option>English</option>
                      <option>Pidgin English</option>
                    </select>
                  </div>

                  {/* Matched Interpreter Preview Card */}
                  <div className="bg-gradient-to-br from-brand-navy to-brand-royal rounded-xl p-5 text-white shadow-lg transition-all duration-500">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold border-2 border-white/30 backdrop-blur-sm">
                        {interpreterProfiles[selectedLanguage].name.charAt(0)}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-base flex items-center">
                          Meet Your Matched Interpreter
                          <span className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        </h4>
                        <p className="text-blue-200 text-sm font-medium">{interpreterProfiles[selectedLanguage].name}</p>
                        <div className="flex items-center space-x-3 mt-1 text-xs">
                          <span className="flex items-center text-yellow-400 font-bold">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            {interpreterProfiles[selectedLanguage].rating}
                          </span>
                          <span className="text-blue-300">•</span>
                          <span className="text-blue-100">{interpreterProfiles[selectedLanguage].sessions}+ Sessions</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-4">Session Duration</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { val: 30, label: '30 Mins' },
                        { val: 60, label: '1 Hour' },
                        { val: 90, label: '1.5 Hours' }
                      ].map((option) => (
                        <button
                          key={option.val}
                          type="button"
                          onClick={() => setDuration(option.val)}
                          className={`py-3 rounded-lg font-bold transition border-2 ${
                            duration === option.val ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-gray-700 border-gray-300 hover:border-brand-royal'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Premium Toggle */}
                  <div className={`border-2 rounded-xl p-5 transition ${isPremium ? 'border-brand-royal bg-brand-royal/5' : 'border-gray-200 bg-white'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-800 flex items-center">
                        <svg className="w-5 h-5 text-brand-royal mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        Premium HD Recording & Transcripts
                      </h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={isPremium} onChange={() => setIsPremium(!isPremium)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-royal"></div>
                      </label>
                    </div>
                    <p className="text-sm text-gray-600">Includes secure proprietary video room, HD recording, and automated transcripts. <span className="font-bold text-brand-royal">(+20% Premium)</span></p>
                  </div>

                  {/* Pre-Call Smart Briefing */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Pre-Call Smart Briefing (Optional)</label>
                    <textarea
                      value={briefingContext}
                      onChange={(e) => setBriefingContext(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal bg-white resize-none transition"
                      rows="3"
                      placeholder="e.g., 'Discussing MRI results for John Doe' or 'Legal terms: Affidavit, Deposition'..."
                    ></textarea>
                  </div>

                  {/* NEW: PROFESSIONAL QUOTE BREAKDOWN */}
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                    <h4 className="font-bold text-brand-navy text-sm uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Your Quote</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>Language Pair:</span>
                        <span className="font-medium text-gray-800">{selectedLanguage} ↔ English</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Duration:</span>
                        <span className="font-medium text-gray-800">{duration} minutes</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Rate:</span>
                        <span className="font-medium text-gray-800">${currentRate.toFixed(2)} / min</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal:</span>
                        <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
                      </div>
                      {isPremium && (
                        <div className="flex justify-between text-brand-royal">
                          <span>Premium Fee (20%):</span>
                          <span className="font-medium">+${premiumFee.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-brand-navy font-bold text-xl pt-3 border-t border-gray-200 mt-3">
                        <span>Total Due:</span>
                        <span>${totalCost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleConfirm}
                    className="w-full bg-brand-royal hover:bg-brand-navy text-white font-bold py-4 rounded-lg transition shadow-lg text-lg"
                  >
                    Pay & Schedule Video Call
                  </button>
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

export default VideoBooking;