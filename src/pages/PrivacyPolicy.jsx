import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-blue-100">
              Last updated: September 15, 2026
            </p>
          </div>
        </section>

        {/* Policy Content */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
              
              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">1. Introduction</h2>
                <p>
                  Welcome to Access Lingua ("we", "our", or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website and use our translation and interpretation services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">2. Information We Collect</h2>
                <p>
                  We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, or otherwise contact us. This includes:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li><strong>Personal Identifiers:</strong> Name, email address, phone number, and company name.</li>
                  <li><strong>Payment Data:</strong> Credit card numbers and billing details (processed securely via our payment providers).</li>
                  <li><strong>Usage Data:</strong> IP address, browser type, and pages visited to help us improve our services.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">3. How We Use Your Information</h2>
                <p>
                  We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>To facilitate account creation and logon process.</li>
                  <li>To send you marketing and promotional communications (with your consent).</li>
                  <li>To protect our Services and prevent fraud.</li>
                  <li>To fulfill and manage your translation and interpretation orders.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">4. Data Security</h2>
                <p>
                  We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. All video and phone interpretations are encrypted end-to-end.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">5. Cookies and Tracking Technologies</h2>
                <p>
                  We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">6. Contact Us</h2>
                <p>
                  If you have questions or comments about this policy, you may email us at privacy@accesslingua.com or by post to:
                </p>
                <p className="mt-2 font-medium text-gray-800">
                  Access Lingua<br />
                  123 Global Plaza, Tech District<br />
                  New York, NY 10001
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default PrivacyPolicy;