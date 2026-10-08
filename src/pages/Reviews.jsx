import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  // Fetch reviews from Supabase
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
        // Fallback to mock data if table doesn't exist yet
        setReviews([
          {
            id: 1,
            name: "Sarah Jenkins",
            role: "CEO, Global Tech Inc.",
            industry: "Corporate",
            text: "Access Lingua transformed how we do business internationally. Their interpreters are incredibly professional and accurate. Highly recommended!",
            rating: 5,
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            name: "Dr. Michael Chen",
            role: "Medical Director",
            industry: "Healthcare",
            text: "The video interpretation service is a lifesaver for our hospital. It's fast, secure, and the doctors can finally communicate clearly with all our patients.",
            rating: 5,
            created_at: new Date().toISOString()
          },
          {
            id: 3,
            name: "Elena Rodriguez",
            role: "Legal Counsel",
            industry: "Legal",
            text: "I've used many interpretation services, but Access Lingua is on another level. Their certified legal interpreters are always perfect and delivered on time.",
            rating: 5,
            created_at: new Date().toISOString()
          },
          {
            id: 4,
            name: "David O'Connor",
            role: "Event Coordinator",
            industry: "Events",
            text: "We hired them for a massive international conference. The team was flawless, managing multiple languages simultaneously without a hitch!",
            rating: 4,
            created_at: new Date().toISOString()
          },
          {
            id: 5,
            name: "Aisha Patel",
            role: "Founder, StartUp Hub",
            industry: "Corporate",
            text: "The subscription plans are very flexible. As a growing startup, the Professional plan gives us exactly what we need without breaking the bank.",
            rating: 5,
            created_at: new Date().toISOString()
          },
          {
            id: 6,
            name: "James Wilson",
            role: "Freelance Journalist",
            industry: "General",
            text: "I use their phone interpretation daily when interviewing sources abroad. The audio quality is crystal clear and the connection is instant.",
            rating: 5,
            created_at: new Date().toISOString()
          }
        ]);
      } else {
        setReviews(data || []);
      }
      setLoading(false);
    };

    fetchReviews();
  }, []);

  // Filter reviews by industry
  const filteredReviews = activeFilter === 'All' 
    ? reviews 
    : reviews.filter(r => r.industry === activeFilter);

  // Video testimonials data
  const videoTestimonials = [
    {
      name: "Dr. Sarah Thompson",
      role: "Chief Medical Officer, City General Hospital",
      quote: "Access Lingua's VRI platform has revolutionized our patient care.",
      thumbnail: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=600&fit=crop"
    },
    {
      name: "Michael Rodriguez",
      role: "Partner, Rodriguez & Associates Law Firm",
      quote: "The most reliable legal interpretation service we've ever used.",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
    },
    {
      name: "Jennifer Park",
      role: "VP of Operations, Global Tech Inc.",
      quote: "Their corporate solutions are unmatched in quality and speed.",
      thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop"
    }
  ];

  // Client logos (placeholder URLs - replace with actual logo URLs)
  const clientLogos = [
    { name: "City General Hospital", logo: "🏥" },
    { name: "Global Tech Inc.", logo: "🏢" },
    { name: "Rodriguez Law Firm", logo: "⚖️" },
    { name: "StartUp Hub", logo: "🚀" },
    { name: "International Conference Center", logo: "🎤" }
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

        {/* NEW: Trusted By Client Logos Bar */}
        <section className="py-12 bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-bold text-gray-500 uppercase tracking-wider mb-8">Trusted by Leading Organizations</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {clientLogos.map((client, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-2 opacity-60 hover:opacity-100 transition">
                  <span className="text-4xl md:text-5xl">{client.logo}</span>
                  <span className="text-xs font-semibold text-gray-600 text-center max-w-[120px]">{client.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NEW: Video Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-navy mb-4">Hear From Our Clients</h2>
            <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">Watch what industry leaders have to say about working with Access Lingua.</p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {videoTestimonials.map((video, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-lg mb-4">
                    <img 
                      src={video.thumbnail} 
                      alt={video.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition shadow-2xl">
                        <svg className="w-8 h-8 text-brand-royal ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="px-2">
                    <p className="text-lg font-bold text-brand-navy mb-1">"{video.quote}"</p>
                    <p className="text-sm font-semibold text-gray-800">{video.name}</p>
                    <p className="text-xs text-gray-500">{video.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Grid with Industry Filters */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* NEW: Industry Filter Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {['All', 'Healthcare', 'Legal', 'Corporate', 'Events', 'General'].map((industry) => (
                <button
                  key={industry}
                  onClick={() => setActiveFilter(industry)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition ${
                    activeFilter === industry
                      ? 'bg-brand-royal text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-brand-royal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading reviews...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
                    <div key={review.id} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col">
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
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-xl text-gray-500">No reviews found for this category.</p>
                    <button 
                      onClick={() => setActiveFilter('All')}
                      className="mt-4 text-brand-royal font-bold hover:underline"
                    >
                      View all reviews
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* NEW: Leave a Review CTA */}
            <div className="mt-16 text-center bg-gradient-to-br from-brand-navy to-brand-royal p-10 rounded-3xl shadow-lg text-white">
              <h3 className="text-2xl font-bold mb-4">Share Your Experience</h3>
              <p className="text-blue-100 mb-6 max-w-lg mx-auto">
                Have you used Access Lingua? We'd love to hear about your experience and help others make informed decisions.
              </p>
              <a 
                href="/contact?subject=Leave a Review" 
                className="inline-block bg-white text-brand-navy hover:bg-brand-cyan hover:text-white px-8 py-3 rounded-full font-bold transition shadow-lg"
              >
                Leave a Review
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Reviews;