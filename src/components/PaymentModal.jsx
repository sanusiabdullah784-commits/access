import { useState } from 'react';

function PaymentModal({ isOpen, onClose, amount, purpose, onSuccess }) {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate API call to Flutterwave/Paystack/PayPal
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      // Trigger the success callback if it exists
      if (onSuccess) {
        onSuccess();
      }
    }, 2500);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsProcessing(false);
    setSelectedMethod('card');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* SUCCESS STATE */}
        {isSuccess ? (
          <div className="p-10 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-brand-navy mb-2">Payment Successful!</h2>
            <p className="text-gray-500 mb-6">Your {purpose.toLowerCase()} has been processed securely.</p>
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <p className="text-sm text-gray-500">Amount Paid</p>
              <p className="text-2xl font-bold text-brand-navy">${amount}</p>
            </div>
            <button 
              onClick={handleClose}
              className="w-full bg-brand-royal hover:bg-brand-navy text-white font-bold py-3 rounded-full transition shadow-lg"
            >
              Done
            </button>
          </div>
        ) : (
          /* PAYMENT FORM STATE */
          <div className="p-8">
            <h2 className="text-2xl font-bold text-brand-navy mb-1">Secure Checkout</h2>
            <p className="text-gray-500 text-sm mb-6">Paying for: <span className="font-bold text-brand-royal">{purpose}</span></p>

            {/* Amount Display */}
            <div className="bg-brand-navy text-white p-4 rounded-xl mb-6 flex justify-between items-center">
              <span className="text-blue-100">Total Amount</span>
              <span className="text-2xl font-black">${amount}</span>
            </div>

            {/* Payment Methods */}
            <p className="text-sm font-bold text-gray-700 mb-3">Select Payment Method</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button 
                onClick={() => setSelectedMethod('flutterwave')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center transition ${selectedMethod === 'flutterwave' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <span className="font-black text-orange-500 text-sm">Flutterwave</span>
              </button>
              <button 
                onClick={() => setSelectedMethod('paystack')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center transition ${selectedMethod === 'paystack' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <span className="font-black text-green-600 text-sm">Paystack</span>
              </button>
              <button 
                onClick={() => setSelectedMethod('paypal')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center transition ${selectedMethod === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <span className="font-black text-blue-600 text-sm">PayPal</span>
              </button>
            </div>

            {/* Mock Card Details Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Number</label>
                <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry</label>
                  <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVV</label>
                  <input type="text" placeholder="123" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal" />
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-brand-royal hover:bg-brand-navy disabled:bg-gray-400 text-white font-bold py-4 rounded-full transition shadow-lg flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                `Pay $${amount} Securely`
              )}
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              256-bit SSL Encrypted & Secure
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentModal;