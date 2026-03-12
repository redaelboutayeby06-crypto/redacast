import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import Waveform from '../components/Waveform';

const FEATURES = [
  { icon: '🎬', label: 'Faceless channels', desc: 'Run a faceless YouTube channel without ever recording your voice. Consistent, professional sound across every video.' },
  { icon: '🎧', label: 'Podcast creators', desc: 'Generate podcast-quality voiceovers for intros, segments, and ads. Sounds human, costs nothing.' },
  { icon: '🎙️', label: 'Commentary creators', desc: 'Add professional narration to any commentary video. No mic setup, no noise, no retakes.' },
  { icon: '📥', label: 'Clean MP3 every time', desc: 'Every generation exports as a studio-clean MP3 ready for Premiere, DaVinci, or CapCut.' },
  { icon: '🔊', label: '3 voice engines', desc: 'Free uses Microsoft Neural. Pro unlocks Google TTS with 220+ voices. Premium gets ElevenLabs — the best on earth.' },
  { icon: '⚡', label: 'Generate in seconds', desc: 'No cold starts. No queue. Type your script, click generate, download your MP3. Done.' },
];

const COMPARE = [
  ['Free chars (no signup)',      '2,000 chars', '500 chars',    '0 chars'],
  ['Free chars (with account)',   '20,000/month', '80,000/month', '~1,333/month'],
  ['Voice engine',                'Microsoft TTS', 'Microsoft TTS','Standard AI'],
  ['Built for faceless creators', true,            false,          false],
  ['No credit card ever',         true,            true,           false],
  ['Unlimited price',             '$4.99/mo',      '$9.99/mo',     '$22/mo'],
];

