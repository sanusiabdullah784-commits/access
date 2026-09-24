function ActivityCounters() {
  const counters = [
    { label: 'Happy Clients', value: '1,240+', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { label: 'Interpretations Completed', value: '45,800+', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
    { label: 'Languages Supported', value: '150+', icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129' },
    { label: 'Countries Reached', value: '85+', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  return (
    <section className="py-20 bg-brand-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Global Impact</h2>
          <p className="text-blue-200 max-w-2xl mx-auto">Connecting the world through seamless, professional language services.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {counters.map((counter, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 hover:bg-white/20 transition">
              <div className="w-16 h-16 bg-brand-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={counter.icon} /></svg>
              </div>
              <h3 className="text-4xl font-black text-white mb-2">{counter.value}</h3>
              <p className="text-blue-200 font-medium">{counter.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ActivityCounters;