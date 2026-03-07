import { useState, useRef, useEffect } from "react";

// ─── ELEVENLABS VOICE IDs (mapped to our voice names) ────────────────────────
// These are real ElevenLabs voice IDs from their free voice library
const VOICES_DATA = [
  { id: "en-US-1",  name: "Marcus",   lang: "English (US)", gender: "Male",   accent: "American",   style: "Deep & Authoritative",   tag: "Popular", color: "#00FFB2", langCode: "en-US", pitch: 0.8,  rate: 0.9,  elId: "VR6AewLTigWG4xSOukaG" },
  { id: "en-US-2",  name: "Sofia",    lang: "English (US)", gender: "Female", accent: "American",   style: "Warm & Engaging",         tag: "Popular", color: "#E8476A", langCode: "en-US", pitch: 1.2,  rate: 1.0,  elId: "EXAVITQu4vr4xnSDxMaL" },
  { id: "en-US-3",  name: "Tyler",    lang: "English (US)", gender: "Male",   accent: "American",   style: "Casual & Upbeat",         tag: "New",     color: "#47B8E8", langCode: "en-US", pitch: 1.0,  rate: 1.05, elId: "TxGEqnHWrfWFTfGW9XjX" },
  { id: "en-US-4",  name: "Ava",      lang: "English (US)", gender: "Female", accent: "American",   style: "Crisp & Confident",       tag: "",        color: "#A990F5", langCode: "en-US", pitch: 1.1,  rate: 1.0,  elId: "ThT5KcBeYPX3keUQqHPh" },
  { id: "en-GB-1",  name: "Oliver",   lang: "English (UK)", gender: "Male",   accent: "British",    style: "Refined & Confident",     tag: "Premium", color: "#47B8E8", langCode: "en-GB", pitch: 0.9,  rate: 0.95, elId: "GBv7mTt0atIp3Br8iCZE" },
  { id: "en-GB-2",  name: "Emma",     lang: "English (UK)", gender: "Female", accent: "British",    style: "Clear & Professional",    tag: "Premium", color: "#E8C547", langCode: "en-GB", pitch: 1.3,  rate: 1.0,  elId: "LcfcDJNUP1GQjkzn1xUU" },
  { id: "en-GB-3",  name: "Henry",    lang: "English (UK)", gender: "Male",   accent: "British",    style: "Authoritative & Calm",    tag: "",        color: "#E87747", langCode: "en-GB", pitch: 0.85, rate: 0.9,  elId: "onwK4e9ZLuTAKqWW03F9" },
  { id: "en-AU-1",  name: "Jack",     lang: "English (AU)", gender: "Male",   accent: "Australian", style: "Casual & Friendly",       tag: "New",     color: "#A990F5", langCode: "en-AU", pitch: 0.95, rate: 1.0,  elId: "pNInz6obpgDQGcFmaJgB" },
  { id: "en-AU-2",  name: "Olivia",   lang: "English (AU)", gender: "Female", accent: "Australian", style: "Bright & Energetic",      tag: "New",     color: "#E87747", langCode: "en-AU", pitch: 1.1,  rate: 1.05, elId: "MF3mGyEYCl7XYWbV9V6O" },
  { id: "fr-FR-1",  name: "Antoine",  lang: "Français",     gender: "Male",   accent: "French",     style: "Smooth & Elegant",        tag: "",        color: "#00FFB2", langCode: "fr-FR", pitch: 0.9,  rate: 0.95, elId: "VR6AewLTigWG4xSOukaG" },
  { id: "fr-FR-2",  name: "Camille",  lang: "Français",     gender: "Female", accent: "French",     style: "Expressive & Warm",       tag: "",        color: "#E8476A", langCode: "fr-FR", pitch: 1.2,  rate: 1.0,  elId: "EXAVITQu4vr4xnSDxMaL" },
  { id: "es-ES-1",  name: "Diego",    lang: "Español",      gender: "Male",   accent: "Spanish",    style: "Bold & Confident",        tag: "",        color: "#47B8E8", langCode: "es-ES", pitch: 0.85, rate: 1.05, elId: "TxGEqnHWrfWFTfGW9XjX" },
  { id: "es-ES-2",  name: "Isabella", lang: "Español",      gender: "Female", accent: "Spanish",    style: "Vibrant & Expressive",    tag: "New",     color: "#E8C547", langCode: "es-ES", pitch: 1.15, rate: 1.0,  elId: "ThT5KcBeYPX3keUQqHPh" },
  { id: "de-DE-1",  name: "Klaus",    lang: "Deutsch",      gender: "Male",   accent: "German",     style: "Precise & Strong",        tag: "",        color: "#E8C547", langCode: "de-DE", pitch: 0.8,  rate: 0.9,  elId: "GBv7mTt0atIp3Br8iCZE" },
  { id: "de-DE-2",  name: "Lena",     lang: "Deutsch",      gender: "Female", accent: "German",     style: "Clear & Articulate",      tag: "",        color: "#00FFB2", langCode: "de-DE", pitch: 1.1,  rate: 0.95, elId: "LcfcDJNUP1GQjkzn1xUU" },
  { id: "ar-SA-1",  name: "Karim",    lang: "Arabic",       gender: "Male",   accent: "Arabic",     style: "Rich & Resonant",         tag: "Popular", color: "#A990F5", langCode: "ar-SA", pitch: 0.85, rate: 0.9,  elId: "onwK4e9ZLuTAKqWW03F9" },
  { id: "ar-SA-2",  name: "Layla",    lang: "Arabic",       gender: "Female", accent: "Arabic",     style: "Melodic & Warm",          tag: "",        color: "#E87747", langCode: "ar-SA", pitch: 1.2,  rate: 0.95, elId: "pNInz6obpgDQGcFmaJgB" },
  { id: "ja-JP-1",  name: "Yuki",     lang: "Japanese",     gender: "Female", accent: "Japanese",   style: "Crisp & Articulate",      tag: "",        color: "#E87747", langCode: "ja-JP", pitch: 1.3,  rate: 1.0,  elId: "MF3mGyEYCl7XYWbV9V6O" },
  { id: "ja-JP-2",  name: "Kenji",    lang: "Japanese",     gender: "Male",   accent: "Japanese",   style: "Calm & Professional",     tag: "",        color: "#47B8E8", langCode: "ja-JP", pitch: 0.9,  rate: 0.95, elId: "VR6AewLTigWG4xSOukaG" },
  { id: "pt-BR-1",  name: "Lucas",    lang: "Português",    gender: "Male",   accent: "Brazilian",  style: "Energetic & Warm",        tag: "New",     color: "#E8476A", langCode: "pt-BR", pitch: 0.95, rate: 1.05, elId: "TxGEqnHWrfWFTfGW9XjX" },
  { id: "pt-BR-2",  name: "Ana",      lang: "Português",    gender: "Female", accent: "Brazilian",  style: "Bright & Friendly",       tag: "New",     color: "#A990F5", langCode: "pt-BR", pitch: 1.2,  rate: 1.0,  elId: "EXAVITQu4vr4xnSDxMaL" },
  { id: "it-IT-1",  name: "Marco",    lang: "Italiano",     gender: "Male",   accent: "Italian",    style: "Passionate & Expressive", tag: "",        color: "#00FFB2", langCode: "it-IT", pitch: 0.95, rate: 1.0,  elId: "GBv7mTt0atIp3Br8iCZE" },
  { id: "it-IT-2",  name: "Giulia",   lang: "Italiano",     gender: "Female", accent: "Italian",    style: "Elegant & Warm",          tag: "",        color: "#E8C547", langCode: "it-IT", pitch: 1.15, rate: 1.0,  elId: "LcfcDJNUP1GQjkzn1xUU" },
];

