import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold text-white">
          ReVoice<span className="text-purple-400">AI</span>
        </Link>
        <Link 
          to="/" 
          className="text-white hover:text-purple-300 transition-colors"
        >
          ← Back to Home
        </Link>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 text-white">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          Terms of Service
        </h1>
        
        <div className="prose prose-invert prose-purple max-w-none space-y-6 text-gray-300">
          <p className="text-sm text-purple-300">Last Updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using ReVoice AI ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Description of Service</h2>
            <p>ReVoice AI provides text-to-speech conversion services using AI technology. Features include:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Free guest access with basic voice options</li>
              <li>Premium subscription with advanced voice features</li>
              <li>Audio file generation and download</li>
              <li>User account creation and management</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. User Accounts</h2>
            <p>3.1. You may use the Service as a guest without registering.</p>
            <p className="mt-2">3.2. To access premium features, you must create an account. You are responsible for maintaining the security of your account.</p>
            <p className="mt-2">3.3. You must be at least 13 years old to use the Service. Users under 18 must have parental consent.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Subscription and Payments</h2>
            <p>4.1. Premium features require a paid subscription.</p>
            <p className="mt-2">4.2. Subscriptions are billed monthly and automatically renew unless cancelled.</p>
            <p className="mt-2">4.3. You can cancel anytime through your account settings.</p>
            <p className="mt-2">4.4. All payments are processed securely through PayPal. We do not store your payment information.</p>
            <p className="mt-2">4.5. Refunds are handled on a case-by-case basis. Please contact support within 7 days of purchase for refund requests.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Acceptable Use Policy</h2>
            <p>You agree NOT to use ReVoice AI to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Create misleading, fraudulent, or deceptive content</li>
              <li>Impersonate individuals without consent</li>
              <li>Generate hate speech, harassment, or discriminatory content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Attempt to reverse engineer or copy the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Intellectual Property</h2>
            <p>6.1. You retain ownership of the text you input and the audio you generate.</p>
            <p className="mt-2">6.2. ReVoice AI owns the service, technology, and underlying AI models.</p>
            <p className="mt-2">6.3. You may use generated audio for commercial purposes (YouTube videos, etc.).</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Termination</h2>
            <p>We reserve the right to terminate or suspend accounts for violations of these terms, with or without notice.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">8. Disclaimer of Warranties</h2>
            <p>The Service is provided "as is" without warranties of any kind. We do not guarantee that the Service will be uninterrupted or error-free.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">9. Limitation of Liability</h2>
            <p>ReVoice AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">10. Changes to Terms</h2>
            <p>We may modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">11. Contact Information</h2>
            <p>For questions about these Terms, contact: support@revoiceai.com</p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-800/30 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <Link to="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfService;