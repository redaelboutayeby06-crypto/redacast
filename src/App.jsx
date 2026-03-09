import { useState, useRef, useEffect, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const AFFILIATE_LINK = "https://elevenlabs.io?from=redacast";
const CHAR_LIMIT = 10000;
const FREE_MONTHLY_LIMIT = 10000;

const VOICES_DATA = [
  { id: "en-US-1", name: "Marcus",   lang: "English (US)", gender: "Male",   accent: "American",   style: "Deep & Authoritative",   tag: "Popular", color: "#00FFB2", langCode: "en-US", pitch: 0.8,  rate: 0.9,  elId: "VR6AewLTigWG4xSOukaG" },
  { id: "en-US-2", name: "Sofia",    lang: "English (US)", gender: "Female", accent: "American",   style: "Warm & Engaging",         tag: "Popular", color: "#E8476A", langCode: "en-US", pitch: 1.2,  rate: 1.0,  elId: "21m00Tcm4TlvDq8ikWAM" },
  { id: "en-US-3", name: "Tyler",    lang: "English (US)", gender: "Male",   accent: "American",   style: "Casual & Upbeat",         tag: "New",     color: "#47B8E8", langCode: "en-US", pitch: 1.0,  rate: 1.05, elId: "TxGEqnHWrfWFTfGW9XjX" },
  { id: "en-US-4", name: "Ava",      lang: "English (US)", gender: "Female", accent: "American",   style: "Crisp & Confident",       tag: "",        color: "#A990F5", langCode: "en-US", pitch: 1.1,  rate: 1.0,  elId: "AZnzlk1XvdvUeBnXmlld" },
  { id: "en-GB-1", name: "Oliver",   lang: "English (UK)", gender: "Male",   accent: "British",    style: "Refined & Confident",     tag: "Premium", color: "#47B8E8", langCode: "en-GB", pitch: 0.9,  rate: 0.95, elId: "onwK4e9ZLuTAKqWW03F9" },
  { id: "en-GB-2", name: "Emma",     lang: "English (UK)", gender: "Female", accent: "British",    style: "Clear & Professional",    tag: "Premium", color: "#E8C547", langCode: "en-GB", pitch: 1.3,  rate: 1.0,  elId: "XB0fDUnXU5powFXDhCwa" },
  { id: "en-GB-3", name: "Henry",    lang: "English (UK)", gender: "Male",   accent: "British",    style: "Authoritative & Calm",    tag: "",        color: "#E87747", langCode: "en-GB", pitch: 0.85, rate: 0.9,  elId: "IKne3meq5aSn9XLyUdCD" },
  { id: "en-AU-1", name: "Jack",     lang: "English (AU)", gender: "Male",   accent: "Australian", style: "Casual & Friendly",       tag: "New",     color: "#A990F5", langCode: "en-AU", pitch: 0.95, rate: 1.0,  elId: "ErXwobaYiN019PkySvjV" },
  { id: "en-AU-2", name: "Olivia",   lang: "English (AU)", gender: "Female", accent: "Australian", style: "Bright & Energetic",      tag: "New",     color: "#E87747", langCode: "en-AU", pitch: 1.1,  rate: 1.05, elId: "MF3mGyEYCl7XYWbV9V6O" },
  { id: "fr-FR-1", name: "Antoine",  lang: "Français",     gender: "Male",   accent: "French",     style: "Smooth & Elegant",        tag: "",        color: "#00FFB2", langCode: "fr-FR", pitch: 0.9,  rate: 0.95, elId: "2EiwWnXFnvU5JabPnv8n" },
  { id: "fr-FR-2", name: "Camille",  lang: "Français",     gender: "Female", accent: "French",     style: "Expressive & Warm",       tag: "",        color: "#E8476A", langCode: "fr-FR", pitch: 1.2,  rate: 1.0,  elId: "EXAVITQu4vr4xnSDxMaL" },
  { id: "es-ES-1", name: "Diego",    lang: "Español",      gender: "Male",   accent: "Spanish",    style: "Bold & Confident",        tag: "",        color: "#47B8E8", langCode: "es-ES", pitch: 0.85, rate: 1.05, elId: "yoZ06aMxZJJ28mfd3POQ" },
  { id: "es-ES-2", name: "Isabella", lang: "Español",      gender: "Female", accent: "Spanish",    style: "Vibrant & Expressive",    tag: "New",     color: "#E8C547", langCode: "es-ES", pitch: 1.15, rate: 1.0,  elId: "piTKgcLEGmPE4e6mEKli" },
  { id: "de-DE-1", name: "Klaus",    lang: "Deutsch",      gender: "Male",   accent: "German",     style: "Precise & Strong",        tag: "",        color: "#E8C547", langCode: "de-DE", pitch: 0.8,  rate: 0.9,  elId: "pNInz6obpgDQGcFmaJgB" },
  { id: "de-DE-2", name: "Lena",     lang: "Deutsch",      gender: "Female", accent: "German",     style: "Clear & Articulate",      tag: "",        color: "#00FFB2", langCode: "de-DE", pitch: 1.1,  rate: 0.95, elId: "z9fAnlkpzviPz146aGWa" },
  { id: "ar-SA-1", name: "Karim",    lang: "Arabic",       gender: "Male",   accent: "Arabic",     style: "Rich & Resonant",         tag: "Popular", color: "#A990F5", langCode: "ar-SA", pitch: 0.85, rate: 0.9,  elId: "VR6AewLTigWG4xSOukaG" },
  { id: "ar-SA-2", name: "Layla",    lang: "Arabic",       gender: "Female", accent: "Arabic",     style: "Melodic & Warm",          tag: "",        color: "#E87747", langCode: "ar-SA", pitch: 1.2,  rate: 0.95, elId: "21m00Tcm4TlvDq8ikWAM" },
  { id: "ja-JP-1", name: "Yuki",     lang: "Japanese",     gender: "Female", accent: "Japanese",   style: "Crisp & Articulate",      tag: "",        color: "#E87747", langCode: "ja-JP", pitch: 1.3,  rate: 1.0,  elId: "AZnzlk1XvdvUeBnXmlld" },
  { id: "ja-JP-2", name: "Kenji",    lang: "Japanese",     gender: "Male",   accent: "Japanese",   style: "Calm & Professional",     tag: "",        color: "#47B8E8", langCode: "ja-JP", pitch: 0.9,  rate: 0.95, elId: "TxGEqnHWrfWFTfGW9XjX" },
  { id: "pt-BR-1", name: "Lucas",    lang: "Português",    gender: "Male",   accent: "Brazilian",  style: "Energetic & Warm",        tag: "New",     color: "#E8476A", langCode: "pt-BR", pitch: 0.95, rate: 1.05, elId: "ErXwobaYiN019PkySvjV" },
  { id: "pt-BR-2", name: "Ana",      lang: "Português",    gender: "Female", accent: "Brazilian",  style: "Bright & Friendly",       tag: "New",     color: "#A990F5", langCode: "pt-BR", pitch: 1.2,  rate: 1.0,  elId: "MF3mGyEYCl7XYWbV9V6O" },
  { id: "it-IT-1", name: "Marco",    lang: "Italiano",     gender: "Male",   accent: "Italian",    style: "Passionate & Expressive", tag: "",        color: "#00FFB2", langCode: "it-IT", pitch: 0.95, rate: 1.0,  elId: "IKne3meq5aSn9XLyUdCD" },
  { id: "it-IT-2", name: "Giulia",   lang: "Italiano",     gender: "Female", accent: "Italian",    style: "Elegant & Warm",          tag: "",        color: "#E8C547", langCode: "it-IT", pitch: 1.15, rate: 1.0,  elId: "XB0fDUnXU5powFXDhCwa" },
];

const ALL_LANGUAGES = ["All", ...Array.from(new Set(VOICES_DATA.map(v => v.lang)))];

const EMOTIONS = [
  { id: "neutral",  label: "Neutral",  pitchMod: 0,    rateMod: 0,     desc: "Balanced and natural",      stability: 0.65, similarity: 0.75, style: 0.0 },
  { id: "excited",  label: "Excited",  pitchMod: 0.2,  rateMod: 0.2,   desc: "High energy, enthusiastic", stability: 0.35, similarity: 0.80, style: 0.6 },
  { id: "calm",     label: "Calm",     pitchMod: -0.1, rateMod: -0.2,  desc: "Slow, relaxed, peaceful",   stability: 0.85, similarity: 0.70, style: 0.1 },
  { id: "serious",  label: "Serious",  pitchMod: -0.2, rateMod: -0.15, desc: "Professional and formal",   stability: 0.80, similarity: 0.75, style: 0.2 },
  { id: "dramatic", label: "Dramatic", pitchMod: -0.3, rateMod: -0.25, desc: "Intense and cinematic",      stability: 0.30, similarity: 0.85, style: 0.8 },
  { id: "friendly", label: "Friendly", pitchMod: 0.1,  rateMod: 0.05,  desc: "Conversational and warm",   stability: 0.55, similarity: 0.78, style: 0.4 },
];

// Audio tags that can be used in scripts
const AUDIO_TAGS = [
  { tag: "[whispers]",  label: "Whisper",  icon: "🤫", desc: "Soft whisper voice",       pitchMod: 0.2,  rateMod: -0.3, volumeMod: 0.4 },
  { tag: "[excited]",   label: "Excited",  icon: "⚡", desc: "High energy burst",        pitchMod: 0.3,  rateMod: 0.3,  volumeMod: 1.0 },
  { tag: "[laughs]",    label: "Laughs",   icon: "😄", desc: "Laughing tone",            pitchMod: 0.4,  rateMod: 0.2,  volumeMod: 1.0 },
  { tag: "[sighs]",     label: "Sighs",    icon: "😮‍💨", desc: "Sighing exhale",          pitchMod: -0.2, rateMod: -0.3, volumeMod: 0.7 },
  { tag: "[serious]",   label: "Serious",  icon: "😐", desc: "Stern and serious",        pitchMod: -0.3, rateMod: -0.2, volumeMod: 1.0 },
  { tag: "[dramatic]",  label: "Dramatic", icon: "🎭", desc: "Dramatic intensity",       pitchMod: -0.4, rateMod: -0.3, volumeMod: 1.0 },
  { tag: "[pause 1s]",  label: "Pause 1s", icon: "⏸", desc: "1 second pause",          pitchMod: 0,    rateMod: 0,    volumeMod: 0,  isPause: true, pauseMs: 1000 },
  { tag: "[pause 2s]",  label: "Pause 2s", icon: "⏸", desc: "2 second pause",          pitchMod: 0,    rateMod: 0,    volumeMod: 0,  isPause: true, pauseMs: 2000 },
  { tag: "[pause 3s]",  label: "Pause 3s", icon: "⏸", desc: "3 second pause",          pitchMod: 0,    rateMod: 0,    volumeMod: 0,  isPause: true, pauseMs: 3000 },
];

const SCRIPT_TEMPLATES = [
  { id: "youtube-intro",   label: "YouTube Intro",    icon: "📺", prompt: "Write a 30 second YouTube channel intro script that is energetic and engaging. Keep it under 100 words. No stage directions, just the spoken words." },
  { id: "podcast-intro",   label: "Podcast Intro",    icon: "🎙", prompt: "Write a 30 second podcast intro script that sounds professional and warm. Keep it under 100 words. No stage directions." },
  { id: "product-promo",   label: "Product Promo",    icon: "📦", prompt: "Write a 30 second product promotional script that highlights benefits and ends with a call to action. Keep it under 100 words. No stage directions." },
  { id: "motivational",    label: "Motivational",     icon: "💪", prompt: "Write a short motivational speech script that is inspiring and powerful. Keep it under 100 words. No stage directions." },
  { id: "explainer",       label: "Explainer Video",  icon: "💡", prompt: "Write a 30 second explainer video script that simplifies a complex concept. Keep it under 100 words. No stage directions." },
  { id: "news-anchor",     label: "News Anchor",      icon: "📰", prompt: "Write a short news anchor opening script that sounds professional and authoritative. Keep it under 100 words. No stage directions." },
  { id: "story-narrator",  label: "Story Narrator",   icon: "📖", prompt: "Write a short story narration opening that is captivating and draws the listener in. Keep it under 100 words. No stage directions." },
  { id: "ad-copy",         label: "Ad Copy",          icon: "📢", prompt: "Write a 15 second advertisement script that is catchy and memorable. Keep it under 60 words. No stage directions." },
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
  const saveKey = (key) => { localStorage.setItem("el_api_key", key.trim()); setApiKey(key.trim()); };
  return [apiKey, saveKey];
}

function useDarkMode() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") !== "light");
  const toggle = () => { const next = !dark; localStorage.setItem("theme", next ? "dark" : "light"); setDark(next); };
  return [dark, toggle];
}

