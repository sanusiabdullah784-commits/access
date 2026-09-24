import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Calendar from '../components/Calendar';
import PaymentModal from '../components/PaymentModal';

function VideoBooking() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [duration, setDuration] = useState(60);
  const [isPremium, setIsPremium] = useState(false); // 20% Premium Toggle
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Pricing Logic: Base rate $2/min. Premium adds 20%.
  const baseRate = 2; 
  const premiumMultiplier = isPremium ? 1.20 : 1.00;
  const totalCost = (duration * baseRate) * premiumMultiplier;

  const bookedSlots = ['10:00', '14:00'];
  const allSlots = [];
  for (let i = 9; i <= 17; i++) {
    allSlots.push(`${i.toString().padStart(2, '0')}:00`);
    if (i !== 17) allSlots.push(`${i.toString().padStart(2, '0')}:30`);
  }

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      setIsPaymentOpen(true);
    } else {
      alert("Please select a date and time!");
    }
  };

  const handlePaymentSuccess = () => {
    setIsPaymentOpen(false);
    setShowSuccess(true);
  };

  // --- SUCCESS STATE ---
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-12 px-4">
          <div className="bg-white rounded-3xl shadow-xl p-10 max-w-2xl w-full text-center animate-fadeIn">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </div>
            <h1 className="text-3xl font-black text-brand-navy mb-2">Video Appointment Confirmed!</h1>
            <p className="text-gray-500 mb-8">Your secure meeting link has been generated.</p>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-left mb-8">
              <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-2">Your Zoom Meeting Link</p>
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-blue-100">
                <span className="text-brand-navy font-mono font-bold truncate">https://zoom.us/j/987-654-3210</span>
                <button className="ml-4 text-blue-600 hover:text-blue-800 font-bold text-sm whitespace-nowrap">Copy</button>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                <strong>Meeting ID:</strong> 987 654 3210 &nbsp;|&nbsp; <strong>Passcode:</strong> Lingua26
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-brand-royal flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <div>
                  <h4 className="font-bold text-gray-800">Confirmation & Reminders Sent</h4>
                  <p className="text-sm text-gray-600">A calendar invite and receipt were sent to <span className="font-medium text-brand-navy">{userEmail || 'your email'}</span>. You will receive reminders 24 hours and 1 hour before the call.</p>
                </div>
              </div>
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
        purpose="Video Interpretation Appointment" 
        onSuccess={handlePaymentSuccess} 
      />

      <main className="flex-grow">
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-brand-navy text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Schedule Video Interpretation</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Connect face-to-face with certified interpreters via secure HD video.
            </p>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
              <h2 className="text-2xl font-bold text-brand-navy mb-8">Book Your Video Session</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column: Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
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
                      <div className="grid grid-cols-3 gap-3">
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
                                isBooked ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through' : isSelected ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-500'
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

                {/* Right Column: Options & Summary */}
                <div className="space-y-6">
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
                            duration === option.val ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 20% PREMIUM TOGGLE */}
                  <div className={`border-2 rounded-xl p-5 transition ${isPremium ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-800 flex items-center">
                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        Premium Zoom & Recording
                      </h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={isPremium} onChange={() => setIsPremium(!isPremium)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <p className="text-sm text-gray-600">Includes dedicated Zoom link, HD recording, and automated transcripts. <span className="font-bold text-blue-600">(+20% Premium)</span></p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Language Needed</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option>Spanish</option>
                      <option>French</option>
                      <option>Mandarin Chinese</option>
                      <option>Arabic</option>
                      <option>Other</option>
                    </select>
                  </div>

                  {/* Cost Summary */}
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Base Rate ({duration} mins)</span>
                      <span className="font-bold">${(duration * baseRate).toFixed(2)}</span>
                    </div>
                    {isPremium && (
                      <div className="flex justify-between mb-2 text-blue-600">
                        <span className="font-medium">Premium Fee (20%)</span>
                        <span className="font-bold">+${((duration * baseRate) * 0.20).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-300 my-3"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Total Due</span>
                      <span className="text-3xl font-black text-brand-navy">${totalCost.toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleConfirm}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition shadow-lg text-lg"
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