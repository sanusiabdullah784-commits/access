import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function VideoInterpretation() {
  const steps = [
    {
      step: "01",
      title: "Log In",
      desc: "Access your secure Access Lingua portal from any device."
    },
    {
      step: "02",
      title: "Select Language",
      desc: "Choose from over 150 languages and pick your interpreter."
    },
    {
      step: "03",
      title: "Start Video Call",
      desc: "Connect instantly via our crystal-clear, secure video platform."
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Video Interpretation</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Face-to-face connection with expert linguists, anywhere in the world.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-navy mb-16">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-10">
              {steps.map((item, index) => (
                <div key={index} className="text-center p-6">
                  <div className="text-6xl font-black text-brand-cyan mb-4 opacity-30">{item.step}</div>
                  <h3 className="text-2xl font-bold text-brand-navy mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-6">Crystal Clear & Secure</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Our proprietary video platform is built specifically for interpretation. It features low-latency audio, HD video, and end-to-end encryption to ensure your conversations remain 100% confidential.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-brand-royal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-gray-700 font-medium">Available 24/7/365</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-brand-royal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-gray-700 font-medium">Works on Mobile, Tablet & Desktop</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-brand-royal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-gray-700 font-medium">No software downloads required</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
                <div className="aspect-video bg-brand-navy rounded-xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-royal to-brand-cyan opacity-20"></div>
                  <svg className="w-16 h-16 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-brand-navy">Interpreter Connected</p>
                    <p className="text-sm text-green-500 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                      Live
                    </p>
                  </div>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold transition">
                    End Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-brand-navy text-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to connect face-to-face?</h2>
            <p className="text-xl text-blue-100 mb-8">Start your first video interpretation session in under 30 seconds.</p>
            <button className="bg-brand-cyan hover:bg-white hover:text-brand-navy text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-xl">
              Start Video Call Now
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default VideoInterpretation;