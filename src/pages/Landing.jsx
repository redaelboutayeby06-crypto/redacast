import { Link } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import Waveform from '../components/Waveform';

const FEATURES = [
  { icon: '⚡', label: 'Zero-shot cloning', desc: 'No training. Upload your voice, type text, done. Seconds — not minutes.' },
  { icon: '🎙️', label: 'Record in browser', desc: 'No extra software needed. Hit record in the app and speak for 30 seconds.' },
  { icon: '📥', label: 'MP3 download', desc: 'Every generation exports as a clean MP3 ready for your editing software.' },
  { icon: '🔒', label: 'Your voice, your data', desc: "We never sell your voice or share it with anyone. You own everything." },
  { icon: '∞', label: 'Unlimited on Pro', desc: 'Free gives you 5 generations/day. Pro is $2.99/mo for unlimited.' },
  { icon: '🆓', label: 'Actually free', desc: 'No credit card to start. No hidden fees. Just sign up and go.' },
];

const COMPARE = [
  ['Clone your own voice',     true,  true ],
  ['Record in browser',        true,  false],
  ['MP3 download',             true,  true ],
  ['No credit card to start',  true,  false],
  ['Starts at',                '$0',  '$22/mo'],
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── Grid texture ── */}
      <div className="grid-texture" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />

      {/* ── Orbs ── */}
      <div className="orb" style={{ width: 500, height: 500, background: 'rgba(0,229,255,0.06)', top: -150, left: -150, zIndex: 0 }} />
      <div className="orb" style={{ width: 400, height: 400, background: 'rgba(184,255,87,0.04)', top: 300, right: -100, zIndex: 0 }} />

      {/* ── Nav ── */}
      <nav style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Waveform bars={8} active height={20} />
          <span style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>VoiceClone AI</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/login" className="btn btn-ghost" style={{ fontSize: 14, padding: '9px 18px' }}>Sign in</Link>
          <Link to={user ? '/app' : '/login'} className="btn btn-cyan" style={{ fontSize: 14, padding: '9px 18px' }}>
            {user ? 'Open App →' : 'Start free →'}
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '100px 24px 80px', maxWidth: 800, margin: '0 auto' }}>

        <div className="tag tag-cyan fade-up" style={{ marginBottom: 28 }}>
          <span className="pulse-dot" /> Free for YouTubers
        </div>

        <h1 className="fade-up-1" style={{ fontFamily: 'Clash Display', fontSize: 'clamp(52px, 8vw, 96px)', fontWeight: 700, lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 28 }}>
          <span style={{ color: 'var(--text)' }}>Your voice.</span>
          <br />
          <span style={{ color: 'var(--cyan)' }}>Cloned instantly.</span>
        </h1>

        <p className="fade-up-2" style={{ fontSize: 20, color: 'var(--subtle)', lineHeight: 1.6, maxWidth: 520, margin: '0 auto 40px' }}>
          Upload 30 seconds of your voice. Type anything. Get it back sounding exactly like you — in seconds. <strong style={{ color: 'var(--text)' }}>100% free to start.</strong>
        </p>

        <div className="fade-up-3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to={user ? '/app' : '/login'} className="btn btn-cyan" style={{ fontSize: 17, padding: '16px 36px' }}>
            Clone My Voice Free →
          </Link>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontFamily: 'Geist Mono', fontSize: 13 }}>
            5 generations/day free
          </span>
        </div>

        {/* ── Demo card ── */}
        <div className="panel fade-up-4" style={{ marginTop: 64, padding: '32px', textAlign: 'left', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontFamily: 'Geist Mono', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Live demo</span>
            <span className="tag tag-cyan"><span className="pulse-dot" style={{ width: 5, height: 5 }} /> Cloning...</span>
          </div>
          <Waveform bars={22} active height={48} />
          <div style={{ marginTop: 20, fontFamily: 'Geist Mono', fontSize: 14, color: 'var(--subtle)', background: 'var(--surface)', borderRadius: 10, padding: '14px 18px', borderLeft: '3px solid var(--cyan)' }}>
            "Hey everyone, welcome back to my channel…"
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ position: 'relative', zIndex: 10, padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 42, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Built for creators</h2>
          <p style={{ color: 'var(--muted)', fontSize: 17 }}>Everything you need to sound consistent across every video.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="panel" style={{ padding: '28px 28px', transition: 'border-color 0.2s ease', cursor: 'default' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,229,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontFamily: 'Clash Display', fontWeight: 600, fontSize: 18, color: 'var(--text)', marginBottom: 8 }}>{f.label}</div>
              <div style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comparison ── */}
      <section style={{ position: 'relative', zIndex: 10, padding: '80px 24px', maxWidth: 700, margin: '0 auto' }}>
        <h2 style={{ fontSize: 42, fontWeight: 700, color: 'var(--text)', textAlign: 'center', marginBottom: 40 }}>vs ElevenLabs</h2>
        <div className="panel-hi" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', color: 'var(--muted)', fontFamily: 'Geist Mono', fontSize: 11, textTransform: 'uppercase', fontWeight: 500 }}>Feature</th>
                <th style={{ padding: '16px 24px', textAlign: 'center', color: 'var(--cyan)', fontFamily: 'Clash Display', fontSize: 15 }}>VoiceClone AI</th>
                <th style={{ padding: '16px 24px', textAlign: 'center', color: 'var(--muted)', fontFamily: 'Clash Display', fontSize: 15 }}>ElevenLabs</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([feat, ours, theirs], i) => (
                <tr key={i} style={{ borderBottom: i < COMPARE.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '14px 24px', color: 'var(--subtle)', fontSize: 14 }}>{feat}</td>
                  <td style={{ padding: '14px 24px', textAlign: 'center', color: ours === true ? 'var(--lime)' : 'var(--text)', fontSize: 14, fontWeight: 500 }}>
                    {ours === true ? '✓' : ours}
                  </td>
                  <td style={{ padding: '14px 24px', textAlign: 'center', color: theirs === false ? 'var(--muted)' : 'var(--muted)', fontSize: 14 }}>
                    {theirs === true ? '✓' : theirs === false ? '✗' : theirs}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section style={{ position: 'relative', zIndex: 10, padding: '80px 24px', maxWidth: 860, margin: '0 auto' }}>
        <h2 style={{ fontSize: 42, fontWeight: 700, color: 'var(--text)', textAlign: 'center', marginBottom: 48 }}>Simple pricing</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {/* Free */}
          <div className="panel" style={{ padding: 32 }}>
            <div style={{ fontFamily: 'Clash Display', fontSize: 22, color: 'var(--text)', marginBottom: 4 }}>Free</div>
            <div style={{ fontFamily: 'Clash Display', fontSize: 48, color: 'var(--text)', fontWeight: 700, marginBottom: 28 }}>$0<span style={{ fontSize: 16, color: 'var(--muted)', fontFamily: 'Cabinet Grotesk' }}>/mo</span></div>
            <ul style={{ listStyle: 'none', marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['5 generations/day', '1 saved voice profile', 'MP3 download', 'Browser mic recording', 'Standard quality'].map(f => (
                <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: 'var(--subtle)' }}>
                  <span style={{ color: 'var(--lime)' }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Link to="/login" className="btn btn-ghost" style={{ width: '100%' }}>Get started</Link>
          </div>
          {/* Pro */}
          <div className="panel-hi" style={{ padding: 32, position: 'relative', overflow: 'hidden', borderColor: 'rgba(0,229,255,0.25)' }}>
            <div className="orb" style={{ width: 200, height: 200, background: 'rgba(0,229,255,0.06)', top: -60, right: -60 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <div style={{ fontFamily: 'Clash Display', fontSize: 22, color: 'var(--text)' }}>Pro</div>
                <span className="tag tag-cyan" style={{ fontSize: 10 }}>POPULAR</span>
              </div>
              <div style={{ fontFamily: 'Clash Display', fontSize: 48, color: 'var(--cyan)', fontWeight: 700, marginBottom: 28 }}>$2.99<span style={{ fontSize: 16, color: 'var(--muted)', fontFamily: 'Cabinet Grotesk' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Unlimited generations', '10 saved voice profiles', 'MP3 download', 'Browser mic recording', 'HD quality output', 'Priority processing', 'Early access to new features'].map(f => (
                  <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: 'var(--subtle)' }}>
                    <span style={{ color: 'var(--cyan)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link to="/login" className="btn btn-cyan" style={{ width: '100%' }}>Start Pro →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position: 'relative', zIndex: 10, padding: '80px 24px 120px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Clash Display', fontSize: 52, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Start cloning today</h2>
        <p style={{ color: 'var(--muted)', fontSize: 17, marginBottom: 36 }}>No credit card. No limits on day one.</p>
        <Link to={user ? '/app' : '/login'} className="btn btn-lime" style={{ fontSize: 17, padding: '16px 40px' }}>
          Clone My Voice Free →
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer style={{ position: 'relative', zIndex: 10, borderTop: '1px solid var(--border)', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Waveform bars={6} active height={16} />
          <span style={{ fontFamily: 'Geist Mono', fontSize: 12, color: 'var(--muted)' }}>VoiceClone AI</span>
        </div>
        <span style={{ fontFamily: 'Geist Mono', fontSize: 12, color: 'var(--muted)' }}>© 2025 · Free for creators</span>
      </footer>
    </div>
  );
}