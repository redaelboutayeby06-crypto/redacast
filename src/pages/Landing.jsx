import { Link } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import Waveform from '../components/Waveform';

const FEATURES = [
  { icon: '🎙️', label: 'Made for YouTubers', desc: 'Built specifically for Reddit story channels, commentary, and narration. Not corporate presentations.' },
  { icon: '⚡', label: 'Generate in seconds', desc: 'Type your script, pick a voice, click generate. Your voiceover is ready instantly.' },
  { icon: '📥', label: 'MP3 download', desc: 'Every generation exports as a clean MP3 ready for your video editor.' },
  { icon: '🆓', label: '500 chars free — no signup', desc: 'Try it right now. No account needed. Just type and generate.' },
  { icon: '🔊', label: '3 voice engines', desc: 'Free uses Microsoft Neural. Pro uses Google TTS 220+ voices. Premium uses ElevenLabs — the best in the world.' },
  { icon: '🌍', label: 'More languages coming', desc: 'English now. Arabic, French, Spanish coming soon — perfect for multilingual creators.' },
];

const COMPARE = [
  ['Free chars (no signup)',    '500 chars',     '500 chars',     '0 chars'],
  ['Free chars (with account)', '5,000/week',    '20,000/week',   '~333/month'],
  ['Voice engine',              'Microsoft TTS', 'Microsoft TTS', 'Standard AI'],
  ['Built for YouTubers',       true,            false,           false],
  ['No credit card ever',       true,            true,            false],
  ['Unlimited price',           '$4.99/mo',      '$9.99/mo',      '$22/mo'],
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div style={{ background: '#000', minHeight: '100vh', overflowX: 'hidden', color: '#fff', fontFamily: 'sans-serif' }}>

      {/* Grid texture */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
        backgroundSize: '48px 48px'
      }} />

      {/* Orbs */}
      <div style={{ position: 'fixed', width: 600, height: 600, background: 'radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 70%)', top: -200, left: -200, zIndex: 0, borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', width: 500, height: 500, background: 'radial-gradient(circle, rgba(184,255,87,0.04) 0%, transparent 70%)', top: 400, right: -150, zIndex: 0, borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Nav */}
      <nav style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid #111' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <Waveform bars={8} active height={20} />
          <span style={{ fontWeight: 800, fontSize: 20, color: '#00e5ff', letterSpacing: '-0.02em' }}>ReVoice AI</span>
        </Link>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: 14, color: '#555', textDecoration: 'none' }}>Home</Link>
          <a href="#pricing" style={{ fontSize: 14, color: '#555', textDecoration: 'none' }}>Pricing</a>
          <a href="#compare" style={{ fontSize: 14, color: '#555', textDecoration: 'none' }}>Compare</a>
          <Link to="/login" style={{ fontSize: 14, padding: '8px 16px', background: 'transparent', border: '1px solid #222', borderRadius: '8px', color: '#888', textDecoration: 'none' }}>Sign in</Link>
          <Link to={user ? '/app' : '/login'} style={{ fontSize: 14, padding: '8px 16px', background: 'linear-gradient(135deg, #00e5ff, #b8ff57)', borderRadius: '8px', color: '#000', fontWeight: '700', textDecoration: 'none' }}>
            {user ? 'Open App →' : 'Try free →'}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '100px 24px 80px', maxWidth: 820, margin: '0 auto' }}>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(184,255,87,0.08)', border: '1px solid rgba(184,255,87,0.2)', borderRadius: '99px', padding: '6px 14px', fontSize: '13px', color: '#b8ff57', marginBottom: '28px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#b8ff57', display: 'inline-block' }} />
          Free for YouTube creators · No credit card ever
        </div>

        <h1 style={{ fontSize: 'clamp(48px, 8vw, 88px)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 28 }}>
          <span style={{ color: '#fff' }}>Professional voiceovers</span>
          <br />
          <span style={{ color: '#00e5ff' }}>for your YouTube channel.</span>
        </h1>

        <p style={{ fontSize: 19, color: '#555', lineHeight: 1.7, maxWidth: 540, margin: '0 auto 40px' }}>
          Type your script. Pick a voice. Download MP3. Built for Reddit story channels, commentary, and narration. <strong style={{ color: '#888' }}>500 chars free — no signup needed.</strong>
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
          <Link to={user ? '/app' : '/app'} style={{ fontSize: 17, padding: '16px 36px', background: 'linear-gradient(135deg, #00e5ff, #b8ff57)', borderRadius: '12px', color: '#000', fontWeight: '800', textDecoration: 'none' }}>
            Try Free Now — No Signup →
          </Link>
          <Link to="/login" style={{ fontSize: 17, padding: '16px 36px', background: 'transparent', border: '1px solid #222', borderRadius: '12px', color: '#888', fontWeight: '600', textDecoration: 'none' }}>
            Create Account
          </Link>
        </div>
        <p style={{ color: '#333', fontSize: '13px' }}>500 chars free without account · 5,000/week with free account</p>

        {/* Demo card */}
        <div style={{ marginTop: 64, background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '20px', padding: '32px', textAlign: 'left', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontSize: '12px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'monospace' }}>Live demo</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)', borderRadius: '99px', padding: '4px 10px', fontSize: '12px', color: '#00e5ff' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#00e5ff', display: 'inline-block' }} />
              Generating...
            </span>
          </div>
          <Waveform bars={22} active height={48} />
          <div style={{ marginTop: 20, fontFamily: 'monospace', fontSize: 14, color: '#666', background: '#111', borderRadius: 10, padding: '14px 18px', borderLeft: '3px solid #00e5ff' }}>
            "Hey everyone, welcome back to my channel…"
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ position: 'relative', zIndex: 10, padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: '38px', fontWeight: '800', marginBottom: '12px' }}>Built for creators</h2>
          <p style={{ color: '#555', fontSize: '16px' }}>Everything you need to sound consistent across every video.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ background: '#0a0a0a', border: '1px solid #111', borderRadius: '16px', padding: '28px', transition: 'border-color 0.2s ease', cursor: 'default' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,229,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#111'}
            >
              <div style={{ fontSize: '28px', marginBottom: '14px' }}>{f.icon}</div>
              <div style={{ fontWeight: '700', fontSize: '17px', color: '#fff', marginBottom: '8px' }}>{f.label}</div>
              <div style={{ color: '#444', fontSize: '14px', lineHeight: '1.6' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Voice engines explained */}
      <section style={{ position: 'relative', zIndex: 10, padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '38px', fontWeight: '800', marginBottom: '12px' }}>3 voice engines. You pick.</h2>
          <p style={{ color: '#555', fontSize: '16px' }}>Same sentence. Three different engines. The difference is obvious.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {[
            { engine: 'Microsoft Neural', plan: 'Free', planColor: '#b8ff57', quality: '⭐⭐⭐⭐', color: '#b8ff57', desc: '8 natural voices. Fast. Unlimited. No account needed for first 500 chars.', tag: 'Free forever' },
            { engine: 'Google TTS', plan: 'Pro — $4.99/mo', planColor: '#00e5ff', quality: '⭐⭐⭐⭐⭐', color: '#00e5ff', desc: '220+ voices. 40+ languages. Crisp & clear. Used by professional creators.', tag: 'Most popular' },
            { engine: 'ElevenLabs', plan: 'Premium — $19.99/mo', planColor: '#c084fc', quality: '⭐⭐⭐⭐⭐⭐', color: '#c084fc', desc: 'The most human AI voice on the planet. Used by top YouTubers globally.', tag: 'Best quality' },
          ].map((v, i) => (
            <div key={i} style={{ background: '#0a0a0a', border: `1px solid ${v.color}22`, borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, background: `radial-gradient(circle, ${v.color}08 0%, transparent 70%)`, borderRadius: '50%' }} />
              <div style={{ display: 'inline-block', background: `${v.color}15`, border: `1px solid ${v.color}33`, borderRadius: '99px', padding: '3px 10px', fontSize: '11px', color: v.color, fontWeight: '700', marginBottom: '12px' }}>{v.tag}</div>
              <div style={{ fontWeight: '800', fontSize: '18px', color: v.color, marginBottom: '4px' }}>{v.engine}</div>
              <div style={{ fontSize: '12px', color: '#444', marginBottom: '12px' }}>{v.plan}</div>
              <div style={{ fontSize: '14px', marginBottom: '12px' }}>{v.quality}</div>
              <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section id="compare" style={{ position: 'relative', zIndex: 10, padding: '80px 24px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ fontSize: '38px', fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: '40px' }}>How we compare</h2>
        <div style={{ background: '#0a0a0a', border: '1px solid #111', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #111' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', color: '#333', fontFamily: 'monospace', fontSize: '11px', textTransform: 'uppercase', fontWeight: 500 }}>Feature</th>
                <th style={{ padding: '16px 24px', textAlign: 'center', color: '#00e5ff', fontSize: '14px', fontWeight: '700' }}>ReVoice AI</th>
                <th style={{ padding: '16px 24px', textAlign: 'center', color: '#444', fontSize: '14px', fontWeight: '700' }}>TTSMaker</th>
                <th style={{ padding: '16px 24px', textAlign: 'center', color: '#444', fontSize: '14px', fontWeight: '700' }}>ElevenLabs</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([feat, ours, ttsmaker, eleven], i) => (
                <tr key={i} style={{ borderBottom: i < COMPARE.length - 1 ? '1px solid #0d0d0d' : 'none' }}>
                  <td style={{ padding: '14px 24px', color: '#555', fontSize: '14px' }}>{feat}</td>
                  <td style={{ padding: '14px 24px', textAlign: 'center', color: ours === true ? '#b8ff57' : '#00e5ff', fontSize: '14px', fontWeight: '600' }}>
                    {ours === true ? '✓' : ours === false ? '✗' : ours}
                  </td>
                  <td style={{ padding: '14px 24px', textAlign: 'center', color: '#444', fontSize: '14px' }}>
                    {ttsmaker === true ? '✓' : ttsmaker === false ? '✗' : ttsmaker}
                  </td>
                  <td style={{ padding: '14px 24px', textAlign: 'center', color: '#444', fontSize: '14px' }}>
                    {eleven === true ? '✓' : eleven === false ? '✗' : eleven}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ position: 'relative', zIndex: 10, padding: '80px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ fontSize: '38px', fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: '8px' }}>Simple pricing</h2>
        <p style={{ color: '#555', textAlign: 'center', fontSize: '16px', marginBottom: '48px' }}>Start free. Upgrade when you're ready. Cancel anytime.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>

          {/* Free */}
          <div style={{ background: '#0a0a0a', border: '1px solid #111', borderRadius: '20px', padding: '32px' }}>
            <div style={{ fontWeight: '800', fontSize: '20px', color: '#fff', marginBottom: '4px' }}>Free</div>
            <div style={{ fontSize: '42px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>$0<span style={{ fontSize: '15px', color: '#333', fontWeight: '400' }}>/mo</span></div>
            <div style={{ fontSize: '12px', color: '#444', marginBottom: '24px' }}>No credit card. No catch.</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                '500 chars without signup',
                '5,000 chars/week with account',
                '8 Microsoft Neural voices',
                'MP3 download',
                'Speed control',
              ].map(f => (
                <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '14px', color: '#555' }}>
                  <span style={{ color: '#b8ff57', marginTop: '1px' }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Link to="/app" style={{ display: 'block', textAlign: 'center', background: 'transparent', border: '1px solid #222', borderRadius: '10px', padding: '12px', color: '#666', fontWeight: '600', textDecoration: 'none', fontSize: '15px' }}>Try free now</Link>
          </div>

          {/* Pro */}
          <div style={{ background: '#0a0a0a', border: '1px solid rgba(0,229,255,0.3)', borderRadius: '20px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
            <div style={{ position: 'relative' }}>
              {/* Sneaky banner */}
              <div style={{ background: 'linear-gradient(135deg, #00e5ff, #b8ff57)', borderRadius: '8px', padding: '8px 12px', marginBottom: '16px', textAlign: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#000' }}>🤫 WE PROBABLY SHOULDN'T OFFER THIS</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '4px' }}>
                <div style={{ fontWeight: '800', fontSize: '20px', color: '#fff' }}>Pro</div>
                <span style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.3)', borderRadius: '99px', padding: '2px 8px', fontSize: '10px', color: '#00e5ff', fontWeight: '700' }}>MOST POPULAR</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: '4px' }}>
                <div style={{ fontSize: '42px', fontWeight: '800', color: '#00e5ff' }}>$4.99<span style={{ fontSize: '15px', color: '#333', fontWeight: '400' }}>/mo</span></div>
                <div style={{ fontSize: '14px', color: '#333', textDecoration: 'line-through' }}>$22/mo</div>
              </div>
              <div style={{ fontSize: '12px', color: '#b8ff57', marginBottom: '24px', fontWeight: '600' }}>ElevenLabs charges $22 for less. You pay $4.99.</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Unlimited generations forever',
                  'Google TTS — 220+ voices',
                  '40+ languages',
                  'Priority processing',
                  'No weekly limits ever',
                  'Early access to new features',
                ].map(f => (
                  <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '14px', color: '#666' }}>
                    <span style={{ color: '#00e5ff', marginTop: '1px' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link to="/login" style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #00e5ff, #b8ff57)', borderRadius: '10px', padding: '14px', color: '#000', fontWeight: '800', textDecoration: 'none', fontSize: '15px' }}>Get Pro for $4.99 →</Link>
              <p style={{ textAlign: 'center', color: '#333', fontSize: '11px', marginTop: '8px', marginBottom: 0 }}>Cancel anytime. No questions asked.</p>
            </div>
          </div>

          {/* Premium */}
          <div style={{ background: '#0a0a0a', border: '1px solid rgba(192,132,252,0.2)', borderRadius: '20px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'radial-gradient(circle, rgba(192,132,252,0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontWeight: '800', fontSize: '20px', color: '#fff', marginBottom: '4px' }}>Premium</div>
              <div style={{ fontSize: '42px', fontWeight: '800', color: '#c084fc', marginBottom: '8px' }}>$19.99<span style={{ fontSize: '15px', color: '#333', fontWeight: '400' }}>/mo</span></div>
              <div style={{ fontSize: '12px', color: '#444', marginBottom: '24px' }}>For monetized channels who need the best.</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Everything in Pro',
                  'ElevenLabs voices',
                  'Most human AI quality',
                  '1000+ voice styles',
                  'Best for monetized channels',
                ].map(f => (
                  <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '14px', color: '#666' }}>
                    <span style={{ color: '#c084fc', marginTop: '1px' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link to="/login" style={{ display: 'block', textAlign: 'center', background: 'transparent', border: '1px solid rgba(192,132,252,0.3)', borderRadius: '10px', padding: '12px', color: '#c084fc', fontWeight: '700', textDecoration: 'none', fontSize: '15px' }}>Start Premium →</Link>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', zIndex: 10, padding: '80px 24px 120px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '48px', fontWeight: '800', color: '#fff', marginBottom: '14px' }}>Start generating today</h2>
        <p style={{ color: '#444', fontSize: '16px', marginBottom: '36px' }}>No credit card. 500 chars free right now. No signup needed.</p>
        <Link to="/app" style={{ fontSize: '17px', padding: '16px 40px', background: 'linear-gradient(135deg, #b8ff57, #00e5ff)', borderRadius: '12px', color: '#000', fontWeight: '800', textDecoration: 'none' }}>
          Try ReVoice AI Free →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 10, borderTop: '1px solid #0d0d0d', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Waveform bars={6} active height={16} />
          <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#333' }}>ReVoice AI</span>
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#333' }}>© 2026 · Built for creators</span>
      </footer>

    </div>
  );
}