const ALL_LANGUAGES = ["All", ...Array.from(new Set(VOICES_DATA.map(v => v.lang)))];

const EMOTIONS = [
  { id: "neutral",  label: "Neutral",  pitchMod: 0,    rateMod: 0,     desc: "Balanced and natural",      elStyle: ""                            },
  { id: "excited",  label: "Excited",  pitchMod: 0.2,  rateMod: 0.2,   desc: "High energy, enthusiastic", elStyle: "excited"                     },
  { id: "calm",     label: "Calm",     pitchMod: -0.1, rateMod: -0.2,  desc: "Slow, relaxed, peaceful",   elStyle: "calm"                        },
  { id: "serious",  label: "Serious",  pitchMod: -0.2, rateMod: -0.15, desc: "Professional and formal",   elStyle: "serious"                     },
  { id: "dramatic", label: "Dramatic", pitchMod: -0.3, rateMod: -0.25, desc: "Intense and cinematic",      elStyle: "dramatic"                    },
  { id: "friendly", label: "Friendly", pitchMod: 0.1,  rateMod: 0.05,  desc: "Conversational and warm",   elStyle: "friendly"                    },
];

const PROJECTS_MOCK = [
  { id: 1, name: "YouTube Intro",      chars: 312,  date: "Today",      voice: "Marcus" },
  { id: 2, name: "Podcast Episode 12", chars: 1821, date: "Yesterday",  voice: "Sofia"  },
  { id: 3, name: "Product Demo",       chars: 890,  date: "2 days ago", voice: "Oliver" },
];

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

function useApiKey() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("el_api_key") || "");
  const saveKey = (key) => {
    localStorage.setItem("el_api_key", key.trim());
    setApiKey(key.trim());
  };
  return [apiKey, saveKey];
}

