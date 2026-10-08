import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function AboutUs() {
  const coreValues = [
    { title: 'Trust', desc: 'We build lasting relationships with clients through reliability and dependable service.' },
    { title: 'Transparency', desc: 'We maintain clear and honest communication with our clients throughout every project.' },
    { title: 'Confidentiality', desc: 'We protect sensitive information and maintain strict confidentiality in all assignments.' },
    { title: 'Accuracy', desc: 'We strive to deliver precise and faithful interpretation without compromising the intended meaning.' },
    { title: 'Impartiality', desc: 'Our interpreters maintain professional neutrality and do not allow personal opinions to influence their work.' },
    { title: 'Professionalism', desc: 'We maintain high professional standards in every interaction and assignment.' },
    { title: 'Integrity', desc: 'We conduct our business honestly, ethically, and responsibly.' },
    { title: 'Quality', desc: 'We are committed to delivering consistently high-quality language services that exceed expectations.' }
  ];

  const services = [
    { 
      title: 'Interpretation Services', 
      items: ['Simultaneous Interpretation', 'Consecutive Interpretation', 'Remote Interpretation (VRI/OPI)', 'On-site Interpretation'] 
    },
    { 
      title: 'Translation & Content', 
      items: ['Document & Website Translation', 'Transcription & Subtitling', 'Proofreading & Editing', 'Technical & Business Content'] 
    },
    { 
      title: 'Localization & Agency', 
      items: ['Content Localization', 'Language Project Management', 'Support for Education & Government', 'Media & Tech Adaptation'] 
    },
    { 
      title: 'Consultancy & Education', 
      items: ['Language Assessment', 'Cross-cultural Communication', 'Workshops & Seminars', 'Training Programmes & Webinars'] 
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About Access Lingua Ltd.</h1>
            <p className="text-2xl md:text-3xl font-light text-brand-cyan mb-4">Breaking Language Barriers. Connecting People.</p>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              Providing professional interpretation, translation, and language education services to individuals, businesses, institutions, and government agencies worldwide.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-gray-50 p-8 rounded-2xl shadow-lg border-l-4 border-brand-cyan">
                <h2 className="text-3xl font-bold text-brand-navy mb-4">Our Mission</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To promote hitch-free, accurate, confidential, and time-efficient communication among people of different languages and backgrounds across all fields of life. We aim to eliminate language barriers in business, healthcare, legal proceedings, education, and everyday conversations.
                </p>
              </div>
              <div className="bg-brand-navy p-8 rounded-2xl shadow-lg text-white">
                <h2 className="text-3xl font-bold text-brand-cyan mb-4">Our Vision</h2>
                <p className="text-lg text-blue-100 leading-relaxed">
                  To become the world's leading provider of high-quality professional language services, recognized globally for excellence, reliability, accuracy, confidentiality, and unwavering professionalism.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* INITIAL SPECIALIZATION (Highlighted as requested) */}
        <section className="py-16 bg-gradient-to-r from-brand-royal to-brand-navy text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block bg-brand-cyan text-brand-navy px-4 py-1 rounded-full text-sm font-bold mb-6">OUR FOCUS</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Initial Specialization: Mandarin Interpretation</h2>
            <p className="text-xl text-blue-100 leading-relaxed max-w-4xl mx-auto">
              Although Access Lingua Ltd. is structured to provide a broad range of language services, our initial and primary specialization is <strong className="text-white">Mandarin interpretation</strong>. We believe in mastering one field before expanding. Rather than becoming a "jack of all trades," our objective is to build Access Lingua into one of the world's most trusted and respected Mandarin interpretation companies. Once we have established excellence here, we will strategically expand into additional languages.
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-navy mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((value, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border-t-4 border-brand-royal">
                  <h3 className="text-xl font-bold text-brand-navy mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-navy mb-4">Our Services</h2>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
              Comprehensive multilingual communication support tailored to individuals, corporations, and government agencies.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                  <h3 className="text-2xl font-bold text-brand-royal mb-4">{service.title}</h3>
                  <ul className="space-y-3">
                    {service.items.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3 text-gray-700">
                        <svg className="w-5 h-5 text-brand-cyan flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team & Global Coverage */}
        <section className="py-20 bg-brand-navy text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Team & Global Coverage</h2>
                <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                  Access Lingua Ltd. operates with a global outlook. Our services are designed to support clients regardless of their geographical location. 
                </p>
                <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                  We work with a carefully selected and vetted network of professional interpreters from across the globe. Our team members are chosen based on language proficiency, subject-matter expertise, cultural understanding, and strict professional ethics. 
                </p>
                <p className="text-lg text-blue-100 leading-relaxed">
                  We believe that quality interpretation requires more than simply speaking two languages. It requires accuracy, cultural awareness, and the ability to communicate effectively under pressure.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <h3 className="text-2xl font-bold text-brand-cyan mb-4">Wherever language creates a barrier...</h3>
                <p className="text-white text-lg italic">
                  "...Access Lingua Ltd. aims to provide the bridge."
                </p>
                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-sm text-blue-200">
                    We collaborate with qualified language professionals, educational institutions, and technology partners to deliver high-quality digital and online language services worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AboutUs;