import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useTheme } from '../context/ThemeContext'; // <-- ADDED: Import Theme Context
import logo from '../assets/logo.png'; 

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const location = useLocation();
  const { theme, toggleTheme } = useTheme(); // <-- ADDED: Get theme state and toggle function

  // 1. Scroll Glassmorphism & Shrink
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Auth User Check
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 3. Helper for Active Route Highlighting (Updated with dark mode colors)
  const isActive = (path) => location.pathname === path;
  const activeClass = "text-brand-royal dark:text-brand-cyan font-bold border-b-2 border-brand-royal dark:border-brand-cyan";
  const inactiveClass = "text-gray-700 dark:text-gray-300 hover:text-brand-royal dark:hover:text-brand-cyan font-medium transition border-b-2 border-transparent";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsProfileOpen(false);
    window.location.href = '/';
  };

  // Reusable Theme Toggle Button
  const ThemeToggle = () => (
    <button 
      onClick={toggleTheme} 
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'light' ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      )}
    </button>
  );

  return (
    // UPDATED: Added dark mode background and shadow colors
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'h-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm dark:shadow-gray-800/50' 
        : 'h-36 bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          
          {/* Logo with responsive sizing */}
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="Access Lingua Logo" 
              className={`w-auto transition-all duration-300 ${isScrolled ? 'h-12' : 'h-20'}`} 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className={`${isActive('/') ? activeClass : inactiveClass} py-1`}>Home</Link>
            <Link to="/about" className={`${isActive('/about') ? activeClass : inactiveClass} py-1`}>About</Link>
            <Link to="/services" className={`${isActive('/services') ? activeClass : inactiveClass} py-1`}>Services</Link>
            <Link to="/contact" className={`${isActive('/contact') ? activeClass : inactiveClass} py-1`}>Contact</Link>
            
            {/* 4. Rich Mega Menu */}
            <div className="relative group">
              <button className={`${isActive('/plans') || isActive('/video-booking') || isActive('/client-dashboard') ? activeClass : inactiveClass} py-1 flex items-center space-x-1`}>
                <span>More</span>
                <svg className={`w-4 h-4 transition-transform group-hover:rotate-180`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              
              {/* UPDATED: Dark mode styling for Mega Menu Dropdown */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[500px] bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                <div className="grid grid-cols-2 gap-6">
                  {/* Column 1: Platform */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Platform</h4>
                    <ul className="space-y-1">
                      <li><Link to="/client-dashboard" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-brand-royal dark:hover:text-brand-cyan transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg><span>My Account</span></Link></li>
                      <li><Link to="/interpreter-dashboard" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-brand-royal dark:hover:text-brand-cyan transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg><span>Interpreter Portal</span></Link></li>
                      <li><Link to="/corporate-dashboard" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-brand-royal dark:hover:text-brand-cyan transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg><span>Corporate Dashboard</span></Link></li>
                      <li><Link to="/wallet" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-brand-royal dark:hover:text-brand-cyan transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg><span>Wallet</span></Link></li>
                    </ul>
                  </div>
                  {/* Column 2: Resources */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Resources</h4>
                    <ul className="space-y-1">
                      <li><Link to="/plans" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-brand-royal dark:hover:text-brand-cyan transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span>Plans & Pricing</span></Link></li>
                      <li><Link to="/video-booking" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-brand-royal dark:hover:text-brand-cyan transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg><span>Video Booking</span></Link></li>
                      <li><Link to="/languages" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-brand-royal dark:hover:text-brand-cyan transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg><span>Languages</span></Link></li>
                      <li><Link to="/blog" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-brand-royal dark:hover:text-brand-cyan transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg><span>Blog & News</span></Link></li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4">
                   <Link to="/reviews" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-brand-royal dark:hover:text-brand-cyan transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg><span>Reviews</span></Link>
                   <Link to="/faq" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-brand-royal dark:hover:text-brand-cyan transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span>FAQ</span></Link>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Primary Actions / Auth Profile & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            {/* NEW: Theme Toggle Button */}
            <ThemeToggle />

            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-full transition border border-gray-200 dark:border-gray-700"
                >
                  <div className="w-8 h-8 bg-brand-royal rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300 text-sm max-w-[120px] truncate">{user.email}</span>
                  <svg className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 shadow-2xl rounded-xl py-2 border border-gray-100 dark:border-gray-700 z-50">
                    <Link to="/client-dashboard" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-brand-royal dark:hover:text-brand-cyan font-medium">My Dashboard</Link>
                    <Link to="/wallet" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-brand-royal dark:hover:text-brand-cyan font-medium">Wallet</Link>
                    <Link to="/interpreter-dashboard" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-brand-royal dark:hover:text-brand-cyan font-medium">Interpreter Portal</Link>
                    <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium">Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/call-interpreter" className="flex items-center space-x-2 text-brand-navy dark:text-white hover:text-brand-royal dark:hover:text-brand-cyan font-bold transition border-2 border-brand-navy dark:border-white px-5 py-2.5 rounded-full hover:bg-brand-navy/5 dark:hover:bg-white/10">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <span>Phone Instantly</span>
                </Link>
                <Link to="/book" className="bg-brand-royal hover:bg-brand-navy text-white px-6 py-3 rounded-full font-bold transition shadow-lg flex items-center space-x-2">
                  <span>Book Appointment</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />
            <button onClick={() => setIsOpen(!isOpen)} className="text-brand-navy dark:text-white focus:outline-none p-2">
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

        {/* 5. Organized Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-xl max-h-[80vh] overflow-y-auto z-40">
            <div className="p-6 space-y-6">
              
              {/* Mobile Primary Actions */}
              <div className="space-y-3 pb-6 border-b border-gray-200 dark:border-gray-700">
                <Link to="/call-interpreter" onClick={() => setIsOpen(false)} className="block w-full text-center border-2 border-brand-navy dark:border-white text-brand-navy dark:text-white font-bold py-3 rounded-full flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <span>Phone Instantly</span>
                </Link>
                <Link to="/book" onClick={() => setIsOpen(false)} className="block w-full text-center bg-brand-royal text-white font-bold py-3 rounded-full shadow-md">
                  Book an Appointment
                </Link>
              </div>

              {/* Mobile Navigation Groups */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Company</h4>
                <div className="space-y-1">
                  <Link to="/" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-lg ${isActive('/') ? 'bg-brand-royal/10 dark:bg-brand-royal/20 text-brand-royal dark:text-brand-cyan font-bold' : 'text-gray-700 dark:text-gray-300'}`}>Home</Link>
                  <Link to="/about" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-lg ${isActive('/about') ? 'bg-brand-royal/10 dark:bg-brand-royal/20 text-brand-royal dark:text-brand-cyan font-bold' : 'text-gray-700 dark:text-gray-300'}`}>About Us</Link>
                  <Link to="/contact" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-lg ${isActive('/contact') ? 'bg-brand-royal/10 dark:bg-brand-royal/20 text-brand-royal dark:text-brand-cyan font-bold' : 'text-gray-700 dark:text-gray-300'}`}>Contact</Link>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Platform</h4>
                <div className="space-y-1">
                  <Link to="/client-dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300">My Account</Link>
                  <Link to="/interpreter-dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300">Interpreter Portal</Link>
                  <Link to="/corporate-dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300">Corporate Dashboard</Link>
                  <Link to="/wallet" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300">Wallet</Link>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Resources</h4>
                <div className="space-y-1">
                  <Link to="/services" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300">Services</Link>
                  <Link to="/plans" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300">Plans & Pricing</Link>
                  <Link to="/video-booking" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300">Video Booking</Link>
                  <Link to="/languages" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300">Languages</Link>
                  <Link to="/blog" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300">Blog</Link>
                  <Link to="/careers" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300">Careers</Link>
                  <Link to="/reviews" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300">Reviews</Link>
                  <Link to="/faq" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300">FAQ</Link>
                </div>
              </div>

              {user && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={handleLogout} className="w-full text-center text-red-600 font-bold py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                    Sign Out ({user.email})
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;