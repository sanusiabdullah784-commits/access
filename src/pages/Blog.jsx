import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Industry News', 'Translation Tips', 'Company Updates', 'Case Studies'];

  const featuredPost = {
    title: "The Future of AI in Human Translation: A Perfect Synergy",
    category: "Industry News",
    date: "Sep 10, 2026",
    readTime: "8 min read",
    summary: "Discover how Access Lingua combines cutting-edge Artificial Intelligence with human expertise to deliver translations that are both lightning-fast and culturally perfect."
  };

  const posts = [
    { title: "5 Common Mistakes in Legal Document Translation", category: "Translation Tips", date: "Sep 08, 2026", color: "from-brand-royal to-brand-cyan" },
    { title: "How We Helped Global Tech Expand into 12 New Markets", category: "Case Studies", date: "Sep 05, 2026", color: "from-brand-navy to-brand-royal" },
    { title: "Access Lingua Wins 'Best Language Service Provider' 2026", category: "Company Updates", date: "Sep 01, 2026", color: "from-brand-cyan to-brand-navy" },
    { title: "Understanding Localization vs. Translation", category: "Translation Tips", date: "Aug 28, 2026", color: "from-brand-royal to-brand-navy" },
    { title: "The Rise of Video Interpretation in Healthcare", category: "Industry News", date: "Aug 25, 2026", color: "from-brand-navy to-brand-cyan" },
    { title: "Meet Our Lead Linguist: Maria Gonzalez", category: "Company Updates", date: "Aug 20, 2026", color: "from-brand-cyan to-brand-royal" }
  ];

  const filteredPosts = activeCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog & Resources</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Insights, tips, and news from the world of global communication.
            </p>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-50 rounded-3xl overflow-hidden shadow-xl grid md:grid-cols-2">
              <div className="bg-gradient-to-br from-brand-navy to-brand-cyan p-12 flex items-center justify-center">
                <svg className="w-32 h-32 text-white opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              </div>
              <div className="p-10 md:p-12 flex flex-col justify-center">
                <span className="text-brand-royal font-bold uppercase tracking-wider text-sm mb-2">{featuredPost.category} • Featured</span>
                <h2 className="text-3xl font-bold text-brand-navy mb-4">{featuredPost.title}</h2>
                <p className="text-gray-600 mb-6 text-lg">{featuredPost.summary}</p>
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <span>{featuredPost.date}</span>
                  <span className="mx-2">•</span>
                  <span>{featuredPost.readTime}</span>
                </div>
                <button className="bg-brand-royal hover:bg-brand-navy text-white px-6 py-3 rounded-full font-bold transition shadow-lg w-fit">
                  Read Article
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter & Posts Grid */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full font-semibold transition ${
                    activeCategory === cat 
                      ? 'bg-brand-navy text-white shadow-lg' 
                      : 'bg-white text-gray-600 hover:bg-brand-cyan hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Posts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col">
                  <div className={`h-48 bg-gradient-to-br ${post.color} flex items-center justify-center`}>
                    <svg className="w-16 h-16 text-white opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="text-brand-royal font-bold text-xs uppercase tracking-wider mb-2">{post.category}</span>
                    <h3 className="text-xl font-bold text-brand-navy mb-3 flex-grow">{post.title}</h3>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">{post.date}</span>
                      <button className="text-brand-royal font-semibold hover:underline text-sm">Read More →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-20 bg-brand-navy text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Ahead of the Curve</h2>
            <p className="text-xl text-blue-100 mb-8">Subscribe to our newsletter for the latest industry insights and company news.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-grow px-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-brand-cyan/30"
              />
              <button className="bg-brand-cyan hover:bg-white hover:text-brand-navy text-white px-8 py-4 rounded-full font-bold transition shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Blog;