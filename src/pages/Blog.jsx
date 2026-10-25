import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <-- ADDED: For linking to blog posts
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

  // Brand-aligned categories
  const categories = ['All', 'Industry News', 'Interpretation Best Practices', 'Company Updates', 'Case Studies', 'Language Insights'];

  // Fetch posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        // Fallback to brand-aligned mock data (Remove this block once you add real posts to Supabase)
        setPosts([
          {
            id: '1',
            title: "The Future of AI in Human Interpretation: A Perfect Synergy",
            category: "Industry News",
            date: "Sep 10, 2026",
            readTime: "8 min read",
            summary: "Discover how Access Lingua combines cutting-edge Artificial Intelligence with human expertise to deliver interpretations that are both lightning-fast and culturally perfect.",
            author: "Dr. Sarah Thompson",
            authorRole: "Chief Innovation Officer",
            views: 2450,
            comments: 18,
            color: "from-brand-navy to-brand-cyan",
            is_featured: true
          },
          {
            id: '2',
            title: "5 Common Mistakes in Legal Interpretation and How to Avoid Them",
            category: "Interpretation Best Practices",
            date: "Sep 08, 2026",
            readTime: "6 min read",
            summary: "From misinterpreting legal jargon to cultural faux pas, learn the top pitfalls that can derail a deposition or courtroom proceeding.",
            author: "Elena Rodriguez",
            authorRole: "Lead Legal Interpreter",
            views: 1820,
            comments: 12,
            color: "from-brand-royal to-brand-cyan"
          },
          {
            id: '3',
            title: "How We Helped City General Hospital Reduce Patient Wait Times by 40%",
            category: "Case Studies",
            date: "Sep 05, 2026",
            readTime: "10 min read",
            summary: "A deep dive into how our VRI platform transformed multilingual patient intake at one of the busiest hospitals in the country.",
            author: "Michael Chen",
            authorRole: "VP of Healthcare Solutions",
            views: 3100,
            comments: 24,
            color: "from-brand-navy to-brand-royal"
          }
        ]);
      } else {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  // Handle newsletter subscription
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterStatus('loading');
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email: newsletterEmail }]);

    if (error) {
      if (error.code === '23505') {
        setNewsletterStatus('error');
        alert("This email is already subscribed!");
      } else {
        setNewsletterStatus('error');
        alert("Something went wrong. Please try again.");
      }
    } else {
      setNewsletterStatus('success');
      setNewsletterEmail('');
    }
  };

  // Social sharing handlers
  const shareOnLinkedIn = (title) => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(title)}`, '_blank');
  };

  const shareOnTwitter = (title) => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareViaEmail = (title) => {
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this article from Access Lingua: ${window.location.href}`)}`;
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (post.summary && post.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch && !post.is_featured;
  });

  const featuredPost = posts.find(p => p.is_featured) || posts[0];
  const relatedPosts = posts.filter(p => p.id !== featuredPost?.id && p.category === featuredPost?.category).slice(0, 2);

  return (
    // FIXED: Added pt-36 to push content down below the fixed Navbar
    <div className="min-h-screen bg-white flex flex-col pt-36">
      <Navbar />
      
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog & Resources</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Insights, tips, and news from the world of professional interpretation.
            </p>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gray-50 rounded-3xl overflow-hidden shadow-xl grid md:grid-cols-2">
                <div className={`bg-gradient-to-br ${featuredPost.color || 'from-brand-navy to-brand-cyan'} p-12 flex items-center justify-center relative`}>
                  <svg className="w-32 h-32 text-white opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                  
                  {/* Social Sharing Buttons on Featured */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button onClick={() => shareOnLinkedIn(featuredPost.title)} className="w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition backdrop-blur-sm" title="Share on LinkedIn">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </button>
                    <button onClick={() => shareOnTwitter(featuredPost.title)} className="w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition backdrop-blur-sm" title="Share on Twitter">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                    </button>
                    <button onClick={() => shareViaEmail(featuredPost.title)} className="w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition backdrop-blur-sm" title="Share via Email">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </button>
                  </div>
                </div>
                <div className="p-10 md:p-12 flex flex-col justify-center">
                  <span className="text-brand-royal font-bold uppercase tracking-wider text-sm mb-2">{featuredPost.category} • Featured</span>
                  <h2 className="text-3xl font-bold text-brand-navy mb-4">{featuredPost.title}</h2>
                  <p className="text-gray-600 mb-6 text-lg">{featuredPost.summary}</p>
                  
                  {/* Author Profile */}
                  {featuredPost.author && (
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-brand-cyan to-brand-royal rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {featuredPost.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{featuredPost.author}</p>
                        <p className="text-xs text-gray-500">{featuredPost.authorRole}</p>
                      </div>
                    </div>
                  )}

                  {/* Engagement Metrics */}
                  <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
                    <span>{featuredPost.date}</span>
                    <span>•</span>
                    <span>{featuredPost.readTime}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      <span>{(featuredPost.views || 0).toLocaleString()}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                      <span>{featuredPost.comments || 0}</span>
                    </span>
                  </div>
                  
                  <Link to={`/blog/${featuredPost.id}`} className="bg-brand-royal hover:bg-brand-navy text-white px-6 py-3 rounded-full font-bold transition shadow-lg w-fit inline-block text-center">
                    Read Article
                  </Link>
                </div>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-brand-navy mb-4">Related Articles</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {relatedPosts.map((post) => (
                      <Link key={post.id} to={`/blog/${post.id}`} className="bg-gray-50 p-5 rounded-xl border border-gray-100 hover:shadow-md transition flex items-start space-x-4 group">
                        <div className={`w-16 h-16 bg-gradient-to-br ${post.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <svg className="w-8 h-8 text-white opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-brand-navy text-sm group-hover:text-brand-royal transition">{post.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{post.date} • {post.readTime}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Category Filter, Search & Posts Grid */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Live Search */}
            <div className="max-w-md mx-auto mb-8 relative">
              <input 
                type="text" 
                placeholder="Search articles (e.g., 'HIPAA', 'Mandarin')..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3 pl-12 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-royal/30 focus:border-brand-royal transition bg-white shadow-sm"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                    activeCategory === cat 
                      ? 'bg-brand-navy text-white shadow-lg' 
                      : 'bg-white text-gray-600 hover:bg-brand-cyan hover:text-white border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Posts Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-4 border-brand-royal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading articles...</p>
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.id}`} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col group">
                    <div className={`h-48 bg-gradient-to-br ${post.color} flex items-center justify-center relative`}>
                      <svg className="w-16 h-16 text-white opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                      
                      {/* Social Sharing on Hover */}
                      <div className="absolute top-3 right-3 flex space-x-1.5 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); shareOnLinkedIn(post.title); }} className="w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-blue-700 transition shadow-sm" title="LinkedIn">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        </button>
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); shareOnTwitter(post.title); }} className="w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-blue-400 transition shadow-sm" title="Twitter">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-brand-royal font-bold text-xs uppercase tracking-wider mb-2">{post.category}</span>
                      <h3 className="text-xl font-bold text-brand-navy mb-2 group-hover:text-brand-royal transition">{post.title}</h3>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-grow">{post.summary}</p>
                      
                      {/* Author & Metrics */}
                      {post.author && (
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-brand-cyan to-brand-royal rounded-full flex items-center justify-center text-white font-bold text-xs">
                            {post.author.charAt(0)}
                          </div>
                          <span className="text-xs text-gray-600 font-medium">{post.author}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                          {post.views && (
                            <>
                              <span>•</span>
                              <span>{post.views.toLocaleString()} views</span>
                            </>
                          )}
                        </div>
                        <span className="text-brand-royal font-semibold group-hover:underline text-sm">Read →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <p className="text-xl text-gray-500">No articles found matching your criteria.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                  className="mt-4 text-brand-royal font-bold hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Signup with Supabase Integration */}
        <section className="py-20 bg-brand-navy text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Ahead of the Curve</h2>
            <p className="text-xl text-blue-100 mb-8">Subscribe to our newsletter for the latest interpretation industry insights and company news.</p>
            
            {newsletterStatus === 'success' ? (
              <div className="bg-green-500/20 border border-green-400/30 rounded-2xl p-6 max-w-lg mx-auto animate-fadeIn">
                <svg className="w-10 h-10 text-green-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="font-bold text-lg">You're subscribed! 🎉</p>
                <p className="text-sm text-blue-200 mt-1">Check your inbox for a confirmation email.</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input 
                  type="email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address" 
                  required
                  className="flex-grow px-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-brand-cyan/30"
                />
                <button 
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="bg-brand-cyan hover:bg-white hover:text-brand-navy disabled:opacity-50 text-white px-8 py-4 rounded-full font-bold transition shadow-lg"
                >
                  {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Blog;