import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (error || !data) {
        setError(true);
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col pt-36">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-brand-royal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Loading article...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white flex flex-col pt-36">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h2 className="text-3xl font-bold text-brand-navy mb-4">Article Not Found</h2>
            <p className="text-gray-600 mb-6">The article you are looking for doesn't exist or has been unpublished.</p>
            <Link to="/blog" className="inline-block bg-brand-royal hover:bg-brand-navy text-white px-6 py-3 rounded-full font-bold transition shadow-lg">
              ← Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    // FIXED: Added pt-36 to push content down below the fixed Navbar
    <div className="min-h-screen bg-white flex flex-col pt-36">
      <Navbar />
      
      <main className="flex-grow">
        {/* Article Header */}
        <section className={`bg-gradient-to-br ${post.color || 'from-brand-navy to-brand-cyan'} text-white py-20 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-bold mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-blue-100 text-sm">
              {post.author && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs">
                    {post.author.charAt(0)}
                  </div>
                  <span>{post.author}</span>
                </div>
              )}
              <span>•</span>
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.read_time || '5 min read'}</span>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Summary / Excerpt */}
            <div className="text-xl md:text-2xl font-medium text-brand-navy leading-relaxed mb-10 border-l-4 border-brand-cyan pl-6 italic">
              {post.summary}
            </div>

            {/* Placeholder for full article content */}
            <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed space-y-6">
              <p>
                <em>(Note: This is a placeholder for the full article body. In a real-world scenario, you would add a 'content' TEXT column to your Supabase 'posts' table to store the full HTML or Markdown of the article.)</em>
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>

            {/* Engagement Metrics */}
            <div className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between">
              <Link to="/blog" className="text-brand-royal font-bold hover:underline flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                <span>Back to all articles</span>
              </Link>
              <div className="flex items-center space-x-4 text-gray-500 text-sm">
                <span className="flex items-center space-x-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  <span>{(post.views || 0).toLocaleString()} views</span>
                </span>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

export default BlogPost;