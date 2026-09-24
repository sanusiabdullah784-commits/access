import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function ClientPortal() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Welcome Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-brand-navy">Welcome back, Alex! 👋</h1>
              <p className="text-gray-500 mt-2">Here is what's happening with your translations today.</p>
            </div>
            <button className="mt-4 md:mt-0 bg-brand-royal hover:bg-brand-navy text-white px-6 py-3 rounded-full font-bold transition shadow-lg">
              + New Request
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-brand-cyan">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Wallet Balance</p>
              <h2 className="text-3xl font-black text-brand-navy mt-2">$240.00</h2>
              <p className="text-green-500 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                +12% this month
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-brand-royal">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Active Projects</p>
              <h2 className="text-3xl font-black text-brand-navy mt-2">4</h2>
              <p className="text-gray-500 text-sm mt-1">2 awaiting review</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-brand-navy">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Words Translated</p>
              <h2 className="text-3xl font-black text-brand-navy mt-2">15,420</h2>
              <p className="text-gray-500 text-sm mt-1">Lifetime total</p>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold text-brand-navy mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { title: "Document Translation - Legal Contract", status: "Completed", color: "bg-green-100 text-green-700" },
                  { title: "Video Interpretation - Spanish", status: "In Progress", color: "bg-blue-100 text-blue-700" },
                  { title: "Website Localization - French", status: "Pending Review", color: "bg-yellow-100 text-yellow-700" },
                  { title: "Phone Interpretation - Mandarin", status: "Scheduled", color: "bg-gray-100 text-gray-700" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 text-brand-royal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <p className="font-medium text-gray-800">{item.title}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.color}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions & Upcoming */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-bold text-brand-navy mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-brand-cyan hover:text-white rounded-xl transition font-medium text-gray-700 flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Top Up Wallet
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-brand-royal hover:text-white rounded-xl transition font-medium text-gray-700 flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    Start Video Call
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-brand-navy hover:text-white rounded-xl transition font-medium text-gray-700 flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Account Settings
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-brand-royal to-brand-navy rounded-2xl shadow-md p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Upgrade to Pro</h3>
                <p className="text-blue-100 text-sm mb-4">Get unlimited translations and 24/7 priority support.</p>
                <button className="w-full bg-white text-brand-navy font-bold py-2 rounded-lg hover:bg-brand-cyan hover:text-white transition">
                  View Plans
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ClientPortal;