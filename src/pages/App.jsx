import { useState, useEffect } from 'react'
import { useAuth } from '../firebase/AuthContext'

const HF_SPACE_URL = 'https://hexgrad-kokoro-tts.hf.space'

const WEEKLY_LIMIT = 5000

const VOICES = [
  { id: 'af_sky', label: 'Sky', desc: 'Calm & warm — best for Reddit stories', emoji: '🌤️' },
  { id: 'af_bella', label: 'Bella', desc: 'Smooth & friendly', emoji: '✨' },
  { id: 'am_adam', label: 'Adam', desc: 'Deep & confident', emoji: '🎙️' },
  { id: 'am_michael', label: 'Michael', desc: 'Clear & professional', emoji: '📻' },
  { id: 'bf_emma', label: 'Emma', desc: 'British & elegant', emoji: '🇬🇧' },
  { id: 'bm_george', label: 'George', desc: 'British male narrator', emoji: '🎬' },
]

function getWeekKey() {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setHours(0, 0, 0, 0)
  startOfWeek.setDate(now.getDate() - now.getDay())
  return `vc_usage_${startOfWeek.toISOString().split('T')[0]}`
}

export default function App() {
  const { user, signOut } = useAuth()
  const [text, setText] = useState('')
  const [voice, setVoice] = useState('af_sky')
  const [speed, setSpeed] = useState(1.0)
  const [audioUrl, setAudioUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [charsUsed, setCharsUsed] = useState(0)

  useEffect(() => {
    const key = getWeekKey()
    const stored = parseInt(localStorage.getItem(key) || '0')
    setCharsUsed(stored)
  }, [])

  const charsLeft = WEEKLY_LIMIT - charsUsed
  const usagePercent = Math.min((charsUsed / WEEKLY_LIMIT) * 100, 100)

  async function generateVoice() {
    if (!text.trim()) return
    if (text.length > charsLeft) {
      setError(`You only have ${charsLeft} characters left this week. Upgrade to Pro for unlimited.`)
      return
    }

    setLoading(true)
    setError('')
    setAudioUrl(null)

    try {
      const response = await fetch(`${HF_SPACE_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fn_index: 0,
          data: [text, voice, speed]
        })
      })

      if (!response.ok) throw new Error('Generation failed. The voice server may be waking up — try again in 30 seconds.')

      const result = await response.json()
      const audioData = result.data?.[0]

      if (!audioData) throw new Error('No audio returned. Please try again.')

      // Handle base64 or URL response from Gradio
      let url
      if (typeof audioData === 'string' && audioData.startsWith('data:')) {
        url = audioData
      } else if (audioData?.url) {
        url = audioData.url
      } else if (audioData?.name) {
        url = `${HF_SPACE_URL}/file=${audioData.name}`
      } else {
        throw new Error('Unexpected response format. Please try again.')
      }

      setAudioUrl(url)

      // Update usage
      const key = getWeekKey()
      const newUsed = charsUsed + text.length
      localStorage.setItem(key, newUsed.toString())
      setCharsUsed(newUsed)

    } catch (err) {
      setError(err.message)
    }

    setLoading(false)
  }

  const selectedVoice = VOICES.find(v => v.id === voice)

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: 'sans-serif' }}>

      {/* Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #1a1a1a' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ color: '#00e5ff', fontSize: '20px', fontWeight: '700', margin: 0, cursor: 'pointer' }}>VoiceClone AI</h1>
        </a>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ color: '#555', fontSize: '13px' }}>{user?.email}</span>
          <button onClick={signOut} style={{ background: 'transparent', border: '1px solid #222', borderRadius: '8px', padding: '7px 14px', color: '#666', cursor: 'pointer', fontSize: '13px' }}>
            Sign out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '720px', margin: '50px auto', padding: '0 20px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
            Generate your voiceover
          </h2>
          <p style={{ color: '#555', fontSize: '15px' }}>
            Type anything and get a professional voiceover in seconds
          </p>
        </div>

        {/* Usage bar */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#555', fontSize: '13px' }}>Weekly usage</span>
            <span style={{ color: charsLeft < 500 ? '#ff6666' : '#00e5ff', fontSize: '13px', fontWeight: '600' }}>
              {charsLeft.toLocaleString()} / {WEEKLY_LIMIT.toLocaleString()} chars left
            </span>
          </div>
          <div style={{ background: '#1a1a1a', borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              borderRadius: '99px',
              width: `${usagePercent}%`,
              background: usagePercent > 80 ? 'linear-gradient(90deg, #ff6666, #ff3333)' : 'linear-gradient(90deg, #00e5ff, #b8ff57)',
              transition: 'width 0.4s ease'
            }} />
          </div>
          {charsLeft < 1000 && (
            <p style={{ color: '#ff6666', fontSize: '12px', marginTop: '8px', marginBottom: 0 }}>
              ⚠️ Running low — <a href="/pricing" style={{ color: '#00e5ff', textDecoration: 'none' }}>upgrade to Pro for unlimited</a>
            </p>
          )}
        </div>

        {/* Voice selector */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#555', fontSize: '13px', display: 'block', marginBottom: '10px' }}>Choose voice</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {VOICES.map(v => (
              <button
                key={v.id}
                onClick={() => setVoice(v.id)}
                style={{
                  background: voice === v.id ? 'rgba(0,229,255,0.08)' : '#0d0d0d',
                  border: `1px solid ${voice === v.id ? 'rgba(0,229,255,0.4)' : '#1a1a1a'}`,
                  borderRadius: '10px',
                  padding: '12px 10px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>{v.emoji}</div>
                <div style={{ color: voice === v.id ? '#00e5ff' : '#fff', fontSize: '14px', fontWeight: '600' }}>{v.label}</div>
                <div style={{ color: '#444', fontSize: '11px', marginTop: '2px', lineHeight: '1.3' }}>{v.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Speed control */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '16px 20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label style={{ color: '#555', fontSize: '13px' }}>Speed</label>
            <span style={{ color: '#00e5ff', fontSize: '13px', fontWeight: '600' }}>{speed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={speed}
            onChange={e => setSpeed(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#00e5ff', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#333', fontSize: '11px', marginTop: '4px' }}>
            <span>0.5x slow</span>
            <span>1.0x normal</span>
            <span>2.0x fast</span>
          </div>
        </div>

        {/* Text input */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
          <label style={{ color: '#555', fontSize: '13px', display: 'block', marginBottom: '10px' }}>
            Your script
          </label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Hey everyone, welcome back to my channel! Today we have an incredible story..."
            rows={6}
            style={{ width: '100%', background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '14px', color: '#fff', fontSize: '15px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'sans-serif', lineHeight: '1.6', outline: 'none' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            <span style={{ color: '#333', fontSize: '12px' }}>
              {selectedVoice?.emoji} {selectedVoice?.label} · {speed.toFixed(1)}x
            </span>
            <span style={{ color: text.length > charsLeft ? '#ff6666' : '#333', fontSize: '12px' }}>
              {text.length} chars
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#1a0505', border: '1px solid #ff333333', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#ff8888', fontSize: '14px' }}>
            {error}
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={generateVoice}
          disabled={loading || !text.trim() || text.length > charsLeft}
          style={{
            width: '100%',
            background: loading || !text.trim() || text.length > charsLeft
              ? '#111'
              : 'linear-gradient(135deg, #00e5ff, #b8ff57)',
            border: 'none',
            borderRadius: '12px',
            padding: '18px',
            color: loading || !text.trim() || text.length > charsLeft ? '#333' : '#000',
            fontWeight: '800',
            fontSize: '17px',
            cursor: loading || !text.trim() || text.length > charsLeft ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            letterSpacing: '0.02em'
          }}
        >
          {loading ? '⏳ Generating... (may take 20-60s on first use)' : '🎙️ Generate Voiceover'}
        </button>

        {loading && (
          <p style={{ color: '#444', fontSize: '13px', textAlign: 'center', marginTop: '10px' }}>
            First generation of the day takes ~60 seconds while the server wakes up. After that it's fast!
          </p>
        )}

        {/* Audio output */}
        {audioUrl && (
          <div style={{ background: '#0d0d0d', border: '1px solid rgba(0,229,255,0.2)', borderRadius: '16px', padding: '24px', marginTop: '20px', textAlign: 'center' }}>
            <p style={{ color: '#00e5ff', fontWeight: '700', marginBottom: '16px', fontSize: '16px' }}>
              ✅ Your voiceover is ready!
            </p>
            <audio controls src={audioUrl} style={{ width: '100%', marginBottom: '16px' }} />
            <a
              href={audioUrl}
              download="voiceover.mp3"
              style={{ display: 'inline-block', background: 'linear-gradient(135deg, #00e5ff, #b8ff57)', borderRadius: '8px', padding: '12px 32px', color: '#000', fontWeight: '700', textDecoration: 'none', fontSize: '15px' }}
            >
              ⬇️ Download MP3
            </a>
          </div>
        )}

      </div>
    </div>
  )
}