import { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';

function PaymentModal({ isOpen, onClose, amount, purpose, onSuccess, userEmail }) {
  const [selectedMethod, setSelectedMethod] = useState('paystack');
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionRef, setTransactionRef] = useState(null);

  if (!isOpen) return null;

  // Safeguard: Ensure amount is always a valid number
  const displayAmount = amount ? Number(amount).toFixed(2) : '0.00';
  const displayPurpose = purpose || 'Interpretation Service';

  // Paystack expects amount in the smallest currency unit (e.g., kobo for NGN, cents for USD)
  const amountInSmallestUnit = Math.round(Number(amount) * 100);

  // Paystack Configuration
  const config = {
    reference: `TXN-${new Date().getTime()}`,
    email: userEmail || 'customer@example.com',
    amount: amountInSmallestUnit,
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY, 
    currency: 'NGN', // Change to 'USD' if your primary wallet currency is USD
    metadata: {
      custom_fields: [
        { display_name: "Purpose", variable_name: "purpose", value: displayPurpose },
        { display_name: "Customer Email", variable_name: "email", value: userEmail }
      ]
    }
  };

  // Initialize Paystack Hook
  const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    // 1. Handle Bank Transfer (Instant Confirmation as requested)
    if (selectedMethod === 'bank_transfer') {
      const mockRef = `BANK-${new Date().getTime()}`;
      setTransactionRef({ reference: mockRef });
      setIsSuccess(true);
      if (onSuccess) {
        // Instantly trigger the parent component to start "PHONING AN INTERPRETER"
        onSuccess({ reference: mockRef, status: 'success', method: 'bank_transfer' });
      }
      return;
    }

    // 2. Handle Paystack
    if (selectedMethod === 'paystack') {
      const onSuccessHandler = (reference) => {
        setTransactionRef(reference);
        setIsSuccess(true);
        if (onSuccess) {
          onSuccess(reference);
        }
      };

      const onCloseHandler = () => {
        console.log('Payment modal closed by user');
      };

      initializePayment(onSuccessHandler, onCloseHandler);
      return;
    }

    // 3. Handle other methods
    alert(`${selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)} integration is coming soon! Please use Paystack or Bank Transfer for now.`);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setTransactionRef(null);
    setSelectedMethod('paystack');
    onClose();
  };

  // Function to download a professional text receipt
  const handleDownloadReceipt = () => {
    const methodText = selectedMethod === 'bank_transfer' ? 'Bank Transfer' : 'Card Payment (Paystack)';
    const receiptContent = `
========================================
         ACCESS LINGUA LTD.
         PAYMENT RECEIPT
========================================
Date: ${new Date().toLocaleString()}
Reference: ${transactionRef?.reference || 'N/A'}
----------------------------------------
Purpose: ${displayPurpose}
Amount Paid: $${displayAmount}
Payment Method: ${methodText}
Customer Email: ${userEmail || 'N/A'}
----------------------------------------
Status: SUCCESSFUL
========================================
Thank you for choosing Access Lingua!
For support: support@accesslingua.com
========================================
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AccessLingua-Receipt-${transactionRef?.reference || 'TXN'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative border border-gray-100 dark:border-gray-700">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10 transition p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* SUCCESS STATE */}
        {isSuccess ? (
          <div className="p-10 text-center animate-fadeIn">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-brand-navy dark:text-white mb-2">Payment Confirmed!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Connecting you to your interpreter now...</p>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl mb-6 border border-gray-100 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Amount Paid</p>
              <p className="text-3xl font-black text-brand-navy dark:text-white">${displayAmount}</p>
              <p className="text-xs text-gray-400 mt-2 font-mono">Ref: {transactionRef?.reference}</p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleDownloadReceipt}
                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-3 rounded-xl transition flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download Receipt</span>
              </button>
            </div>
          </div>
        ) : (
          /* PAYMENT SUMMARY STATE */
          <div className="p-8">
            <div className="flex items-center space-x-2 mb-1">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h2 className="text-xl font-bold text-brand-navy dark:text-white">Secure Checkout</h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 ml-7">
              Paying for: <span className="font-bold text-brand-royal">{displayPurpose}</span>
            </p>

            {/* Amount Display */}
            <div className="bg-brand-navy dark:bg-gray-900 text-white p-5 rounded-xl mb-6 flex justify-between items-center shadow-inner">
              <div>
                <span className="text-blue-200 text-xs uppercase tracking-wider font-semibold block mb-1">Total Amount</span>
                <span className="text-xs text-blue-300">Including all fees</span>
              </div>
              <span className="text-3xl font-black">${displayAmount}</span>
            </div>

            {/* Payment Methods */}
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Select Payment Method</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button 
                onClick={() => setSelectedMethod('paystack')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition relative ${
                  selectedMethod === 'paystack' 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                {selectedMethod === 'paystack' && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"></div>
                )}
                <span className="font-black text-green-600 dark:text-green-400 text-sm">Card Payment</span>
                <span className="text-[10px] text-gray-500 mt-1">via Paystack</span>
              </button>
              
              <button 
                onClick={() => setSelectedMethod('bank_transfer')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition relative ${
                  selectedMethod === 'bank_transfer' 
                    ? 'border-brand-royal bg-brand-royal/5 dark:bg-brand-royal/20 shadow-sm' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                {selectedMethod === 'bank_transfer' && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-brand-royal rounded-full"></div>
                )}
                <span className="font-black text-brand-navy dark:text-white text-sm">Bank Transfer</span>
                <span className="text-[10px] text-gray-500 mt-1">Instant Confirm</span>
              </button>
            </div>

            {/* BANK TRANSFER DETAILS (OPay/Jumia Style) */}
            {selectedMethod === 'bank_transfer' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-6 animate-fadeIn">
                <h3 className="font-bold text-brand-navy dark:text-white mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-brand-royal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  Transfer Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Bank Name:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">Access Bank</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Account Number:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-brand-royal text-lg">0123456789</span>
                      <button 
                        onClick={() => navigator.clipboard.writeText('0123456789')}
                        className="text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Account Name:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">Access Lingua Ltd</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Once you have made the transfer, click the button below to instantly confirm and connect to your interpreter.
                  </p>
                  <button 
                    onClick={handlePayment}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>I Have Made The Transfer</span>
                  </button>
                </div>
              </div>
            )}

            {/* Paystack Button */}
            {selectedMethod === 'paystack' && (
              <button 
                onClick={handlePayment}
                className="w-full bg-brand-royal hover:bg-brand-navy text-white font-bold py-4 rounded-xl transition shadow-lg flex items-center justify-center space-x-2 transform active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Pay ${displayAmount} Securely</span>
              </button>
            )}
            
            {/* Security Badges */}
            <div className="mt-6 flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>256-bit SSL Encrypted</span>
              </div>
              {userEmail && (
                <p className="text-[10px] text-gray-400 mt-2">
                  Receipt will be sent to: <span className="font-medium text-gray-600 dark:text-gray-300">{userEmail}</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentModal;