import { Link } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import Waveform from '../components/Waveform';

const FEATURES = [
  { icon: '🎙️', label: 'Made for YouTubers', desc: 'Built specifically for Reddit story channels, commentary, and narration. Not corporate presentations.' },
  { icon: '⚡', label: 'Generate in seconds', desc: 'Type your script, pick a voice, click generate. Your voiceover is ready in under 30 seconds.' },
  { icon: '📥', label: 'MP3 download', desc: 'Every generation exports as a clean MP3 ready for your video editor.' },
  { icon: '🆓', label: '5,000 chars/week free', desc: 'Enough to test. Not enough for a full video — so you always know exactly what you\'re getting.' },
  { icon: '🔊', label: '3 voice engines', desc: 'Free uses Kokoro. Pro uses Google TTS. Premium uses ElevenLabs. You hear the difference yourself.' },
  { icon: '🌍', label: 'More languages coming', desc: 'English now. Arabic, French, Spanish coming soon — perfect for multilingual creators.' },
];

const COMPARE = [
  ['Free characters/week',     '5,000 chars',   '20,000 chars',  '~333 chars'],
  ['Voice quality',            '⭐⭐⭐⭐',        '⭐⭐⭐⭐',        '⭐⭐⭐⭐⭐'],
  ['Built for YouTubers',      true,             false,           false],
  ['No credit card to start',  true,             true,            false],
  ['Price for unlimited',      '$4.99/mo',       '$9.99/mo',      '$22/mo'],
];

