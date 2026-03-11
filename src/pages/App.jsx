import { useState } from 'react'
import { useAuth } from '../firebase/AuthContext'

const ELEVENLABS_API_KEY = 'sk_8c584e85dbb47b51301bac1e8ff08d2a161c2e0585348d3b'
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'

export default function App() {
  const { user, signOut } = useAuth()
  const [text, setText] = useState('')
  const [audioUrl, setAudioUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function generateVoice() {
    if (!text.trim()) return
    setLoading(true)
    setError('')
    setAudioUrl(null)
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        })
      })
      if (!response.ok) throw new Error('Generation failed. Please try again.')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #222' }}>
        <h1 style={{ color: '#00e5ff', fontSize: '20px', fontWeight: '700', margin: 0 }}>VoiceClone AI</h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ color: '#666', fontSize: '14px' }}>{user?.email}</span>
          <button onClick={signOut} style={{ background: 'transparent', border: '1px solid #333', borderRadius: '8px', padding: '8px 16px', color: '#aaa', cursor: 'pointer' }}>
            Sign out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '700px', margin: '60px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '800', textAlign: 'center', marginBottom: '8px' }}>
          Generate your voiceover
        </h2>
        <p style={{ color: '#666', textAlign: 'center', marginBottom: '40px' }}>
          Type anything and get a professional voiceover in seconds
        </p>

        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
          <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '10px' }}>
            What should it say?
          </label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Hey everyone, welcome back to my channel!"
            rows={5}
            style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '14px', color: '#fff', fontSize: '15px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'sans-serif' }}
          />
          <div style={{ color: '#444', fontSize: '12px', marginTop: '8px', textAlign: 'right' }}>
            {text.length} characters
          </div>
        </div>

        {error && (
          <div style={{ background: '#2a0a0a', border: '1px solid #ff0000', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: '#ff6666' }}>
            {error}
          </div>
        )}

        <button
          onClick={generateVoice}
          disabled={loading || !text.trim()}
          style={{
            width: '100%',
            background: loading || !text.trim() ? '#222' : 'linear-gradient(135deg, #00e5ff, #b8ff57)',
            border: 'none',
            borderRadius: '12px',
            padding: '18px',
            color: loading || !text.trim() ? '#444' : '#000',
            fontWeight: '800',
            fontSize: '18px',
            cursor: loading || !text.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Generating...' : 'Generate Voiceover'}
        </button>

        {audioUrl && (
          <div style={{ background: '#111', border: '1px solid #00e5ff33', borderRadius: '16px', padding: '24px', marginTop: '24px', textAlign: 'center' }}>
            <p style={{ color: '#00e5ff', fontWeight: '700', marginBottom: '16px' }}>Your voiceover is ready!</p>
            <audio controls src={audioUrl} style={{ width: '100%', marginBottom: '16px' }} />
            <a
              href={audioUrl}
              download="voiceover.mp3"
              style={{ display: 'inline-block', background: 'linear-gradient(135deg, #00e5ff, #b8ff57)', borderRadius: '8px', padding: '12px 32px', color: '#000', fontWeight: '700', textDecoration: 'none' }}
            >
              Download MP3
            </a>
          </div>
        )}
      </div>
    </div>
  )
}