import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Fetch jobs from Supabase
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        // Fallback to brand-aligned mock data if table is empty/missing
        setJobs([
          {
            id: 1,
            title: "Lead Linguist (Mandarin/English)",
            location: "Remote",
            type: "Full-Time",
            department: "Linguistics",
            description: "Lead our core Mandarin interpretation team and ensure the highest quality of service for our enterprise clients."
          },
          {
            id: 2,
            title: "Certified Interpreter (Igbo / Pidgin English)",
            location: "Remote / Lagos",
            type: "Contract",
            department: "Linguistics",
            description: "Provide top-tier, culturally nuanced interpretation services for our growing healthcare and legal partners."
          },
          {
            id: 3,
            title: "Senior React Developer",
            location: "Remote / New York",
            type: "Full-Time",
            department: "Engineering",
            description: "Build and scale our proprietary, low-latency video interpretation platform used by thousands daily."
          },
          {
            id: 4,
            title: "Customer Success Manager",
            location: "New York, NY",
            type: "Full-Time",
            department: "Operations",
            description: "Guide our enterprise healthcare and legal clients to success, ensuring seamless onboarding and support."
          },
          {
            id: 5,
            title: "Product Designer",
            location: "Remote",
            type: "Contract",
            department: "Design",
            description: "Design intuitive, accessible, and beautiful interfaces for our interpreter and client dashboards."
          }
        ]);
      } else {
        setJobs(data);
      }
      setLoading(false);
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search and department
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || job.department === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Extract unique departments for filter tabs
  const departments = ['All', ...new Set(jobs.map(job => job.department))];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Global Team</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Help us break down language barriers. Build your career with purpose at Access Lingua, where your expertise connects the world.
            </p>
          </div>
        </section>

        {/* NEW: Rich Perks & Benefits Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-navy mb-4">Why Work With Us?</h2>
            <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">We believe in taking care of our team so they can take care of our clients.</p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  icon: "🌍", 
                  title: "Remote-First Flexibility", 
                  desc: "Work from anywhere in the world. We care about your output, not your office hours." 
                },
                { 
                  icon: "📚", 
                  title: "Continuous Learning", 
                  desc: "Annual stipend for conferences, courses, and certifications to keep your skills sharp." 
                },
                { 
                  icon: "🏥", 
                  title: "Top-Tier Health & Wellness", 
                  desc: "Comprehensive medical, dental, and vision coverage for you and your dependents." 
                },
                { 
                  icon: "💡", 
                  title: "Real Global Impact", 
                  desc: "Your work directly helps hospitals, courts, and families communicate clearly and safely." 
                }
              ].map((perk, idx) => (
                <div key={idx} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:border-brand-royal/20 transition group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition duration-300">{perk.icon}</div>
                  <h3 className="text-lg font-bold text-brand-navy mb-2">{perk.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{perk.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions with Smart Filtering */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-navy mb-8">Open Positions</h2>
            
            {/* NEW: Smart Search & Filter */}
            <div className="mb-10 space-y-4">
              <div className="relative max-w-md mx-auto">
                <input 
                  type="text" 
                  placeholder="Search by title or keyword..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3 pl-12 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-royal/30 focus:border-brand-royal transition"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setActiveFilter(dept)}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition ${
                      activeFilter === dept
                        ? 'bg-brand-royal text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Job Listings */}
            {loading ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-4 border-brand-royal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading opportunities...</p>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition flex flex-col md:flex-row md:items-center justify-between border border-gray-100 group">
                    <div className="mb-4 md:mb-0 flex-grow">
                      <h3 className="text-xl font-bold text-brand-navy group-hover:text-brand-royal transition">{job.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 mb-3 line-clamp-2">{job.description}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        <span className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                          <svg className="w-4 h-4 mr-1.5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                          {job.location}
                        </span>
                        <span className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                          <svg className="w-4 h-4 mr-1.5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          {job.department} • {job.type}
                        </span>
                      </div>
                    </div>
                    <button className="bg-brand-royal hover:bg-brand-navy text-white px-6 py-2.5 rounded-full font-semibold transition shadow-md whitespace-nowrap mt-4 md:mt-0">
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <p className="text-xl text-gray-500">No open positions match your search.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
                  className="mt-4 text-brand-royal font-bold hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* General Application CTA */}
            <div className="mt-16 text-center bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-brand-navy mb-4">Don't see your perfect role?</h3>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto">We are always looking for exceptional talent, especially certified linguists in our core languages. Send us your resume and let's talk!</p>
              <a href="/contact?subject=General Application" className="inline-block bg-transparent border-2 border-brand-royal text-brand-royal hover:bg-brand-royal hover:text-white px-8 py-3 rounded-full font-bold transition">
                Send General Application
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Careers;