// ─── ELEVENLABS API CALL ──────────────────────────────────────────────────────
async function generateWithElevenLabs(text, voice, emotion, apiKey) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voice.elId}`;

  // Stability & similarity settings per emotion
  const emotionSettings = {
    neutral:  { stability: 0.65, similarity_boost: 0.75, style: 0.0  },
    excited:  { stability: 0.35, similarity_boost: 0.80, style: 0.6  },
    calm:     { stability: 0.85, similarity_boost: 0.70, style: 0.1  },
    serious:  { stability: 0.80, similarity_boost: 0.75, style: 0.2  },
    dramatic: { stability: 0.30, similarity_boost: 0.85, style: 0.8  },
    friendly: { stability: 0.55, similarity_boost: 0.78, style: 0.4  },
  };

  const settings = emotionSettings[emotion.id] || emotionSettings.neutral;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: settings.stability,
        similarity_boost: settings.similarity_boost,
        style: settings.style,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.detail?.message || `ElevenLabs error ${response.status}`);
  }

  const audioBlob = await response.blob();
  return URL.createObjectURL(audioBlob);
}

// ─── WEB SPEECH FALLBACK ──────────────────────────────────────────────────────
function speakWithWebSpeech(text, voice, emotion, speed, onStart, onEnd) {
  if (!window.speechSynthesis) { onEnd(); return; }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find(v => v.lang === voice.langCode || v.lang.startsWith(voice.langCode.split("-")[0]));
  if (match) utter.voice = match;
  utter.lang = voice.langCode;
  utter.pitch = Math.max(0.1, Math.min(2, voice.pitch + emotion.pitchMod));
  utter.rate  = Math.max(0.5, Math.min(2, voice.rate * speed + emotion.rateMod));
  utter.volume = 1;
  utter.onstart = onStart;
  utter.onend = onEnd;
  utter.onerror = onEnd;
  window.speechSynthesis.speak(utter);
}

// ─── SHARED UI COMPONENTS ─────────────────────────────────────────────────────
function WaveAnim({ active, color = "#00FFB2", bars = 18, height = 28 }) {
  const [heights, setHeights] = useState(() => Array(bars).fill(4));
  const frameRef = useRef(null);
  useEffect(() => {
    if (active) {
      const animate = () => {
        setHeights(Array(bars).fill(0).map(() => Math.max(4, Math.floor(Math.random() * height))));
        frameRef.current = setTimeout(animate, 120);
      };
      animate();
    } else {
      clearTimeout(frameRef.current);
      setHeights(Array(bars).fill(0).map((_, i) => Math.max(3, i % 3 === 0 ? 14 : i % 2 === 0 ? 8 : 5)));
    }
    return () => clearTimeout(frameRef.current);
  }, [active]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height }}>
      {heights.map((h, i) => (
        <div key={i} style={{ width: 3, height: h, background: active ? color : "#222", borderRadius: 2, transition: active ? "height 0.1s ease" : "height 0.4s ease" }} />
      ))}
    </div>
  );
}

function Tag({ label, color }) {
  return (
    <div style={{ background: color + "18", border: "1px solid " + color + "35", borderRadius: 5, padding: "2px 8px", fontSize: 9, fontWeight: 800, color, letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap", flexShrink: 0 }}>
      {label}
    </div>
  );
}

// ─── API KEY BANNER ───────────────────────────────────────────────────────────
function ApiKeyBanner({ apiKey, onGoSettings }) {
  if (apiKey) return null;
  return (
    <div style={{ background: "#E8C54712", border: "1px solid #E8C54730", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <span style={{ fontSize: 16 }}>⚠️</span>
      <div style={{ flex: 1, minWidth: 200 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#E8C547" }}>No ElevenLabs API key — </span>
        <span style={{ fontSize: 13, color: "#666" }}>using browser voices (robotic). Add your key for real AI voices.</span>
      </div>
      <button onClick={onGoSettings} style={{ background: "#E8C54720", border: "1px solid #E8C54740", borderRadius: 8, padding: "6px 14px", color: "#E8C547", fontSize: 12, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" }}>
        Add API Key →
      </button>
    </div>
  );
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
function SettingsPage({ apiKey, onSaveKey }) {
  const isMobile = useIsMobile();
  const [inputKey, setInputKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // null | "ok" | "fail"

  const handleSave = () => {
    onSaveKey(inputKey);
    setSaved(true);
    setTestResult(null);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleTest = async () => {
    if (!inputKey.trim()) return;
    setTesting(true);
    setTestResult(null);
    try {
      // Test by fetching user subscription info — lightweight call
      const res = await fetch("https://api.elevenlabs.io/v1/user/subscription", {
        headers: { "xi-api-key": inputKey.trim() },
      });
      setTestResult(res.ok ? "ok" : "fail");
    } catch {
      setTestResult("fail");
    }
    setTesting(false);
  };

  return (
    <div style={{ padding: isMobile ? "14px" : 24, overflowY: "auto", height: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 900, letterSpacing: -0.5 }}>Settings</h2>
        <p style={{ color: "#555", marginTop: 6, fontSize: 14 }}>Configure your AI voice engine.</p>
      </div>

      {/* API KEY CARD */}
      <div style={{ background: "#0D0D0D", border: "1px solid #1E1E1E", borderRadius: 16, padding: "22px", marginBottom: 16, maxWidth: 600 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#00FFB210", border: "1px solid #00FFB225", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🔑</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>ElevenLabs API Key</div>
            <div style={{ fontSize: 12, color: "#555", marginTop: 1 }}>Required for real AI voices</div>
          </div>
          {apiKey && <div style={{ marginLeft: "auto", background: "#00FFB215", border: "1px solid #00FFB230", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 800, color: "#00FFB2" }}>● ACTIVE</div>}
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 11, color: "#555", fontWeight: 700, marginBottom: 8, letterSpacing: 0.5 }}>YOUR API KEY</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="password"
              value={inputKey}
              onChange={e => { setInputKey(e.target.value); setTestResult(null); setSaved(false); }}
              placeholder="sk-..."
              style={{ flex: 1, background: "#111", border: "1px solid " + (testResult === "ok" ? "#00FFB2" : testResult === "fail" ? "#E8476A" : "#2a2a2a"), borderRadius: 10, padding: "11px 14px", color: "#E0E0E0", fontSize: 14, outline: "none", fontFamily: "monospace" }}
            />
          </div>

          {/* Status messages */}
          {testResult === "ok"   && <div style={{ marginTop: 8, fontSize: 12, color: "#00FFB2", fontWeight: 700 }}>✓ Key is valid and working!</div>}
          {testResult === "fail" && <div style={{ marginTop: 8, fontSize: 12, color: "#E8476A", fontWeight: 700 }}>✗ Invalid key or network error. Try with VPN.</div>}
          {saved && !testResult  && <div style={{ marginTop: 8, fontSize: 12, color: "#00FFB2", fontWeight: 700 }}>✓ Saved!</div>}

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={handleSave} style={{ flex: 1, background: "linear-gradient(135deg, #00FFB2, #47B8E8)", border: "none", borderRadius: 10, padding: "11px", fontWeight: 900, fontSize: 13, color: "#000", cursor: "pointer" }}>
              Save Key
            </button>
            <button onClick={handleTest} disabled={!inputKey.trim() || testing} style={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 10, padding: "11px 18px", fontWeight: 700, fontSize: 13, color: testing ? "#555" : "#888", cursor: inputKey.trim() ? "pointer" : "not-allowed" }}>
              {testing ? "Testing..." : "Test Key"}
            </button>
          </div>
        </div>

        {/* How to get a key */}
        <div style={{ marginTop: 20, padding: "14px 16px", background: "#111", borderRadius: 10, border: "1px solid #1a1a1a" }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#555", marginBottom: 10, letterSpacing: 0.5 }}>HOW TO GET YOUR FREE API KEY</div>
          {[
            { n: "1", t: "Use a VPN",              d: "Connect to US or EU server (ProtonVPN free works)" },
            { n: "2", t: "Go to elevenlabs.io",    d: "Create a free account" },
            { n: "3", t: "Go to Profile Settings", d: "Find your API key under your profile" },
            { n: "4", t: "Copy & paste here",      d: "You get 10,000 free characters/month" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: i < 3 ? 10 : 0 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: "#00FFB215", border: "1px solid #00FFB225", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#00FFB2", flexShrink: 0 }}>{s.n}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#E0E0E0" }}>{s.t}</div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 1 }}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VOICE ENGINE STATUS */}
      <div style={{ background: "#0D0D0D", border: "1px solid #1E1E1E", borderRadius: 16, padding: "20px", maxWidth: 600 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#555", marginBottom: 14, letterSpacing: 0.5 }}>VOICE ENGINE STATUS</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "ElevenLabs AI",    active: !!apiKey, desc: "Real neural voices, multilingual",      badge: "Recommended" },
            { label: "Web Speech API",   active: true,     desc: "Browser built-in, robotic quality",     badge: "Fallback"    },
          ].map((e, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#111", borderRadius: 10, border: "1px solid " + (e.active && i === 0 ? "#00FFB225" : "#1a1a1a") }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: e.active ? "#00FFB2" : "#2a2a2a", flexShrink: 0, boxShadow: e.active ? "0 0 8px #00FFB2" : "none" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{e.label}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 1 }}>{e.desc}</div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 800, color: i === 0 ? "#00FFB2" : "#444", letterSpacing: 0.5 }}>{e.badge}</div>
            </div>
          ))}
        </div>
      </div>

      {isMobile && <div style={{ height: 8 }} />}
    </div>
  );
}

// ─── STUDIO PAGE ──────────────────────────────────────────────────────────────
function StudioPage({ apiKey, onGoSettings }) {
  const isMobile = useIsMobile();
  const [text, setText] = useState("Welcome to Redacast. Type your script here and click Generate to hear it in a real AI voice.");
  const [voice, setVoice] = useState(VOICES_DATA[0]);
  const [emotion, setEmotion] = useState(EMOTIONS[0]);
  const [speed, setSpeed] = useState(1.0);
  const [status, setStatus] = useState("idle"); // idle | generating | playing | done | error
  const [errorMsg, setErrorMsg] = useState("");
  const [voiceFilter, setVoiceFilter] = useState("All");
  const [showVoicePanel, setShowVoicePanel] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);
  const charLimit = 2500;

  // Cleanup blob URLs
  useEffect(() => {
    return () => { if (audioUrl) URL.revokeObjectURL(audioUrl); };
  }, [audioUrl]);

  const handleGenerate = async () => {
    if (!text.trim() || status === "generating") return;
    setStatus("generating");
    setErrorMsg("");

    // Stop any playing audio
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    window.speechSynthesis && window.speechSynthesis.cancel();

    if (apiKey) {
      // ── ElevenLabs path ──
      try {
        const url = await generateWithElevenLabs(text, voice, emotion, apiKey);
        setAudioUrl(url);
        setStatus("playing");
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.playbackRate = speed;
        audio.play();
        audio.onended = () => setStatus("done");
        audio.onerror = () => { setStatus("error"); setErrorMsg("Playback failed."); };
      } catch (err) {
        setStatus("error");
        setErrorMsg(err.message || "ElevenLabs request failed. Check your key or VPN.");
      }
    } else {
      // ── Web Speech fallback ──
      setTimeout(() => {
        setStatus("playing");
        speakWithWebSpeech(text, voice, emotion, speed, () => setStatus("playing"), () => setStatus("done"));
      }, 600);
    }
  };

  const handleStop = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    window.speechSynthesis && window.speechSynthesis.cancel();
    setStatus("done");
  };

  const handlePlayAgain = () => {
    if (apiKey && audioUrl) {
      setStatus("playing");
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.playbackRate = speed;
      audio.play();
      audio.onended = () => setStatus("done");
    } else {
      handleGenerate();
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `redacast-${voice.name.toLowerCase()}-${Date.now()}.mp3`;
    a.click();
  };

  const filteredVoices = voiceFilter === "All" ? VOICES_DATA
    : voiceFilter === "Male" ? VOICES_DATA.filter(v => v.gender === "Male")
    : VOICES_DATA.filter(v => v.gender === "Female");

  const pct = Math.min(100, (text.length / charLimit) * 100);

  const VoiceList = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ background: "#0D0D0D", border: "1px solid #1E1E1E", borderRadius: 14, padding: "14px 16px" }}>
        <div style={{ fontSize: 11, color: "#555", fontWeight: 800, letterSpacing: 1, marginBottom: 10 }}>SELECT VOICE</div>
        <div style={{ display: "flex", gap: 6 }}>
          {["All", "Male", "Female"].map(f => (
            <button key={f} onClick={() => setVoiceFilter(f)} style={{ flex: 1, background: voiceFilter === f ? "#00FFB210" : "transparent", border: "1px solid " + (voiceFilter === f ? "#00FFB240" : "#222"), borderRadius: 7, padding: "6px", color: voiceFilter === f ? "#00FFB2" : "#444", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
        {filteredVoices.map(v => {
          const selected = voice.id === v.id;
          return (
            <div key={v.id} onClick={() => { setVoice(v); if (isMobile) setShowVoicePanel(false); }}
              style={{ background: selected ? v.color + "0C" : "#0D0D0D", border: "1.5px solid " + (selected ? v.color : "#1E1E1E"), borderRadius: 13, padding: "14px 16px", cursor: "pointer", transition: "all 0.2s", boxShadow: selected ? "0 0 20px " + v.color + "18" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{v.name}</div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 1 }}>{v.accent} · {v.gender}</div>
                  <div style={{ fontSize: 11, color: "#3a3a3a", fontStyle: "italic" }}>{v.style}</div>
                </div>
                {v.tag && <Tag label={v.tag} color={v.color} />}
              </div>
              <WaveAnim active={selected && status === "playing"} color={v.color} bars={12} height={20} />
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ height: "100%", overflow: "hidden", position: "relative" }}>

      {/* MOBILE VOICE PANEL OVERLAY */}
      {isMobile && showVoicePanel && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "#060606", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <span style={{ fontWeight: 800, fontSize: 15 }}>Choose Voice</span>
            <button onClick={() => setShowVoicePanel(false)} style={{ background: "#1a1a1a", border: "none", borderRadius: 8, padding: "6px 14px", color: "#E0E0E0", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Done ✓</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px" }}><VoiceList /></div>
        </div>
      )}

      <div style={{
        display: isMobile ? "flex" : "grid",
        flexDirection: isMobile ? "column" : undefined,
        gridTemplateColumns: isMobile ? undefined : "1fr 360px",
        gap: 16,
        padding: isMobile ? "14px" : 24,
        height: "100%",
        overflowY: isMobile ? "auto" : "hidden",
        boxSizing: "border-box",
      }}>

        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, overflowY: isMobile ? "visible" : "auto" }}>

          {/* API KEY BANNER */}
          <ApiKeyBanner apiKey={apiKey} onGoSettings={onGoSettings} />

          {/* SELECTED VOICE PILL — mobile only */}
          {isMobile && (
            <button onClick={() => setShowVoicePanel(true)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0D0D0D", border: "1.5px solid " + voice.color, borderRadius: 12, padding: "12px 16px", cursor: "pointer", width: "100%", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: voice.color, flexShrink: 0 }} />
                <span style={{ fontWeight: 800, fontSize: 14, color: "#E0E0E0" }}>{voice.name}</span>
                <span style={{ fontSize: 11, color: "#555" }}>{voice.accent} · {voice.gender}</span>
              </div>
              <span style={{ fontSize: 12, color: "#555", fontWeight: 700 }}>Change ›</span>
            </button>
          )}

          {/* SCRIPT EDITOR */}
          <div style={{ background: "#0D0D0D", border: "1px solid #1E1E1E", borderRadius: 18, overflow: "hidden" }}>
            <div style={{ padding: "12px 18px", borderBottom: "1px solid #141414", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#444", letterSpacing: 1 }}>SCRIPT EDITOR</span>
              <span style={{ fontSize: 11, color: pct > 90 ? "#E8476A" : "#444" }}>{text.length} / {charLimit}</span>
            </div>
            <div style={{ height: 3, background: "#111" }}>
              <div style={{ width: pct + "%", height: "100%", background: pct > 90 ? "#E8476A" : "#00FFB2", transition: "width 0.2s" }} />
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value.slice(0, charLimit))}
              placeholder="Type or paste your script here..."
              style={{ width: "100%", minHeight: isMobile ? 130 : 200, background: "transparent", border: "none", padding: "16px", color: "#E0E0E0", fontSize: 15, lineHeight: 1.8, resize: "vertical", outline: "none", fontFamily: "Georgia, serif", boxSizing: "border-box" }}
            />
          </div>

          {/* EMOTION */}
          <div style={{ background: "#0D0D0D", border: "1px solid #1E1E1E", borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "#555", fontWeight: 800, letterSpacing: 1, marginBottom: 10 }}>EMOTION STYLE</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {EMOTIONS.map(em => (
                <button key={em.id} onClick={() => setEmotion(em)} style={{ background: emotion.id === em.id ? "#00FFB212" : "#111", border: "1.5px solid " + (emotion.id === em.id ? "#00FFB2" : "#222"), borderRadius: 10, padding: "7px 13px", color: emotion.id === em.id ? "#00FFB2" : "#555", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                  {em.label}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "#333", marginTop: 8, fontStyle: "italic" }}>{emotion.desc}</div>
          </div>

          {/* SPEED */}
          <div style={{ background: "#0D0D0D", border: "1px solid #1E1E1E", borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "#555", fontWeight: 800, letterSpacing: 1, marginBottom: 8 }}>PLAYBACK SPEED — {speed.toFixed(1)}x</div>
            <input type="range" min="0.5" max="2" step="0.1" value={speed}
              onChange={e => setSpeed(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: "#00FFB2" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#333", marginTop: 4 }}>
              <span>0.5x Slow</span><span>1.0x Normal</span><span>2.0x Fast</span>
            </div>
          </div>

          {/* ERROR */}
          {status === "error" && (
            <div style={{ background: "#E8476A10", border: "1px solid #E8476A30", borderRadius: 12, padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 16 }}>❌</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#E8476A" }}>Generation failed</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{errorMsg}</div>
              </div>
            </div>
          )}

          {/* GENERATE BUTTON */}
          <button
            onClick={status === "playing" ? handleStop : status === "done" ? handlePlayAgain : handleGenerate}
            style={{ width: "100%", padding: "16px", background: status === "generating" ? "#111" : status === "playing" ? "linear-gradient(135deg, #E8476A, #E87747)" : "linear-gradient(135deg, #00FFB2, #47B8E8)", border: "none", borderRadius: 14, fontWeight: 900, fontSize: 16, color: status === "generating" ? "#444" : "#000", cursor: status === "generating" ? "not-allowed" : "pointer", transition: "all 0.3s" }}>
            {status === "generating" ? "⏳ Generating with " + (apiKey ? "ElevenLabs AI..." : "browser voice...") : status === "playing" ? "⏹ Stop" : status === "done" ? "▶ Play Again" : status === "error" ? "↺ Retry" : "▶ Generate Voiceover"}
          </button>

          {/* PLAYBACK BAR */}
          {(status === "playing" || status === "done") && (
            <div style={{ background: "#0D0D0D", border: "1px solid #00FFB220", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "#00FFB210", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🎧</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 13 }}>{voice.name} — {emotion.label}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>
                  {apiKey ? "🤖 ElevenLabs AI" : "🔈 Browser voice"} · {speed.toFixed(1)}x speed
                </div>
              </div>
              <WaveAnim active={status === "playing"} color="#00FFB2" height={24} bars={14} />
              {/* MP3 Download — only available with ElevenLabs */}
              {apiKey && audioUrl && (
                <button onClick={handleDownload} title="Download MP3" style={{ background: "#00FFB215", border: "1px solid #00FFB230", borderRadius: 8, padding: "7px 12px", color: "#00FFB2", fontSize: 12, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" }}>
                  ↓ MP3
                </button>
              )}
            </div>
          )}

          {/* NO DOWNLOAD TIP when no API key */}
          {!apiKey && (status === "done" || status === "playing") && (
            <div style={{ fontSize: 11, color: "#333", textAlign: "center", fontStyle: "italic" }}>
              Add an ElevenLabs API key to unlock MP3 downloads
            </div>
          )}

          {isMobile && <div style={{ height: 8 }} />}
        </div>

        {/* RIGHT COLUMN — desktop voice list */}
        {!isMobile && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
            <VoiceList />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage({ apiKey, onGoSettings }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ padding: isMobile ? "14px" : 24, overflowY: "auto", height: "100%" }}>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 900, letterSpacing: -0.5 }}>Good morning, <span style={{ color: "#00FFB2" }}>Reda</span></h2>
        <p style={{ color: "#555", marginTop: 6, fontSize: 14 }}>Here is your Redacast overview.</p>
      </div>
      <ApiKeyBanner apiKey={apiKey} onGoSettings={onGoSettings} />
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 12, marginBottom: 18, marginTop: 16 }}>
        {[
          { label: "Characters Used",  value: "6,023", color: "#00FFB2", sub: "This month" },
          { label: "Audios Generated", value: "14",    color: "#47B8E8", sub: "This month" },
          { label: "Languages Used",   value: "3",     color: "#E8C547", sub: "EN, FR, AR" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#0D0D0D", border: "1px solid #1E1E1E", borderRadius: 14, padding: "14px 16px", gridColumn: isMobile && i === 2 ? "span 2" : undefined }}>
            <div style={{ fontSize: 10, color: "#555", fontWeight: 800, letterSpacing: 1, marginBottom: 6 }}>{s.label.toUpperCase()}</div>
            <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#0D0D0D", border: "1px solid #1E1E1E", borderRadius: 16, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ padding: "13px 18px", borderBottom: "1px solid #141414", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 800, fontSize: 14 }}>Recent Projects</span>
          <span style={{ fontSize: 12, color: "#555", cursor: "pointer" }}>View all</span>
        </div>
        {PROJECTS_MOCK.map((p, i) => (
          <div key={i} style={{ padding: "12px 18px", borderBottom: i < PROJECTS_MOCK.length - 1 ? "1px solid #111" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1, minWidth: 0 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "#141414", border: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🎙</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 1 }}>{p.chars} chars · {p.voice}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#444", whiteSpace: "nowrap", marginLeft: 10 }}>{p.date}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #00FFB20A, #47B8E80A)", border: "1px solid #00FFB222", borderRadius: 16, padding: "18px", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "center", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 4 }}>Upgrade to Pro — $9/mo</div>
          <div style={{ fontSize: 13, color: "#555" }}>50,000 chars/mo · All voices · MP3 downloads</div>
        </div>
        <button style={{ background: "linear-gradient(135deg, #00FFB2, #47B8E8)", border: "none", borderRadius: 10, padding: "11px 24px", fontWeight: 900, fontSize: 13, color: "#000", cursor: "pointer" }}>Upgrade Now</button>
      </div>
      {isMobile && <div style={{ height: 8 }} />}
    </div>
  );
}

// ─── VOICES PAGE ──────────────────────────────────────────────────────────────
function VoicesPage({ onUseVoice, apiKey }) {
  const isMobile = useIsMobile();
  const [playing, setPlaying] = useState(null);
  const [langFilter, setLangFilter] = useState("All");
  const audioRef = useRef(null);

  const handlePreview = async (v) => {
    // Stop current
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    window.speechSynthesis && window.speechSynthesis.cancel();
    if (playing === v.id) { setPlaying(null); return; }

    setPlaying(v.id);
    const previewText = `Hi, I am ${v.name}. ${v.style}.`;

    if (apiKey) {
      try {
        const url = await generateWithElevenLabs(previewText, v, EMOTIONS[0], apiKey);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.play();
        audio.onended = () => { setPlaying(null); URL.revokeObjectURL(url); };
        audio.onerror = () => setPlaying(null);
      } catch { setPlaying(null); }
    } else {
      speakWithWebSpeech(previewText, v, EMOTIONS[0], 1.0, () => {}, () => setPlaying(null));
    }
  };

  const filtered = langFilter === "All" ? VOICES_DATA : VOICES_DATA.filter(v => v.lang === langFilter);

  return (
    <div style={{ padding: isMobile ? "14px" : 24, overflowY: "auto", height: "100%" }}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 900, letterSpacing: -0.5 }}>Voice Library</h2>
        <p style={{ color: "#555", marginTop: 6, fontSize: 14 }}>{VOICES_DATA.length} voices · {ALL_LANGUAGES.length - 1} languages · {apiKey ? "🤖 ElevenLabs AI active" : "🔈 Browser fallback"}</p>
      </div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 16, scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
        {ALL_LANGUAGES.map(l => (
          <button key={l} onClick={() => setLangFilter(l)} style={{ flexShrink: 0, background: langFilter === l ? "#00FFB210" : "#0D0D0D", border: "1px solid " + (langFilter === l ? "#00FFB240" : "#222"), borderRadius: 20, padding: "6px 14px", color: langFilter === l ? "#00FFB2" : "#555", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{l}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
        {filtered.map(v => (
          <div key={v.id} style={{ background: "#0D0D0D", border: "1.5px solid " + (playing === v.id ? v.color : "#1E1E1E"), borderRadius: 16, padding: "16px 18px", transition: "all 0.2s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{v.name}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{v.lang} · {v.gender}</div>
                <div style={{ fontSize: 11, color: "#3a3a3a", marginTop: 1, fontStyle: "italic" }}>{v.style}</div>
              </div>
              {v.tag && <Tag label={v.tag} color={v.color} />}
            </div>
            <WaveAnim active={playing === v.id} color={v.color} height={20} bars={14} />
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button onClick={() => handlePreview(v)} style={{ flex: 1, background: playing === v.id ? v.color + "15" : "#141414", border: "1px solid " + (playing === v.id ? v.color + "40" : "#222"), borderRadius: 8, padding: "9px", color: playing === v.id ? v.color : "#666", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                {playing === v.id ? "⏹ Stop" : "▶ Preview"}
              </button>
              <button onClick={() => onUseVoice(v)} style={{ background: "#141414", border: "1px solid #222", borderRadius: 8, padding: "9px 16px", color: "#666", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Use</button>
            </div>
          </div>
        ))}
      </div>
      {isMobile && <div style={{ height: 8 }} />}
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ onLaunchApp }) {
  const isMobile = useIsMobile();
  const [demoText, setDemoText] = useState("Redacast gives you studio-quality AI voices in seconds. No recording needed.");
  const [demoVoice, setDemoVoice] = useState(VOICES_DATA[0]);
  const [demoEmotion, setDemoEmotion] = useState(EMOTIONS[0]);
  const [demoStatus, setDemoStatus] = useState("idle");

  const handleDemo = () => {
    if (demoStatus === "playing") { window.speechSynthesis && window.speechSynthesis.cancel(); setDemoStatus("idle"); return; }
    setDemoStatus("generating");
    setTimeout(() => {
      setDemoStatus("playing");
      speakWithWebSpeech(demoText, demoVoice, demoEmotion, 1.0, () => {}, () => setDemoStatus("done"));
    }, 800);
  };

  const FEATS = [
    { icon: "🎙", title: "23 AI Voices",         desc: "Multiple voices across 10 languages. Every accent, every style.",  color: "#00FFB2" },
    { icon: "🎭", title: "Emotion Control",       desc: "Excited, calm, dramatic, serious — the voice actually changes.",   color: "#E8C547" },
    { icon: "📥", title: "MP3 Downloads",         desc: "Broadcast-quality audio ready for Premiere or CapCut.",            color: "#47B8E8" },
    { icon: "⚡", title: "Instant Generation",    desc: "Your voiceover is ready in seconds. No queue, no waiting.",        color: "#E8476A" },
    { icon: "🌍", title: "10 Languages",          desc: "English, French, Spanish, Arabic, German, Japanese and more.",     color: "#A990F5" },
    { icon: "🧬", title: "Voice Cloning (soon)",  desc: "Upload 60 seconds of your voice. Clone it forever.",               color: "#E87747" },
  ];

  const COMPARE = [
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
      <section style={{ minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: isMobile ? "80px 18px 48px" : "100px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: "30%", width: 500, height: 500, background: "radial-gradient(circle, #00FFB2 0%, transparent 70%)", opacity: 0.07, pointerEvents: "none", borderRadius: "50%", transform: "translate(-50%, -50%)" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#00FFB210", border: "1px solid #00FFB230", borderRadius: 20, padding: "5px 16px", fontSize: 10, fontWeight: 800, color: "#00FFB2", marginBottom: 24, letterSpacing: 1, textTransform: "uppercase", position: "relative", zIndex: 1 }}>
          The ElevenLabs alternative for creators
        </div>
        <h1 style={{ fontSize: isMobile ? "clamp(34px, 11vw, 52px)" : "clamp(40px, 8vw, 86px)", fontWeight: 900, lineHeight: 1.06, letterSpacing: -2, margin: "0 0 22px", maxWidth: 880, fontFamily: "Georgia, serif", position: "relative", zIndex: 1 }}>
          Your words.<br />
          <span style={{ background: "linear-gradient(135deg, #00FFB2, #47B8E8, #A990F5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Any voice.</span><br />
          Zero recording.
        </h1>
        <p style={{ fontSize: isMobile ? 14 : 18, color: "#666", maxWidth: 500, lineHeight: 1.8, margin: "0 0 32px", position: "relative", zIndex: 1, padding: "0 4px" }}>
          Studio-quality voiceovers in seconds. 23 voices, 10 languages, emotion control — built for creators.
        </p>
        <div style={{ display: "flex", gap: 10, marginBottom: 48, flexWrap: "wrap", justifyContent: "center", position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>
          <button onClick={onLaunchApp} style={{ background: "linear-gradient(135deg, #00FFB2, #47B8E8)", border: "none", borderRadius: 14, padding: "14px 28px", fontWeight: 900, fontSize: 15, color: "#000", cursor: "pointer", boxShadow: "0 8px 40px #00FFB235", flex: "1 1 140px" }}>Start Creating Free</button>
          <button style={{ background: "transparent", border: "1px solid #222", borderRadius: 14, padding: "14px 28px", fontWeight: 700, fontSize: 14, color: "#555", cursor: "pointer", flex: "1 1 140px" }}>Hear the difference</button>
        </div>
        <div style={{ width: "100%", maxWidth: 640, position: "relative", zIndex: 1, background: "#0A0A0A", border: "1px solid #1E1E1E", borderRadius: 18, overflow: "hidden", boxShadow: "0 30px 80px #00000080" }}>
          <div style={{ background: "#0E0E0E", padding: "10px 16px", borderBottom: "1px solid #141414", display: "flex", alignItems: "center", gap: 7 }}>
            {["#E8476A", "#E8C547", "#00FFB2"].map((c, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
            <span style={{ fontSize: 11, color: "#333", marginLeft: 6, fontWeight: 600 }}>redacast.app — Live Demo</span>
          </div>
          <div style={{ padding: isMobile ? "14px" : 22 }}>
            <textarea value={demoText} onChange={e => setDemoText(e.target.value.slice(0, 300))}
              style={{ width: "100%", minHeight: 68, background: "#111", border: "1px solid #1E1E1E", borderRadius: 10, padding: "11px 13px", color: "#E0E0E0", fontSize: 14, lineHeight: 1.7, resize: "none", outline: "none", fontFamily: "Georgia, serif", boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <select value={demoVoice.id} onChange={e => setDemoVoice(VOICES_DATA.find(v => v.id === e.target.value))}
                style={{ flex: 1, minWidth: 0, background: "#111", border: "1px solid #1E1E1E", borderRadius: 8, padding: "9px 10px", color: "#E0E0E0", fontSize: isMobile ? 12 : 13, outline: "none" }}>
                {VOICES_DATA.map(v => <option key={v.id} value={v.id}>{v.name} — {v.style}</option>)}
              </select>
              <select value={demoEmotion.id} onChange={e => setDemoEmotion(EMOTIONS.find(em => em.id === e.target.value))}
                style={{ background: "#111", border: "1px solid #1E1E1E", borderRadius: 8, padding: "9px 10px", color: "#00FFB2", fontSize: isMobile ? 12 : 13, outline: "none" }}>
                {EMOTIONS.map(em => <option key={em.id} value={em.id}>{em.label}</option>)}
              </select>
            </div>
            <button onClick={handleDemo} style={{ width: "100%", marginTop: 10, padding: 13, background: demoStatus === "generating" ? "#111" : demoStatus === "playing" ? "linear-gradient(135deg, #E8476A, #E87747)" : "linear-gradient(135deg, #00FFB2, #47B8E8)", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 14, color: demoStatus === "generating" ? "#444" : "#000", cursor: "pointer" }}>
              {demoStatus === "generating" ? "Preparing..." : demoStatus === "playing" ? "⏹ Stop" : demoStatus === "done" ? "▶ Play Again" : "▶ Generate Voiceover"}
            </button>
          </div>
        </div>
      </section>

      <section style={{ padding: isMobile ? "52px 18px" : "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 10, color: "#00FFB2", letterSpacing: 3, fontWeight: 800, textTransform: "uppercase", marginBottom: 12 }}>What you get</div>
          <h2 style={{ fontSize: isMobile ? "clamp(22px, 7vw, 36px)" : "clamp(28px, 5vw, 52px)", fontWeight: 900, letterSpacing: -1.5, fontFamily: "Georgia, serif" }}>Built for creators.<br /><span style={{ color: "#2a2a2a" }}>Not engineers.</span></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(300px, 1fr))", gap: 10 }}>
          {FEATS.map((f, i) => (
            <div key={i} style={{ background: "#0A0A0A", border: "1px solid #141414", borderRadius: 14, padding: isMobile ? "16px 14px" : 26 }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: f.color + "14", border: "1px solid " + f.color + "28", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 18 : 21, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontWeight: 800, fontSize: isMobile ? 13 : 16, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: isMobile ? 12 : 14, color: "#555", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: isMobile ? "40px 14px" : "80px 24px", background: "#080808" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 10, color: "#47B8E8", letterSpacing: 3, fontWeight: 800, textTransform: "uppercase", marginBottom: 12 }}>Why Redacast</div>
            <h2 style={{ fontSize: isMobile ? "clamp(20px, 7vw, 34px)" : "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: -1, fontFamily: "Georgia, serif" }}>More features.<br /><span style={{ color: "#2a2a2a" }}>Half the price.</span></h2>
          </div>
          <div style={{ background: "#0A0A0A", border: "1px solid #1a1a1a", borderRadius: 16, overflow: "hidden", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", background: "#0E0E0E", padding: "11px 14px", borderBottom: "1px solid #141414", minWidth: 300 }}>
              {["Feature", "Redacast", "ElevenLabs", "Murf"].map((h, i) => (
                <span key={i} style={{ fontSize: i === 0 ? 10 : 11, fontWeight: i === 1 ? 900 : 700, color: i === 1 ? "#00FFB2" : "#444", textAlign: i > 0 ? "center" : "left" }}>{h}</span>
              ))}
            </div>
            {COMPARE.map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", padding: "10px 14px", borderBottom: i < COMPARE.length - 1 ? "1px solid #0E0E0E" : "none", background: i % 2 === 0 ? "transparent" : "#0D0D0D", minWidth: 300 }}>
                <span style={{ fontSize: 12, color: "#777" }}>{row.f}</span>
                {[row.r, row.e, row.m].map((val, j) => (
                  <span key={j} style={{ textAlign: "center", fontSize: 13 }}>
                    {typeof val === "boolean" ? (val ? <span style={{ color: j === 0 ? "#00FFB2" : "#444" }}>✓</span> : <span style={{ color: "#222" }}>✗</span>) : <span style={{ color: j === 0 ? "#00FFB2" : "#555", fontWeight: 800, fontSize: 11 }}>{val}</span>}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: isMobile ? "56px 18px" : "100px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: isMobile ? "clamp(26px, 9vw, 44px)" : "clamp(30px, 5vw, 56px)", fontWeight: 900, letterSpacing: -2, fontFamily: "Georgia, serif", marginBottom: 14 }}>Ready to find<br />your voice?</h2>
          <p style={{ color: "#555", fontSize: isMobile ? 14 : 16, marginBottom: 30 }}>No credit card. No setup. Just voices, instantly.</p>
          <button onClick={onLaunchApp} style={{ background: "linear-gradient(135deg, #00FFB2, #47B8E8)", border: "none", borderRadius: 14, padding: isMobile ? "14px 32px" : "18px 48px", fontWeight: 900, fontSize: isMobile ? 15 : 17, color: "#000", cursor: "pointer", boxShadow: "0 12px 48px #00FFB235", width: isMobile ? "100%" : "auto" }}>
            Start for Free
          </button>
        </div>
      </section>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function Redacast() {
  const isMobile = useIsMobile();
  const [page, setPage] = useState("landing");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiKey, saveApiKey] = useApiKey();

  const NAV = [
    { id: "landing",   label: "Home"     },
    { id: "app",       label: "Studio"   },
    { id: "voices",    label: "Voices"   },
    { id: "dashboard", label: "Dashboard"},
    { id: "settings",  label: "Settings" },
  ];

  const navigate = (id) => { setPage(id); setMobileMenuOpen(false); };

  return (
    <div style={{ width: "100%", height: "100dvh", background: "#060606", color: "#E0E0E0", fontFamily: "DM Sans, Segoe UI, system-ui, sans-serif", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0A0A0A; }
        ::-webkit-scrollbar-thumb { background: #1E1E1E; border-radius: 2px; }
        input[type=range] { -webkit-appearance: none; height: 4px; border-radius: 2px; background: #1E1E1E; cursor: pointer; outline: none; width: 100%; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #00FFB2; cursor: pointer; }
        select option { background: #111; }
        button { -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar:horizontal { display: none; }
      `}</style>

      {/* HEADER */}
      <div style={{ height: 54, padding: "0 14px", flexShrink: 0, background: "#080808", borderBottom: "1px solid #111", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #00FFB2, #47B8E8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🎙</div>
          <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: -0.5 }}>Redacast</span>
          <div style={{ background: "#00FFB214", border: "1px solid #00FFB230", borderRadius: 5, padding: "2px 7px", fontSize: 9, fontWeight: 800, color: "#00FFB2", letterSpacing: 1 }}>BETA</div>
        </div>

        {!isMobile && (
          <div style={{ display: "flex", gap: 4 }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => navigate(n.id)} style={{ background: page === n.id ? "#141414" : "transparent", border: "1px solid " + (page === n.id ? "#252525" : "transparent"), borderRadius: 8, padding: "7px 14px", color: page === n.id ? "#E0E0E0" : "#444", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                {n.label}
                {n.id === "settings" && !apiKey && <span style={{ marginLeft: 5, width: 6, height: 6, borderRadius: "50%", background: "#E8C547", display: "inline-block", verticalAlign: "middle" }} />}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {!isMobile && (
            <div style={{ background: "#0D0D0D", border: "1px solid #1E1E1E", borderRadius: 8, padding: "5px 12px", fontSize: 11, color: apiKey ? "#00FFB2" : "#555", fontWeight: 700 }}>
              {apiKey ? "🤖 AI Active" : "Free Plan"}
            </div>
          )}
          <div onClick={() => navigate("settings")} style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #0f2027, #203a43)", border: "1px solid " + (apiKey ? "#00FFB230" : "#1E1E1E"), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 12, color: "#00FFB2", cursor: "pointer", flexShrink: 0 }}>R</div>
          {isMobile && (
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: mobileMenuOpen ? "#141414" : "transparent", border: "1px solid " + (mobileMenuOpen ? "#252525" : "transparent"), borderRadius: 8, padding: "5px 9px", color: "#E0E0E0", fontSize: 15, cursor: "pointer", lineHeight: 1 }}>
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          )}
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {isMobile && mobileMenuOpen && (
        <div style={{ background: "#0A0A0A", borderBottom: "1px solid #141414", flexShrink: 0 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => navigate(n.id)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: page === n.id ? "#141414" : "transparent", border: "none", padding: "13px 16px", color: page === n.id ? "#00FFB2" : "#888", fontWeight: 700, fontSize: 14, cursor: "pointer", textAlign: "left" }}>
              {n.label}
              {n.id === "settings" && !apiKey && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#E8C547", display: "inline-block" }} />}
            </button>
          ))}
        </div>
      )}

      {/* PAGES */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {page === "landing"   && <LandingPage onLaunchApp={() => navigate("app")} />}
        {page === "app"       && <StudioPage apiKey={apiKey} onGoSettings={() => navigate("settings")} />}
        {page === "voices"    && <VoicesPage apiKey={apiKey} onUseVoice={() => navigate("app")} />}
        {page === "dashboard" && <DashboardPage apiKey={apiKey} onGoSettings={() => navigate("settings")} />}
        {page === "settings"  && <SettingsPage apiKey={apiKey} onSaveKey={saveApiKey} />}
      </div>

      {/* MOBILE BOTTOM NAV */}
      {isMobile && (
        <div style={{ height: 58, background: "#080808", borderTop: "1px solid #111", display: "flex", alignItems: "stretch", flexShrink: 0 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => navigate(n.id)} style={{ flex: 1, background: "transparent", border: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, cursor: "pointer", padding: 0, position: "relative" }}>
              {n.id === "settings" && !apiKey && <div style={{ position: "absolute", top: 8, right: "calc(50% - 12px)", width: 6, height: 6, borderRadius: "50%", background: "#E8C547" }} />}
              <div style={{ width: 18, height: 2.5, borderRadius: 2, background: page === n.id ? "#00FFB2" : "transparent" }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: page === n.id ? "#00FFB2" : "#3a3a3a" }}>{n.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}