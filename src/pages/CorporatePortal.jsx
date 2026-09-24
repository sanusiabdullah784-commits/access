import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function CorporatePortal() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-20 bg-gray-50">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
            
            {/* Left Side: Info & Branding */}
            <div className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan p-12 text-white flex flex-col justify-between hidden md:flex">
              <div>
                <h2 className="text-3xl font-bold mb-4">Access Lingua Enterprise</h2>
                <p className="text-blue-100 text-lg">
                  Welcome to the Corporate Portal. Manage your team's translation credits, view analytics, and schedule global interpreters in one secure place.
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
                    <p className="text-blue-200 text-sm">Add users and control permissions easily</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="p-12 flex flex-col justify-center">
              <div className="md:hidden mb-8 text-center">
                <h2 className="text-2xl font-bold text-brand-navy">Corporate Portal Login</h2>
              </div>
              <h3 className="text-2xl font-bold text-brand-navy mb-2 hidden md:block">Sign In to Your Account</h3>
              <p className="text-gray-500 mb-8 hidden md:block">Enter your corporate credentials to continue.</p>

              <form className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Work Email</label>
                  <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal" placeholder="name@company.com" />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Password</label>
                  <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-royal" placeholder="••••••••" />
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

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <button type="button" className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-lg transition flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
                  <span>Sign in with Google SSO</span>
                </button>
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