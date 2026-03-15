import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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
        <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>Privacy Policy</h1>
        <p style={{ color: '#555', fontSize: 13, marginBottom: 48 }}>Last Updated: {new Date().toLocaleDateString()}</p>

        {[
          {
            title: '1. Information We Collect',
            content: (
              <>
                <h3 style={h3}>1.1. Account Information</h3>
                <p style={p}>When you create an account, we collect your email address, optional name, and profile information.</p>
                <h3 style={h3}>1.2. Usage Data</h3>
                <p style={p}>We automatically collect text content you convert to speech (temporarily processed, not stored), voice preferences and settings, generated audio files (stored temporarily for delivery), and usage statistics.</p>
                <h3 style={h3}>1.3. Payment Information</h3>
                <p style={p}>All payments are processed by Paddle. We do not store credit card or banking information on our servers.</p>
              </>
            )
          },
          {
            title: '2. How We Use Your Information',
            content: <p style={p}>We use your information to provide and improve the TTS service, process your subscription payments, send service updates and support messages, analyze usage patterns to enhance features, and prevent fraud and abuse.</p>
          },
          {
            title: '3. Data Storage and Security',
            content: <p style={p}>Your data is stored securely using Supabase. Generated audio files are deleted after 30 days unless you save them. We use industry-standard encryption to protect your data and retain account information until you delete your account.</p>
          },
          {
            title: '4. Third-Party Services',
            content: (
              <p style={p}>We use the following third-party services: <strong style={{ color: '#fff' }}>Supabase</strong> for authentication and database, <strong style={{ color: '#fff' }}>Paddle</strong> for payment processing, <strong style={{ color: '#fff' }}>Vercel</strong> for hosting and serverless functions, and <strong style={{ color: '#fff' }}>Edge-TTS</strong> for voice generation. Each service has its own privacy policy.</p>
            )
          },
          {
            title: '5. Guest Users',
            content: <p style={p}>If you use the service without an account, we process your text temporarily but don't store it. Generated audio is available for download but not saved on our servers. We collect anonymous usage statistics only.</p>
          },
          {
            title: '6. Your Rights',
            content: <p style={p}>You have the right to access your personal data, correct inaccurate data, delete your account and associated data, export your data, and opt-out of marketing communications. To exercise these rights, contact us at privacy@redacast.app</p>
          },
          {
            title: '7. Cookies and Tracking',
            content: <p style={p}>We use essential cookies for authentication and service functionality. We do not use tracking cookies for advertising.</p>
          },
          {
            title: "8. Children's Privacy",
            content: <p style={p}>Our service is not directed to children under 13. We do not knowingly collect information from children under 13. If you believe a child has provided us with personal information, contact us immediately.</p>
          },
          {
            title: '9. International Data Transfers',
            content: <p style={p}>Your information may be transferred to and processed in countries where our servers operate. By using the Service, you consent to this transfer.</p>
          },
          {
            title: '10. Changes to This Policy',
            content: <p style={p}>We may update this Privacy Policy periodically. We will notify you of material changes via email or a notice on our website.</p>
          },
          {
            title: '11. Contact Us',
            content: <p style={p}>For privacy-related questions, email us at: <span style={{ color: '#a5b4fc' }}>privacy@redacast.app</span></p>
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

const h3 = { fontSize: 15, fontWeight: 700, color: '#ddd', margin: '16px 0 8px' };
const p = { color: '#666', fontSize: 14, lineHeight: 1.8, margin: 0 };

export default PrivacyPolicy;