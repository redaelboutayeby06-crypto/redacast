import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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
          Privacy Policy
        </h1>
        
        <div className="prose prose-invert prose-purple max-w-none space-y-6 text-gray-300">
          <p className="text-sm text-purple-300">Last Updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-white mt-4 mb-2">1.1. Account Information</h3>
            <p>When you create an account, we collect:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Email address</li>
              <li>Name (optional)</li>
              <li>Profile information</li>
            </ul>

            <h3 className="text-xl font-medium text-white mt-4 mb-2">1.2. Usage Data</h3>
            <p>We automatically collect:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Text content you convert to speech (temporarily processed, not stored)</li>
              <li>Voice preferences and settings</li>
              <li>Generated audio files (stored temporarily for delivery)</li>
              <li>Usage statistics and feature interactions</li>
            </ul>

            <h3 className="text-xl font-medium text-white mt-4 mb-2">1.3. Payment Information</h3>
            <p>All payments are processed by PayPal. We do not store credit card or banking information on our servers.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6">
              <li>Provide and improve the TTS service</li>
              <li>Process your subscription payments</li>
              <li>Send service updates and support messages</li>
              <li>Analyze usage patterns to enhance features</li>
              <li>Prevent fraud and abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Data Storage and Security</h2>
            <p>3.1. Your data is stored securely using Firebase (Google Cloud Platform).</p>
            <p className="mt-2">3.2. Generated audio files are deleted after 30 days unless you save them.</p>
            <p className="mt-2">3.3. We use industry-standard encryption to protect your data.</p>
            <p className="mt-2">3.4. We retain account information until you delete your account.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 mt-2">
              <li><span className="text-white">Firebase (Google):</span> Authentication and database</li>
              <li><span className="text-white">PayPal:</span> Payment processing</li>
              <li><span className="text-white">Vercel:</span> Hosting and serverless functions</li>
              <li><span className="text-white">Edge-TTS:</span> Voice generation service</li>
            </ul>
            <p className="mt-4">Each service has its own privacy policy and data handling practices.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Guest Users</h2>
            <p>If you use the service without an account:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>We process your text temporarily but don't store it</li>
              <li>Generated audio is available for download but not saved on our servers</li>
              <li>We collect anonymous usage statistics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
            <p className="mt-4">To exercise these rights, contact us at privacy@revoiceai.com</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Cookies and Tracking</h2>
            <p>We use essential cookies for authentication and service functionality. We do not use tracking cookies for advertising.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">8. Children's Privacy</h2>
            <p>Our service is not directed to children under 13. We do not knowingly collect information from children under 13. If you believe a child has provided us with personal information, contact us immediately.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">9. International Data Transfers</h2>
            <p>Your information may be transferred to and processed in countries where our servers operate. By using the Service, you consent to this transfer.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy periodically. We will notify you of material changes via email or a notice on our website.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">11. Contact Us</h2>
            <p>For privacy-related questions:</p>
            <p className="mt-2">Email: privacy@revoiceai.com</p>
            <p>Address: [Your Business Address - optional]</p>
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

export default PrivacyPolicy;