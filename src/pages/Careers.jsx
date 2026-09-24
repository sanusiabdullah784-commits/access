import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Careers() {
  const jobs = [
    { title: "Senior React Developer", location: "Remote / New York", type: "Full-Time", department: "Engineering" },
    { title: "Lead Linguist (Spanish/English)", location: "Remote", type: "Full-Time", department: "Operations" },
    { title: "Customer Success Manager", location: "New York, NY", type: "Full-Time", department: "Support" },
    { title: "Product Designer", location: "Remote", type: "Contract", department: "Design" },
    { title: "Marketing Director", location: "New York, NY", type: "Full-Time", department: "Marketing" }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Global Team</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Help us break down language barriers and connect the world. Build your career with purpose at Access Lingua.
            </p>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-navy mb-16">Why Work With Us?</h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-brand-cyan/10 text-brand-cyan rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3">Fast-Paced Innovation</h3>
                <p className="text-gray-600">We are building the future of communication using cutting-edge AI and human expertise.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-brand-royal/10 text-brand-royal rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3">Global Diversity</h3>
                <p className="text-gray-600">Work with a brilliant team of linguists, engineers, and dreamers from over 40 countries.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-brand-navy/10 text-brand-navy rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3">Real Impact</h3>
                <p className="text-gray-600">Every day, your work helps hospitals, courts, and families communicate clearly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-navy mb-12">Open Positions</h2>
            
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col md:flex-row md:items-center justify-between border border-gray-100">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-brand-navy">{job.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        {job.department} • {job.type}
                      </span>
                    </div>
                  </div>
                  <button className="bg-brand-royal hover:bg-brand-navy text-white px-6 py-2.5 rounded-full font-semibold transition shadow-md whitespace-nowrap">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>

            {/* General Application CTA */}
            <div className="mt-16 text-center bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-brand-navy mb-4">Don't see your perfect role?</h3>
              <p className="text-gray-600 mb-6">We are always looking for exceptional talent. Send us your resume and let's talk!</p>
              <button className="bg-transparent border-2 border-brand-royal text-brand-royal hover:bg-brand-royal hover:text-white px-8 py-3 rounded-full font-bold transition">
                Send General Application
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Careers;