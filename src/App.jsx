import { useState, useRef, useEffect } from "react";

const VOICES_DATA = [
  { id: "en-US-1",  name: "Marcus",   lang: "English (US)", gender: "Male",   accent: "American",   style: "Deep & Authoritative", tag: "Popular", color: "#00FFB2", langCode: "en-US", pitch: 0.8,  rate: 0.9  },
  { id: "en-US-2",  name: "Sofia",    lang: "English (US)", gender: "Female", accent: "American",   style: "Warm & Engaging",      tag: "Popular", color: "#E8476A", langCode: "en-US", pitch: 1.2,  rate: 1.0  },
  { id: "en-GB-1",  name: "Oliver",   lang: "English (UK)", gender: "Male",   accent: "British",    style: "Refined & Confident",  tag: "Premium", color: "#47B8E8", langCode: "en-GB", pitch: 0.9,  rate: 0.95 },
  { id: "en-GB-2",  name: "Emma",     lang: "English (UK)", gender: "Female", accent: "British",    style: "Clear & Professional", tag: "Premium", color: "#E8C547", langCode: "en-GB", pitch: 1.3,  rate: 1.0  },
  { id: "en-AU-1",  name: "Jack",     lang: "English (AU)", gender: "Male",   accent: "Australian", style: "Casual & Friendly",    tag: "New",     color: "#A990F5", langCode: "en-AU", pitch: 0.95, rate: 1.0  },
  { id: "en-AU-2",  name: "Olivia",   lang: "English (AU)", gender: "Female", accent: "Australian", style: "Bright & Energetic",   tag: "New",     color: "#E87747", langCode: "en-AU", pitch: 1.1,  rate: 1.05 },
  { id: "fr-FR-1",  name: "Antoine",  lang: "Francais",     gender: "Male",   accent: "French",     style: "Smooth & Elegant",     tag: "",        color: "#00FFB2", langCode: "fr-FR", pitch: 0.9,  rate: 0.95 },
  { id: "fr-FR-2",  name: "Camille",  lang: "Francais",     gender: "Female", accent: "French",     style: "Expressive & Warm",    tag: "",        color: "#E8476A", langCode: "fr-FR", pitch: 1.2,  rate: 1.0  },
  { id: "es-ES-1",  name: "Diego",    lang: "Espanol",      gender: "Male",   accent: "Spanish",    style: "Bold & Confident",     tag: "",        color: "#47B8E8", langCode: "es-ES", pitch: 0.85, rate: 1.05 },
  { id: "de-DE-1",  name: "Klaus",    lang: "Deutsch",      gender: "Male",   accent: "German",     style: "Precise & Strong",     tag: "",        color: "#E8C547", langCode: "de-DE", pitch: 0.8,  rate: 0.9  },
  { id: "ar-SA-1",  name: "Karim",    lang: "Arabic",       gender: "Male",   accent: "Arabic",     style: "Rich & Resonant",      tag: "Popular", color: "#A990F5", langCode: "ar-SA", pitch: 0.85, rate: 0.9  },
  { id: "ja-JP-1",  name: "Yuki",     lang: "Japanese",     gender: "Female", accent: "Japanese",   style: "Crisp & Articulate",   tag: "",        color: "#E87747", langCode: "ja-JP", pitch: 1.3,  rate: 1.0  },
];

const EMOTIONS = [
  { id: "neutral",  label: "Neutral",  icon: "O", pitchMod: 0,    rateMod: 0,     desc: "Balanced and natural"      },
  { id: "excited",  label: "Excited",  icon: "!", pitchMod: 0.2,  rateMod: 0.2,   desc: "High energy, enthusiastic" },
  { id: "calm",     label: "Calm",     icon: "~", pitchMod: -0.1, rateMod: -0.2,  desc: "Slow, relaxed, peaceful"   },
  { id: "serious",  label: "Serious",  icon: "|", pitchMod: -0.2, rateMod: -0.15, desc: "Professional and formal"   },
  { id: "dramatic", label: "Dramatic", icon: "*", pitchMod: -0.3, rateMod: -0.25, desc: "Intense and cinematic"      },
  { id: "friendly", label: "Friendly", icon: "+", pitchMod: 0.1,  rateMod: 0.05,  desc: "Conversational and warm"   },
];

