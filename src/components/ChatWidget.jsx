import { useState, useRef, useEffect } from 'react'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

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
  const [hovered, setHovered] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 150) }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function speakText(text) {
    try {
      setSpeaking(true)
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'af_sky', speed: 0.9 })
      })
      const result = await res.json()
      if (result.success && result.audio) {
        const audio = new Audio(result.audio)
        audio.onended = () => setSpeaking(false)
        audio.onerror = () => setSpeaking(false)
        await audio.play()
      } else setSpeaking(false)
    } catch { setSpeaking(false) }
  }

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 300,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...newMessages.map(m => ({ role: m.role, content: m.content }))
          ]
        })
      })
      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content || "I'm sorry, something went wrong. Try again?"
      const assistantMsg = { role: 'assistant', content: reply }
      setMessages(prev => [...prev, assistantMsg])
      if (!open) setUnread(u => u + 1)
      speakText(reply)
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I had a little hiccup. Try again in a moment 🙏" }])
    }
    setLoading(false)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:.3;transform:scale(.7)} 50%{opacity:1;transform:scale(1)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(99,102,241,0.3)} 50%{box-shadow:0 0 40px rgba(168,85,247,0.5)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .chat-msg { animation: fadeUp 0.25s ease forwards; }
        .chat-scroll::-webkit-scrollbar { width: 4px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 4px; }
        .chat-input:focus { border-color: rgba(99,102,241,0.5) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.1) !important; }
        .send-btn:hover:not(:disabled) { background: #7c3aed !important; transform: scale(1.05); }
        .send-btn:active:not(:disabled) { transform: scale(0.95); }
      `}</style>

      {/* Panel */}
      {open && (
        <div style={{ position:'fixed', bottom:88, right:24, width:380, height:560, zIndex:9999, display:'flex', flexDirection:'column', borderRadius:24, overflow:'hidden', background:'linear-gradient(145deg,#0c0c1a,#080810)', border:'1px solid rgba(99,102,241,0.2)', boxShadow:'0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', animation:'fadeUp 0.3s ease' }}>

          {/* Header */}
          <div style={{ padding:'18px 20px', background:'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(168,85,247,0.08))', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', gap:12, backdropFilter:'blur(10px)' }}>
            <div style={{ position:'relative', flexShrink:0 }}>
              <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, boxShadow:'0 4px 16px rgba(99,102,241,0.4)', animation:'glow 3s ease-in-out infinite' }}>🎙️</div>
              <div style={{ position:'absolute', bottom:1, right:1, width:11, height:11, borderRadius:'50%', background: speaking ? '#a855f7' : '#22c55e', border:'2px solid #0c0c1a', transition:'background 0.3s' }} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ color:'#fff', fontWeight:700, fontSize:15, letterSpacing:'-0.02em' }}>Reda</div>
              <div style={{ color: speaking ? '#c084fc' : '#4ade80', fontSize:11, fontWeight:500, letterSpacing:'0.03em', textTransform:'uppercase', transition:'color 0.3s' }}>
                {speaking ? '● Speaking...' : '● Online'}
              </div>
            </div>
            <div style={{ display:'flex', gap:4 }}>
              <div style={{ width:10, height:10, borderRadius:'50%', background:'rgba(239,68,68,0.6)' }} />
              <div style={{ width:10, height:10, borderRadius:'50%', background:'rgba(234,179,8,0.6)' }} />
              <div style={{ width:10, height:10, borderRadius:'50%', background:'rgba(34,197,94,0.6)', cursor:'pointer' }} onClick={() => setOpen(false)} />
            </div>
          </div>

          {/* Messages */}
          <div className="chat-scroll" style={{ flex:1, overflowY:'auto', padding:'20px 16px', display:'flex', flexDirection:'column', gap:14 }}>
            {messages.map((m, i) => (
              <div key={i} className="chat-msg" style={{ display:'flex', flexDirection:'column', alignItems: m.role==='user' ? 'flex-end' : 'flex-start', gap:4 }}>
                {m.role === 'assistant' && (
                  <div style={{ fontSize:10, color:'#444', fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', paddingLeft:4 }}>Reda</div>
                )}
                <div style={{ maxWidth:'82%', padding:'12px 16px', borderRadius: m.role==='user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: m.role==='user' ? 'linear-gradient(135deg,#6366f1,#7c3aed)' : 'rgba(255,255,255,0.04)', border: m.role==='user' ? 'none' : '1px solid rgba(255,255,255,0.07)', color: m.role==='user' ? '#fff' : '#c8c8d8', fontSize:14, lineHeight:1.65, boxShadow: m.role==='user' ? '0 4px 16px rgba(99,102,241,0.3)' : 'none' }}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-msg" style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', gap:4 }}>
                <div style={{ fontSize:10, color:'#444', fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', paddingLeft:4 }}>Reda</div>
                <div style={{ padding:'14px 18px', borderRadius:'18px 18px 18px 4px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', display:'flex', gap:5, alignItems:'center' }}>
                  {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#a855f7)', animation:'pulse 1.4s ease-in-out infinite', animationDelay:`${i*0.2}s` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div style={{ padding:'0 16px 12px', display:'flex', gap:6, flexWrap:'wrap' }}>
              {['How does it work?', 'Help me write a script', 'What voices are free?'].map(s => (
                <button key={s} onClick={() => { setInput(s); setTimeout(sendMessage, 50) }} style={{ padding:'6px 12px', borderRadius:20, background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.25)', color:'#a5b4fc', fontSize:12, cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s' }}
                  onMouseEnter={e => e.target.style.background='rgba(99,102,241,0.2)'}
                  onMouseLeave={e => e.target.style.background='rgba(99,102,241,0.1)'}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding:'12px 16px 16px', borderTop:'1px solid rgba(255,255,255,0.05)', background:'rgba(0,0,0,0.2)', display:'flex', gap:10, alignItems:'flex-end' }}>
            <textarea
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              ref={inputRef}
              placeholder="Ask me anything..."
              rows={1}
              style={{ flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'11px 14px', color:'#e2e2f0', fontSize:14, resize:'none', outline:'none', fontFamily:'inherit', lineHeight:1.5, maxHeight:90, overflowY:'auto', transition:'all 0.2s', caretColor:'#6366f1' }}
            />
            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{ width:42, height:42, borderRadius:14, background: loading || !input.trim() ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#6366f1,#7c3aed)', border:'none', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.2s', boxShadow: !loading && input.trim() ? '0 4px 16px rgba(99,102,241,0.4)' : 'none' }}>
              {loading
                ? <div style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.2)', borderTopColor:'#6366f1', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              }
            </button>
          </div>

          {/* Footer */}
          <div style={{ padding:'8px 16px 12px', textAlign:'center' }}>
            <span style={{ fontSize:10, color:'#2a2a3a', letterSpacing:'0.05em' }}>Powered by Redacast AI · Press Enter to send</span>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position:'fixed', bottom:24, right:24, width:60, height:60, borderRadius:'50%', background: open ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg,#6366f1,#a855f7)', border: open ? '1px solid rgba(255,255,255,0.1)' : 'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, zIndex:9999, boxShadow: open ? 'none' : '0 8px 32px rgba(99,102,241,0.5), 0 0 0 1px rgba(255,255,255,0.05)', transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)', transform: hovered && !open ? 'scale(1.1)' : 'scale(1)' }}>
        <span style={{ transition:'transform 0.3s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)', display:'block', fontSize: open ? 28 : 24 }}>
          {open ? '×' : '💬'}
        </span>
        {!open && unread > 0 && (
          <div style={{ position:'absolute', top:-2, right:-2, width:20, height:20, borderRadius:'50%', background:'linear-gradient(135deg,#ef4444,#dc2626)', color:'#fff', fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #000', boxShadow:'0 2px 8px rgba(239,68,68,0.5)' }}>{unread}</div>
        )}
      </button>
    </>
  )
}