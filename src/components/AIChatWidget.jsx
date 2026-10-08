import { useState, useRef, useEffect } from 'react';

function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial AI greeting
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! 👋 I'm Access Lingua AI. How can I help you with interpretation services today?", sender: 'ai' }
  ]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Mock AI Logic (Simulates a smart backend)
  const getAIResponse = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('plan')) {
      return "Our plans start at just $29/month for the Starter plan, and $79/month for Professional. You can view our full pricing on the Plans page!";
    } else if (lowerText.includes('book') || lowerText.includes('appointment') || lowerText.includes('schedule')) {
      return "You can easily book an interpreter by clicking the 'Book an Appointment' button in the top navigation, or I can take you there directly!";
    } else if (lowerText.includes('language') || lowerText.includes('spanish') || lowerText.includes('mandarin')) {
      return "We specialize in 4 core languages: English, Igbo, Mandarin Chinese, and Pidgin English. We also support over 150+ extended languages on demand!";
    } else if (lowerText.includes('video') || lowerText.includes('vri')) {
      return "Our Video Remote Interpretation (VRI) provides secure, HD, face-to-face interpretation. It's fully HIPAA compliant and perfect for telehealth!";
    } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
      return "Hi there! Are you looking to book an interpreter, or do you have questions about our services?";
    } else {
      return "That's a great question! For specific inquiries, our human support team is available 24/7. Would you like me to connect you via WhatsApp?";
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const aiResponse = { id: Date.now() + 1, text: getAIResponse(userMessage.text), sender: 'ai' };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Action Button (Bottom Left) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 left-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600 rotate-90' 
            : 'bg-brand-royal hover:bg-brand-navy dark:bg-brand-cyan dark:hover:bg-brand-royal dark:text-brand-navy text-white'
        }`}
        aria-label="Toggle AI Chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-[calc(100%-3rem)] sm:w-96 h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="bg-brand-navy dark:bg-gray-900 text-white p-4 flex items-center space-x-3">
            <div className="w-10 h-10 bg-brand-cyan/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h3 className="font-bold text-sm">Access Lingua AI</h3>
              <p className="text-xs text-green-400 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                Online now
              </p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-brand-royal text-white rounded-br-none' 
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-600'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 dark:border-gray-600 flex space-x-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question..."
              className="flex-grow px-4 py-2.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-royal text-sm"
            />
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-brand-royal hover:bg-brand-navy dark:bg-brand-cyan dark:hover:bg-brand-royal dark:text-brand-navy text-white p-2.5 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default AIChatWidget;