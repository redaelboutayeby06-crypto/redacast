export default function Waveform({ bars = 14, active = false, color = 'var(--cyan)', height = 32 }) {
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="wave-bar"
          style={{
            height: '100%',
            background: color,
            animation: active ? `wave 1.4s ease-in-out infinite` : 'none',
            animationDelay: `${i * 0.07}s`,
            transform: active ? undefined : 'scaleY(0.25)',
            opacity: active ? 1 : 0.3,
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}
        />
      ))}
    </div>
  );
}