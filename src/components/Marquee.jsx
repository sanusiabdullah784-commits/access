function Marquee() {
  // Messages to scroll (aligned with your Interpretation-first branding)
  const messages = [
    "🌟 24/7 Professional Interpretation Services Available Now",
    "🇨🇳 Initial Specialization: Expert Mandarin Interpretation",
    "🌍 Serving Clients Globally with Accuracy & Confidentiality",
    "📞 Call or WhatsApp Us Instantly: 0816 668 5270",
    "💼 Corporate, Legal, and Medical Interpretation Supported",
    "🔒 100% Secure and Confidential Language Solutions"
  ];

  // Duplicate the array to ensure a seamless, gapless infinite loop
  const duplicatedMessages = [...messages, ...messages, ...messages];

  return (
    <div className="bg-brand-royal text-white py-2.5 overflow-hidden whitespace-nowrap relative border-b border-brand-navy/20">
      <div className="flex animate-marquee w-max">
        {duplicatedMessages.map((msg, index) => (
          <span key={index} className="mx-8 text-sm md:text-base font-semibold flex items-center">
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Marquee;