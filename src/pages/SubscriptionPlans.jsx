import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PaymentModal from '../components/PaymentModal';

function SubscriptionPlans() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedAmount, setSelectedAmount] = useState('0');

  const handleChoosePlan = (planName, planPrice) => {
    setSelectedPlan(planName);
    // Remove the '$' and '/month' for a clean amount display
    const cleanAmount = planPrice.replace('$', '').replace('/month', '');
    setSelectedAmount(cleanAmount);
    setIsPaymentOpen(true);
  };

  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      desc: "Perfect for individuals and small projects.",
      features: ["5 Languages Supported", "10 Hours of Interpretation", "Email Support", "Standard Accuracy"],
      popular: false
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      desc: "Best for growing businesses and teams.",
      features: ["50+ Languages Supported", "50 Hours of Interpretation", "24/7 Priority Support", "Certified Translations", "Video & Phone Access"],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "For large corporations with global needs.",
      features: ["150+ Languages Supported", "Unlimited Interpretation", "Dedicated Account Manager", "API Access", "Custom Integrations"],
      popular: false
    }
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

        {/* Pricing Grid */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-3xl shadow-xl p-8 flex flex-col transition transform hover:-translate-y-2 ${
                    plan.popular ? 'border-2 border-brand-royal relative md:-mt-4 md:mb-4' : 'border border-gray-100'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span className="bg-brand-royal text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <h3 className="text-2xl font-bold text-brand-navy mb-2">{plan.name}</h3>
                  <p className="text-gray-500 mb-6">{plan.desc}</p>
                  
                  <div className="mb-8">
                    <span className="text-5xl font-black text-brand-navy">{plan.price}</span>
                    <span className="text-gray-500 text-lg">{plan.period}</span>
                  </div>

                  <ul className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <svg className={`w-6 h-6 flex-shrink-0 ${plan.popular ? 'text-brand-royal' : 'text-brand-cyan'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => handleChoosePlan(plan.name, plan.price)}
                    className={`w-full py-3 rounded-full font-bold transition shadow-lg ${
                      plan.popular 
                        ? 'bg-brand-royal hover:bg-brand-navy text-white' 
                        : 'bg-gray-100 hover:bg-brand-cyan hover:text-white text-brand-navy'
                    }`}
                  >
                    Choose {plan.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Teaser */}
        <section className="py-20 bg-white text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-brand-navy mb-4">Have questions about our plans?</h2>
            <p className="text-gray-600 mb-8">Check out our FAQ page or contact our sales team for a custom quote.</p>
            <button className="bg-transparent border-2 border-brand-royal text-brand-royal hover:bg-brand-royal hover:text-white px-8 py-3 rounded-full font-bold transition">
              View FAQ
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default SubscriptionPlans;