import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Services() {
  const services = [
    {
      title: "Document Translation",
      desc: "Certified and accurate translation for legal, medical, and business documents in over 150 languages.",
      icon: "📄"
    },
    {
      title: "Video Interpretation",
      desc: "Real-time, face-to-face video interpretation connecting you with expert linguists instantly.",
      icon: ""
    },
    {
      title: "Phone Interpretation",
      desc: "On-demand telephone interpretation available 24/7 for urgent and everyday communication needs.",
      icon: "📞"
    },
    {
      title: "Website Localization",
      desc: "Adapt your website and digital content to resonate with local cultures and languages globally.",
      icon: "🌐"
    },
    {
      title: "Corporate Solutions",
      desc: "Tailored language solutions for enterprise businesses, including dedicated account management.",
      icon: ""
    },
    {
      title: "Subtitling & Transcription",
      desc: "Professional audio transcription and video subtitling to make your multimedia content accessible.",
      icon: "🎬"
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Premium Services</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Comprehensive language solutions tailored to your unique needs.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
                  <div className="text-5xl mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-brand-navy mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-6">Ready to Break Language Barriers?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Get a free quote today and discover how Access Lingua can help you connect with the world.
            </p>
            <button className="bg-brand-royal hover:bg-brand-navy text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-xl">
              Get a Free Quote
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Services;