const VOICE_SAMPLES = [
  {
    engine: 'Kokoro',
    plan: 'Free',
    quality: '⭐⭐⭐⭐',
    color: '#b8ff57',
    desc: 'Warm & natural — great for storytelling',
    sample: '"Today\'s story is about a man who discovered his entire life was a lie..."'
  },
  {
    engine: 'Google TTS',
    plan: 'Pro — $4.99/mo',
    quality: '⭐⭐⭐⭐⭐',
    color: '#00e5ff',
    desc: 'Crisp & clear — 220+ voices, 40 languages',
    sample: '"Today\'s story is about a man who discovered his entire life was a lie..."'
  },
  {
    engine: 'ElevenLabs',
    plan: 'Premium — $19.99/mo',
    quality: '⭐⭐⭐⭐⭐⭐',
    color: '#c084fc',
    desc: 'Most human — used by top YouTubers',
    sample: '"Today\'s story is about a man who discovered his entire life was a lie..."'
  },
]

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Waveform bars={8} active height={20} />
          <span style={{ fontWeight: 700, fontSize: 18, color: '#fff' }}>VoiceClone AI</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/login" style={{ fontSize: 14, padding: '9px 18px', background: 'transparent', border: '1px solid #222', borderRadius: '8px', color: '#888', textDecoration: 'none' }}>Sign in</Link>
          <Link to={user ? '/app' : '/login'} style={{ fontSize: 14, padding: '9px 18px', background: 'linear-gradient(135deg, #00e5ff, #b8ff57)', borderRadius: '8px', color: '#000', fontWeight: '700', textDecoration: 'none' }}>
            {user ? 'Open App →' : 'Start free →'}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '100px 24px 80px', maxWidth: 820, margin: '0 auto' }}>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(184,255,87,0.08)', border: '1px solid rgba(184,255,87,0.2)', borderRadius: '99px', padding: '6px 14px', fontSize: '13px', color: '#b8ff57', marginBottom: '28px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#b8ff57', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          Free for YouTube creators
        </div>

        <h1 style={{ fontSize: 'clamp(48px, 8vw, 88px)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 28 }}>
          <span style={{ color: '#fff' }}>Voiceovers for</span>
          <br />
          <span style={{ color: '#00e5ff' }}>your YouTube channel.</span>
        </h1>

        <p style={{ fontSize: 19, color: '#555', lineHeight: 1.7, maxWidth: 540, margin: '0 auto 40px' }}>
          Type your script. Pick a voice. Download your MP3. Made specifically for Reddit story channels, commentary, and narration. <strong style={{ color: '#888' }}>Free to start — no credit card.</strong>
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
          <Link to={user ? '/app' : '/login'} style={{ fontSize: 17, padding: '16px 36px', background: 'linear-gradient(135deg, #00e5ff, #b8ff57)', borderRadius: '12px', color: '#000', fontWeight: '800', textDecoration: 'none' }}>
            Generate Free Voiceover →
          </Link>
        </div>
        <p style={{ color: '#333', fontSize: '13px' }}>5,000 characters/week free · No credit card</p>

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

      {/* Voice Quality Comparison */}
      <section style={{ position: 'relative', zIndex: 10, padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '38px', fontWeight: '800', marginBottom: '12px' }}>Hear the difference</h2>
          <p style={{ color: '#555', fontSize: '16px' }}>Same sentence. Three voice engines. You decide which one fits your channel.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {VOICE_SAMPLES.map((v, i) => (
            <div key={i} style={{ background: '#0a0a0a', border: `1px solid ${v.color}22`, borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, background: `radial-gradient(circle, ${v.color}08 0%, transparent 70%)`, borderRadius: '50%' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '18px', color: v.color }}>{v.engine}</div>
                  <div style={{ fontSize: '12px', color: '#444', marginTop: '2px' }}>{v.plan}</div>
                </div>
                <div style={{ fontSize: '14px' }}>{v.quality}</div>
              </div>
              <p style={{ color: '#555', fontSize: '13px', marginBottom: '16px', lineHeight: '1.5' }}>{v.desc}</p>
              <div style={{ background: '#111', borderRadius: '8px', padding: '12px', fontFamily: 'monospace', fontSize: '12px', color: '#444', lineHeight: '1.5', marginBottom: '16px', borderLeft: `2px solid ${v.color}44` }}>
                {v.sample}
              </div>
              {/* Fake waveform as placeholder — real audio samples would go here */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: `1px solid ${v.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: v.color, fontSize: '12px' }}>▶</div>
                <div style={{ flex: 1, height: '3px', background: '#1a1a1a', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: i === 0 ? '0%' : '0%', background: v.color, borderRadius: '99px' }} />
                </div>
                <span style={{ color: '#333', fontSize: '11px', fontFamily: 'monospace' }}>0:08</span>
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', color: '#333', fontSize: '13px', marginTop: '20px' }}>
          🎧 Audio samples coming soon — sign up to be first to hear them
        </p>
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

      {/* Comparison */}
      <section style={{ position: 'relative', zIndex: 10, padding: '80px 24px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ fontSize: '38px', fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: '40px' }}>How we compare</h2>
        <div style={{ background: '#0a0a0a', border: '1px solid #111', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #111' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', color: '#333', fontFamily: 'monospace', fontSize: '11px', textTransform: 'uppercase', fontWeight: 500 }}>Feature</th>
                <th style={{ padding: '16px 24px', textAlign: 'center', color: '#00e5ff', fontSize: '14px', fontWeight: '700' }}>VoiceClone AI</th>
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
      <section style={{ position: 'relative', zIndex: 10, padding: '80px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ fontSize: '38px', fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: '12px' }}>Simple pricing</h2>
        <p style={{ color: '#555', textAlign: 'center', fontSize: '16px', marginBottom: '48px' }}>Start free. Upgrade when you're ready.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>

          {/* Free */}
          <div style={{ background: '#0a0a0a', border: '1px solid #111', borderRadius: '20px', padding: '32px' }}>
            <div style={{ fontWeight: '800', fontSize: '20px', color: '#fff', marginBottom: '4px' }}>Free</div>
            <div style={{ fontSize: '42px', fontWeight: '800', color: '#fff', marginBottom: '24px' }}>$0<span style={{ fontSize: '15px', color: '#333', fontWeight: '400' }}>/mo</span></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['5,000 chars/week', '6 Kokoro voices', 'MP3 download', 'No credit card'].map(f => (
                <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: '14px', color: '#555' }}>
                  <span style={{ color: '#b8ff57' }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Link to="/login" style={{ display: 'block', textAlign: 'center', background: 'transparent', border: '1px solid #222', borderRadius: '10px', padding: '12px', color: '#666', fontWeight: '600', textDecoration: 'none', fontSize: '15px' }}>Get started</Link>
          </div>

          {/* Pro */}
          <div style={{ background: '#0a0a0a', border: '1px solid rgba(0,229,255,0.25)', borderRadius: '20px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '4px' }}>
                <div style={{ fontWeight: '800', fontSize: '20px', color: '#fff' }}>Pro</div>
                <span style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.3)', borderRadius: '99px', padding: '2px 8px', fontSize: '10px', color: '#00e5ff', fontWeight: '700' }}>POPULAR</span>
              </div>
              <div style={{ fontSize: '42px', fontWeight: '800', color: '#00e5ff', marginBottom: '24px' }}>$4.99<span style={{ fontSize: '15px', color: '#333', fontWeight: '400' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Unlimited generations', 'Google TTS — 220+ voices', '40+ languages', 'Priority processing', 'No limits ever'].map(f => (
                  <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: '14px', color: '#666' }}>
                    <span style={{ color: '#00e5ff' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link to="/login" style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #00e5ff, #b8ff57)', borderRadius: '10px', padding: '12px', color: '#000', fontWeight: '800', textDecoration: 'none', fontSize: '15px' }}>Start Pro →</Link>
            </div>
          </div>

          {/* Premium */}
          <div style={{ background: '#0a0a0a', border: '1px solid rgba(192,132,252,0.2)', borderRadius: '20px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'radial-gradient(circle, rgba(192,132,252,0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontWeight: '800', fontSize: '20px', color: '#fff', marginBottom: '4px' }}>Premium</div>
              <div style={{ fontSize: '42px', fontWeight: '800', color: '#c084fc', marginBottom: '24px' }}>$19.99<span style={{ fontSize: '15px', color: '#333', fontWeight: '400' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Everything in Pro', 'ElevenLabs voices', 'Most human quality', '1000+ voice styles', 'Best for monetized channels'].map(f => (
                  <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: '14px', color: '#666' }}>
                    <span style={{ color: '#c084fc' }}>✓</span> {f}
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
        <p style={{ color: '#444', fontSize: '16px', marginBottom: '36px' }}>No credit card. 5,000 free characters every week. Forever.</p>
        <Link to={user ? '/app' : '/login'} style={{ fontSize: '17px', padding: '16px 40px', background: 'linear-gradient(135deg, #b8ff57, #00e5ff)', borderRadius: '12px', color: '#000', fontWeight: '800', textDecoration: 'none' }}>
          Generate Free Voiceover →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 10, borderTop: '1px solid #0d0d0d', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Waveform bars={6} active height={16} />
          <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#333' }}>VoiceClone AI</span>
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#333' }}>© 2026 · Built for creators</span>
      </footer>

    </div>
  );
}