function useCharUsage() {
  const key = "rc_char_usage";
  const monthKey = new Date().toISOString().slice(0, 7);
  const getUsage = () => {
    try { const d = JSON.parse(localStorage.getItem(key) || "{}"); return d.month === monthKey ? d.used : 0; } catch { return 0; }
  };
  const [used, setUsed] = useState(getUsage);
  const addUsage = (n) => {
    const newUsed = used + n;
    localStorage.setItem(key, JSON.stringify({ month: monthKey, used: newUsed }));
    setUsed(newUsed);
  };
  return [used, addUsage];
}

function useHistory() {
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("rc_history") || "[]"); } catch { return []; }
  });
  const addItem = (item) => {
    const next = [item, ...history].slice(0, 10);
    localStorage.setItem("rc_history", JSON.stringify(next));
    setHistory(next);
  };
  const clearHistory = () => { localStorage.removeItem("rc_history"); setHistory([]); };
  return [history, addItem, clearHistory];
}

// ─── VOICE API ────────────────────────────────────────────────────────────────
async function generateWithElevenLabs(text, voice, emotion, apiKey) {
  const cleanText = stripAudioTags(text);
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice.elId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "xi-api-key": apiKey },
    body: JSON.stringify({
      text: cleanText,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: emotion.stability, similarity_boost: emotion.similarity, style: emotion.style, use_speaker_boost: true },
    }),
  });
  if (!response.ok) { const err = await response.json().catch(() => ({})); throw new Error(err?.detail?.message || `ElevenLabs error ${response.status}`); }
  return URL.createObjectURL(await response.blob());
}

// Strip audio tags for display/counting
function stripAudioTags(text) {
  return text.replace(/\[whispers\]|\[excited\]|\[laughs\]|\[sighs\]|\[serious\]|\[dramatic\]|\[pause \ds\]/gi, "").trim();
}

// Parse text with audio tags into segments
function parseTaggedText(text) {
  const segments = [];
  const tagPattern = /(\[whispers\]|\[excited\]|\[laughs\]|\[sighs\]|\[serious\]|\[dramatic\]|\[pause \ds\])/gi;
  const parts = text.split(tagPattern);
  let currentTag = null;
  for (const part of parts) {
    const matchedTag = AUDIO_TAGS.find(t => t.tag.toLowerCase() === part.toLowerCase());
    if (matchedTag) { currentTag = matchedTag; }
    else if (part.trim()) { segments.push({ text: part.trim(), tag: currentTag }); currentTag = null; }
  }
  return segments;
}

function speakSegment(segment, voice, baseEmotion, speed, onEnd) {
  if (!window.speechSynthesis) { onEnd(); return; }
  if (segment.tag?.isPause) { setTimeout(onEnd, segment.tag.pauseMs); return; }
  const utter = new SpeechSynthesisUtterance(segment.text);
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find(v => v.lang === voice.langCode || v.lang.startsWith(voice.langCode.split("-")[0]));
  if (match) utter.voice = match;
  utter.lang = voice.langCode;
  const tagMod = segment.tag || { pitchMod: 0, rateMod: 0, volumeMod: 1 };
  utter.pitch = Math.max(0.1, Math.min(2, voice.pitch + baseEmotion.pitchMod + tagMod.pitchMod));
  utter.rate = Math.max(0.5, Math.min(2, voice.rate * speed + baseEmotion.rateMod + tagMod.rateMod));
  utter.volume = tagMod.volumeMod !== undefined ? tagMod.volumeMod : 1;
  utter.onend = onEnd;
  utter.onerror = onEnd;
  window.speechSynthesis.speak(utter);
}

function speakWithWebSpeech(text, voice, emotion, speed, onStart, onEnd) {
  if (!window.speechSynthesis) { onEnd(); return; }
  window.speechSynthesis.cancel();
  const segments = parseTaggedText(text);
  if (segments.length === 0) { onEnd(); return; }
  onStart();
  let i = 0;
  const next = () => { if (i < segments.length) speakSegment(segments[i++], voice, emotion, speed, next); else onEnd(); };
  next();
}

// ─── AI SCRIPT GENERATOR (uses Anthropic API) ─────────────────────────────────
async function generateScript(templatePrompt, topic, tone) {
  const fullPrompt = `${templatePrompt}${topic ? ` The topic is: "${topic}".` : ""} Tone: ${tone}. Return ONLY the script text, nothing else.`;
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: fullPrompt }],
    }),
  });
  const data = await response.json();
  return data.content?.[0]?.text || "";
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function WaveAnim({ active, color = "#00FFB2", bars = 18, height = 28 }) {
  const [heights, setHeights] = useState(() => Array(bars).fill(4));
  const frameRef = useRef(null);
  useEffect(() => {
    if (active) {
      const animate = () => { setHeights(Array(bars).fill(0).map(() => Math.max(4, Math.floor(Math.random() * height)))); frameRef.current = setTimeout(animate, 120); };
      animate();
    } else { clearTimeout(frameRef.current); setHeights(Array(bars).fill(0).map((_, i) => Math.max(3, i % 3 === 0 ? 14 : i % 2 === 0 ? 8 : 5))); }
    return () => clearTimeout(frameRef.current);
  }, [active]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height }}>
      {heights.map((h, i) => <div key={i} style={{ width: 3, height: h, background: active ? color : "#222", borderRadius: 2, transition: active ? "height 0.1s ease" : "height 0.4s ease" }} />)}
    </div>
  );
}

