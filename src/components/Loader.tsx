export default function Loader({ size = 28, color = "#2E9E63", text }: { size?: number, color?: string, text?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
        <style>{`
          @keyframes pulse-ring { 
            0% { transform: scale(0.8); opacity: 0.8; } 
            100% { transform: scale(1.6); opacity: 0; } 
          }
          @keyframes spin-slow { 
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); } 
          }
          @keyframes pulse-core {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(0.85); opacity: 1; }
          }
        `}</style>
        {/* Outer glowing ring */}
        <div style={{ position: "absolute", inset: "-4px", border: `2px solid ${color}`, borderRadius: "50%", opacity: 0.15 }} />
        
        {/* Spinning dashed ring */}
        <div style={{ position: "absolute", inset: 0, border: `2px dashed transparent`, borderTopColor: color, borderRightColor: color, borderRadius: "50%", animation: "spin-slow 2s linear infinite", opacity: 0.7 }} />
        
        {/* Pulsing core */}
        <div style={{ position: "absolute", inset: "6px", background: color, borderRadius: "50%", animation: "pulse-core 1.5s ease-in-out infinite", boxShadow: `0 0 12px ${color}` }} />
        
        {/* Expanding sonar ring */}
        <div style={{ position: "absolute", inset: "4px", border: `2px solid ${color}`, borderRadius: "50%", animation: "pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite" }} />
      </div>
      {text && <span style={{ fontSize: 16, fontWeight: 700, color: color, letterSpacing: 0.3 }}>{text}</span>}
    </div>
  );
}
