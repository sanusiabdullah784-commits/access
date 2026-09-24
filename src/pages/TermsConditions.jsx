import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function TermsConditions() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-brand-navy via-brand-royal to-brand-cyan text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
            <p className="text-xl text-blue-100">
              Last updated: September 15, 2026
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-gray-600 space-y-8">
              
              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">1. Agreement to Terms</h2>
                <p>
                  By accessing or using the Access Lingua website and services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time, and your continued use of the service constitutes acceptance of those changes.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">2. Description of Services</h2>
                <p>
                  Access Lingua provides professional translation, interpretation, and localization services. We act as a platform connecting clients with certified linguists and interpreters. We strive for the highest accuracy, but we do not guarantee that translations will be 100% error-free in every context.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">3. Accounts and Registration</h2>
                <p>
                  To access certain features of the platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process. You are responsible for safeguarding your password and for all activities that occur under your account.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">4. Payments and Subscriptions</h2>
                <p>
                  Certain services require payment. By purchasing credits or subscribing to a plan, you agree to pay all fees in accordance with the pricing displayed at the time of purchase. 
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li><strong>Subscriptions:</strong> Automatically renew at the end of each billing cycle unless canceled at least 24 hours before the renewal date.</li>
                  <li><strong>Refunds:</strong> Unused credits are non-refundable, except as required by law or at our sole discretion.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">5. Intellectual Property</h2>
                <p>
                  The Access Lingua logo, design, and content are the exclusive property of Access Lingua. You may not reproduce, distribute, or create derivative works from our materials without our express written permission.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">6. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law, Access Lingua shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of our services. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">7. Governing Law</h2>
                <p>
                  These Terms shall be governed and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border-l-4 border-brand-royal mt-12">
                <h3 className="text-xl font-bold text-brand-navy mb-2">Have Questions?</h3>
                <p className="mb-4">If you have any questions about these Terms, please contact our legal team.</p>
                <a href="/contact" className="inline-block bg-brand-royal hover:bg-brand-navy text-white px-6 py-2 rounded-full font-bold transition">
                  Contact Us
                </a>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default TermsConditions;