function Tag({ label, color }) {
  return <div style={{ background: color + "18", border: "1px solid " + color + "35", borderRadius: 5, padding: "2px 8px", fontSize: 9, fontWeight: 800, color, letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap", flexShrink: 0 }}>{label}</div>;
}

function ApiKeyBanner({ apiKey, onGoSettings, dark, voice }) {
  const isNonEnglish = voice && !voice.langCode.startsWith("en");
  if (apiKey) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ background: "#E8C54712", border: "1px solid #E8C54730", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 16 }}>⚠️</span>
        <div style={{ flex: 1, minWidth: 200 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#E8C547" }}>No ElevenLabs API key — </span>
          <span style={{ fontSize: 13, color: dark ? "#666" : "#888" }}>using browser voices. Add your key for real AI voices.</span>
        </div>
        <button onClick={onGoSettings} style={{ background: "#E8C54720", border: "1px solid #E8C54740", borderRadius: 8, padding: "6px 14px", color: "#E8C547", fontSize: 12, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" }}>Add API Key →</button>
      </div>
      {isNonEnglish && (
        <div style={{ background: "#E8476A10", border: "1px solid #E8476A30", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 16 }}>🌍</span>
          <div style={{ flex: 1, minWidth: 200 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#E8476A" }}>Language may not switch — </span>
            <span style={{ fontSize: 13, color: dark ? "#666" : "#888" }}>
              Browser voices don't support <strong>{voice.lang}</strong> on most devices. 
              Add an ElevenLabs API key for real multilingual voices.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SCRIPT GENERATOR PAGE ────────────────────────────────────────────────────
function ScriptGeneratorPage({ dark, onUseScript }) {
  const isMobile = useIsMobile();
  const [template, setTemplate] = useState(SCRIPT_TEMPLATES[0]);
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professional");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const bg = dark ? "#060606" : "#F5F5F0";
  const card = dark ? "#0D0D0D" : "#FFFFFF";
  const border = dark ? "#1E1E1E" : "#E8E8E0";
  const text = dark ? "#E0E0E0" : "#1A1A1A";
  const sub = dark ? "#555" : "#888";

  const handleGenerate = async () => {
    setGenerating(true); setResult("");
    try { const script = await generateScript(template.prompt, topic, tone); setResult(script); }
    catch { setResult("Failed to generate. Please try again."); }
    setGenerating(false);
  };

  const handleCopy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const tones = ["Professional", "Casual", "Energetic", "Calm", "Dramatic", "Friendly"];

  return (
    <div style={{ padding: isMobile ? "14px" : 24, overflowY: "auto", height: "100%", background: bg }}>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 900, letterSpacing: -0.5, color: text }}>AI Script Generator</h2>
        <p style={{ color: sub, marginTop: 6, fontSize: 14 }}>Generate professional scripts instantly with AI. Then convert to voice.</p>
      </div>

      {/* TEMPLATE PICKER */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "18px", marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: sub, fontWeight: 800, letterSpacing: 1, marginBottom: 12 }}>SCRIPT TYPE</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 8 }}>
          {SCRIPT_TEMPLATES.map(t => (
            <button key={t.id} onClick={() => setTemplate(t)} style={{ background: template.id === t.id ? "#00FFB210" : dark ? "#111" : "#F8F8F5", border: `1.5px solid ${template.id === t.id ? "#00FFB2" : border}`, borderRadius: 10, padding: "10px 12px", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{t.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: template.id === t.id ? "#00FFB2" : text }}>{t.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 14 }}>
        {/* TOPIC */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "18px" }}>
          <div style={{ fontSize: 11, color: sub, fontWeight: 800, letterSpacing: 1, marginBottom: 10 }}>TOPIC (optional)</div>
          <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Morning productivity tips..."
            style={{ width: "100%", background: dark ? "#111" : "#F8F8F5", border: `1px solid ${border}`, borderRadius: 10, padding: "11px 14px", color: text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
        {/* TONE */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "18px" }}>
          <div style={{ fontSize: 11, color: sub, fontWeight: 800, letterSpacing: 1, marginBottom: 10 }}>TONE</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {tones.map(t => (
              <button key={t} onClick={() => setTone(t)} style={{ background: tone === t ? "#00FFB210" : dark ? "#111" : "#F8F8F5", border: `1.5px solid ${tone === t ? "#00FFB2" : border}`, borderRadius: 8, padding: "6px 12px", color: tone === t ? "#00FFB2" : sub, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={handleGenerate} disabled={generating} style={{ width: "100%", padding: "15px", background: generating ? (dark ? "#111" : "#E8E8E0") : "linear-gradient(135deg, #00FFB2, #47B8E8)", border: "none", borderRadius: 14, fontWeight: 900, fontSize: 15, color: generating ? sub : "#000", cursor: generating ? "not-allowed" : "pointer", marginBottom: 14, transition: "all 0.3s" }}>
        {generating ? "✨ Generating script..." : "✨ Generate Script"}
      </button>

      {result && (
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "12px 18px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: text }}>Generated Script</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleCopy} style={{ background: copied ? "#00FFB215" : dark ? "#141414" : "#F0F0EB", border: `1px solid ${copied ? "#00FFB240" : border}`, borderRadius: 8, padding: "6px 12px", color: copied ? "#00FFB2" : sub, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                {copied ? "✓ Copied" : "📋 Copy"}
              </button>
              <button onClick={() => onUseScript(result)} style={{ background: "linear-gradient(135deg, #00FFB220, #47B8E820)", border: "1px solid #00FFB230", borderRadius: 8, padding: "6px 12px", color: "#00FFB2", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                Use in Studio →
              </button>
            </div>
          </div>
          <div style={{ padding: "18px", fontSize: 15, lineHeight: 1.8, color: text, fontFamily: "Georgia, serif", whiteSpace: "pre-wrap" }}>{result}</div>
        </div>
      )}
      {isMobile && <div style={{ height: 8 }} />}
    </div>
  );
}

// ─── PRICING PAGE ─────────────────────────────────────────────────────────────
function PricingPage({ dark }) {
  const isMobile = useIsMobile();
  const bg = dark ? "#060606" : "#F5F5F0";
  const card = dark ? "#0D0D0D" : "#FFFFFF";
  const border = dark ? "#1E1E1E" : "#E8E8E0";
  const text = dark ? "#E0E0E0" : "#1A1A1A";
  const sub = dark ? "#555" : "#888";

  const PLANS = [
    {
      name: "Free", price: "$0", period: "/month", color: "#555", chars: "10,000", highlight: false,
      features: ["10,000 chars/month", "Azure AI voices", "10 languages", "Emotion control", "Script generator", "Audio tags", "Speed control"],
      missing: ["MP3 download", "ElevenLabs voices", "Commercial use", "Priority support"],
      cta: "Start Free", ctaLink: "#",
    },
    {
      name: "Starter", price: "$5", period: "/month", color: "#47B8E8", chars: "50,000", highlight: false,
      features: ["50,000 chars/month", "Azure AI voices", "10 languages", "Emotion control", "Script generator", "Audio tags", "MP3 download", "Commercial license"],
      missing: ["ElevenLabs voices", "Priority support"],
      cta: "Get Starter", ctaLink: "#",
    },
    {
      name: "Pro", price: "$9", period: "/month", color: "#00FFB2", chars: "150,000", highlight: true, badge: "Most Popular",
      features: ["150,000 chars/month", "ElevenLabs AI voices", "10 languages", "Emotion control", "Script generator", "Audio tags", "MP3 download", "Commercial license", "Multi-speaker mode", "Priority support"],
      missing: [],
      cta: "Get Pro", ctaLink: "#",
    },
    {
      name: "Creator", price: "$29", period: "/month", color: "#A990F5", chars: "Unlimited", highlight: false,
      features: ["Unlimited chars", "ElevenLabs AI voices", "10 languages", "Emotion control", "Script generator", "Audio tags", "MP3 download", "Commercial license", "Multi-speaker mode", "Voice cloning (soon)", "API access", "Priority support"],
      missing: [],
      cta: "Get Creator", ctaLink: "#",
    },
  ];

  const COMPARE = [
    { f: "Monthly chars",      free: "10k",    starter: "50k",   pro: "150k",   creator: "Unlimited" },
    { f: "Voice quality",      free: "Azure",  starter: "Azure", pro: "ElevenLabs", creator: "ElevenLabs" },
    { f: "MP3 download",       free: false,    starter: true,    pro: true,     creator: true },
    { f: "Commercial use",     free: false,    starter: true,    pro: true,     creator: true },
    { f: "Audio tags",         free: true,     starter: true,    pro: true,     creator: true },
    { f: "Script generator",   free: true,     starter: true,    pro: true,     creator: true },
    { f: "Multi-speaker",      free: false,    starter: false,   pro: true,     creator: true },
    { f: "Voice cloning",      free: false,    starter: false,   pro: false,    creator: "Soon" },
    { f: "API access",         free: false,    starter: false,   pro: false,    creator: true },
    { f: "Priority support",   free: false,    starter: false,   pro: true,     creator: true },
  ];

  const renderVal = (v, isFirst) => {
    if (typeof v === "boolean") return v ? <span style={{ color: isFirst ? "#00FFB2" : "#444" }}>✓</span> : <span style={{ color: dark ? "#222" : "#CCC" }}>✗</span>;
    return <span style={{ fontSize: 11, fontWeight: 700, color: isFirst ? "#00FFB2" : sub }}>{v}</span>;
  };

  return (
    <div style={{ padding: isMobile ? "14px" : 24, overflowY: "auto", height: "100%", background: bg }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 style={{ fontSize: isMobile ? 26 : 36, fontWeight: 900, letterSpacing: -1, color: text }}>Simple, honest pricing</h2>
        <p style={{ color: sub, marginTop: 8, fontSize: 14 }}>No confusing credits. Just characters. Cancel anytime.</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#00FFB210", border: "1px solid #00FFB230", borderRadius: 20, padding: "5px 16px", fontSize: 11, fontWeight: 800, color: "#00FFB2", marginTop: 12, letterSpacing: 1 }}>
          UP TO 75% CHEAPER THAN ELEVENLABS
        </div>
      </div>

      {/* PLANS */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12, marginBottom: 32, maxWidth: 1000, margin: "0 auto 32px" }}>
        {PLANS.map((plan, i) => (
          <div key={i} style={{ background: plan.highlight ? (dark ? "#0A0A0A" : "#FAFAF8") : card, border: `${plan.highlight ? 2 : 1}px solid ${plan.highlight ? plan.color : border}`, borderRadius: 18, padding: isMobile ? "16px 14px" : "24px", position: "relative", boxShadow: plan.highlight ? `0 0 40px ${plan.color}15` : "none", display: "flex", flexDirection: "column" }}>
            {plan.badge && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: plan.color, borderRadius: 20, padding: "3px 12px", fontSize: 10, fontWeight: 900, color: "#000", whiteSpace: "nowrap" }}>{plan.badge}</div>}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: plan.color, letterSpacing: 1, marginBottom: 6 }}>{plan.name.toUpperCase()}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                <span style={{ fontSize: isMobile ? 28 : 36, fontWeight: 900, color: text, letterSpacing: -1 }}>{plan.price}</span>
                <span style={{ fontSize: 13, color: sub }}>{plan.period}</span>
              </div>
              <div style={{ fontSize: 12, color: plan.color, fontWeight: 700, marginTop: 4 }}>{plan.chars} chars/mo</div>
            </div>
            <div style={{ flex: 1, marginBottom: 16 }}>
              {plan.features.map((f, j) => (
                <div key={j} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                  <span style={{ color: plan.color, fontSize: 12, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: isMobile ? 11 : 12, color: text }}>{f}</span>
                </div>
              ))}
              {plan.missing.map((f, j) => (
                <div key={j} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6, opacity: 0.3 }}>
                  <span style={{ fontSize: 12, flexShrink: 0 }}>✗</span>
                  <span style={{ fontSize: isMobile ? 11 : 12, color: sub, textDecoration: "line-through" }}>{f}</span>
                </div>
              ))}
            </div>
            <button style={{ width: "100%", padding: "11px", background: plan.highlight ? `linear-gradient(135deg, ${plan.color}, #47B8E8)` : dark ? "#141414" : "#F0F0EB", border: `1px solid ${plan.highlight ? "transparent" : border}`, borderRadius: 10, fontWeight: 900, fontSize: 13, color: plan.highlight ? "#000" : text, cursor: "pointer" }}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* COMPARE TABLE */}
      <div style={{ maxWidth: 800, margin: "0 auto", background: card, border: `1px solid ${border}`, borderRadius: 16, overflow: "hidden", marginBottom: 24 }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${border}`, background: dark ? "#0E0E0E" : "#F8F8F5" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: text }}>Full Plan Comparison</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", minWidth: 480 }}>
            {["Feature", "Free", "Starter", "Pro", "Creator"].map((h, i) => (
              <div key={i} style={{ padding: "10px 14px", background: dark ? "#0E0E0E" : "#F5F5F0", fontSize: 11, fontWeight: 800, color: i === 3 ? "#00FFB2" : sub, textAlign: i > 0 ? "center" : "left", borderBottom: `1px solid ${border}` }}>{h}</div>
            ))}
            {COMPARE.map((row, ri) => (
              [row.f, row.free, row.starter, row.pro, row.creator].map((val, ci) => (
                <div key={`${ri}-${ci}`} style={{ padding: "10px 14px", background: ri % 2 === 0 ? "transparent" : (dark ? "#0A0A0A" : "#FAFAF8"), borderBottom: `1px solid ${border}`, textAlign: ci > 0 ? "center" : "left", fontSize: ci === 0 ? 12 : 14, color: ci === 0 ? sub : text }}>
                  {ci === 0 ? val : renderVal(val, ci === 3)}
                </div>
              ))
            ))}
          </div>
        </div>
      </div>

      {/* VS ELEVENLABS */}
      <div style={{ maxWidth: 800, margin: "0 auto", background: dark ? "#00FFB205" : "#F0FFF8", border: "1px solid #00FFB220", borderRadius: 16, padding: "20px", textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: text, marginBottom: 6 }}>Why Redacast over ElevenLabs?</div>
        <div style={{ fontSize: 13, color: sub, marginBottom: 14 }}>Same free tier. Better price. Simpler to use. No confusing credits system.</div>
        <div style={{ display: "flex", justifyContent: "center", gap: isMobile ? 16 : 32, flexWrap: "wrap" }}>
          {[["ElevenLabs Creator", "$22/mo", "100k chars"], ["Redacast Pro", "$9/mo", "150k chars"]].map(([name, price, chars], i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: i === 1 ? "#00FFB2" : sub, marginBottom: 4 }}>{name}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: i === 1 ? "#00FFB2" : (dark ? "#333" : "#BBB"), letterSpacing: -1 }}>{price}</div>
              <div style={{ fontSize: 11, color: sub }}>{chars}</div>
            </div>
          ))}
        </div>
      </div>
      {isMobile && <div style={{ height: 8 }} />}
    </div>
  );
}

// ─── HISTORY PAGE ─────────────────────────────────────────────────────────────
function HistoryPage({ history, onClearHistory, onReuse, dark }) {
  const isMobile = useIsMobile();
  const bg = dark ? "#060606" : "#F5F5F0";
  const card = dark ? "#0D0D0D" : "#FFFFFF";
  const border = dark ? "#1E1E1E" : "#E8E8E0";
  const text = dark ? "#E0E0E0" : "#1A1A1A";
  const sub = dark ? "#555" : "#888";

  return (
    <div style={{ padding: isMobile ? "14px" : 24, overflowY: "auto", height: "100%", background: bg }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <h2 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 900, letterSpacing: -0.5, color: text }}>History</h2>
          <p style={{ color: sub, marginTop: 6, fontSize: 14 }}>Your last {history.length} generated audios this session.</p>
        </div>
        {history.length > 0 && (
          <button onClick={onClearHistory} style={{ background: dark ? "#141414" : "#F0F0EB", border: `1px solid ${border}`, borderRadius: 8, padding: "7px 14px", color: sub, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Clear All</button>
        )}
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: sub }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎙</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: text, marginBottom: 8 }}>No history yet</div>
          <div style={{ fontSize: 13 }}>Generate your first voiceover in the Studio</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {history.map((item, i) => {
            const voice = VOICES_DATA.find(v => v.id === item.voiceId) || VOICES_DATA[0];
            return (
              <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "16px 18px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: voice.color + "15", border: `1px solid ${voice.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🎙</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, flexWrap: "wrap", gap: 4 }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: text }}>{voice.name} — {item.emotion}</div>
                    <div style={{ fontSize: 11, color: sub }}>{item.time}</div>
                  </div>
                  <div style={{ fontSize: 13, color: sub, lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{stripAudioTags(item.text)}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <div style={{ fontSize: 11, color: sub, background: dark ? "#111" : "#F5F5F0", borderRadius: 6, padding: "3px 8px" }}>{item.chars} chars</div>
                    <div style={{ fontSize: 11, color: sub, background: dark ? "#111" : "#F5F5F0", borderRadius: 6, padding: "3px 8px" }}>{item.speed}x speed</div>
                    <button onClick={() => onReuse(item)} style={{ fontSize: 11, color: "#00FFB2", background: "#00FFB210", border: "1px solid #00FFB225", borderRadius: 6, padding: "3px 10px", fontWeight: 700, cursor: "pointer", marginLeft: "auto" }}>Reuse →</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {isMobile && <div style={{ height: 8 }} />}
    </div>
  );
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
function SettingsPage({ apiKey, onSaveKey, dark, toggleDark, charsUsed }) {
  const isMobile = useIsMobile();
  const [inputKey, setInputKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const bg = dark ? "#060606" : "#F5F5F0";
  const card = dark ? "#0D0D0D" : "#FFFFFF";
  const border = dark ? "#1E1E1E" : "#E8E8E0";
  const text = dark ? "#E0E0E0" : "#1A1A1A";
  const sub = dark ? "#555" : "#888";
  const inputBg = dark ? "#111" : "#F8F8F5";

  const handleSave = () => { onSaveKey(inputKey); setSaved(true); setTestResult(null); setTimeout(() => setSaved(false), 2500); };
  const handleTest = async () => {
    if (!inputKey.trim()) return;
    setTesting(true); setTestResult(null);
    try { const res = await fetch("https://api.elevenlabs.io/v1/user/subscription", { headers: { "xi-api-key": inputKey.trim() } }); setTestResult(res.ok ? "ok" : "fail"); }
    catch { setTestResult("fail"); }
    setTesting(false);
  };

  const pct = Math.min(100, (charsUsed / FREE_MONTHLY_LIMIT) * 100);

  return (
    <div style={{ padding: isMobile ? "14px" : 24, overflowY: "auto", height: "100%", background: bg }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 900, letterSpacing: -0.5, color: text }}>Settings</h2>
        <p style={{ color: sub, marginTop: 6, fontSize: 14 }}>Configure your AI voice engine and preferences.</p>
      </div>

      {/* THEME TOGGLE */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "18px", marginBottom: 14, maxWidth: 600, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: dark ? "#E8C54710" : "#1a1a1a10", border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{dark ? "🌙" : "☀️"}</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: text }}>Appearance</div>
            <div style={{ fontSize: 12, color: sub, marginTop: 1 }}>{dark ? "Dark mode" : "Light mode"}</div>
          </div>
        </div>
        <button onClick={toggleDark} style={{ background: dark ? "#E8C54720" : "#1a1a1a10", border: `1px solid ${border}`, borderRadius: 20, padding: "8px 18px", fontWeight: 800, fontSize: 13, color: text, cursor: "pointer" }}>
          Switch to {dark ? "Light" : "Dark"}
        </button>
      </div>

      {/* USAGE */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "18px", marginBottom: 14, maxWidth: 600 }}>
        <div style={{ fontSize: 11, color: sub, fontWeight: 800, letterSpacing: 1, marginBottom: 14 }}>THIS MONTH'S USAGE</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: text }}>{charsUsed.toLocaleString()} / {FREE_MONTHLY_LIMIT.toLocaleString()} chars</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: pct > 80 ? "#E8476A" : "#00FFB2" }}>{Math.round(pct)}% used</span>
        </div>
        <div style={{ height: 6, background: dark ? "#111" : "#EEE", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: pct + "%", height: "100%", background: pct > 80 ? "#E8476A" : "linear-gradient(90deg, #00FFB2, #47B8E8)", transition: "width 0.3s", borderRadius: 3 }} />
        </div>
        <div style={{ fontSize: 12, color: sub, marginTop: 8 }}>Resets on the 1st of each month. Upgrade for more.</div>
      </div>

      {/* API KEY */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "22px", marginBottom: 14, maxWidth: 600 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#00FFB210", border: "1px solid #00FFB225", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🔑</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: text }}>ElevenLabs API Key</div>
            <div style={{ fontSize: 12, color: sub, marginTop: 1 }}>Required for real AI voices</div>
          </div>
          {apiKey && <div style={{ marginLeft: "auto", background: "#00FFB215", border: "1px solid #00FFB230", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 800, color: "#00FFB2" }}>● ACTIVE</div>}
        </div>
        <div style={{ fontSize: 11, color: sub, fontWeight: 700, marginBottom: 8, letterSpacing: 0.5 }}>YOUR API KEY</div>
        <input type="password" value={inputKey} onChange={e => { setInputKey(e.target.value); setTestResult(null); setSaved(false); }} placeholder="sk-..."
          style={{ width: "100%", background: inputBg, border: `1px solid ${testResult === "ok" ? "#00FFB2" : testResult === "fail" ? "#E8476A" : border}`, borderRadius: 10, padding: "11px 14px", color: text, fontSize: 14, outline: "none", fontFamily: "monospace", boxSizing: "border-box" }} />
        {testResult === "ok"   && <div style={{ marginTop: 8, fontSize: 12, color: "#00FFB2", fontWeight: 700 }}>✓ Key is valid!</div>}
        {testResult === "fail" && <div style={{ marginTop: 8, fontSize: 12, color: "#E8476A", fontWeight: 700 }}>✗ Invalid key. Try with VPN.</div>}
        {saved && !testResult  && <div style={{ marginTop: 8, fontSize: 12, color: "#00FFB2", fontWeight: 700 }}>✓ Saved!</div>}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button onClick={handleSave} style={{ flex: 1, background: "linear-gradient(135deg, #00FFB2, #47B8E8)", border: "none", borderRadius: 10, padding: "11px", fontWeight: 900, fontSize: 13, color: "#000", cursor: "pointer" }}>Save Key</button>
          <button onClick={handleTest} disabled={!inputKey.trim() || testing} style={{ background: inputBg, border: `1px solid ${border}`, borderRadius: 10, padding: "11px 18px", fontWeight: 700, fontSize: 13, color: testing ? sub : sub, cursor: inputKey.trim() ? "pointer" : "not-allowed" }}>
            {testing ? "Testing..." : "Test Key"}
          </button>
        </div>
        <div style={{ marginTop: 18, padding: "14px 16px", background: inputBg, borderRadius: 10, border: `1px solid ${border}` }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: sub, marginBottom: 10, letterSpacing: 0.5 }}>HOW TO GET YOUR FREE KEY</div>
          {[
            { n: "1", t: "Use a VPN",                d: "Connect to US/EU (ProtonVPN free works)" },
            { n: "2", t: "Create free account",       d: <span>Go to <a href={AFFILIATE_LINK} target="_blank" rel="noreferrer" style={{ color: "#00FFB2", textDecoration: "none", fontWeight: 700 }}>ElevenLabs ↗</a> and sign up</span> },
            { n: "3", t: "Profile → API Keys",        d: "Find your API key in settings" },
            { n: "4", t: "Copy & paste here",         d: "You get 10,000 free chars/month" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: i < 3 ? 10 : 0 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: "#00FFB215", border: "1px solid #00FFB225", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#00FFB2", flexShrink: 0 }}>{s.n}</div>
              <div><div style={{ fontSize: 13, fontWeight: 700, color: text }}>{s.t}</div><div style={{ fontSize: 12, color: sub, marginTop: 1 }}>{s.d}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* ENGINE STATUS */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "20px", maxWidth: 600 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: sub, marginBottom: 14, letterSpacing: 0.5 }}>VOICE ENGINE STATUS</div>
        {[
          { label: "ElevenLabs AI",  active: !!apiKey, desc: "Real neural voices, multilingual" },
          { label: "Web Speech API", active: true,     desc: "Browser built-in fallback" },
        ].map((e, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: inputBg, borderRadius: 10, border: `1px solid ${e.active && i === 0 ? "#00FFB225" : border}`, marginBottom: i === 0 ? 8 : 0 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: e.active ? "#00FFB2" : dark ? "#2a2a2a" : "#DDD", flexShrink: 0, boxShadow: e.active ? "0 0 8px #00FFB2" : "none" }} />
            <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 700, color: text }}>{e.label}</div><div style={{ fontSize: 11, color: sub, marginTop: 1 }}>{e.desc}</div></div>
          </div>
        ))}
      </div>
      {isMobile && <div style={{ height: 8 }} />}
    </div>
  );
}

// ─── STUDIO PAGE ──────────────────────────────────────────────────────────────
function StudioPage({ apiKey, onGoSettings, dark, charsUsed, addUsage, addHistory }) {
  const isMobile = useIsMobile();
  const [text, setText] = useState("Welcome to Redacast. [pause 1s] Type your script here and click Generate to hear it in a real AI voice.");
  const [voice, setVoice] = useState(VOICES_DATA[0]);
  const [emotion, setEmotion] = useState(EMOTIONS[0]);
  const [speed, setSpeed] = useState(1.0);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [voiceFilter, setVoiceFilter] = useState("All");
  const [voiceSearch, setVoiceSearch] = useState("");
  const [showVoicePanel, setShowVoicePanel] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTagHelper, setShowTagHelper] = useState(false);
  // Multi-speaker mode
  const [multiSpeaker, setMultiSpeaker] = useState(false);
  const [speakerLines, setSpeakerLines] = useState([
    { id: 1, text: "Hello everyone, welcome to today's episode.", voiceId: VOICES_DATA[0].id },
    { id: 2, text: "Thanks Marcus! Today we're talking about AI voices.", voiceId: VOICES_DATA[1].id },
  ]);
  const audioRef = useRef(null);
  const textareaRef = useRef(null);

  const bg = dark ? "#060606" : "#F5F5F0";
  const card = dark ? "#0D0D0D" : "#FFFFFF";
  const border = dark ? "#1E1E1E" : "#E8E8E0";
  const textColor = dark ? "#E0E0E0" : "#1A1A1A";
  const sub = dark ? "#555" : "#888";
  const inputBg = dark ? "#111" : "#F8F8F5";

  useEffect(() => { return () => { if (audioUrl) URL.revokeObjectURL(audioUrl); }; }, [audioUrl]);

  const handleVoiceChange = (v) => {
    setVoice(v);
    if (status === "playing") { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } window.speechSynthesis && window.speechSynthesis.cancel(); }
    if (status !== "idle" && status !== "generating") { setStatus("idle"); setGenerated(false); }
    if (isMobile) setShowVoicePanel(false);
  };

  const handleTextChange = (val) => {
    setText(val.slice(0, CHAR_LIMIT));
    if (generated && status !== "generating") { setStatus("idle"); setGenerated(false); }
  };

  const insertTag = (tag) => {
    const el = textareaRef.current;
    if (!el) { setText(t => (t + " " + tag).slice(0, CHAR_LIMIT)); return; }
    const start = el.selectionStart; const end = el.selectionEnd;
    const newText = (text.slice(0, start) + " " + tag + " " + text.slice(end)).slice(0, CHAR_LIMIT);
    setText(newText);
    setTimeout(() => { el.selectionStart = el.selectionEnd = start + tag.length + 2; el.focus(); }, 0);
  };

  const handleCopyText = () => { navigator.clipboard.writeText(stripAudioTags(text)); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const handleGenerate = async () => {
    if (!text.trim() || status === "generating") return;
    const cleanChars = stripAudioTags(text).length;
    if (charsUsed + cleanChars > FREE_MONTHLY_LIMIT && !apiKey) { setStatus("error"); setErrorMsg("Monthly free limit reached. Add API key or upgrade to Pro."); return; }
    setStatus("generating"); setErrorMsg("");
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    window.speechSynthesis && window.speechSynthesis.cancel();

    if (apiKey) {
      try {
        const url = await generateWithElevenLabs(text, voice, emotion, apiKey);
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(url); setStatus("playing"); setGenerated(true);
        addUsage(cleanChars);
        addHistory({ text, voiceId: voice.id, emotion: emotion.label, speed, chars: cleanChars, time: new Date().toLocaleTimeString() });
        const audio = new Audio(url); audioRef.current = audio; audio.playbackRate = speed; audio.play();
        audio.onended = () => setStatus("done"); audio.onerror = () => { setStatus("error"); setErrorMsg("Playback failed."); };
      } catch (err) { setStatus("error"); setErrorMsg(err.message || "ElevenLabs request failed."); }
    } else {
      setTimeout(() => {
        setStatus("playing"); setGenerated(true);
        addUsage(cleanChars);
        addHistory({ text, voiceId: voice.id, emotion: emotion.label, speed, chars: cleanChars, time: new Date().toLocaleTimeString() });
        speakWithWebSpeech(text, voice, emotion, speed, () => setStatus("playing"), () => setStatus("done"));
      }, 600);
    }
  };

  const handleStop = () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } window.speechSynthesis && window.speechSynthesis.cancel(); setStatus("done"); };
  const handlePlayAgain = () => { if (apiKey && audioUrl) { setStatus("playing"); const audio = new Audio(audioUrl); audioRef.current = audio; audio.playbackRate = speed; audio.play(); audio.onended = () => setStatus("done"); } else handleGenerate(); };
  const handleDownload = () => { if (!audioUrl) return; const a = document.createElement("a"); a.href = audioUrl; a.download = `redacast-${voice.name.toLowerCase()}-${Date.now()}.mp3`; a.click(); };

  const filteredVoices = VOICES_DATA.filter(v => {
    const matchFilter = voiceFilter === "All" || v.gender === voiceFilter || v.lang === voiceFilter;
    const matchSearch = !voiceSearch || v.name.toLowerCase().includes(voiceSearch.toLowerCase()) || v.lang.toLowerCase().includes(voiceSearch.toLowerCase()) || v.accent.toLowerCase().includes(voiceSearch.toLowerCase());
    return matchFilter && matchSearch;
  });

  const pct = Math.min(100, (text.length / CHAR_LIMIT) * 100);
  const usagePct = Math.min(100, (charsUsed / FREE_MONTHLY_LIMIT) * 100);

  const btnLabel = () => {
    if (status === "generating") return "⏳ Generating" + (apiKey ? " with ElevenLabs..." : "...");
    if (status === "playing")    return "⏹ Stop";
    if (status === "done")       return "▶ Play Again";
    if (status === "error")      return "↺ Retry";
    return "▶ Generate Voiceover";
  };
  const btnAction = () => { if (status === "playing") return handleStop; if (status === "done") return handlePlayAgain; return handleGenerate; };

  const VoiceList = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* SEARCH */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14, color: sub }}>🔍</span>
        <input value={voiceSearch} onChange={e => setVoiceSearch(e.target.value)} placeholder="Search voices..."
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: textColor, fontSize: 13 }} />
        {voiceSearch && <button onClick={() => setVoiceSearch("")} style={{ background: "none", border: "none", color: sub, cursor: "pointer", fontSize: 14 }}>✕</button>}
      </div>
      {/* FILTERS */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "10px 12px" }}>
        <div style={{ display: "flex", gap: 5, overflowX: "auto", scrollbarWidth: "none" }}>
          {["All", "Male", "Female", ...ALL_LANGUAGES.slice(1)].map(f => (
            <button key={f} onClick={() => setVoiceFilter(f)} style={{ flexShrink: 0, background: voiceFilter === f ? "#00FFB210" : "transparent", border: `1px solid ${voiceFilter === f ? "#00FFB240" : border}`, borderRadius: 7, padding: "5px 10px", color: voiceFilter === f ? "#00FFB2" : sub, fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{f}</button>
          ))}
        </div>
      </div>
      {/* VOICE CARDS */}
      <div style={{ display: "flex", flexDirection: "column", gap: 7, overflowY: "auto" }}>
        {filteredVoices.length === 0 ? (
          <div style={{ textAlign: "center", padding: 24, color: sub, fontSize: 13 }}>No voices found</div>
        ) : filteredVoices.map(v => {
          const selected = voice.id === v.id;
          return (
            <div key={v.id} onClick={() => handleVoiceChange(v)} style={{ background: selected ? v.color + "0C" : card, border: `1.5px solid ${selected ? v.color : border}`, borderRadius: 12, padding: "12px 14px", cursor: "pointer", transition: "all 0.2s", boxShadow: selected ? `0 0 20px ${v.color}18` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                  <div style={{ fontWeight: 800, fontSize: 13, color: textColor }}>{v.name}</div>
                  <div style={{ fontSize: 11, color: sub, marginTop: 1 }}>{v.accent} · {v.gender}</div>
                  <div style={{ fontSize: 11, color: dark ? "#3a3a3a" : "#BBB", fontStyle: "italic" }}>{v.style}</div>
                </div>
                {v.tag && <Tag label={v.tag} color={v.color} />}
              </div>
              <WaveAnim active={selected && status === "playing"} color={v.color} bars={10} height={18} />
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ height: "100%", overflow: "hidden", position: "relative", background: bg }}>
      {/* MOBILE VOICE OVERLAY */}
      {isMobile && showVoicePanel && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: bg, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <span style={{ fontWeight: 800, fontSize: 15, color: textColor }}>Choose Voice</span>
            <button onClick={() => setShowVoicePanel(false)} style={{ background: dark ? "#1a1a1a" : "#EEE", border: "none", borderRadius: 8, padding: "6px 14px", color: textColor, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Done ✓</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px" }}><VoiceList /></div>
        </div>
      )}

      <div style={{ display: isMobile ? "flex" : "grid", flexDirection: isMobile ? "column" : undefined, gridTemplateColumns: isMobile ? undefined : "1fr 340px", gap: 14, padding: isMobile ? "14px" : 20, height: "100%", overflowY: isMobile ? "auto" : "hidden", boxSizing: "border-box" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, overflowY: isMobile ? "visible" : "auto" }}>

          <ApiKeyBanner apiKey={apiKey} onGoSettings={onGoSettings} dark={dark} voice={voice} />

          {/* MOBILE VOICE PILL */}
          {isMobile && (
            <button onClick={() => setShowVoicePanel(true)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: card, border: `1.5px solid ${voice.color}`, borderRadius: 12, padding: "12px 16px", cursor: "pointer", width: "100%", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: voice.color, flexShrink: 0 }} />
                <span style={{ fontWeight: 800, fontSize: 14, color: textColor }}>{voice.name}</span>
                <span style={{ fontSize: 11, color: sub }}>{voice.accent} · {voice.gender}</span>
              </div>
              <span style={{ fontSize: 12, color: sub, fontWeight: 700 }}>Change ›</span>
            </button>
          )}

          {/* MULTI-SPEAKER TOGGLE */}
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: textColor }}>Multi-Speaker Mode</span>
              <span style={{ fontSize: 11, color: sub, marginLeft: 8 }}>Assign different voices to each line</span>
            </div>
            <button onClick={() => setMultiSpeaker(!multiSpeaker)} style={{ background: multiSpeaker ? "#00FFB215" : (dark ? "#141414" : "#F0F0EB"), border: `1px solid ${multiSpeaker ? "#00FFB240" : border}`, borderRadius: 20, padding: "5px 14px", color: multiSpeaker ? "#00FFB2" : sub, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
              {multiSpeaker ? "ON" : "OFF"}
            </button>
          </div>

          {multiSpeaker ? (
            /* MULTI-SPEAKER EDITOR */
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: sub, letterSpacing: 1 }}>SPEAKER LINES</span>
                <button onClick={() => setSpeakerLines(l => [...l, { id: Date.now(), text: "", voiceId: VOICES_DATA[0].id }])} style={{ background: "#00FFB215", border: "1px solid #00FFB230", borderRadius: 7, padding: "4px 10px", color: "#00FFB2", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>+ Add Line</button>
              </div>
              <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
                {speakerLines.map((line, i) => {
                  const lv = VOICES_DATA.find(v => v.id === line.voiceId) || VOICES_DATA[0];
                  return (
                    <div key={line.id} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: lv.color + "15", border: `1px solid ${lv.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: lv.color, flexShrink: 0, marginTop: 2 }}>{lv.name[0]}</div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                        <select value={line.voiceId} onChange={e => setSpeakerLines(ls => ls.map(l => l.id === line.id ? { ...l, voiceId: e.target.value } : l))}
                          style={{ background: inputBg, border: `1px solid ${border}`, borderRadius: 7, padding: "6px 10px", color: textColor, fontSize: 12, outline: "none" }}>
                          {VOICES_DATA.map(v => <option key={v.id} value={v.id}>{v.name} — {v.accent}</option>)}
                        </select>
                        <textarea value={line.text} onChange={e => setSpeakerLines(ls => ls.map(l => l.id === line.id ? { ...l, text: e.target.value } : l))} placeholder="Type this speaker's line..."
                          style={{ background: inputBg, border: `1px solid ${border}`, borderRadius: 7, padding: "8px 10px", color: textColor, fontSize: 13, resize: "vertical", outline: "none", minHeight: 60, fontFamily: "Georgia, serif", lineHeight: 1.6 }} />
                      </div>
                      {speakerLines.length > 1 && <button onClick={() => setSpeakerLines(ls => ls.filter(l => l.id !== line.id))} style={{ background: "none", border: "none", color: sub, cursor: "pointer", fontSize: 16, padding: "4px", marginTop: 2, flexShrink: 0 }}>✕</button>}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* SINGLE SPEAKER EDITOR */
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "10px 16px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: sub, letterSpacing: 1 }}>SCRIPT EDITOR</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: pct > 90 ? "#E8476A" : sub }}>{text.length.toLocaleString()} / {CHAR_LIMIT.toLocaleString()}</span>
                  <button onClick={handleCopyText} title="Copy text" style={{ background: copied ? "#00FFB215" : "transparent", border: `1px solid ${copied ? "#00FFB230" : border}`, borderRadius: 6, padding: "3px 8px", color: copied ? "#00FFB2" : sub, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                    {copied ? "✓" : "📋 Copy"}
                  </button>
                  <button onClick={() => setShowTagHelper(!showTagHelper)} style={{ background: showTagHelper ? "#47B8E815" : "transparent", border: `1px solid ${showTagHelper ? "#47B8E840" : border}`, borderRadius: 6, padding: "3px 8px", color: showTagHelper ? "#47B8E8" : sub, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                    🎭 Tags
                  </button>
                </div>
              </div>
              <div style={{ height: 3, background: dark ? "#111" : "#EEE" }}>
                <div style={{ width: pct + "%", height: "100%", background: pct > 90 ? "#E8476A" : "#00FFB2", transition: "width 0.2s" }} />
              </div>
              {/* AUDIO TAGS HELPER */}
              {showTagHelper && (
                <div style={{ padding: "10px 14px", borderBottom: `1px solid ${border}`, background: dark ? "#080808" : "#F8F8F5" }}>
                  <div style={{ fontSize: 10, color: sub, fontWeight: 800, letterSpacing: 1, marginBottom: 8 }}>CLICK TO INSERT TAG</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {AUDIO_TAGS.map((t, i) => (
                      <button key={i} onClick={() => insertTag(t.tag)} title={t.desc} style={{ background: dark ? "#111" : "#EEE", border: `1px solid ${border}`, borderRadius: 7, padding: "5px 10px", color: textColor, fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        <span>{t.icon}</span> <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize: 10, color: sub, marginTop: 8, fontStyle: "italic" }}>
                    Example: "Hello [whispers] this is a secret [pause 1s] and now back to normal!"
                  </div>
                </div>
              )}
              <textarea ref={textareaRef} value={text} onChange={e => handleTextChange(e.target.value)} placeholder="Type or paste your script here. Use 🎭 Tags for expression!"
                style={{ width: "100%", minHeight: isMobile ? 120 : 180, background: "transparent", border: "none", padding: "14px 16px", color: textColor, fontSize: 15, lineHeight: 1.8, resize: "vertical", outline: "none", fontFamily: "Georgia, serif", boxSizing: "border-box" }} />
            </div>
          )}

          {/* EMOTION */}
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: sub, fontWeight: 800, letterSpacing: 1, marginBottom: 8 }}>EMOTION STYLE</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {EMOTIONS.map(em => (
                <button key={em.id} onClick={() => setEmotion(em)} style={{ background: emotion.id === em.id ? "#00FFB212" : dark ? "#111" : "#F0F0EB", border: `1.5px solid ${emotion.id === em.id ? "#00FFB2" : border}`, borderRadius: 8, padding: "6px 12px", color: emotion.id === em.id ? "#00FFB2" : sub, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                  {em.label}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: dark ? "#333" : "#BBB", marginTop: 6, fontStyle: "italic" }}>{emotion.desc}</div>
          </div>

          {/* SPEED */}
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: sub, fontWeight: 800, letterSpacing: 1, marginBottom: 6 }}>SPEED — {speed.toFixed(1)}x</div>
            <input type="range" min="0.5" max="2" step="0.1" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} style={{ width: "100%", accentColor: "#00FFB2" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: dark ? "#333" : "#BBB", marginTop: 2 }}>
              <span>0.5x Slow</span><span>1.0x Normal</span><span>2.0x Fast</span>
            </div>
          </div>

          {/* USAGE BAR */}
          {!apiKey && (
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "10px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: sub, fontWeight: 700 }}>Free tier usage this month</span>
                <span style={{ fontSize: 11, color: usagePct > 80 ? "#E8476A" : sub }}>{charsUsed.toLocaleString()} / {FREE_MONTHLY_LIMIT.toLocaleString()}</span>
              </div>
              <div style={{ height: 4, background: dark ? "#111" : "#EEE", borderRadius: 2 }}>
                <div style={{ width: usagePct + "%", height: "100%", background: usagePct > 80 ? "#E8476A" : "linear-gradient(90deg, #00FFB2, #47B8E8)", borderRadius: 2 }} />
              </div>
            </div>
          )}

          {/* ERROR */}
          {status === "error" && (
            <div style={{ background: "#E8476A10", border: "1px solid #E8476A30", borderRadius: 12, padding: "12px 16px", display: "flex", gap: 10 }}>
              <span style={{ fontSize: 16 }}>❌</span>
              <div><div style={{ fontSize: 13, fontWeight: 700, color: "#E8476A" }}>Generation failed</div><div style={{ fontSize: 12, color: sub, marginTop: 2 }}>{errorMsg}</div></div>
            </div>
          )}

          {/* MAIN BUTTON */}
          <button onClick={btnAction()} style={{ width: "100%", padding: "15px", background: status === "generating" ? (dark ? "#111" : "#EEE") : status === "playing" ? "linear-gradient(135deg, #E8476A, #E87747)" : "linear-gradient(135deg, #00FFB2, #47B8E8)", border: "none", borderRadius: 14, fontWeight: 900, fontSize: 16, color: status === "generating" ? sub : "#000", cursor: status === "generating" ? "not-allowed" : "pointer", transition: "all 0.3s" }}>
            {btnLabel()}
          </button>

          {/* PLAYBACK BAR */}
          {(status === "playing" || status === "done") && (
            <div style={{ background: card, border: "1px solid #00FFB220", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#00FFB210", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🎧</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: textColor }}>{voice.name} — {emotion.label}</div>
                <div style={{ fontSize: 11, color: sub, marginTop: 2 }}>{apiKey ? "🤖 ElevenLabs AI" : "🔈 Browser voice"} · {speed.toFixed(1)}x</div>
              </div>
              <WaveAnim active={status === "playing"} color="#00FFB2" height={22} bars={12} />
              {apiKey && audioUrl && (
                <button onClick={handleDownload} style={{ background: "#00FFB215", border: "1px solid #00FFB230", borderRadius: 8, padding: "7px 12px", color: "#00FFB2", fontSize: 12, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" }}>↓ MP3</button>
              )}
            </div>
          )}

          {isMobile && <div style={{ height: 8 }} />}
        </div>

        {/* DESKTOP VOICE LIST */}
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
function DashboardPage({ apiKey, onGoSettings, dark, charsUsed }) {
  const isMobile = useIsMobile();
  const bg = dark ? "#060606" : "#F5F5F0";
  const card = dark ? "#0D0D0D" : "#FFFFFF";
  const border = dark ? "#1E1E1E" : "#E8E8E0";
  const text = dark ? "#E0E0E0" : "#1A1A1A";
  const sub = dark ? "#555" : "#888";
  const usagePct = Math.min(100, (charsUsed / FREE_MONTHLY_LIMIT) * 100);

  return (
    <div style={{ padding: isMobile ? "14px" : 24, overflowY: "auto", height: "100%", background: bg }}>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 900, letterSpacing: -0.5, color: text }}>Good morning, <span style={{ color: "#00FFB2" }}>Reda</span></h2>
        <p style={{ color: sub, marginTop: 6, fontSize: 14 }}>Here is your Redacast overview.</p>
      </div>
      <ApiKeyBanner apiKey={apiKey} onGoSettings={onGoSettings} dark={dark} />
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 12, marginBottom: 16, marginTop: 16 }}>
        {[
          { label: "Characters Used",  value: charsUsed.toLocaleString(), color: "#00FFB2", sub: "This month" },
          { label: "Audios Generated", value: "14",    color: "#47B8E8", sub: "This month" },
          { label: "Languages Used",   value: "3",     color: "#E8C547", sub: "EN, FR, AR" },
        ].map((s, i) => (
          <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "14px 16px", gridColumn: isMobile && i === 2 ? "span 2" : undefined }}>
            <div style={{ fontSize: 10, color: sub, fontWeight: 800, letterSpacing: 1, marginBottom: 6 }}>{s.label.toUpperCase()}</div>
            <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: sub, marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* USAGE CARD */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "16px 18px", marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: text }}>Free Tier Usage</span>
          <span style={{ fontSize: 12, color: usagePct > 80 ? "#E8476A" : sub }}>{charsUsed.toLocaleString()} / {FREE_MONTHLY_LIMIT.toLocaleString()}</span>
        </div>
        <div style={{ height: 6, background: dark ? "#111" : "#EEE", borderRadius: 3 }}>
          <div style={{ width: usagePct + "%", height: "100%", background: usagePct > 80 ? "#E8476A" : "linear-gradient(90deg, #00FFB2, #47B8E8)", borderRadius: 3, transition: "width 0.5s" }} />
        </div>
        <div style={{ fontSize: 11, color: sub, marginTop: 6 }}>Resets on the 1st of each month</div>
      </div>

      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ padding: "13px 18px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 800, fontSize: 14, color: text }}>Recent Projects</span>
          <span style={{ fontSize: 12, color: sub, cursor: "pointer" }}>View all</span>
        </div>
        {PROJECTS_MOCK.map((p, i) => (
          <div key={i} style={{ padding: "12px 18px", borderBottom: i < PROJECTS_MOCK.length - 1 ? `1px solid ${dark ? "#111" : "#F0F0EB"}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1, minWidth: 0 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: dark ? "#141414" : "#F0F0EB", border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🎙</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                <div style={{ fontSize: 11, color: sub, marginTop: 1 }}>{p.chars} chars · {p.voice}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: sub, whiteSpace: "nowrap", marginLeft: 10 }}>{p.date}</div>
          </div>
        ))}
      </div>

      <div style={{ background: dark ? "linear-gradient(135deg, #00FFB20A, #47B8E80A)" : "linear-gradient(135deg, #F0FFF8, #F0F8FF)", border: "1px solid #00FFB222", borderRadius: 16, padding: "18px", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "center", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 4, color: text }}>Upgrade to Pro — $9/mo</div>
          <div style={{ fontSize: 13, color: sub }}>150,000 chars/mo · ElevenLabs voices · MP3 downloads</div>
        </div>
        <button style={{ background: "linear-gradient(135deg, #00FFB2, #47B8E8)", border: "none", borderRadius: 10, padding: "11px 24px", fontWeight: 900, fontSize: 13, color: "#000", cursor: "pointer" }}>Upgrade Now</button>
      </div>
      {isMobile && <div style={{ height: 8 }} />}
    </div>
  );
}

// ─── VOICES PAGE ──────────────────────────────────────────────────────────────
function VoicesPage({ onUseVoice, apiKey, dark }) {
  const isMobile = useIsMobile();
  const [playing, setPlaying] = useState(null);
  const [langFilter, setLangFilter] = useState("All");
  const [search, setSearch] = useState("");
  const audioRef = useRef(null);
  const bg = dark ? "#060606" : "#F5F5F0";
  const card = dark ? "#0D0D0D" : "#FFFFFF";
  const border = dark ? "#1E1E1E" : "#E8E8E0";
  const text = dark ? "#E0E0E0" : "#1A1A1A";
  const sub = dark ? "#555" : "#888";

  const handlePreview = async (v) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    window.speechSynthesis && window.speechSynthesis.cancel();
    if (playing === v.id) { setPlaying(null); return; }
    setPlaying(v.id);
    const previewText = `Hi, I am ${v.name}. ${v.style}.`;
    if (apiKey) {
      try {
        const url = await generateWithElevenLabs(previewText, v, EMOTIONS[0], apiKey);
        const audio = new Audio(url); audioRef.current = audio; audio.play();
        audio.onended = () => { setPlaying(null); URL.revokeObjectURL(url); };
        audio.onerror = () => setPlaying(null);
      } catch { setPlaying(null); }
    } else {
      speakWithWebSpeech(previewText, v, EMOTIONS[0], 1.0, () => {}, () => setPlaying(null));
    }
  };

  const filtered = VOICES_DATA.filter(v => {
    const matchLang = langFilter === "All" || v.lang === langFilter;
    const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.accent.toLowerCase().includes(search.toLowerCase());
    return matchLang && matchSearch;
  });

  return (
    <div style={{ padding: isMobile ? "14px" : 24, overflowY: "auto", height: "100%", background: bg }}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 900, letterSpacing: -0.5, color: text }}>Voice Library</h2>
        <p style={{ color: sub, marginTop: 6, fontSize: 14 }}>{VOICES_DATA.length} voices · {ALL_LANGUAGES.length - 1} languages · {apiKey ? "🤖 ElevenLabs AI active" : "🔈 Browser fallback"}</p>
      </div>

      {/* SEARCH + FILTERS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexDirection: isMobile ? "column" : "row" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: card, border: `1px solid ${border}`, borderRadius: 10, padding: "9px 12px", flex: isMobile ? undefined : 1 }}>
          <span style={{ color: sub }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or accent..." style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: text, fontSize: 13 }} />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: sub, cursor: "pointer" }}>✕</button>}
        </div>
      </div>

      <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 4, marginBottom: 16, scrollbarWidth: "none" }}>
        {ALL_LANGUAGES.map(l => (
          <button key={l} onClick={() => setLangFilter(l)} style={{ flexShrink: 0, background: langFilter === l ? "#00FFB210" : card, border: `1px solid ${langFilter === l ? "#00FFB240" : border}`, borderRadius: 20, padding: "6px 14px", color: langFilter === l ? "#00FFB2" : sub, fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{l}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: sub }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: text }}>No voices found</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {filtered.map(v => (
            <div key={v.id} style={{ background: card, border: `1.5px solid ${playing === v.id ? v.color : border}`, borderRadius: 16, padding: "16px 18px", transition: "all 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: text }}>{v.name}</div>
                  <div style={{ fontSize: 11, color: sub, marginTop: 2 }}>{v.lang} · {v.gender}</div>
                  <div style={{ fontSize: 11, color: dark ? "#3a3a3a" : "#BBB", marginTop: 1, fontStyle: "italic" }}>{v.style}</div>
                </div>
                {v.tag && <Tag label={v.tag} color={v.color} />}
              </div>
              <WaveAnim active={playing === v.id} color={v.color} height={18} bars={14} />
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button onClick={() => handlePreview(v)} style={{ flex: 1, background: playing === v.id ? v.color + "15" : (dark ? "#141414" : "#F0F0EB"), border: `1px solid ${playing === v.id ? v.color + "40" : border}`, borderRadius: 8, padding: "9px", color: playing === v.id ? v.color : sub, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                  {playing === v.id ? "⏹ Stop" : "▶ Preview"}
                </button>
                <button onClick={() => onUseVoice(v)} style={{ background: dark ? "#141414" : "#F0F0EB", border: `1px solid ${border}`, borderRadius: 8, padding: "9px 16px", color: sub, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Use</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {isMobile && <div style={{ height: 8 }} />}
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ onLaunchApp, dark }) {
  const isMobile = useIsMobile();
  const bg = dark ? "#060606" : "#F5F5F0";
  const text = dark ? "#E0E0E0" : "#1A1A1A";
  const sub = dark ? "#555" : "#888";
  const card = dark ? "#0A0A0A" : "#FFFFFF";
  const border = dark ? "#1E1E1E" : "#E8E8E0";

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
    { icon: "🎙", title: "23 AI Voices",        desc: "Multiple voices across 10 languages. Every accent, every style.", color: "#00FFB2" },
    { icon: "🎭", title: "Audio Tags",           desc: "Type [whispers], [excited], [pause 2s] — the voice reacts.",    color: "#E8C547" },
    { icon: "✨", title: "Script Generator",     desc: "AI writes your YouTube or podcast script in seconds.",          color: "#47B8E8" },
    { icon: "🎤", title: "Multi-Speaker",        desc: "Assign different voices to each line. Perfect for dialogues.",  color: "#E8476A" },
    { icon: "📥", title: "MP3 Downloads",        desc: "Broadcast-quality audio ready for Premiere or CapCut.",        color: "#A990F5" },
    { icon: "🌍", title: "10 Languages",         desc: "English, French, Spanish, Arabic, German, Japanese and more.", color: "#E87747" },
  ];

  const COMPARE = [
    { f: "Monthly free chars", r: "10,000",  e: "10,000", m: "10,000" },
    { f: "Pro price",          r: "$9/mo",   e: "$22/mo", m: "$29/mo" },
    { f: "Audio tags",         r: true,      e: false,    m: false    },
    { f: "Script generator",   r: true,      e: false,    m: false    },
    { f: "Multi-speaker",      r: true,      e: true,     m: true     },
    { f: "No confusing credits", r: true,    e: false,    m: false    },
    { f: "MP3 download",       r: true,      e: true,     m: true     },
  ];

  return (
    <div style={{ overflowY: "auto", height: "100%", background: bg }}>
      {/* HERO */}
      <section style={{ minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: isMobile ? "80px 18px 48px" : "100px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: "30%", width: 500, height: 500, background: `radial-gradient(circle, ${dark ? "#00FFB2" : "#47B8E8"} 0%, transparent 70%)`, opacity: 0.07, pointerEvents: "none", borderRadius: "50%", transform: "translate(-50%, -50%)" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#00FFB210", border: "1px solid #00FFB230", borderRadius: 20, padding: "5px 16px", fontSize: 10, fontWeight: 800, color: "#00FFB2", marginBottom: 24, letterSpacing: 1, textTransform: "uppercase", position: "relative", zIndex: 1 }}>
          The ElevenLabs alternative for creators
        </div>
        <h1 style={{ fontSize: isMobile ? "clamp(34px, 11vw, 52px)" : "clamp(40px, 8vw, 86px)", fontWeight: 900, lineHeight: 1.06, letterSpacing: -2, margin: "0 0 22px", maxWidth: 880, fontFamily: "Georgia, serif", position: "relative", zIndex: 1, color: text }}>
          Your words.<br />
          <span style={{ background: "linear-gradient(135deg, #00FFB2, #47B8E8, #A990F5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Any voice.</span><br />
          Zero recording.
        </h1>
        <p style={{ fontSize: isMobile ? 14 : 18, color: sub, maxWidth: 500, lineHeight: 1.8, margin: "0 0 32px", position: "relative", zIndex: 1, padding: "0 4px" }}>
          Studio-quality voiceovers in seconds. 23 voices, 10 languages, emotion control, audio tags — built for creators.
        </p>
        <div style={{ display: "flex", gap: 10, marginBottom: 48, flexWrap: "wrap", justifyContent: "center", position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>
          <button onClick={onLaunchApp} style={{ background: "linear-gradient(135deg, #00FFB2, #47B8E8)", border: "none", borderRadius: 14, padding: "14px 28px", fontWeight: 900, fontSize: 15, color: "#000", cursor: "pointer", boxShadow: "0 8px 40px #00FFB235", flex: "1 1 140px" }}>Start Creating Free</button>
          <button style={{ background: "transparent", border: `1px solid ${border}`, borderRadius: 14, padding: "14px 28px", fontWeight: 700, fontSize: 14, color: sub, cursor: "pointer", flex: "1 1 140px" }}>Hear the difference</button>
        </div>

        {/* DEMO WIDGET */}
        <div style={{ width: "100%", maxWidth: 640, position: "relative", zIndex: 1, background: card, border: `1px solid ${border}`, borderRadius: 18, overflow: "hidden", boxShadow: dark ? "0 30px 80px #00000080" : "0 30px 80px #00000015" }}>
          <div style={{ background: dark ? "#0E0E0E" : "#F8F8F5", padding: "10px 16px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 7 }}>
            {["#E8476A", "#E8C547", "#00FFB2"].map((c, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
            <span style={{ fontSize: 11, color: sub, marginLeft: 6, fontWeight: 600 }}>redacast.app — Live Demo</span>
          </div>
          <div style={{ padding: isMobile ? "14px" : 22 }}>
            <textarea value={demoText} onChange={e => setDemoText(e.target.value.slice(0, 300))}
              style={{ width: "100%", minHeight: 68, background: dark ? "#111" : "#F8F8F5", border: `1px solid ${border}`, borderRadius: 10, padding: "11px 13px", color: text, fontSize: 14, lineHeight: 1.7, resize: "none", outline: "none", fontFamily: "Georgia, serif", boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <select value={demoVoice.id} onChange={e => setDemoVoice(VOICES_DATA.find(v => v.id === e.target.value))}
                style={{ flex: 1, minWidth: 0, background: dark ? "#111" : "#F8F8F5", border: `1px solid ${border}`, borderRadius: 8, padding: "9px 10px", color: text, fontSize: isMobile ? 12 : 13, outline: "none" }}>
                {VOICES_DATA.map(v => <option key={v.id} value={v.id}>{v.name} — {v.style}</option>)}
              </select>
              <select value={demoEmotion.id} onChange={e => setDemoEmotion(EMOTIONS.find(em => em.id === e.target.value))}
                style={{ background: dark ? "#111" : "#F8F8F5", border: `1px solid ${border}`, borderRadius: 8, padding: "9px 10px", color: "#00FFB2", fontSize: isMobile ? 12 : 13, outline: "none" }}>
                {EMOTIONS.map(em => <option key={em.id} value={em.id}>{em.label}</option>)}
              </select>
            </div>
            <button onClick={handleDemo} style={{ width: "100%", marginTop: 10, padding: 13, background: demoStatus === "generating" ? (dark ? "#111" : "#EEE") : demoStatus === "playing" ? "linear-gradient(135deg, #E8476A, #E87747)" : "linear-gradient(135deg, #00FFB2, #47B8E8)", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 14, color: demoStatus === "generating" ? sub : "#000", cursor: "pointer" }}>
              {demoStatus === "generating" ? "Preparing..." : demoStatus === "playing" ? "⏹ Stop" : demoStatus === "done" ? "▶ Play Again" : "▶ Generate Voiceover"}
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: isMobile ? "52px 18px" : "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 10, color: "#00FFB2", letterSpacing: 3, fontWeight: 800, textTransform: "uppercase", marginBottom: 12 }}>What you get</div>
          <h2 style={{ fontSize: isMobile ? "clamp(22px, 7vw, 36px)" : "clamp(28px, 5vw, 52px)", fontWeight: 900, letterSpacing: -1.5, fontFamily: "Georgia, serif", color: text }}>
            Built for creators.<br /><span style={{ color: dark ? "#2a2a2a" : "#CCC" }}>Not engineers.</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(300px, 1fr))", gap: 10 }}>
          {FEATS.map((f, i) => (
            <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: isMobile ? "16px 14px" : 26 }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: f.color + "14", border: `1px solid ${f.color}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 18 : 21, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontWeight: 800, fontSize: isMobile ? 13 : 16, marginBottom: 6, color: text }}>{f.title}</div>
              <div style={{ fontSize: isMobile ? 12 : 14, color: sub, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARE */}
      <section style={{ padding: isMobile ? "40px 14px" : "80px 24px", background: dark ? "#080808" : "#EFEFEA" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 10, color: "#47B8E8", letterSpacing: 3, fontWeight: 800, textTransform: "uppercase", marginBottom: 12 }}>Why Redacast</div>
            <h2 style={{ fontSize: isMobile ? "clamp(20px, 7vw, 34px)" : "clamp(24px, 4vw, 44px)", fontWeight: 900, letterSpacing: -1, fontFamily: "Georgia, serif", color: text }}>More features.<br /><span style={{ color: dark ? "#2a2a2a" : "#CCC" }}>Half the price.</span></h2>
          </div>
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, overflow: "hidden", overflowX: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", background: dark ? "#0E0E0E" : "#F5F5F0", padding: "11px 14px", borderBottom: `1px solid ${border}`, minWidth: 300 }}>
              {["Feature", "Redacast", "ElevenLabs", "Murf"].map((h, i) => (
                <span key={i} style={{ fontSize: i === 0 ? 10 : 11, fontWeight: i === 1 ? 900 : 700, color: i === 1 ? "#00FFB2" : sub, textAlign: i > 0 ? "center" : "left" }}>{h}</span>
              ))}
            </div>
            {COMPARE.map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", padding: "10px 14px", borderBottom: i < COMPARE.length - 1 ? `1px solid ${dark ? "#0E0E0E" : "#F0F0EB"}` : "none", background: i % 2 === 0 ? "transparent" : (dark ? "#0D0D0D" : "#FAFAF8"), minWidth: 300 }}>
                <span style={{ fontSize: 12, color: sub }}>{row.f}</span>
                {[row.r, row.e, row.m].map((val, j) => (
                  <span key={j} style={{ textAlign: "center", fontSize: 13 }}>
                    {typeof val === "boolean" ? (val ? <span style={{ color: j === 0 ? "#00FFB2" : sub }}>✓</span> : <span style={{ color: dark ? "#222" : "#CCC" }}>✗</span>) : <span style={{ color: j === 0 ? "#00FFB2" : sub, fontWeight: 800, fontSize: 11 }}>{val}</span>}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: sub }}>
            Powered by <a href={AFFILIATE_LINK} target="_blank" rel="noreferrer" style={{ color: "#00FFB2", textDecoration: "none", fontWeight: 700 }}>ElevenLabs voice technology ↗</a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: isMobile ? "56px 18px" : "100px 24px", textAlign: "center", background: bg }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: isMobile ? "clamp(26px, 9vw, 44px)" : "clamp(30px, 5vw, 56px)", fontWeight: 900, letterSpacing: -2, fontFamily: "Georgia, serif", marginBottom: 14, color: text }}>Ready to find<br />your voice?</h2>
          <p style={{ color: sub, fontSize: isMobile ? 14 : 16, marginBottom: 30 }}>No credit card. No setup. Just voices, instantly.</p>
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
  const [dark, toggleDark] = useDarkMode();
  const [charsUsed, addUsage] = useCharUsage();
  const [history, addHistory, clearHistory] = useHistory();

  const NAV = [
    { id: "landing",   label: "Home",      icon: "🏠" },
    { id: "app",       label: "Studio",    icon: "🎙" },
    { id: "script",    label: "Scripts",   icon: "✨" },
    { id: "voices",    label: "Voices",    icon: "🎤" },
    { id: "pricing",   label: "Pricing",   icon: "💰" },
    { id: "history",   label: "History",   icon: "📋" },
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "settings",  label: "Settings",  icon: "⚙️" },
  ];

  const navigate = (id) => { setPage(id); setMobileMenuOpen(false); };

  const handleUseScript = (script) => { navigate("app"); };
  const handleUseVoice  = (voice)  => { navigate("app"); };
  const handleReuseHistory = (item) => { navigate("app"); };

  const bg     = dark ? "#080808" : "#F5F5F0";
  const hbg    = dark ? "#080808" : "#FFFFFF";
  const border = dark ? "#111"    : "#E8E8E0";
  const text   = dark ? "#E0E0E0" : "#1A1A1A";
  const sub    = dark ? "#444"    : "#999";

  return (
    <div style={{ width: "100%", height: "100dvh", background: bg, color: text, fontFamily: "DM Sans, Segoe UI, system-ui, sans-serif", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
        input[type=range] { -webkit-appearance: none; height: 4px; border-radius: 2px; background: #1E1E1E; cursor: pointer; outline: none; width: 100%; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #00FFB2; cursor: pointer; }
        select option { background: #111; }
        button { -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar:horizontal { display: none; }
      `}</style>

      {/* HEADER */}
      <div style={{ height: 54, padding: "0 14px", flexShrink: 0, background: hbg, borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #00FFB2, #47B8E8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🎙</div>
          <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: -0.5, color: text }}>Redacast</span>
          <div style={{ background: "#00FFB214", border: "1px solid #00FFB230", borderRadius: 5, padding: "2px 7px", fontSize: 9, fontWeight: 800, color: "#00FFB2", letterSpacing: 1 }}>BETA</div>
        </div>

        {/* DESKTOP NAV */}
        {!isMobile && (
          <div style={{ display: "flex", gap: 2 }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => navigate(n.id)} style={{ background: page === n.id ? (dark ? "#141414" : "#F0F0EB") : "transparent", border: `1px solid ${page === n.id ? border : "transparent"}`, borderRadius: 8, padding: "7px 12px", color: page === n.id ? text : sub, fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                {n.label}
                {n.id === "settings" && !apiKey && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8C547", display: "inline-block" }} />}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* DARK MODE TOGGLE */}
          <button onClick={toggleDark} style={{ background: dark ? "#141414" : "#F0F0EB", border: `1px solid ${border}`, borderRadius: 8, padding: "5px 10px", color: text, fontSize: 14, cursor: "pointer" }}>
            {dark ? "☀️" : "🌙"}
          </button>
          {!isMobile && (
            <div style={{ background: dark ? "#0D0D0D" : "#F0F0EB", border: `1px solid ${border}`, borderRadius: 8, padding: "5px 12px", fontSize: 11, color: apiKey ? "#00FFB2" : sub, fontWeight: 700 }}>
              {apiKey ? "🤖 AI Active" : "Free Plan"}
            </div>
          )}
          <div onClick={() => navigate("settings")} style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #0f2027, #203a43)", border: `1px solid ${apiKey ? "#00FFB230" : border}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 12, color: "#00FFB2", cursor: "pointer", flexShrink: 0 }}>R</div>
          {isMobile && (
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: mobileMenuOpen ? (dark ? "#141414" : "#F0F0EB") : "transparent", border: `1px solid ${mobileMenuOpen ? border : "transparent"}`, borderRadius: 8, padding: "5px 9px", color: text, fontSize: 15, cursor: "pointer", lineHeight: 1 }}>
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          )}
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {isMobile && mobileMenuOpen && (
        <div style={{ background: hbg, borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => navigate(n.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: page === n.id ? (dark ? "#141414" : "#F0F0EB") : "transparent", border: "none", padding: "13px 16px", color: page === n.id ? "#00FFB2" : sub, fontWeight: 700, fontSize: 14, cursor: "pointer", textAlign: "left" }}>
              <span>{n.icon}</span> {n.label}
              {n.id === "settings" && !apiKey && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#E8C547", display: "inline-block" }} />}
            </button>
          ))}
        </div>
      )}

      {/* PAGES */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {page === "landing"   && <LandingPage onLaunchApp={() => navigate("app")} dark={dark} />}
        {page === "app"       && <StudioPage apiKey={apiKey} onGoSettings={() => navigate("settings")} dark={dark} charsUsed={charsUsed} addUsage={addUsage} addHistory={addHistory} />}
        {page === "script"    && <ScriptGeneratorPage dark={dark} onUseScript={handleUseScript} />}
        {page === "voices"    && <VoicesPage apiKey={apiKey} onUseVoice={handleUseVoice} dark={dark} />}
        {page === "pricing"   && <PricingPage dark={dark} />}
        {page === "history"   && <HistoryPage history={history} onClearHistory={clearHistory} onReuse={handleReuseHistory} dark={dark} />}
        {page === "dashboard" && <DashboardPage apiKey={apiKey} onGoSettings={() => navigate("settings")} dark={dark} charsUsed={charsUsed} />}
        {page === "settings"  && <SettingsPage apiKey={apiKey} onSaveKey={saveApiKey} dark={dark} toggleDark={toggleDark} charsUsed={charsUsed} />}
      </div>

      {/* MOBILE BOTTOM NAV */}
      {isMobile && (
        <div style={{ height: 58, background: hbg, borderTop: `1px solid ${border}`, display: "flex", alignItems: "stretch", flexShrink: 0 }}>
          {NAV.filter(n => ["landing", "app", "script", "voices", "settings"].includes(n.id)).map(n => (
            <button key={n.id} onClick={() => navigate(n.id)} style={{ flex: 1, background: "transparent", border: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, cursor: "pointer", padding: 0, position: "relative" }}>
              {n.id === "settings" && !apiKey && <div style={{ position: "absolute", top: 8, right: "calc(50% - 12px)", width: 6, height: 6, borderRadius: "50%", background: "#E8C547" }} />}
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: page === n.id ? "#00FFB2" : sub }}>{n.label}</span>
              {page === n.id && <div style={{ position: "absolute", bottom: 0, width: 20, height: 2, borderRadius: 1, background: "#00FFB2" }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}