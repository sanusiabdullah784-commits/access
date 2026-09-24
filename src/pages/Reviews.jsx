import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Reviews() {
  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "CEO, Global Tech Inc.",
      text: "Access Lingua transformed how we do business internationally. Their interpreters are incredibly professional and accurate. Highly recommended!",
      rating: 5
    },
    {
      name: "Dr. Michael Chen",
      role: "Medical Director",
      text: "The video interpretation service is a lifesaver for our hospital. It's fast, secure, and the doctors can finally communicate clearly with all our patients.",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "Legal Counsel",
      text: "I've used many translation services, but Access Lingua is on another level. Their certified document translations are always perfect and delivered on time.",
      rating: 5
    },
    {
      name: "David O'Connor",
      role: "Event Coordinator",
      text: "We hired them for a massive international conference. The team was flawless, managing multiple languages simultaneously without a hitch!",
      rating: 4
    },
    {
      name: "Aisha Patel",
      role: "Founder, StartUp Hub",
      text: "The subscription plans are very flexible. As a growing startup, the Professional plan gives us exactly what we need without breaking the bank.",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "Freelance Journalist",
      text: "I use their phone interpretation daily when interviewing sources abroad. The audio quality is crystal clear and the connection is instant.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">What Our Clients Say</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Trusted by thousands of businesses and individuals worldwide.
            </p>
          </div>
        </section>

        {/* Overall Rating */}
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-10 h-10 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <h2 className="text-3xl font-bold text-brand-navy mb-2">4.9 out of 5 Stars</h2>
            <p className="text-gray-500">Based on over 2,500 verified reviews</p>
          </div>
        </section>

        {/* Reviews Grid */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col">
                  {/* Stars */}
                  <div className="flex space-x-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-gray-600 mb-6 flex-grow italic">"{review.text}"</p>
                  
                  <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-cyan to-brand-royal rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-navy">{review.name}</h4>
                      <p className="text-sm text-gray-500">{review.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Reviews;