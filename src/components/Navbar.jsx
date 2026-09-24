import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; 

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-36">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Access Lingua Logo" className="h-32 w-auto" />
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-700 hover:text-brand-royal font-medium transition">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-brand-royal font-medium transition">About</Link>
            <Link to="/services" className="text-gray-700 hover:text-brand-royal font-medium transition">Services</Link>
            <Link to="/contact" className="text-gray-700 hover:text-brand-royal font-medium transition">Contact</Link>
            
            {/* More Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsMoreOpen(!isMoreOpen)} 
                className="text-gray-700 hover:text-brand-royal font-medium transition flex items-center space-x-1"
              >
                <span>More</span>
                <svg className={`w-4 h-4 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              
              {isMoreOpen && (
                <div className="absolute top-full mt-4 w-48 bg-white shadow-2xl rounded-xl py-2 border border-gray-100">
                  <Link to="/plans" onClick={() => setIsMoreOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-brand-royal">Plans</Link>
                  <Link to="/video-booking" onClick={() => setIsMoreOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-brand-royal">Video Booking</Link>
                  <Link to="/client-dashboard" onClick={() => setIsMoreOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-brand-royal">My Account</Link>
                  <Link to="/interpreter-dashboard" onClick={() => setIsMoreOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-brand-royal">Interpreter Portal</Link>
                  <Link to="/corporate-dashboard" onClick={() => setIsMoreOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-brand-royal">Corporate Dashboard</Link>
                  <Link to="/wallet" onClick={() => setIsMoreOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-brand-royal">Wallet</Link>
                  <Link to="/reviews" onClick={() => setIsMoreOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-brand-royal">Reviews</Link>
                  <Link to="/faq" onClick={() => setIsMoreOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-brand-royal">FAQ</Link>
                  <Link to="/languages" onClick={() => setIsMoreOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-brand-royal">Languages</Link>
                  <Link to="/careers" onClick={() => setIsMoreOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-brand-royal">Careers</Link>
                  <Link to="/blog" onClick={() => setIsMoreOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-brand-royal">Blog</Link>
                </div>
              )}
            </div>
          </div>

          {/* DESKTOP CALL BUTTON SECTION */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/call-interpreter" className="flex items-center space-x-2 text-brand-royal hover:text-brand-navy font-bold transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <span>Call Interpreter</span>
            </Link>
            
            <Link to="/book" className="bg-brand-royal hover:bg-brand-navy text-white px-6 py-3 rounded-full font-semibold transition shadow-lg">
              Get Started
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-brand-navy focus:outline-none">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-6 space-y-3">
            <Link to="/" className="block text-gray-700 hover:text-brand-royal font-medium py-2">Home</Link>
            <Link to="/about" className="block text-gray-700 hover:text-brand-royal font-medium py-2">About</Link>
            <Link to="/services" className="block text-gray-700 hover:text-brand-royal font-medium py-2">Services</Link>
            <Link to="/contact" className="block text-gray-700 hover:text-brand-royal font-medium py-2">Contact</Link>
            
            {/* MOBILE CALL BUTTON */}
            <Link to="/call-interpreter" className="block text-brand-royal font-bold py-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Call Interpreter
            </Link>
            
            <Link to="/plans" className="block text-gray-700 hover:text-brand-royal font-medium py-2">Plans</Link>
            <Link to="/video-booking" className="block text-gray-700 hover:text-brand-royal font-medium py-2">Video Booking</Link>
            <Link to="/client-dashboard" className="block text-gray-700 hover:text-brand-royal font-medium py-2">My Account</Link>
            <Link to="/interpreter-dashboard" className="block text-gray-700 hover:text-brand-royal font-medium py-2">Interpreter Portal</Link>
            <Link to="/corporate-dashboard" className="block text-gray-700 hover:text-brand-royal font-medium py-2">Corporate Dashboard</Link>
            <Link to="/wallet" className="block text-gray-700 hover:text-brand-royal font-medium py-2">Wallet</Link>
            <Link to="/reviews" className="block text-gray-700 hover:text-brand-royal font-medium py-2">Reviews</Link>
            <Link to="/faq" className="block text-gray-700 hover:text-brand-royal font-medium py-2">FAQ</Link>
            <Link to="/languages" className="block text-gray-700 hover:text-brand-royal font-medium py-2">Languages</Link>
            <Link to="/careers" className="block text-gray-700 hover:text-brand-royal font-medium py-2">Careers</Link>
            <Link to="/blog" className="block text-gray-700 hover:text-brand-royal font-medium py-2">Blog</Link>
            <Link to="/book" className="block bg-brand-royal text-white text-center px-6 py-3 rounded-full font-semibold mt-2">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;