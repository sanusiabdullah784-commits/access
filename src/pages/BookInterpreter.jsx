import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Calendar from '../components/Calendar';
import PaymentModal from '../components/PaymentModal';

function BookInterpreter() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [duration, setDuration] = useState(60);
  const [isEmergency, setIsEmergency] = useState(false);
  
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const [timeLeft, setTimeLeft] = useState(0);

  const bookedSlots = ['09:00', '10:00', '14:00', '15:30'];
  const allSlots = [];
  for (let i = 9; i <= 17; i++) {
    allSlots.push(`${i.toString().padStart(2, '0')}:00`);
    if (i !== 17) allSlots.push(`${i.toString().padStart(2, '0')}:30`);
  }

  // Calculate total cost
  const baseRate = 1; // $1 per minute
  const emergencyFee = isEmergency ? 20 : 0;
  const totalCost = (duration * baseRate) + emergencyFee;

  useEffect(() => {
    if (!isSessionActive || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isSessionActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirmBooking = () => {
    if (selectedDate && selectedTime) {
      setIsPaymentOpen(true); // Open Payment Modal first!
    } else {
      alert("Please select a date and an available time slot!");
    }
  };

  const handlePaymentSuccess = () => {
    setIsPaymentOpen(false);
    setShowSuccessModal(true); // Show success modal after payment
  };

  const proceedToSession = () => {
    setShowSuccessModal(false);
    setTimeLeft(duration * 60);
    setIsSessionActive(true);
  };

  // --- LIVE SESSION SCREEN ---
  if (isSessionActive) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 relative">
              <span className="w-4 h-4 bg-green-500 rounded-full animate-ping absolute"></span>
              <span className="w-4 h-4 bg-green-500 rounded-full relative"></span>
            </div>
            <h1 className="text-3xl font-bold text-brand-navy mb-2">Session in Progress</h1>
            <p className="text-gray-500 mb-8">Your interpreter has joined the call.</p>
            
            <div className="bg-brand-navy text-white rounded-2xl p-8 mb-8">
              <p className="text-blue-200 text-sm uppercase tracking-wider mb-2">Time Remaining</p>
              <div className="text-6xl font-black text-brand-cyan tracking-widest">
                {formatTime(timeLeft)}
              </div>
              <p className="mt-4 text-blue-100">
                Scheduled for {selectedTime} on the {selectedDate}th ({duration} mins)
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <button className="bg-brand-royal hover:bg-brand-navy text-white px-8 py-3 rounded-full font-bold transition shadow-lg">
                Join Video Call
              </button>
              <button 
                onClick={() => setIsSessionActive(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold transition shadow-lg"
              >
                End Session
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- BOOKING FORM SCREEN ---
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      {/* Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        amount={totalCost.toFixed(2)} 
        purpose="Interpreter Appointment" 
        onSuccess={handlePaymentSuccess} // We need to pass this prop to PaymentModal!
      />

      {/* SUCCESS MODAL (Email & Reminders) */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center relative">
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            
            <h2 className="text-2xl font-bold text-brand-navy mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 mb-6">Your interpreter is scheduled and ready.</p>

            <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-brand-royal flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <div>
                  <h4 className="font-bold text-gray-800">Confirmation Email Sent</h4>
                  <p className="text-sm text-gray-600">A detailed receipt has been sent to <span className="font-medium text-brand-navy">{userEmail || 'your email'}</span>.</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 my-2"></div>

              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-brand-cyan flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <div>
                  <h4 className="font-bold text-gray-800">Reminders Scheduled</h4>
                  <p className="text-sm text-gray-600">You will receive a reminder 24 hours before, and a final push notification 1 hour before your session.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={proceedToSession}
              className="w-full bg-brand-royal hover:bg-brand-navy text-white font-bold py-3 rounded-full transition shadow-lg text-lg"
            >
              Proceed to Live Session
            </button>
          </div>
        </div>
      )}

      <main className="flex-grow">
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Book an Interpreter</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Schedule a professional interpreter for your next meeting, event, or call.
            </p>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-3">
                
                <div className="bg-brand-navy text-white p-10 md:col-span-1">
                  <h3 className="text-2xl font-bold mb-6">Booking Details</h3>
                  <ul className="space-y-6">
                    <li className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-brand-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span className="text-blue-100">Certified native speakers</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-brand-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span className="text-blue-100">Available 24/7 worldwide</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-brand-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span className="text-blue-100">Secure and confidential</span>
                    </li>
                  </ul>
                </div>

                <div className="p-10 md:col-span-2">
                  <h2 className="text-2xl font-bold text-brand-navy mb-6">Fill in your details</h2>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                        <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal" placeholder="John Doe" />
                      </div>
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
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-4">Select Your Date</label>
                      <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                    </div>

                    {selectedDate && (
                      <div>
                        <label className="block text-gray-700 font-medium mb-4">
                          Available Times for {selectedDate}th 
                          <span className="text-sm text-gray-500 ml-2">(Booked slots are automatically blocked)</span>
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
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
                                  isBooked 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through' 
                                    : isSelected 
                                      ? 'bg-brand-royal text-white shadow-md' 
                                      : 'bg-white border border-gray-300 text-gray-700 hover:border-brand-royal hover:text-brand-royal'
                                }`}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

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
                              duration === option.val 
                                ? 'bg-brand-navy text-white border-brand-navy' 
                                : 'bg-white text-gray-700 border-gray-300 hover:border-brand-royal'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* EMERGENCY BOOKING TOGGLE */}
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-red-700">Urgent / Emergency Booking</h4>
                        <p className="text-sm text-red-600">Need an interpreter in less than 1 hour? (+ $20.00 fee)</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={isEmergency} onChange={() => setIsEmergency(!isEmergency)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                      </label>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Language Needed</label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal bg-white">
                          <option>Spanish</option>
                          <option>French</option>
                          <option>Mandarin Chinese</option>
                          <option>Arabic</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Interpretation Type</label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal bg-white">
                          <option>Video Call</option>
                          <option>Phone Call</option>
                          <option>In-Person</option>
                        </select>
                      </div>
                    </div>

                    {/* Total Cost Display */}
                    <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center border border-gray-200">
                      <span className="text-gray-600 font-medium">Estimated Total:</span>
                      <span className="text-2xl font-black text-brand-navy">${totalCost.toFixed(2)}</span>
                    </div>

                    <button 
                      type="button" 
                      onClick={handleConfirmBooking}
                      className="w-full bg-brand-royal hover:bg-brand-navy text-white font-bold py-4 rounded-lg transition shadow-lg text-lg"
                    >
                      Proceed to Secure Checkout
                    </button>
                  </form>
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

export default BookInterpreter;