import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function InterpreterPortal() {
  const upcomingJobs = [
    { id: 1, client: "Global Tech Inc.", language: "Spanish to English", time: "Today, 2:00 PM", type: "Video Call" },
    { id: 2, client: "City Hospital", language: "English to Mandarin", time: "Tomorrow, 9:30 AM", type: "In-Person" },
    { id: 3, client: "Legal Firm LLC", language: "French to English", time: "Sep 18, 11:00 AM", type: "Phone Call" }
  ];

  const availableJobs = [
    { id: 1, client: "StartUp Hub", language: "German to English", duration: "1 Hour", rate: "$45/hr" },
    { id: 2, client: "Media Corp", language: "Japanese to English", duration: "30 Mins", rate: "$50/hr" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Welcome Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-brand-navy">Welcome back, Maria! ️</h1>
              <p className="text-gray-500 mt-2">You have 3 upcoming sessions this week. Keep up the great work!</p>
            </div>
            <button className="mt-4 md:mt-0 bg-brand-cyan hover:bg-brand-royal text-white px-6 py-3 rounded-full font-bold transition shadow-lg">
              Update Availability
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-green-500">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Earnings</p>
              <h2 className="text-3xl font-black text-brand-navy mt-2">$4,250.00</h2>
              <p className="text-green-500 text-sm mt-1">+ $850 this month</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-brand-royal">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Completed Sessions</p>
              <h2 className="text-3xl font-black text-brand-navy mt-2">142</h2>
              <p className="text-gray-500 text-sm mt-1">Lifetime total</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-yellow-400">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Average Rating</p>
              <h2 className="text-3xl font-black text-brand-navy mt-2">4.9 / 5.0</h2>
              <p className="text-yellow-500 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                Top Rated Interpreter
              </p>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Upcoming Jobs */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold text-brand-navy mb-6">Upcoming Sessions</h3>
              <div className="space-y-4">
                {upcomingJobs.map((job) => (
                  <div key={job.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-800">{job.client}</h4>
                      <span className="bg-brand-cyan/10 text-brand-cyan text-xs font-bold px-2 py-1 rounded-full">{job.type}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{job.language}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {job.time}
                    </div>
                    <button className="mt-3 w-full bg-brand-navy hover:bg-brand-royal text-white text-sm font-bold py-2 rounded-lg transition">
                      Join Session
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Jobs */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold text-brand-navy mb-6">Available Jobs</h3>
              <div className="space-y-4">
                {availableJobs.map((job) => (
                  <div key={job.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-800">{job.client}</h4>
                      <span className="text-green-600 font-bold text-sm">{job.rate}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{job.language} • {job.duration}</p>
                    <button className="mt-3 w-full bg-white border-2 border-brand-royal text-brand-royal hover:bg-brand-royal hover:text-white text-sm font-bold py-2 rounded-lg transition">
                      Accept Job
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default InterpreterPortal;