const PROJECTS_MOCK = [
  { id: 1, name: "YouTube Intro",       chars: 312,  date: "Today",      voice: "Marcus"  },
  { id: 2, name: "Podcast Episode 12",  chars: 1821, date: "Yesterday",  voice: "Sofia"   },
  { id: 3, name: "Product Demo",        chars: 890,  date: "2 days ago", voice: "Oliver"  },
];

function WaveAnim({ active, color, bars, height }) {
  color = color || "#00FFB2";
  bars = bars || 18;
  height = height || 28;
  const [heights, setHeights] = useState(function() { return Array(bars).fill(4); });
  const frameRef = useRef(null);

  useEffect(function() {
    if (active) {
      var animate = function() {
        setHeights(Array(bars).fill(0).map(function() { return Math.max(4, Math.floor(Math.random() * height)); }));
        frameRef.current = setTimeout(animate, 120);
      };
      animate();
    } else {
      clearTimeout(frameRef.current);
      setHeights(Array(bars).fill(0).map(function(_, i) { return Math.max(3, (i % 3 === 0 ? 14 : i % 2 === 0 ? 8 : 5)); }));
    }
    return function() { clearTimeout(frameRef.current); };
  }, [active]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: height }}>
      {heights.map(function(h, i) {
        return (
          <div key={i} style={{
            width: 3, height: h,
            background: active ? color : "#222",
            borderRadius: 2,
            transition: active ? "height 0.1s ease" : "height 0.4s ease",
          }} />
        );
      })}
    </div>
  );
}

function Tag({ label, color }) {
  return (
    <div style={{
      background: color + "18", border: "1px solid " + color + "35",
      borderRadius: 5, padding: "2px 8px",
      fontSize: 9, fontWeight: 800, color: color, letterSpacing: 1, textTransform: "uppercase",
    }}>{label}</div>
  );
}

function speakText(text, voice, emotion, speed, onStart, onEnd) {
  if (!window.speechSynthesis) { onEnd(); return; }
  window.speechSynthesis.cancel();
  var utter = new SpeechSynthesisUtterance(text);
  var voices = window.speechSynthesis.getVoices();
  var match = voices.find(function(v) {
    return v.lang === voice.langCode || v.lang.startsWith(voice.langCode.split("-")[0]);
  });
  if (match) utter.voice = match;
  utter.lang = voice.langCode;
  utter.pitch = Math.max(0.1, Math.min(2, voice.pitch + emotion.pitchMod));
  utter.rate = Math.max(0.5, Math.min(2, voice.rate * speed + emotion.rateMod));
  utter.volume = 1;
  utter.onstart = onStart;
  utter.onend = onEnd;
  utter.onerror = onEnd;
  window.speechSynthesis.speak(utter);
}

