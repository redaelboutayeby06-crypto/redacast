import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../firebase/AuthContext'

const WEEKLY_LIMIT = 1000000
const GUEST_LIMIT = 200000

const VOICES = [
  { id: 'af_heart',   label: 'Heart',   desc: 'Warm & natural',     emoji: '❤️' },
  { id: 'af_sky',     label: 'Sky',     desc: 'Calm & clear',       emoji: '🌤️' },
  { id: 'af_bella',   label: 'Bella',   desc: 'Smooth & friendly',  emoji: '✨' },
  { id: 'am_adam',    label: 'Adam',    desc: 'Deep & confident',   emoji: '🎙️' },
  { id: 'am_michael', label: 'Michael', desc: 'Professional',       emoji: '📻' },
  { id: 'bf_emma',    label: 'Emma',    desc: 'British & elegant',  emoji: '🇬🇧' },
  { id: 'bm_george',  label: 'George',  desc: 'British narrator',   emoji: '🎬' },
  { id: 'bm_lewis',   label: 'Lewis',   desc: 'British & dramatic', emoji: '🎭' },
]

// Example scripts users can try
const EXAMPLES = [
  "Hey guys, welcome back to the channel! Today we're diving into an amazing story that will blow your mind...",
  "In this video, I'll show you how to grow your YouTube channel from zero to 100k subscribers...",
  "Once upon a time in a small village, there lived a young creator with a big dream...",
]

function getMonthKey() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  return `redacast_usage_${startOfMonth.toISOString().split('T')[0]}`
}

