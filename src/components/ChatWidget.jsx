import { useState, useRef, useEffect } from 'react'

const SYSTEM_PROMPT = `You are Reda, a soft and calm AI assistant for Redacast — a text-to-speech tool built for faceless YouTube creators, podcasters, and commentary channels.

Your personality:
- Warm, patient, and encouraging
- Never rushed, never robotic
- Talk like a helpful creative friend, not a support bot
- Use simple language, short sentences
- Occasionally use light emojis to feel human

You can help with:
1. Questions about Redacast (pricing, how it works, voices, limits)
2. Helping users write or improve their video scripts
3. Collecting bug reports (ask for details, reassure them it will be fixed)

Key facts about Redacast:
- Free: 2,000 chars without signup, 20,000 chars/month with free account
- Pro: $4.99/month — unlimited, Google TTS 220+ voices
- Premium: $19.99/month — ElevenLabs voices, most human quality
- 8 free voices: Heart, Sky, Bella, Adam, Michael, Emma, George, Lewis
- Ctrl+Enter shortcut to generate
- MP3 download available
- Built with Microsoft Neural TTS (free tier)
- No credit card needed for free plan

If someone wants to report a bug, collect: what happened, what they clicked, what they expected. Then say you'll pass it on to the team.

Keep responses SHORT — 2-4 sentences max unless writing a script. Never write long paragraphs.`

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! I'm Reda 👋 I'm here to help you get the most out of Redacast. Ask me anything — scripts, voices, pricing, or just say hi." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [unread, setUnread] = useState(0)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  async function speakText(text) {
    try {
      setSpeaking(true)
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'af_sky', speed: 0.9 })
      })
      const result = await response.json()
      if (result.success && result.audio) {
        const audio = new Audio(result.audio)
        audio.onended = () => setSpeaking(false)
        audio.onerror = () => setSpeaking(false)
        await audio.play()
      } else {
        setSpeaking(false)
      }
    } catch {
      setSpeaking(false)
    }
  }

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      })
      const data = await response.json()
      const reply = data.content?.[0]?.text || "I'm sorry, something went wrong. Try again?"
      const assistantMsg = { role: 'assistant', content: reply }
      setMessages(prev => [...prev, assistantMsg])
      if (!open) setUnread(u => u + 1)
      await speakText(reply)
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I had a little hiccup. Try again in a moment 🙏" }])
    }
    setLoading(false)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div style={{ position: 'fixed', bottom: 90, right: 24, width: 360, height: 520, background: '#0a0a0a', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20, display: 'flex', flexDirection: 'column', zIndex: 1000, boxShadow: '0 24px 60px rgba(0,0,0,0.6)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', overflow: 'hidden' }}>

          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0d0d1a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🎙️</div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Reda</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: speaking ? '#a855f7' : '#22c55e' }} />
                  <span style={{ color: speaking ? '#c084fc' : '#22c55e', fontSize: 11 }}>{speaking ? 'Speaking...' : 'Online'}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 4 }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: m.role === 'user' ? '#6366f1' : '#161616', border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.06)', color: '#ddd', fontSize: 14, lineHeight: 1.6 }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 14px', borderRadius: '16px 16px 16px 4px', background: '#161616', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', animation: 'pulse 1.4s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} ref={inputRef} placeholder="Ask me anything..." rows={1} style={{ flex: 1, background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 14px', color: '#ddd', fontSize: 14, resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: 1.5, maxHeight: 80, overflowY: 'auto' }} />
            <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ width: 40, height: 40, borderRadius: 12, background: loading || !input.trim() ? '#1a1a1a' : '#6366f1', border: 'none', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
              {loading ? '⏳' : '➤'}
            </button>
          </div>

        </div>
      )}

      {/* Floating button */}
      <button onClick={() => setOpen(o => !o)} style={{ position: 'fixed', bottom: 24, right: 24, width: 56, height: 56, borderRadius: '50%', background: open ? '#1a1a1a' : 'linear-gradient(135deg, #6366f1, #a855f7)', border: open ? '1px solid rgba(255,255,255,0.1)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, zIndex: 1000, boxShadow: '0 8px 32px rgba(99,102,241,0.4)', transition: 'all 0.2s' }}>
        {open ? '×' : '💬'}
        {!open && unread > 0 && (
          <div style={{ position: 'absolute', top: 0, right: 0, width: 18, height: 18, borderRadius: '50%', background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unread}</div>
        )}
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  )
}