function StudioPage() {
  var [text, setText] = useState("Welcome to Redacast. Type your script here and click Generate to hear it in a real AI voice.");
  var [voice, setVoice] = useState(VOICES_DATA[0]);
  var [emotion, setEmotion] = useState(EMOTIONS[0]);
  var [speed, setSpeed] = useState(1.0);
  var [status, setStatus] = useState("idle");
  var [voiceFilter, setVoiceFilter] = useState("All");
  var charLimit = 2500;

  var handleGenerate = function() {
    if (!text.trim() || status === "generating") return;
    setStatus("generating");
    setTimeout(function() {
      setStatus("playing");
      speakText(text, voice, emotion, speed,
        function() { setStatus("playing"); },
        function() { setStatus("done"); }
      );
    }, 800);
  };

  var handleStop = function() {
    window.speechSynthesis && window.speechSynthesis.cancel();
    setStatus("done");
  };

  var filteredVoices = voiceFilter === "All" ? VOICES_DATA
    : voiceFilter === "Male" ? VOICES_DATA.filter(function(v) { return v.gender === "Male"; })
    : VOICES_DATA.filter(function(v) { return v.gender === "Female"; });

  var pct = Math.min(100, (text.length / charLimit) * 100);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, padding: 24, height: "100%", overflow: "hidden" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, overflowY: "auto" }}>
        <div style={{ background: "#0D0D0D", border: "1px solid #1E1E1E", borderRadius: 18, overflow: "hidden" }}>
          <div style={{ padding: "13px 20px", borderBottom: "1px solid #141414", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#444", letterSpacing: 1 }}>SCRIPT EDITOR</span>
            <span style={{ fontSize: 11, color: pct > 90 ? "#E8476A" : "#444" }}>{text.length} / {charLimit}</span>
          </div>
          <div style={{ height: 3, background: "#111" }}>
            <div style={{ width: pct + "%", height: "100%", background: pct > 90 ? "#E8476A" : "#00FFB2", transition: "width 0.2s" }} />
          </div>
          <textarea
            value={text}
            onChange={function(e) { setText(e.target.value.slice(0, charLimit)); }}
            placeholder="Type or paste your script here..."
            style={{ width: "100%", minHeight: 220, background: "transparent", border: "none", padding: "20px", color: "#E0E0E0", fontSize: 15, lineHeight: 1.85, resize: "vertical", outline: "none", fontFamily: "Georgia, serif", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ background: "#0D0D0D", border: "1px solid #1E1E1E", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#555", fontWeight: 800, letterSpacing: 1, marginBottom: 12 }}>EMOTION STYLE</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {EMOTIONS.map(function(em) {
              return (
                <button key={em.id} onClick={function() { setEmotion(em); }} style={{ background: emotion.id === em.id ? "#00FFB212" : "#111", border: "1.5px solid " + (emotion.id === em.id ? "#00FFB2" : "#222"), borderRadius: 10, padding: "8px 16px", color: emotion.id === em.id ? "#00FFB2" : "#555", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                  {em.label}
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: 11, color: "#333", marginTop: 10, fontStyle: "italic" }}>{emotion.desc}</div>
        </div>

        <div style={{ background: "#0D0D0D", border: "1px solid #1E1E1E", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#555", fontWeight: 800, letterSpacing: 1, marginBottom: 10 }}>PLAYBACK SPEED - {speed.toFixed(1)}x</div>
          <input type="range" min="0.5" max="2" step="0.1" value={speed}
            onChange={function(e) { setSpeed(parseFloat(e.target.value)); }}
            style={{ width: "100%", accentColor: "#00FFB2" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#333", marginTop: 4 }}>
            <span>0.5x Slow</span><span>1.0x Normal</span><span>2.0x Fast</span>
          </div>
        </div>

        <button onClick={status === "playing" ? handleStop : handleGenerate}
          style={{ width: "100%", padding: "18px", background: status === "generating" ? "#111" : status === "playing" ? "linear-gradient(135deg, #E8476A, #E87747)" : "linear-gradient(135deg, #00FFB2, #47B8E8)", border: "none", borderRadius: 14, fontWeight: 900, fontSize: 16, color: status === "generating" ? "#444" : "#000", cursor: "pointer", transition: "all 0.3s" }}>
          {status === "generating" ? "Preparing voice..." : status === "playing" ? "Stop" : status === "done" ? "Play Again" : "Generate Voiceover"}
        </button>

        {(status === "playing" || status === "done") && (
          <div style={{ background: "#0D0D0D", border: "1px solid #00FFB220", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg, #00FFB218, #47B8E818)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🎧</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 13 }}>{voice.name} - {emotion.label}</div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{speed.toFixed(1)}x speed</div>
            </div>
            <WaveAnim active={status === "playing"} color="#00FFB2" height={28} />
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
        <div style={{ background: "#0D0D0D", border: "1px solid #1E1E1E", borderRadius: 14, padding: "14px 16px", flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: "#555", fontWeight: 800, letterSpacing: 1, marginBottom: 10 }}>SELECT VOICE</div>
          <div style={{ display: "flex", gap: 6 }}>
            {["All", "Male", "Female"].map(function(f) {
              return (
                <button key={f} onClick={function() { setVoiceFilter(f); }} style={{ flex: 1, background: voiceFilter === f ? "#00FFB210" : "transparent", border: "1px solid " + (voiceFilter === f ? "#00FFB240" : "#222"), borderRadius: 7, padding: "6px", color: voiceFilter === f ? "#00FFB2" : "#444", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{f}</button>
              );
            })}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          {filteredVoices.map(function(v) {
            var selected = voice.id === v.id;
            return (
              <div key={v.id} onClick={function() { setVoice(v); }} style={{ background: selected ? v.color + "0C" : "#0D0D0D", border: "1.5px solid " + (selected ? v.color : "#1E1E1E"), borderRadius: 13, padding: "16px 18px", cursor: "pointer", transition: "all 0.2s", boxShadow: selected ? "0 0 20px " + v.color + "18" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{v.name}</div>
                    <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{v.accent} - {v.gender}</div>
                    <div style={{ fontSize: 11, color: "#3a3a3a", marginTop: 2, fontStyle: "italic" }}>{v.style}</div>
                  </div>
                  {v.tag && <Tag label={v.tag} color={v.color} />}
                </div>
                <WaveAnim active={selected && status === "playing"} color={v.color} bars={14} height={22} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <div style={{ padding: 24, overflowY: "auto", height: "100%" }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5 }}>Good morning, <span style={{ color: "#00FFB2" }}>Reda</span></h2>
        <p style={{ color: "#555", marginTop: 6, fontSize: 14 }}>Here is your Redacast overview.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Characters Used",  value: "6,023", color: "#00FFB2", sub: "This month" },
          { label: "Audios Generated", value: "14",    color: "#47B8E8", sub: "This month" },
          { label: "Languages Used",   value: "3",     color: "#E8C547", sub: "EN, FR, AR"  },
        ].map(function(s, i) {
          return (
            <div key={i} style={{ background: "#0D0D0D", border: "1px solid #1E1E1E", borderRadius: 16, padding: "20px 22px" }}>
              <div style={{ fontSize: 11, color: "#555", fontWeight: 800, letterSpacing: 1, marginBottom: 8 }}>{s.label.toUpperCase()}</div>
              <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: -1, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#444", marginTop: 6 }}>{s.sub}</div>
            </div>
          );
        })}
      </div>
      <div style={{ background: "#0D0D0D", border: "1px solid #1E1E1E", borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #141414", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 800, fontSize: 14 }}>Recent Projects</span>
          <span style={{ fontSize: 12, color: "#555", cursor: "pointer" }}>View all</span>
        </div>
        {PROJECTS_MOCK.map(function(p, i) {
          return (
            <div key={i} style={{ padding: "14px 20px", borderBottom: i < PROJECTS_MOCK.length - 1 ? "1px solid #111" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#141414", border: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🎙</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{p.chars} chars - {p.voice}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#444" }}>{p.date}</div>
            </div>
          );
        })}
      </div>
      <div style={{ background: "linear-gradient(135deg, #00FFB20A, #47B8E80A)", border: "1px solid #00FFB222", borderRadius: 16, padding: "22px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 4 }}>Upgrade to Pro - $9/mo</div>
          <div style={{ fontSize: 13, color: "#555" }}>50,000 chars/mo - All voices - MP3 downloads</div>
        </div>
        <button style={{ background: "linear-gradient(135deg, #00FFB2, #47B8E8)", border: "none", borderRadius: 10, padding: "11px 24px", fontWeight: 900, fontSize: 13, color: "#000", cursor: "pointer" }}>Upgrade Now</button>
      </div>
    </div>
  );
}

function VoicesPage({ onUseVoice }) {
  var [playing, setPlaying] = useState(null);

  var handlePreview = function(v) {
    if (playing === v.id) { window.speechSynthesis && window.speechSynthesis.cancel(); setPlaying(null); return; }
    setPlaying(v.id);
    speakText("Hi, I am " + v.name + ". " + v.style + ".", v, EMOTIONS[0], 1.0, function() {}, function() { setPlaying(null); });
  };

  return (
    <div style={{ padding: 24, overflowY: "auto", height: "100%" }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5 }}>Voice Library</h2>
        <p style={{ color: "#555", marginTop: 6, fontSize: 14 }}>12 voices across 8 languages. Click Preview to hear them.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {VOICES_DATA.map(function(v) {
          return (
            <div key={v.id} style={{ background: "#0D0D0D", border: "1.5px solid " + (playing === v.id ? v.color : "#1E1E1E"), borderRadius: 16, padding: "20px 22px", transition: "all 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 17 }}>{v.name}</div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>{v.lang} - {v.gender}</div>
                  <div style={{ fontSize: 11, color: "#3a3a3a", marginTop: 2, fontStyle: "italic" }}>{v.style}</div>
                </div>
                {v.tag && <Tag label={v.tag} color={v.color} />}
              </div>
              <WaveAnim active={playing === v.id} color={v.color} height={22} bars={14} />
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button onClick={function() { handlePreview(v); }} style={{ flex: 1, background: playing === v.id ? v.color + "15" : "#141414", border: "1px solid " + (playing === v.id ? v.color + "40" : "#222"), borderRadius: 8, padding: "9px", color: playing === v.id ? v.color : "#666", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                  {playing === v.id ? "Stop" : "Preview"}
                </button>
                <button onClick={function() { onUseVoice(v); }} style={{ background: "#141414", border: "1px solid #222", borderRadius: 8, padding: "9px 16px", color: "#666", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Use</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LandingPage({ onLaunchApp }) {
  var [demoText, setDemoText] = useState("Redacast gives you studio-quality AI voices in seconds. No recording needed.");
  var [demoVoice, setDemoVoice] = useState(VOICES_DATA[0]);
  var [demoEmotion, setDemoEmotion] = useState(EMOTIONS[0]);
  var [demoStatus, setDemoStatus] = useState("idle");

  var handleDemo = function() {
    if (demoStatus === "playing") { window.speechSynthesis && window.speechSynthesis.cancel(); setDemoStatus("idle"); return; }
    setDemoStatus("generating");
    setTimeout(function() {
      setDemoStatus("playing");
      speakText(demoText, demoVoice, demoEmotion, 1.0, function() {}, function() { setDemoStatus("done"); });
    }, 800);
  };

  var FEATS = [
    { icon: "🎙", title: "12 AI Voices",        desc: "Multiple voices across 8 languages. Every accent, every style.",  color: "#00FFB2" },
    { icon: "🎭", title: "Emotion Control",      desc: "Excited, calm, dramatic, serious - the voice actually changes.",  color: "#E8C547" },
    { icon: "📥", title: "MP3 Downloads",        desc: "Broadcast-quality audio ready for Premiere or CapCut.",           color: "#47B8E8" },
    { icon: "⚡", title: "Instant Generation",   desc: "Your voiceover is ready in seconds. No queue, no waiting.",       color: "#E8476A" },
    { icon: "🌍", title: "8 Languages",          desc: "English, French, Spanish, Arabic, German, Japanese and more.",    color: "#A990F5" },
    { icon: "🧬", title: "Voice Cloning (soon)", desc: "Upload 60 seconds of your voice. Clone it forever.",              color: "#E87747" },
  ];

  var COMPARE = [
    { f: "Multiple voices",  r: true,   e: true,  m: true  },
    { f: "Emotion control",  r: true,   e: true,  m: false },
    { f: "Free tier",        r: true,   e: true,  m: true  },
    { f: "MP3 download",     r: true,   e: true,  m: true  },
    { f: "Price (Pro)",      r: "$9",   e: "$22", m: "$19" },
    { f: "SRT subtitles",    r: true,   e: false, m: false },
    { f: "API access",       r: true,   e: true,  m: false },
    { f: "Voice cloning",    r: "Soon", e: true,  m: false },
  ];

  return (
    <div style={{ overflowY: "auto", height: "100%", background: "#060606" }}>
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: "25%", width: 600, height: 600, background: "radial-gradient(circle, #00FFB2 0%, transparent 70%)", opacity: 0.07, pointerEvents: "none", borderRadius: "50%", transform: "translate(-50%, -50%)" }} />

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#00FFB210", border: "1px solid #00FFB230", borderRadius: 20, padding: "6px 18px", fontSize: 11, fontWeight: 800, color: "#00FFB2", marginBottom: 32, letterSpacing: 1, textTransform: "uppercase", position: "relative", zIndex: 1 }}>The ElevenLabs alternative for creators</div>

        <h1 style={{ fontSize: "clamp(40px, 8vw, 86px)", fontWeight: 900, lineHeight: 1.02, letterSpacing: -3, margin: "0 0 28px", maxWidth: 880, fontFamily: "Georgia, serif", position: "relative", zIndex: 1 }}>
          Your words.<br />
          <span style={{ background: "linear-gradient(135deg, #00FFB2, #47B8E8, #A990F5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Any voice.</span><br />
          Zero recording.
        </h1>

        <p style={{ fontSize: "clamp(15px, 2vw, 19px)", color: "#666", maxWidth: 540, lineHeight: 1.8, margin: "0 0 44px", position: "relative", zIndex: 1 }}>
          Studio-quality voiceovers in seconds. 12 voices, 8 languages, emotion control - built for YouTubers and podcasters.
        </p>

        <div style={{ display: "flex", gap: 12, marginBottom: 72, flexWrap: "wrap", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <button onClick={onLaunchApp} style={{ background: "linear-gradient(135deg, #00FFB2, #47B8E8)", border: "none", borderRadius: 14, padding: "16px 36px", fontWeight: 900, fontSize: 16, color: "#000", cursor: "pointer", boxShadow: "0 8px 40px #00FFB235" }}>Start Creating Free</button>
          <button style={{ background: "transparent", border: "1px solid #222", borderRadius: 14, padding: "16px 36px", fontWeight: 700, fontSize: 15, color: "#555", cursor: "pointer" }}>Hear the difference</button>
        </div>

        <div style={{ width: "100%", maxWidth: 660, position: "relative", zIndex: 1, background: "#0A0A0A", border: "1px solid #1E1E1E", borderRadius: 20, overflow: "hidden", boxShadow: "0 40px 100px #00000080" }}>
          <div style={{ background: "#0E0E0E", padding: "12px 18px", borderBottom: "1px solid #141414", display: "flex", alignItems: "center", gap: 8 }}>
            {["#E8476A", "#E8C547", "#00FFB2"].map(function(c, i) { return <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />; })}
            <span style={{ fontSize: 11, color: "#333", marginLeft: 8, fontWeight: 600 }}>redacast.app - Live Demo</span>
          </div>
          <div style={{ padding: 24 }}>
            <textarea value={demoText} onChange={function(e) { setDemoText(e.target.value.slice(0, 300)); }}
              style={{ width: "100%", minHeight: 80, background: "#111", border: "1px solid #1E1E1E", borderRadius: 10, padding: "14px 16px", color: "#E0E0E0", fontSize: 14, lineHeight: 1.7, resize: "none", outline: "none", fontFamily: "Georgia, serif", boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <select value={demoVoice.id} onChange={function(e) { setDemoVoice(VOICES_DATA.find(function(v) { return v.id === e.target.value; })); }}
                style={{ flex: 1, background: "#111", border: "1px solid #1E1E1E", borderRadius: 8, padding: "9px 12px", color: "#E0E0E0", fontSize: 13, outline: "none" }}>
                {VOICES_DATA.map(function(v) { return <option key={v.id} value={v.id}>{v.name} - {v.style}</option>; })}
              </select>
              <select value={demoEmotion.id} onChange={function(e) { setDemoEmotion(EMOTIONS.find(function(em) { return em.id === e.target.value; })); }}
                style={{ background: "#111", border: "1px solid #1E1E1E", borderRadius: 8, padding: "9px 12px", color: "#00FFB2", fontSize: 13, outline: "none" }}>
                {EMOTIONS.map(function(em) { return <option key={em.id} value={em.id}>{em.label}</option>; })}
              </select>
            </div>
            <button onClick={handleDemo} style={{ width: "100%", marginTop: 12, padding: 14, background: demoStatus === "generating" ? "#111" : demoStatus === "playing" ? "linear-gradient(135deg, #E8476A, #E87747)" : "linear-gradient(135deg, #00FFB2, #47B8E8)", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 14, color: demoStatus === "generating" ? "#444" : "#000", cursor: "pointer" }}>
              {demoStatus === "generating" ? "Preparing..." : demoStatus === "playing" ? "Stop" : demoStatus === "done" ? "Play Again" : "Generate Voiceover"}
            </button>
          </div>
        </div>
      </section>

      <section style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontSize: 10, color: "#00FFB2", letterSpacing: 3, fontWeight: 800, textTransform: "uppercase", marginBottom: 12 }}>What you get</div>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, letterSpacing: -1.5, fontFamily: "Georgia, serif" }}>Built for creators.<br /><span style={{ color: "#2a2a2a" }}>Not engineers.</span></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
          {FEATS.map(function(f, i) {
            return (
              <div key={i} style={{ background: "#0A0A0A", border: "1px solid #141414", borderRadius: 16, padding: 28, transition: "all 0.2s" }}
                onMouseEnter={function(e) { e.currentTarget.style.borderColor = f.color + "44"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={function(e) { e.currentTarget.style.borderColor = "#141414"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: f.color + "14", border: "1px solid " + f.color + "28", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 18 }}>{f.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ padding: "80px 24px", background: "#080808" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 10, color: "#47B8E8", letterSpacing: 3, fontWeight: 800, textTransform: "uppercase", marginBottom: 12 }}>Why Redacast</div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: -1, fontFamily: "Georgia, serif" }}>More features.<br /><span style={{ color: "#2a2a2a" }}>Half the price.</span></h2>
          </div>
          <div style={{ background: "#0A0A0A", border: "1px solid #1a1a1a", borderRadius: 18, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", background: "#0E0E0E", padding: "14px 20px", borderBottom: "1px solid #141414" }}>
              {["Feature", "Redacast", "ElevenLabs", "Murf"].map(function(h, i) {
                return <span key={i} style={{ fontSize: i === 0 ? 12 : 13, fontWeight: i === 1 ? 900 : 700, color: i === 1 ? "#00FFB2" : "#444", textAlign: i > 0 ? "center" : "left" }}>{h}</span>;
              })}
            </div>
            {COMPARE.map(function(row, i) {
              return (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", padding: "13px 20px", borderBottom: i < COMPARE.length - 1 ? "1px solid #0E0E0E" : "none", background: i % 2 === 0 ? "transparent" : "#0D0D0D" }}>
                  <span style={{ fontSize: 13, color: "#777" }}>{row.f}</span>
                  {[row.r, row.e, row.m].map(function(val, j) {
                    return (
                      <span key={j} style={{ textAlign: "center", fontSize: 14 }}>
                        {typeof val === "boolean" ? (val ? <span style={{ color: j === 0 ? "#00FFB2" : "#444" }}>✓</span> : <span style={{ color: "#222" }}>✗</span>) : <span style={{ color: j === 0 ? "#00FFB2" : "#555", fontWeight: 800, fontSize: 12 }}>{val}</span>}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ padding: "100px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(30px, 5vw, 56px)", fontWeight: 900, letterSpacing: -2, fontFamily: "Georgia, serif", marginBottom: 16 }}>Ready to find<br />your voice?</h2>
          <p style={{ color: "#555", fontSize: 16, marginBottom: 36 }}>No credit card. No setup. Just voices, instantly.</p>
          <button onClick={onLaunchApp} style={{ background: "linear-gradient(135deg, #00FFB2, #47B8E8)", border: "none", borderRadius: 14, padding: "18px 48px", fontWeight: 900, fontSize: 17, color: "#000", cursor: "pointer", boxShadow: "0 12px 48px #00FFB235" }}>Start for Free</button>
        </div>
      </section>
    </div>
  );
}

export default function Redacast() {
  var [page, setPage] = useState("landing");
  var [selectedVoice, setSelectedVoice] = useState(VOICES_DATA[0]);

  var NAV = [
    { id: "landing",   icon: "Home",      label: "Home"      },
    { id: "app",       icon: "Studio",    label: "Studio"    },
    { id: "voices",    icon: "Voices",    label: "Voices"    },
    { id: "dashboard", icon: "Dashboard", label: "Dashboard" },
  ];

  return (
    <div style={{ width: "100%", height: "100vh", background: "#060606", color: "#E0E0E0", fontFamily: "DM Sans, Segoe UI, system-ui, sans-serif", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0A0A0A; }
        ::-webkit-scrollbar-thumb { background: #1E1E1E; border-radius: 2px; }
        input[type=range] { -webkit-appearance: none; height: 4px; border-radius: 2px; background: #1E1E1E; cursor: pointer; outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #00FFB2; cursor: pointer; }
        select option { background: #111; }
      `}</style>

      <div style={{ height: 58, padding: "0 20px", flexShrink: 0, background: "#080808", borderBottom: "1px solid #111", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg, #00FFB2, #47B8E8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🎙</div>
          <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: -0.5 }}>Redacast</span>
          <div style={{ background: "#00FFB214", border: "1px solid #00FFB230", borderRadius: 5, padding: "2px 8px", fontSize: 9, fontWeight: 800, color: "#00FFB2", letterSpacing: 1 }}>BETA</div>
        </div>

        <div style={{ display: "flex", gap: 4 }}>
          {NAV.map(function(n) {
            return (
              <button key={n.id} onClick={function() { setPage(n.id); }} style={{ background: page === n.id ? "#141414" : "transparent", border: "1px solid " + (page === n.id ? "#252525" : "transparent"), borderRadius: 8, padding: "7px 16px", color: page === n.id ? "#E0E0E0" : "#444", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                {n.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "#0D0D0D", border: "1px solid #1E1E1E", borderRadius: 8, padding: "6px 14px", fontSize: 11, color: "#555", fontWeight: 700 }}>Free Plan</div>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #0f2027, #203a43)", border: "1px solid #1E1E1E", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: "#00FFB2", cursor: "pointer" }}>R</div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "hidden" }}>
        {page === "landing"   && <LandingPage onLaunchApp={function() { setPage("app"); }} />}
        {page === "app"       && <StudioPage />}
        {page === "voices"    && <VoicesPage onUseVoice={function(v) { setSelectedVoice(v); setPage("app"); }} />}
        {page === "dashboard" && <DashboardPage />}
      </div>
    </div>
  );
}