const CREATORS = [
  { type: 'Faceless Commentary', icon: '🎭', desc: 'Never record your voice again' },
  { type: 'Podcast Creators', icon: '🎧', desc: 'Studio quality, zero equipment' },
  { type: 'Finance & Education', icon: '📊', desc: 'Clear, professional narration' },
  { type: 'True Crime Channels', icon: '🔍', desc: 'Dramatic, engaging storytelling' },
  { type: 'Motivational Content', icon: '🔥', desc: 'Powerful voices that inspire' },
  { type: 'Documentary Style', icon: '🎞️', desc: 'Cinematic narration for any topic' },
];

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function Landing() {
  const { user } = useAuth();
  const [feedbackType, setFeedbackType] = useState('review');
  const [feedback, setFeedback] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleFeedback(e) {
    e.preventDefault();
    if (!feedback.trim()) return;
    const existing = JSON.parse(localStorage.getItem('revoice_feedback') || '[]');
    existing.push({ type: feedbackType, text: feedback, name: name || 'Anonymous', date: new Date().toISOString() });
    localStorage.setItem('revoice_feedback', JSON.stringify(existing));
    setSubmitted(true);
    setFeedback('');
    setName('');
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', overflowX: 'hidden', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* Grid */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      <div style={{ position: 'fixed', width: 700, height: 700, background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)', top: -300, left: -200, zIndex: 0, borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', width: 500, height: 500, background: 'radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 65%)', top: 300, right: -150, zIndex: 0, borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Nav */}
      <nav style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <Waveform bars={8} active height={20} />
          <span style={{ fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-0.03em' }}>ReVoice <span style={{ color: '#6366f1' }}>AI</span></span>
        </Link>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          <button onClick={() => scrollTo('creators')} style={{ fontSize: 14, color: '#777', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>For Creators</button>
          <button onClick={() => scrollTo('pricing')} style={{ fontSize: 14, color: '#777', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>Pricing</button>
          <button onClick={() => scrollTo('compare')} style={{ fontSize: 14, color: '#777', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>Compare</button>
          <button onClick={() => scrollTo('feedback')} style={{ fontSize: 14, color: '#777', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>Feedback</button>
          <Link to="/login" style={{ fontSize: 14, padding: '8px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#aaa', textDecoration: 'none' }}>Sign in</Link>
          <Link to="/app" style={{ fontSize: 14, padding: '8px 18px', background: '#6366f1', borderRadius: '8px', color: '#fff', fontWeight: '600', textDecoration: 'none' }}>
            {user ? 'Open App →' : 'Try free →'}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '120px 24px 80px', maxWidth: 860, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '99px', padding: '6px 16px', fontSize: '13px', color: '#a5b4fc', marginBottom: '32px', fontWeight: '500' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
          Built for faceless YouTube creators
        </div>

        <h1 style={{ fontSize: 'clamp(44px, 7vw, 80px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: 24, color: '#fff' }}>
          Professional voiceovers
          <br />
          <span style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            for faceless channels.
          </span>
        </h1>

        <p style={{ fontSize: 18, color: '#777', lineHeight: 1.75, maxWidth: 520, margin: '0 auto 44px' }}>
          Type your script. Pick a voice. Download MP3. Used by faceless creators, commentary channels, and podcasters who never want to record their own voice.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
          <Link to="/app" style={{ fontSize: 16, padding: '14px 32px', background: '#6366f1', borderRadius: '10px', color: '#fff', fontWeight: '700', textDecoration: 'none', letterSpacing: '-0.01em' }}>
            Try Free — No Signup →
          </Link>
          <Link to="/login" style={{ fontSize: 16, padding: '14px 32px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#aaa', fontWeight: '500', textDecoration: 'none' }}>
            Create Account
          </Link>
        </div>
        <p style={{ color: '#444', fontSize: '13px' }}>2,000 chars free · No signup · No credit card · Ever</p>

        {/* Demo card */}
        <div style={{ marginTop: 72, background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '32px', textAlign: 'left', maxWidth: 580, marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <span style={{ fontSize: '12px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>Live preview</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '99px', padding: '4px 12px', fontSize: '12px', color: '#a5b4fc', fontWeight: '500' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
              Generating
            </span>
          </div>
          <Waveform bars={24} active height={52} />
          <div style={{ marginTop: 20, fontSize: 14, color: '#666', background: '#111', borderRadius: 10, padding: '14px 18px', borderLeft: '3px solid #6366f1', fontStyle: 'italic', lineHeight: '1.6' }}>
            "Hey everyone, welcome back to my channel. Today's story is unlike anything I've ever covered…"
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section id="creators" style={{ position: 'relative', zIndex: 10, padding: '80px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: '34px', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.02em' }}>Who uses ReVoice AI?</h2>
          <p style={{ color: '#666', fontSize: '16px' }}>If you create content without showing your face — this is built for you.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          {CREATORS.map((c, i) => (
            <div key={i} style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, transition: 'border-color 0.2s', cursor: 'default' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
            >
              <div style={{ fontSize: '28px', flexShrink: 0 }}>{c.icon}</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '15px', color: '#ddd', marginBottom: '4px' }}>{c.type}</div>
                <div style={{ color: '#555', fontSize: '13px' }}>{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ position: 'relative', zIndex: 10, padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: '34px', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.02em' }}>Everything you need</h2>
          <p style={{ color: '#666', fontSize: '16px' }}>To sound professional across every video, every week.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '28px', transition: 'border-color 0.2s', cursor: 'default' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
            >
              <div style={{ fontSize: '26px', marginBottom: '14px' }}>{f.icon}</div>
              <div style={{ fontWeight: '700', fontSize: '16px', color: '#ddd', marginBottom: '8px' }}>{f.label}</div>
              <div style={{ color: '#666', fontSize: '14px', lineHeight: '1.65' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Voice engines */}
      <section style={{ position: 'relative', zIndex: 10, padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '34px', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.02em' }}>3 voice engines. You choose.</h2>
          <p style={{ color: '#666', fontSize: '16px' }}>Upgrade when you're ready. Downgrade anytime.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
          {[
            { engine: 'Microsoft Neural', plan: 'Free', color: '#22c55e', quality: '⭐⭐⭐⭐', desc: '8 natural voices. Fast. 20,000 free chars/month with account. No credit card.', tag: 'Free forever' },
            { engine: 'Google TTS', plan: 'Pro — $4.99/mo', color: '#6366f1', quality: '⭐⭐⭐⭐⭐', desc: '220+ voices across 40+ languages. Unlimited generations. Crisp and professional.', tag: 'Most popular' },
            { engine: 'ElevenLabs', plan: 'Premium — $19.99/mo', color: '#a855f7', quality: '⭐⭐⭐⭐⭐⭐', desc: 'The most human AI voice on the planet. Used by top YouTubers worldwide.', tag: 'Best quality' },
          ].map((v, i) => (
            <div key={i} style={{ background: '#0a0a0a', border: `1px solid ${v.color}22`, borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, background: `radial-gradient(circle, ${v.color}10 0%, transparent 70%)`, borderRadius: '50%' }} />
              <div style={{ display: 'inline-block', background: `${v.color}15`, border: `1px solid ${v.color}30`, borderRadius: '99px', padding: '3px 10px', fontSize: '11px', color: v.color, fontWeight: '600', marginBottom: '14px' }}>{v.tag}</div>
              <div style={{ fontWeight: '800', fontSize: '17px', color: '#ddd', marginBottom: '4px' }}>{v.engine}</div>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '12px' }}>{v.plan}</div>
              <div style={{ fontSize: '13px', marginBottom: '12px' }}>{v.quality}</div>
              <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section id="compare" style={{ position: 'relative', zIndex: 10, padding: '80px 24px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ fontSize: '34px', fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: '40px', letterSpacing: '-0.02em' }}>How we compare</h2>
        <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', color: '#555', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Feature</th>
                <th style={{ padding: '16px 24px', textAlign: 'center', color: '#a5b4fc', fontSize: '14px', fontWeight: '700' }}>ReVoice AI</th>
                <th style={{ padding: '16px 24px', textAlign: 'center', color: '#555', fontSize: '14px', fontWeight: '700' }}>TTSMaker</th>
                <th style={{ padding: '16px 24px', textAlign: 'center', color: '#555', fontSize: '14px', fontWeight: '700' }}>ElevenLabs</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([feat, ours, ttsmaker, eleven], i) => (
                <tr key={i} style={{ borderBottom: i < COMPARE.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <td style={{ padding: '14px 24px', color: '#777', fontSize: '14px' }}>{feat}</td>
                  <td style={{ padding: '14px 24px', textAlign: 'center', color: ours === true ? '#22c55e' : '#a5b4fc', fontSize: '14px', fontWeight: '600' }}>{ours === true ? '✓' : ours === false ? '✗' : ours}</td>
                  <td style={{ padding: '14px 24px', textAlign: 'center', color: '#555', fontSize: '14px' }}>{ttsmaker === true ? '✓' : ttsmaker === false ? '✗' : ttsmaker}</td>
                  <td style={{ padding: '14px 24px', textAlign: 'center', color: '#555', fontSize: '14px' }}>{eleven === true ? '✓' : eleven === false ? '✗' : eleven}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ position: 'relative', zIndex: 10, padding: '80px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ fontSize: '34px', fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: '8px', letterSpacing: '-0.02em' }}>Simple pricing</h2>
        <p style={{ color: '#666', textAlign: 'center', fontSize: '16px', marginBottom: '52px' }}>Start free. Upgrade when you're ready. Cancel anytime.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>

          {/* Free */}
          <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '32px' }}>
            <div style={{ fontWeight: '700', fontSize: '12px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Free</div>
            <div style={{ fontSize: '44px', fontWeight: '800', color: '#fff', letterSpacing: '-0.03em', marginBottom: '4px' }}>$0</div>
            <div style={{ fontSize: '13px', color: '#444', marginBottom: '28px' }}>No credit card. No catch. Forever.</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                '2,000 chars without signup',
                '20,000 chars/month with account',
                '8 Microsoft Neural voices',
                'MP3 download',
                'Speed control',
              ].map(f => (
                <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '14px', color: '#777' }}>
                  <span style={{ color: '#22c55e', marginTop: '1px', flexShrink: 0 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Link to="/app" style={{ display: 'block', textAlign: 'center', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px', color: '#888', fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}>Try for free — no signup</Link>
          </div>

          {/* Pro */}
          <div style={{ background: '#0d0d1a', border: '1px solid rgba(99,102,241,0.4)', borderRadius: '20px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '8px', padding: '7px 12px', marginBottom: '16px', textAlign: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#a5b4fc' }}>🤫 We probably shouldn't offer this price</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '4px' }}>
                <div style={{ fontWeight: '700', fontSize: '12px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pro</div>
                <span style={{ background: '#6366f1', borderRadius: '99px', padding: '2px 8px', fontSize: '10px', color: '#fff', fontWeight: '700' }}>MOST POPULAR</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: '4px' }}>
                <div style={{ fontSize: '44px', fontWeight: '800', color: '#fff', letterSpacing: '-0.03em' }}>$4.99</div>
                <div style={{ fontSize: '15px', color: '#444', textDecoration: 'line-through' }}>$22/mo</div>
              </div>
              <div style={{ fontSize: '13px', color: '#818cf8', marginBottom: '28px', fontWeight: '600' }}>ElevenLabs charges $22 for less. You pay $4.99.</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Unlimited generations forever',
                  'Google TTS — 220+ voices',
                  '40+ languages',
                  'Priority processing',
                  'No monthly limits ever',
                  'Early access to new features',
                ].map(f => (
                  <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '14px', color: '#777' }}>
                    <span style={{ color: '#6366f1', marginTop: '1px', flexShrink: 0 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link to="/login" style={{ display: 'block', textAlign: 'center', background: '#6366f1', borderRadius: '10px', padding: '14px', color: '#fff', fontWeight: '700', textDecoration: 'none', fontSize: '15px' }}>Get Pro for $4.99 →</Link>
              <p style={{ textAlign: 'center', color: '#444', fontSize: '11px', marginTop: '10px', marginBottom: 0 }}>Cancel anytime. No questions asked.</p>
            </div>
          </div>

          {/* Premium */}
          <div style={{ background: '#0a0a0a', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '20px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontWeight: '700', fontSize: '12px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Premium</div>
              <div style={{ fontSize: '44px', fontWeight: '800', color: '#fff', letterSpacing: '-0.03em', marginBottom: '4px' }}>$19.99</div>
              <div style={{ fontSize: '13px', color: '#444', marginBottom: '28px' }}>For monetized channels who need the absolute best.</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Everything in Pro',
                  'ElevenLabs voices',
                  'Most human AI quality on earth',
                  '1,000+ voice styles',
                  'Best for monetized channels',
                ].map(f => (
                  <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '14px', color: '#777' }}>
                    <span style={{ color: '#a855f7', marginTop: '1px', flexShrink: 0 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link to="/login" style={{ display: 'block', textAlign: 'center', background: 'transparent', border: '1px solid rgba(168,85,247,0.35)', borderRadius: '10px', padding: '12px', color: '#c084fc', fontWeight: '700', textDecoration: 'none', fontSize: '15px' }}>Start Premium →</Link>
            </div>
          </div>

        </div>
      </section>

      {/* Feedback */}
      <section id="feedback" style={{ position: 'relative', zIndex: 10, padding: '80px 24px', maxWidth: 640, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: '34px', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.02em' }}>Your feedback matters</h2>
          <p style={{ color: '#666', fontSize: '16px' }}>Leave a review or report a problem — we read every single one.</p>
        </div>

        {submitted ? (
          <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🙏</div>
            <div style={{ fontWeight: '700', fontSize: '18px', color: '#ddd', marginBottom: '8px' }}>Thank you!</div>
            <div style={{ color: '#666', fontSize: '14px' }}>Your feedback has been received. We appreciate it.</div>
            <button onClick={() => setSubmitted(false)} style={{ marginTop: '20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 18px', color: '#777', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>Submit another</button>
          </div>
        ) : (
          <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '32px' }}>
            {/* Type selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: '24px' }}>
              {[
                { id: 'review', label: '⭐ Leave a review', },
                { id: 'bug', label: '🐛 Report a problem' },
                { id: 'idea', label: '💡 Suggest a feature' },
              ].map(t => (
                <button key={t.id} onClick={() => setFeedbackType(t.id)} style={{ flex: 1, padding: '10px 8px', borderRadius: '8px', border: `1px solid ${feedbackType === t.id ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.06)'}`, background: feedbackType === t.id ? 'rgba(99,102,241,0.1)' : 'transparent', color: feedbackType === t.id ? '#a5b4fc' : '#555', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                  {t.label}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#555', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Your name (optional)</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Anonymous" style={{ width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '12px 14px', color: '#ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#555', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                {feedbackType === 'review' ? 'Your review' : feedbackType === 'bug' ? 'Describe the problem' : 'Your idea'}
              </label>
              <textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder={feedbackType === 'review' ? 'Redacast is...' : feedbackType === 'bug' ? 'When I click... it shows...' : 'It would be great if...'} rows={4} style={{ width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '12px 14px', color: '#ddd', fontSize: '14px', resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: '1.6' }} />
            </div>

            <button onClick={handleFeedback} disabled={!feedback.trim()} style={{ width: '100%', background: feedback.trim() ? '#6366f1' : '#111', border: 'none', borderRadius: '10px', padding: '14px', color: feedback.trim() ? '#fff' : '#333', fontWeight: '700', fontSize: '15px', cursor: feedback.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s', fontFamily: 'inherit' }}>
              Submit →
            </button>
          </div>
        )}
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', zIndex: 10, padding: '80px 24px 120px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontSize: '44px', fontWeight: '800', color: '#fff', marginBottom: '14px', letterSpacing: '-0.03em' }}>Start generating today</h2>
          <p style={{ color: '#555', fontSize: '16px', marginBottom: '36px', lineHeight: '1.6' }}>2,000 chars free. No signup. No credit card. No catch.</p>
          <Link to="/app" style={{ display: 'inline-block', fontSize: '16px', padding: '14px 36px', background: '#6366f1', borderRadius: '10px', color: '#fff', fontWeight: '700', textDecoration: 'none' }}>
            Try ReVoice AI Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 10, borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Waveform bars={6} active height={16} />
          <span style={{ fontSize: '13px', color: '#333', fontWeight: '600' }}>ReVoice AI</span>
        </div>
        <span style={{ fontSize: '12px', color: '#333' }}>© 2026 · Built for faceless creators</span>
      </footer>

    </div>
  );
}