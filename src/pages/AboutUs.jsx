import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function AboutUs() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Access Lingua</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Empowering global communication through precision, culture, and technology.
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-4">
                  At Access Lingua, we believe that language should never be a barrier to human connection, business growth, or cultural exchange. 
                </p>
                <p className="text-lg text-gray-600">
                  Founded with a vision to bridge the gap between diverse cultures, we provide top-tier translation and interpretation services that are accurate, culturally sensitive, and delivered with lightning speed.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-2xl shadow-lg border-l-4 border-brand-cyan">
                <h3 className="text-2xl font-bold text-brand-royal mb-4">Why We Do It</h3>
                <p className="text-gray-600">
                  In a rapidly globalizing world, clear communication is the key to success. We are passionate about helping businesses expand internationally, families stay connected, and individuals access vital services regardless of the language they speak.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-navy mb-16">Our Impact in Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="p-6">
                <div className="text-4xl md:text-5xl font-bold text-brand-royal mb-2">150+</div>
                <div className="text-gray-600 font-medium">Languages Supported</div>
              </div>
              <div className="p-6">
                <div className="text-4xl md:text-5xl font-bold text-brand-royal mb-2">10K+</div>
                <div className="text-gray-600 font-medium">Happy Clients</div>
              </div>
              <div className="p-6">
                <div className="text-4xl md:text-5xl font-bold text-brand-royal mb-2">500+</div>
                <div className="text-gray-600 font-medium">Expert Interpreters</div>
              </div>
              <div className="p-6">
                <div className="text-4xl md:text-5xl font-bold text-brand-royal mb-2">99%</div>
                <div className="text-gray-600 font-medium">Accuracy Rate</div>
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