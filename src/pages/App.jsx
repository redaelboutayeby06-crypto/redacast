import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../firebase/AuthContext'

const WEEKLY_LIMIT = 5000
const GUEST_LIMIT = 500

const VOICES = [
  { id: 'af_heart', label: 'Heart', desc: 'Warm & natural', emoji: '❤️' },
  { id: 'af_sky', label: 'Sky', desc: 'Calm & clear', emoji: '🌤️' },
  { id: 'af_bella', label: 'Bella', desc: 'Smooth & friendly', emoji: '✨' },
  { id: 'am_adam', label: 'Adam', desc: 'Deep & confident', emoji: '🎙️' },
  { id: 'am_michael', label: 'Michael', desc: 'Professional', emoji: '📻' },
  { id: 'bf_emma', label: 'Emma', desc: 'British & elegant', emoji: '🇬🇧' },
  { id: 'bm_george', label: 'George', desc: 'British narrator', emoji: '🎬' },
  { id: 'bm_lewis', label: 'Lewis', desc: 'British & dramatic', emoji: '🎭' },
]

function getWeekKey() {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setHours(0, 0, 0, 0)
  startOfWeek.setDate(now.getDate() - now.getDay())
  return `rv_usage_${startOfWeek.toISOString().split('T')[0]}`
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

  useEffect(() => {
    if (user) {
      const key = getWeekKey()
      const stored = parseInt(localStorage.getItem(key) || '0')
      setCharsUsed(stored)
    }
  }, [user])

  const limit = user ? WEEKLY_LIMIT : GUEST_LIMIT
  const charsLeft = limit - charsUsed
  const usagePercent = Math.min((charsUsed / limit) * 100, 100)
  const selectedVoice = VOICES.find(v => v.id === voice)

  async function generateVoice() {
    if (!text.trim()) return
    if (text.length > charsLeft) {
      setError(user
        ? `You only have ${charsLeft} characters left this week. Upgrade to Pro for unlimited.`
        : `Free guests can generate up to 500 characters. Sign up free for 5,000/week.`
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

      if (!result.success || !result.audio) {
        throw new Error(result.error || 'Generation failed. Please try again.')
      }

      setAudioUrl(result.audio)

      if (user) {
        const key = getWeekKey()
        const newUsed = charsUsed + text.length
        localStorage.setItem(key, newUsed.toString())
        setCharsUsed(newUsed)
      } else {
        setCharsUsed(charsUsed + text.length)
      }

    } catch (err) {
      setError(err.message)
    }

    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: 'sans-serif' }}>

      {/* Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', borderBottom: '1px solid #111' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ color: '#00e5ff', fontSize: '18px', fontWeight: '800', letterSpacing: '-0.02em' }}>ReVoice AI</span>
          </Link>
          <Link to="/" style={{ color: '#444', fontSize: '13px', textDecoration: 'none' }}>Home</Link>
          <a href="/#pricing" style={{ color: '#444', fontSize: '13px', textDecoration: 'none' }}>Pricing</a>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ color: '#444', fontSize: '13px' }}>{user?.email}</span>
              <button onClick={signOut} style={{ background: 'transparent', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '6px 14px', color: '#555', cursor: 'pointer', fontSize: '13px' }}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#555', fontSize: '13px', textDecoration: 'none', padding: '6px 14px', border: '1px solid #1a1a1a', borderRadius: '8px' }}>Sign in</Link>
              <Link to="/login" style={{ background: 'linear-gradient(135deg,#00e5ff,#b8ff57)', borderRadius: '8px', padding: '6px 14px', color: '#000', fontWeight: '700', textDecoration: 'none', fontSize: '13px' }}>Sign up free</Link>
            </>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '720px', margin: '50px auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Generate your voiceover</h2>
          <p style={{ color: '#555', fontSize: '15px' }}>
            {user ? 'Type your script and generate a professional voiceover instantly' : 'Try free — 500 characters, no signup needed'}
          </p>
        </div>

        {/* Usage bar */}
        <div style={{ background: '#0a0a0a', border: '1px solid #111', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#444', fontSize: '13px' }}>{user ? 'Weekly usage' : 'Guest usage'}</span>
            <span style={{ color: charsLeft < 100 ? '#ff6666' : '#00e5ff', fontSize: '13px', fontWeight: '600' }}>
              {charsLeft.toLocaleString()} / {limit.toLocaleString()} chars left
            </span>
          </div>
          <div style={{ background: '#1a1a1a', borderRadius: '99px', height: '5px', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '99px', width: `${usagePercent}%`, background: usagePercent > 80 ? 'linear-gradient(90deg,#ff6666,#ff3333)' : 'linear-gradient(90deg,#00e5ff,#b8ff57)', transition: 'width 0.4s ease' }} />
          </div>
          {!user && (
            <p style={{ color: '#444', fontSize: '12px', marginTop: '8px', marginBottom: 0 }}>
              <Link to="/login" style={{ color: '#00e5ff', textDecoration: 'none' }}>Create free account</Link> for 5,000 chars/week
            </p>
          )}
          {user && charsLeft < 1000 && (
            <p style={{ color: '#ff6666', fontSize: '12px', marginTop: '8px', marginBottom: 0 }}>
              ⚠️ Running low — <a href="/#pricing" style={{ color: '#00e5ff', textDecoration: 'none' }}>upgrade to Pro for unlimited</a>
            </p>
          )}
        </div>

        {/* Voice selector */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#444', fontSize: '13px', display: 'block', marginBottom: '10px' }}>Choose voice</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {VOICES.map(v => (
              <button key={v.id} onClick={() => setVoice(v.id)} style={{ background: voice === v.id ? 'rgba(0,229,255,0.08)' : '#0a0a0a', border: `1px solid ${voice === v.id ? 'rgba(0,229,255,0.4)' : '#111'}`, borderRadius: '10px', padding: '12px 8px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}>
                <div style={{ fontSize: '16px', marginBottom: '4px' }}>{v.emoji}</div>
                <div style={{ color: voice === v.id ? '#00e5ff' : '#fff', fontSize: '13px', fontWeight: '600' }}>{v.label}</div>
                <div style={{ color: '#333', fontSize: '10px', marginTop: '2px', lineHeight: '1.3' }}>{v.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Speed */}
        <div style={{ background: '#0a0a0a', border: '1px solid #111', borderRadius: '12px', padding: '16px 20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <label style={{ color: '#444', fontSize: '13px' }}>Speed</label>
            <span style={{ color: '#00e5ff', fontSize: '13px', fontWeight: '600' }}>{speed.toFixed(1)}x</span>
          </div>
          <input type="range" min="0.5" max="2.0" step="0.1" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#00e5ff', cursor: 'pointer' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#222', fontSize: '11px', marginTop: '4px' }}>
            <span>0.5x slow</span><span>1.0x normal</span><span>2.0x fast</span>
          </div>
        </div>

        {/* Text input */}
        <div style={{ background: '#0a0a0a', border: '1px solid #111', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
          <label style={{ color: '#444', fontSize: '13px', display: 'block', marginBottom: '10px' }}>Your script</label>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Hey everyone, welcome back to my channel! Today we have an incredible story..." rows={6} style={{ width: '100%', background: '#111', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '14px', color: '#fff', fontSize: '15px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'sans-serif', lineHeight: '1.6', outline: 'none' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ color: '#222', fontSize: '12px' }}>{selectedVoice?.emoji} {selectedVoice?.label} · {speed.toFixed(1)}x</span>
            <span style={{ color: text.length > charsLeft ? '#ff6666' : '#333', fontSize: '12px' }}>{text.length} / {limit} chars</span>
          </div>
        </div>

        {error && (
          <div style={{ background: '#1a0505', border: '1px solid #ff333344', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#ff8888', fontSize: '14px' }}>
            {error}
            {!user && error.includes('500') && (
              <div style={{ marginTop: '8px' }}>
                <Link to="/login" style={{ color: '#00e5ff', fontWeight: '700', textDecoration: 'none' }}>→ Create free account for 5,000 chars/week</Link>
              </div>
            )}
          </div>
        )}

        <button onClick={generateVoice} disabled={loading || !text.trim() || text.length > charsLeft} style={{ width: '100%', background: loading || !text.trim() || text.length > charsLeft ? '#111' : 'linear-gradient(135deg,#00e5ff,#b8ff57)', border: 'none', borderRadius: '12px', padding: '18px', color: loading || !text.trim() || text.length > charsLeft ? '#333' : '#000', fontWeight: '800', fontSize: '17px', cursor: loading || !text.trim() || text.length > charsLeft ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease' }}>
          {loading ? '⏳ Generating...' : '🎙️ Generate Voiceover'}
        </button>

        {audioUrl && (
          <div style={{ background: '#0a0a0a', border: '1px solid rgba(0,229,255,0.15)', borderRadius: '16px', padding: '24px', marginTop: '20px', textAlign: 'center' }}>
            <p style={{ color: '#00e5ff', fontWeight: '700', marginBottom: '16px', fontSize: '16px' }}>✅ Your voiceover is ready!</p>
            <audio controls src={audioUrl} style={{ width: '100%', marginBottom: '16px' }} />
            <a href={audioUrl} download="voiceover.mp3" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#00e5ff,#b8ff57)', borderRadius: '8px', padding: '12px 32px', color: '#000', fontWeight: '700', textDecoration: 'none', fontSize: '15px' }}>⬇️ Download MP3</a>
          </div>
        )}

        {/* Upgrade prompt for guests */}
        {!user && (
          <div style={{ background: '#0a0a0a', border: '1px solid rgba(184,255,87,0.15)', borderRadius: '16px', padding: '20px', marginTop: '20px', textAlign: 'center' }}>
            <p style={{ color: '#b8ff57', fontWeight: '700', marginBottom: '6px', fontSize: '15px' }}>Want more?</p>
            <p style={{ color: '#444', fontSize: '13px', marginBottom: '16px' }}>Create a free account for 5,000 chars/week. No credit card.</p>
            <Link to="/login" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#00e5ff,#b8ff57)', borderRadius: '8px', padding: '10px 24px', color: '#000', fontWeight: '700', textDecoration: 'none', fontSize: '14px' }}>Create Free Account →</Link>
          </div>
        )}

      </div>
    </div>
  )
}