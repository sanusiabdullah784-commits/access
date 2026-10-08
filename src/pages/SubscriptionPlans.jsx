import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PaymentModal from '../components/PaymentModal';

function SubscriptionPlans() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedAmount, setSelectedAmount] = useState('0');
  
  // NEW: Billing Toggle State
  const [isAnnual, setIsAnnual] = useState(false);
  
  // NEW: Usage Calculator State
  const [minutes, setMinutes] = useState(50);

  const handleChoosePlan = (planName, planPrice) => {
    setSelectedPlan(planName);
    setSelectedAmount(planPrice.toString());
    setIsPaymentOpen(true);
  };

  // Helper to get recommended plan based on usage
  const getRecommendedPlan = (mins) => {
    if (mins <= 100) return "Starter";
    if (mins <= 500) return "Professional";
    return "Enterprise";
  };

  const plans = [
    {
      name: "Starter",
      monthlyPrice: 29,
      annualPrice: 23, // ~20% discount
      period: "/month",
      desc: "Perfect for individuals and small projects.",
      features: [
        "4 Core Languages Supported",
        "10 Hours of OPI/VRI included",
        "Standard Email Support",
        "Secure, Encrypted Sessions"
      ],
      popular: false
    },
    {
      name: "Professional",
      monthlyPrice: 79,
      annualPrice: 63, // ~20% discount
      period: "/month",
      desc: "Best for growing businesses and medical/legal teams.",
      features: [
        "4 Core + Extended Languages",
        "50 Hours of OPI/VRI included",
        "24/7 Priority Phone Support",
        "HIPAA & GDPR Compliant",
        "Video & Phone Access"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      monthlyPrice: null,
      annualPrice: null,
      period: "",
      desc: "For large corporations with global, high-volume needs.",
      features: [
        "150+ Languages On-Demand",
        "Unlimited Interpretation Minutes",
        "Dedicated Account Manager",
        "Custom API Access & Integrations",
        "Advanced Analytics Dashboard"
      ],
      popular: false
    }
  ];

  // NEW: Comparison Matrix Data
  const comparisonFeatures = [
    { feature: "Core Languages (EN, IG, ZH, PID)", starter: true, professional: true, enterprise: true },
    { feature: "Extended Languages Network", starter: false, professional: true, enterprise: true },
    { feature: "OPI (Phone) Access", starter: true, professional: true, enterprise: true },
    { feature: "VRI (Video) Access", starter: true, professional: true, enterprise: true },
    { feature: "In-Person Interpretation", starter: false, professional: true, enterprise: true },
    { feature: "HIPAA / GDPR Compliance", starter: true, professional: true, enterprise: true },
    { feature: "Dedicated Account Manager", starter: false, professional: false, enterprise: true },
    { feature: "Custom API Access", starter: false, professional: false, enterprise: true },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      {/* Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        amount={selectedAmount} 
        purpose={`${selectedPlan} Subscription`} 
      />
      
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Choose the perfect plan for your language needs. Upgrade or downgrade at any time.
            </p>
          </div>
        </section>

        {/* Pricing Grid Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* NEW: Monthly/Annual Billing Toggle */}
            <div className="flex justify-center items-center space-x-4 mb-12">
              <span className={`text-sm font-bold ${!isAnnual ? 'text-brand-navy' : 'text-gray-500'}`}>Monthly</span>
              <button 
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none ${isAnnual ? 'bg-brand-royal' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`}></span>
              </button>
              <span className={`text-sm font-bold ${isAnnual ? 'text-brand-navy' : 'text-gray-500'}`}>
                Annual <span className="text-green-600 text-xs font-bold bg-green-100 px-2 py-0.5 rounded-full ml-1">Save 20%</span>
              </span>
            </div>

            {/* NEW: Usage Calculator Widget */}
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-16">
              <h3 className="text-xl font-bold text-brand-navy mb-6 text-center">Estimate Your Monthly Usage</h3>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 font-medium">Estimated interpretation minutes per month</span>
                  <span className="text-brand-royal font-bold text-lg">{minutes} mins</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1000" 
                  step="10" 
                  value={minutes} 
                  onChange={(e) => setMinutes(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-royal"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>0 mins</span>
                  <span>500 mins</span>
                  <span>1000+ mins</span>
                </div>
              </div>
              <div className="bg-brand-cyan/10 border border-brand-cyan/20 rounded-xl p-4 text-center">
                <p className="text-brand-navy font-bold flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 text-brand-royal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Based on your usage, we recommend the <span className="text-brand-royal underline">{getRecommendedPlan(minutes)}</span> plan.</span>
                </p>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => {
                const displayPrice = plan.monthlyPrice ? (isAnnual ? plan.annualPrice : plan.monthlyPrice) : "Custom";
                const isEnterprise = plan.name === "Enterprise";

                return (
                  <div 
                    key={index} 
                    className={`bg-white rounded-3xl shadow-xl p-8 flex flex-col transition transform hover:-translate-y-2 ${
                      plan.popular ? 'border-2 border-brand-royal relative md:-mt-4 md:mb-4' : 'border border-gray-100'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <span className="bg-brand-royal text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide shadow-md">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <h3 className="text-2xl font-bold text-brand-navy mb-2">{plan.name}</h3>
                    <p className="text-gray-500 mb-6">{plan.desc}</p>
                    
                    <div className="mb-8">
                      <span className="text-5xl font-black text-brand-navy">
                        {typeof displayPrice === 'number' ? `$${displayPrice}` : displayPrice}
                      </span>
                      <span className="text-gray-500 text-lg">{plan.period}</span>
                      {isAnnual && plan.monthlyPrice && (
                        <p className="text-xs text-green-600 font-bold mt-1">Billed annually (${displayPrice * 12}/year)</p>
                      )}
                    </div>

                    <ul className="space-y-4 mb-8 flex-grow">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start space-x-3">
                          <svg className={`w-6 h-6 flex-shrink-0 ${plan.popular ? 'text-brand-royal' : 'text-brand-cyan'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* NEW: Fixed Enterprise CTA */}
                    {isEnterprise ? (
                      <Link 
                        to="/contact"
                        className="w-full py-3 rounded-full font-bold transition shadow-lg bg-brand-navy hover:bg-brand-royal text-white text-center block"
                      >
                        Contact Sales
                      </Link>
                    ) : (
                      <button 
                        onClick={() => handleChoosePlan(plan.name, displayPrice)}
                        className={`w-full py-3 rounded-full font-bold transition shadow-lg ${
                          plan.popular 
                            ? 'bg-brand-royal hover:bg-brand-navy text-white' 
                            : 'bg-gray-100 hover:bg-brand-cyan hover:text-white text-brand-navy'
                        }`}
                      >
                        Choose {plan.name}
                      </button>
                    )}

                    {/* NEW: Risk-Reversal Trust Badges */}
                    <div className="mt-6 space-y-2 text-center border-t border-gray-100 pt-4">
                      <p className="text-xs text-gray-500 flex items-center justify-center space-x-1">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <span>30-Day Money-Back Guarantee</span>
                      </p>
                      <p className="text-xs text-gray-500 flex items-center justify-center space-x-1">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <span>Cancel anytime, no hidden fees</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* NEW: Detailed Feature Comparison Matrix */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-brand-navy mb-4">Detailed Feature Comparison</h2>
            <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">See exactly what's included in each tier to find the perfect fit for your organization.</p>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="p-4 font-bold text-gray-700 w-1/2">Feature</th>
                      <th className="p-4 font-bold text-center text-brand-navy">Starter</th>
                      <th className="p-4 font-bold text-center text-brand-royal bg-brand-royal/5">Professional</th>
                      <th className="p-4 font-bold text-center text-brand-navy">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {comparisonFeatures.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition">
                        <td className="p-4 text-gray-700 font-medium">{row.feature}</td>
                        <td className="p-4 text-center">
                          {row.starter ? (
                            <svg className="w-6 h-6 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          ) : (
                            <svg className="w-6 h-6 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          )}
                        </td>
                        <td className="p-4 text-center bg-brand-royal/5">
                          {row.professional ? (
                            <svg className="w-6 h-6 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          ) : (
                            <svg className="w-6 h-6 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {row.enterprise ? (
                            <svg className="w-6 h-6 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          ) : (
                            <svg className="w-6 h-6 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Teaser */}
        <section className="py-20 bg-gray-50 text-center border-t border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-brand-navy mb-4">Have questions about our plans?</h2>
            <p className="text-gray-600 mb-8">Check out our FAQ page or contact our sales team for a custom enterprise quote.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/faq" className="bg-transparent border-2 border-brand-royal text-brand-royal hover:bg-brand-royal hover:text-white px-8 py-3 rounded-full font-bold transition">
                View FAQ
              </Link>
              <Link to="/contact" className="bg-brand-royal hover:bg-brand-navy text-white px-8 py-3 rounded-full font-bold transition shadow-lg">
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default SubscriptionPlans;