export default function App() {
  const { user, signOut } = useAuth()
  const [text, setText] = useState('')
  const [voice, setVoice] = useState('af_heart')
  const [speed, setSpeed] = useState(1.0)
  const [audioUrl, setAudioUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [charsUsed, setCharsUsed] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const audioRef = useRef(null)

  // Load saved voice preference (Feature 1)
  useEffect(() => {
    const savedVoice = localStorage.getItem('preferred_voice')
    if (savedVoice) setVoice(savedVoice)
  }, [])

  // Save voice preference (Feature 1)
  useEffect(() => {
    localStorage.setItem('preferred_voice', voice)
  }, [voice])

  // Keyboard shortcut - Ctrl+Enter (Feature 2)
useEffect(() => {
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      generateVoice()
    }
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [text, voice, speed, user, charsUsed])  // ← FIXED: use charsUsed instead

  useEffect(() => {
    if (user) {
      const stored = parseInt(localStorage.getItem(getWeekKey()) || '0')
      setCharsUsed(stored)
    }
  }, [user])

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      setTimeout(() => {
        audioRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }, [audioUrl])

  const limit = user ? WEEKLY_LIMIT : GUEST_LIMIT
  const charsLeft = limit - charsUsed
  const usagePercent = Math.min((charsUsed / limit) * 100, 100)
  const selectedVoice = VOICES.find(v => v.id === voice)

  async function generateVoice() {
    if (!text.trim()) return
    if (text.length > charsLeft) {
      setError(user
        ? `Only ${charsLeft} chars left this week. Upgrade to Pro for unlimited.`
        : `Guest limit is 500 characters. Create a free account for 20,000 chars/month.`
      )
      return
    }
    setLoading(true)
    setError('')
    setAudioUrl(null)
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice, speed })
      })
      const result = await response.json()
      if (!result.success || !result.audio) throw new Error(result.error || 'Generation failed. Please try again.')
      setAudioUrl(result.audio)
      const newUsed = charsUsed + text.length
      if (user) localStorage.setItem(getWeekKey(), newUsed.toString())
      setCharsUsed(newUsed)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const navigate = useNavigate()

  function goToPricing() {
    navigate('/')
    setTimeout(() => {
      const el = document.getElementById('pricing')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  // Load example script (Feature 3)
  function loadExample() {
    const randomExample = EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)]
    setText(randomExample)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      <div style={{ position: 'fixed', width: 600, height: 600, background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 65%)', top: -200, left: '50%', transform: 'translateX(-50%)', zIndex: 0, borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Nav */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ color: '#fff', fontSize: '18px', fontWeight: '800', letterSpacing: '-0.03em' }}>Reda<span style={{ color: '#6366f1' }}>cast</span></span>
          </Link>
          <Link to="/" style={{ color: '#fff', fontSize: '14px', fontWeight: '700', textDecoration: 'none', fontFamily: 'inherit' }}>Home</Link>
          <button onClick={goToPricing} style={{ color: '#fff', fontSize: '14px', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Pricing</button>
          <button onClick={() => setShowSettings(s => !s)} style={{ color: showSettings ? '#a5b4fc' : '#fff', fontSize: '14px', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            ⚙️ Settings
          </button>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ color: '#555', fontSize: '13px' }}>{user?.email}</span>
              <button onClick={goToPricing} style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', padding: '6px 14px', color: '#a5b4fc', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>⚡ Upgrade</button>
              <button onClick={signOut} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '6px 14px', color: '#666', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#fff', fontSize: '13px', fontWeight: '700', textDecoration: 'none', padding: '6px 14px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>Sign in</Link>
              <Link to="/login" style={{ background: '#6366f1', borderRadius: '8px', padding: '6px 14px', color: '#fff', fontWeight: '700', textDecoration: 'none', fontSize: '13px' }}>Sign up free</Link>
            </>
          )}
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '720px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ background: '#0a0a0a', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '16px', padding: '24px', marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontWeight: '700', fontSize: '15px', color: '#ddd' }}>⚙️ Settings</span>
              <button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: '#111', borderRadius: '12px', padding: '16px' }}>
                <div style={{ color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Account</div>
                {user ? (
                  <>
                    <div style={{ color: '#aaa', fontSize: '13px', marginBottom: '8px' }}>{user.email}</div>
                    <div style={{ display: 'inline-block', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '99px', padding: '2px 10px', fontSize: '11px', color: '#22c55e', fontWeight: '600' }}>Free plan</div>
                  </>
                ) : (
                  <>
                    <div style={{ color: '#666', fontSize: '13px', marginBottom: '10px' }}>Not signed in — 500 char limit</div>
                    <Link to="/login" style={{ display: 'block', textAlign: 'center', background: '#6366f1', borderRadius: '8px', padding: '8px', color: '#fff', fontWeight: '600', textDecoration: 'none', fontSize: '13px' }}>Create free account</Link>
                  </>
                )}
              </div>
              <div style={{ background: '#111', borderRadius: '12px', padding: '16px' }}>
                <div style={{ color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Usage this week</div>
                <div style={{ color: '#ddd', fontSize: '22px', fontWeight: '800', marginBottom: '4px' }}>{charsUsed.toLocaleString()}</div>
                <div style={{ color: '#555', fontSize: '12px', marginBottom: '10px' }}>of {limit.toLocaleString()} chars</div>
                <div style={{ background: '#1a1a1a', borderRadius: '99px', height: '4px' }}>
                  <div style={{ height: '100%', borderRadius: '99px', width: `${usagePercent}%`, background: usagePercent > 80 ? '#ef4444' : '#6366f1' }} />
                </div>
              </div>
              <div style={{ background: '#111', borderRadius: '12px', padding: '16px' }}>
                <div style={{ color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Current plan</div>
                <div style={{ color: '#aaa', fontSize: '13px', marginBottom: '10px' }}>Free — Microsoft Neural voices</div>
                <button onClick={() => { setShowSettings(false); goToPricing() }} style={{ display: 'block', width: '100%', textAlign: 'center', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', padding: '8px', color: '#a5b4fc', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>⚡ Upgrade to Pro</button>
              </div>
              <div style={{ background: '#111', borderRadius: '12px', padding: '16px' }}>
                <div style={{ color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Quick links</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link to="/" onClick={() => setShowSettings(false)} style={{ color: '#aaa', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>🏠 Home</Link>
                  <button onClick={() => { setShowSettings(false); goToPricing() }} style={{ color: '#aaa', fontSize: '13px', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', padding: 0 }}>💳 Pricing</button>
                  <button onClick={() => { setShowSettings(false); navigate('/'); setTimeout(() => { document.getElementById('feedback')?.scrollIntoView({ behavior: 'smooth' }) }, 100) }} style={{ color: '#aaa', fontSize: '13px', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', padding: 0 }}>💬 Leave feedback</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '720px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '30px', fontWeight: '800', marginBottom: '10px', letterSpacing: '-0.02em' }}>Generate your voiceover</h2>
          <p style={{ color: '#777', fontSize: '15px' }}>
            {user ? 'Type your script and generate a professional voiceover instantly' : 'Try free — 500 characters, no signup needed'}
          </p>
        </div>

        {/* Usage bar */}
        <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#777', fontSize: '13px', fontWeight: '600' }}>{user ? 'Weekly usage' : 'Guest usage'}</span>
            <span style={{ color: charsLeft < 100 ? '#ef4444' : '#a5b4fc', fontSize: '13px', fontWeight: '700' }}>
              {charsLeft.toLocaleString()} / {limit.toLocaleString()} chars left
            </span>
          </div>
          <div style={{ background: '#1a1a1a', borderRadius: '99px', height: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '99px', width: `${usagePercent}%`, background: usagePercent > 80 ? '#ef4444' : '#6366f1', transition: 'width 0.4s ease' }} />
          </div>
          {!user && (
            <p style={{ color: '#666', fontSize: '12px', marginTop: '8px', marginBottom: 0 }}>
              <Link to="/login" style={{ color: '#a5b4fc', textDecoration: 'none', fontWeight: '600' }}>Create free account</Link> for 20,000 chars/month
            </p>
          )}
          {user && charsLeft < 1000 && (
            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px', marginBottom: 0 }}>
              Running low — <button onClick={goToPricing} style={{ color: '#a5b4fc', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '12px', padding: 0, fontFamily: 'inherit' }}>upgrade to Pro for unlimited</button>
            </p>
          )}
        </div>

        {/* Voice selector */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#888', fontSize: '13px', display: 'block', marginBottom: '10px', fontWeight: '600' }}>Voice</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {VOICES.map(v => (
              <button key={v.id} onClick={() => setVoice(v.id)} style={{ background: voice === v.id ? 'rgba(99,102,241,0.12)' : '#0a0a0a', border: `1px solid ${voice === v.id ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '10px', padding: '12px 8px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease', fontFamily: 'inherit' }}>
                <div style={{ fontSize: '16px', marginBottom: '5px' }}>{v.emoji}</div>
                <div style={{ color: voice === v.id ? '#a5b4fc' : '#ccc', fontSize: '13px', fontWeight: '700' }}>{v.label}</div>
                <div style={{ color: '#555', fontSize: '10px', marginTop: '2px', lineHeight: '1.3' }}>{v.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Speed */}
        <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px 20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <label style={{ color: '#888', fontSize: '13px', fontWeight: '600' }}>Speed</label>
            <span style={{ color: '#a5b4fc', fontSize: '13px', fontWeight: '700' }}>{speed.toFixed(1)}x</span>
          </div>
          <input type="range" min="0.5" max="2.0" step="0.1" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555', fontSize: '11px', marginTop: '6px' }}>
            <span>0.5x slow</span><span>1.0x normal</span><span>2.0x fast</span>
          </div>
        </div>

        {/* Text input with example button */}
        <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label style={{ color: '#888', fontSize: '13px', fontWeight: '600' }}>Your script</label>
            <button onClick={loadExample} style={{ background: '#222', border: '1px solid #333', borderRadius: '20px', padding: '6px 12px', color: '#aaa', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              📋 Try an example
            </button>
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Hey everyone, welcome back to my channel! Today's story is unlike anything I've ever covered..." rows={6} style={{ width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '14px', color: '#ddd', fontSize: '15px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: '1.6', outline: 'none' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ color: '#555', fontSize: '12px' }}>{selectedVoice?.emoji} {selectedVoice?.label} · {speed.toFixed(1)}x</span>
            <span style={{ color: text.length > charsLeft ? '#ef4444' : '#555', fontSize: '12px', fontWeight: '600' }}>
              {text.length} / {limit}
            </span>
          </div>
          <p style={{ color: '#444', fontSize: '11px', marginTop: '8px', marginBottom: 0 }}>
            ⌨️ Press Ctrl+Enter to generate
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#fca5a5', fontSize: '14px' }}>
            {error}
            <div style={{ marginTop: '10px' }}>
              <button onClick={goToPricing} style={{ display: 'inline-block', background: '#6366f1', borderRadius: '8px', padding: '7px 16px', color: '#fff', fontWeight: '700', fontSize: '13px', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>⚡ View Pricing →</button>
            </div>
          </div>
        )}

        {/* Generate + Upgrade buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
          <button onClick={generateVoice} disabled={loading || !text.trim() || text.length > charsLeft} style={{ flex: 1, background: loading || !text.trim() || text.length > charsLeft ? '#111' : '#6366f1', border: 'none', borderRadius: '12px', padding: '16px', color: loading || !text.trim() || text.length > charsLeft ? '#333' : '#fff', fontWeight: '700', fontSize: '16px', cursor: loading || !text.trim() || text.length > charsLeft ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease', fontFamily: 'inherit' }}>
            {loading ? '⏳ Generating...' : '🎙️ Generate Voiceover'}
          </button>
          <button onClick={goToPricing} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '12px', padding: '16px 20px', color: '#a5b4fc', fontWeight: '700', fontSize: '14px', whiteSpace: 'nowrap', cursor: 'pointer', fontFamily: 'inherit' }}>
            ⚡ Upgrade
          </button>
        </div>
        <p style={{ color: '#444', fontSize: '12px', textAlign: 'center', marginBottom: '24px' }}>
          {!user ? 'No signup needed · 200,000 chars free' : 'Free plan · 1 Million chars/month'}
        </p>

        {/* Audio result */}
        {audioUrl && (
          <div ref={audioRef} style={{ background: '#0a0a0a', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
            <p style={{ color: '#a5b4fc', fontWeight: '700', marginBottom: '16px', fontSize: '15px' }}>✅ Your voiceover is ready!</p>
            <audio controls src={audioUrl} autoPlay style={{ width: '100%', marginBottom: '16px' }} />
            <a href={audioUrl} download="voiceover.mp3" style={{ display: 'inline-block', background: '#6366f1', borderRadius: '8px', padding: '11px 28px', color: '#fff', fontWeight: '700', textDecoration: 'none', fontSize: '14px' }}>⬇️ Download MP3</a>
          </div>
        )}

        {!user && (
          <div style={{ background: '#0a0a0a', border: '1px solid rgba(99,102,241,0.1)', borderRadius: '14px', padding: '20px', marginTop: '16px', textAlign: 'center' }}>
            <p style={{ color: '#aaa', fontWeight: '700', marginBottom: '6px', fontSize: '14px' }}>Want 20,000 chars/month for free?</p>
            <p style={{ color: '#555', fontSize: '13px', marginBottom: '14px' }}>Create a free account. No credit card needed.</p>
            <Link to="/login" style={{ display: 'inline-block', background: '#6366f1', borderRadius: '8px', padding: '9px 22px', color: '#fff', fontWeight: '700', textDecoration: 'none', fontSize: '14px' }}>Create Free Account →</Link>
          </div>
        )}

        {/* Simple Footer */}
        <div style={{ marginTop: '40px', padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
          <p style={{ color: '#444', fontSize: '12px' }}>© {new Date().getFullYear()} Redacast. All rights reserved.</p>
        </div>

      </div>
    </div>
  )
}