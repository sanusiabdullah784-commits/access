import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function CorporatePortal() {
  return (
    // FIXED: Added pt-36 to push content down below the fixed Navbar
    <div className="min-h-screen bg-white flex flex-col pt-36">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 md:py-20 bg-gray-50">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
            
            {/* Left Side: Info & Branding */}
            <div className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan p-12 text-white flex flex-col justify-between hidden md:flex">
              <div>
                <h2 className="text-3xl font-bold mb-4">Access Lingua Enterprise</h2>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Welcome to the Corporate Portal. Manage your team's interpretation credits, view real-time analytics, and schedule global interpreters in one secure, compliant place.
                </p>
              </div>
              
              <div className="space-y-6 mt-12">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Bank-Grade Security</h4>
                    <p className="text-blue-200 text-sm">SOC 2 Type II & HIPAA Compliant</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Team Management</h4>
                    <p className="text-blue-200 text-sm">Add users, set department limits, and control permissions easily</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="md:hidden mb-8 text-center">
                <h2 className="text-2xl font-bold text-brand-navy">Corporate Portal Login</h2>
              </div>
              <h3 className="text-2xl font-bold text-brand-navy mb-2 hidden md:block">Sign In to Your Account</h3>
              <p className="text-gray-500 mb-8 hidden md:block">Enter your corporate credentials to continue.</p>

              <form className="space-y-5">
                {/* Company Code Field for Domain Validation/Gating */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Company Code</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <input 
                      type="text" 
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal uppercase tracking-wider" 
                      placeholder="e.g., GT-8842-X" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Work Email</label>
                  <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal" placeholder="name@company.com" />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Password</label>
                  <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal" placeholder="••••••••" />
                  
                  {/* Trust Micro-Badges */}
                  <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      <span>256-bit Encrypted</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      <span>HIPAA Compliant</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-brand-royal rounded border-gray-300 focus:ring-brand-royal" />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-brand-royal hover:underline font-medium">Forgot password?</a>
                </div>

                <button type="button" className="w-full bg-brand-royal hover:bg-brand-navy text-white font-bold py-3 rounded-lg transition shadow-lg text-lg">
                  Sign In
                </button>

                {/* Expanded Enterprise SSO Options */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Or continue with Enterprise SSO</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Microsoft Entra ID / Azure AD */}
                  <button type="button" className="flex flex-col items-center justify-center p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition group">
                    <svg className="w-6 h-6 text-gray-700 group-hover:text-[#00A4EF]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.5 24H0V12.5h11.5V24zM24 24H12.5V12.5H24V24zM11.5 11.5H0V0h11.5v11.5zM24 11.5H12.5V0H24v11.5z"/>
                    </svg>
                    <span className="text-xs font-semibold text-gray-600 mt-1">Microsoft</span>
                  </button>
                  
                  {/* Okta */}
                  <button type="button" className="flex flex-col items-center justify-center p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition group">
                    <svg className="w-6 h-6 text-gray-700 group-hover:text-[#007DC1]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <span className="text-xs font-semibold text-gray-600 mt-1">Okta</span>
                  </button>

                  {/* Google Workspace */}
                  <button type="button" className="flex flex-col items-center justify-center p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition group">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-xs font-semibold text-gray-600 mt-1">Google</span>
                  </button>
                </div>
              </form>

              <p className="text-center text-sm text-gray-500 mt-8">
                Don't have a corporate account? <a href="/contact" className="text-brand-royal hover:underline font-bold">Contact Sales</a>
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CorporatePortal;