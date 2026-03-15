import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-0.03em' }}>Reda<span style={{ color: '#6366f1' }}>cast</span></span>
        </Link>
        <Link to="/" style={{ color: '#555', fontSize: 14, textDecoration: 'none' }}>← Back to Home</Link>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '60px 24px 100px' }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>Terms of Service</h1>
        <p style={{ color: '#555', fontSize: 13, marginBottom: 48 }}>Last Updated: {new Date().toLocaleDateString()}</p>

        {[
          {
            title: '1. Acceptance of Terms',
            content: <p style={p}>By accessing or using Redacast ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
          },
          {
            title: '2. Description of Service',
            content: <p style={p}>Redacast provides AI-powered text-to-speech conversion services. Features include free guest access with basic voice options, premium subscription with advanced voice features, audio file generation and download, and user account creation and management.</p>
          },
          {
            title: '3. User Accounts',
            content: <p style={p}>You may use the Service as a guest without registering. To access premium features, you must create an account and are responsible for maintaining its security. You must be at least 13 years old to use the Service. Users under 18 must have parental consent.</p>
          },
          {
            title: '4. Subscription and Payments',
            content: <p style={p}>Premium features require a paid subscription billed monthly that renews automatically unless cancelled. You can cancel anytime through your account settings. All payments are processed securely through Paddle. We do not store your payment information. Refunds are handled on a case-by-case basis — contact support within 7 days of purchase at redacastapp@gmail.com.</p>
          },
          {
            title: '5. Acceptable Use Policy',
            content: <p style={p}>You agree NOT to use Redacast to create misleading, fraudulent, or deceptive content, impersonate individuals without consent, generate hate speech or discriminatory content, violate any applicable laws or regulations, or attempt to reverse engineer or copy the service.</p>
          },
          {
            title: '6. Intellectual Property',
            content: <p style={p}>You retain ownership of the text you input and the audio you generate. Redacast owns the service, technology, and underlying AI models. You may use generated audio for commercial purposes including YouTube videos and podcasts.</p>
          },
          {
            title: '7. Termination',
            content: <p style={p}>We reserve the right to terminate or suspend accounts for violations of these terms, with or without notice.</p>
          },
          {
            title: '8. Disclaimer of Warranties',
            content: <p style={p}>The Service is provided "as is" without warranties of any kind. We do not guarantee that the Service will be uninterrupted or error-free.</p>
          },
          {
            title: '9. Limitation of Liability',
            content: <p style={p}>Redacast shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.</p>
          },
          {
            title: '10. Changes to Terms',
            content: <p style={p}>We may modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms.</p>
          },
          {
            title: '11. Contact Information',
            content: <p style={p}>For questions about these Terms, contact us at: <span style={{ color: '#a5b4fc' }}>redacastapp@gmail.com</span></p>
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 40, paddingBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#fff' }}>{section.title}</h2>
            {section.content}
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 48px', display: 'flex', justifyContent: 'center', gap: 24 }}>
        <Link to="/privacy" style={{ color: '#444', fontSize: 12, textDecoration: 'none' }}>Privacy Policy</Link>
        <Link to="/terms" style={{ color: '#444', fontSize: 12, textDecoration: 'none' }}>Terms of Service</Link>
      </footer>
    </div>
  );
};

const p = { color: '#666', fontSize: 14, lineHeight: 1.8, margin: 0 };

export default TermsOfService;