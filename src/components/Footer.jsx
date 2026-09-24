function Footer() {
  return (
    <footer className="bg-brand-navy text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-cyan to-brand-royal rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold">Access Lingua</span>
            </div>
            <p className="text-blue-200 text-sm">
              Bridging languages and connecting people worldwide with premium translation services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-brand-cyan">Company</h4>
            <ul className="space-y-2 text-blue-200">
              <li><a href="/about" className="hover:text-white transition">About Us</a></li>
              <li><a href="/careers" className="hover:text-white transition">Careers</a></li>
              <li><a href="/blog" className="hover:text-white transition">Blog</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-brand-cyan">Services</h4>
            <ul className="space-y-2 text-blue-200">
              <li><a href="/services" className="hover:text-white transition">Translation</a></li>
              <li><a href="/interpreter" className="hover:text-white transition">Interpreters</a></li>
              <li><a href="/video" className="hover:text-white transition">Video Interpretation</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-brand-cyan">Contact</h4>
            <ul className="space-y-2 text-blue-200">
              <li><a href="/contact" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="/faq" className="hover:text-white transition">FAQ</a></li>
              <li>support@accesslingua.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-900 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-blue-300">
          <p>&copy; {new Date().getFullYear()} Access Lingua. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;