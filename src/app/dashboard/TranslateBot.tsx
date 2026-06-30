const GREEN = "#3DA672", GREEN_DEEP = "#2E9E63", TEAL = "#1FAE94", INK = "#22332C", MUTE = "#6B7C74", LINE = "#DCEAE3";

const NAMES: Record<string, string> = { bn: "বাংলা", hi: "हिन्दी", ta: "தமிழ்", te: "తెలుగు", mr: "मराठी", gu: "ગુજરાતી", kn: "ಕನ್ನಡ", ml: "മലയാളം", pa: "ਪੰਜਾਬੀ", ur: "اردو", or: "ଓଡ଼ିଆ", as: "অসমীয়া", en: "English" };

export default function TranslateBot({ headline, summary, lang }: { headline: string; summary: string | null; lang: string }) {
  const langName = NAMES[lang] || lang.toUpperCase();

  return (
    <div style={{ background: "linear-gradient(145deg, #0D2B22 0%, #153E31 100%)", border: `1px solid rgba(61,166,114,0.3)`, borderRadius: 26, padding: "24px 26px", flex: 1, display: "flex", flexDirection: "column", minHeight: 210, position: "relative", overflow: "hidden", boxShadow: "0 20px 40px rgba(13, 43, 34, 0.15)" }}>
      <style>{`
        @keyframes mbFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes mbPulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes mbBlink{0%,92%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
        @keyframes mbBeat{0%,100%{transform:scale(1)}15%{transform:scale(1.18)}30%{transform:scale(1)}45%{transform:scale(1.12)}60%{transform:scale(1)}}
        @keyframes aiGlow{0%{transform:scale(1);opacity:0.4}100%{transform:scale(1.4);opacity:0.6}}
        .mb-bot{animation:mbFloat 3.5s ease-in-out infinite; filter: drop-shadow(0 10px 15px rgba(61,166,114,0.2))}
        .mb-dot{animation:mbPulse 1.6s ease-in-out infinite}
        .mb-eye{animation:mbBlink 4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
        .mb-heart{animation:mbBeat 2.2s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
        .ai-bg { position: absolute; top: -50px; left: -50px; width: 250px; height: 250px; background: radial-gradient(circle, rgba(61,166,114,0.25) 0%, transparent 60%); animation: aiGlow 4s infinite alternate; pointer-events: none; }
        .glass-bubble { background: rgba(255, 255, 255, 0.06); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; position: relative; }
        .glass-bubble::after { content: ''; position: absolute; left: -8px; top: 28px; width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-right: 8px solid rgba(255, 255, 255, 0.08); }
        @media (prefers-reduced-motion:reduce){.mb-bot,.mb-dot,.mb-eye,.mb-heart,.ai-bg{animation:none}}
      `}</style>

      <div className="ai-bg" />

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, position: "relative", zIndex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 800, color: "#B8C9C2", letterSpacing: 1.5, margin: "0 0 10px", textTransform: "uppercase" }}>
          🤖 AI MEDICAL ASSISTANT
        </p>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#0D2B22", background: "#8CE6BD", borderRadius: 999, padding: "3px 12px", boxShadow: "0 0 10px rgba(140,230,189,0.3)" }}>in {langName}</span>
      </div>

      <div style={{ display: "flex", gap: 22, alignItems: "center", flexWrap: "wrap", flex: 1, position: "relative", zIndex: 1 }}>
        <svg className="mb-bot" width="124" height="138" viewBox="0 0 140 150" style={{ flexShrink: 0 }} role="img" aria-label="Friendly medical assistant robot">
          <line x1="70" y1="32" x2="70" y2="16" stroke="#8CE6BD" strokeWidth="3.5" strokeLinecap="round" />
          <circle className="mb-dot" cx="70" cy="12" r="6" fill="#4BECD6" />
          <rect x="26" y="88" width="12" height="28" rx="6" fill="rgba(255,255,255,0.1)" stroke="#8CE6BD" strokeWidth="2.5" />
          <rect x="102" y="88" width="12" height="28" rx="6" fill="rgba(255,255,255,0.1)" stroke="#8CE6BD" strokeWidth="2.5" />
          <rect x="63" y="74" width="14" height="10" fill="#8CE6BD" />
          <rect x="40" y="32" width="60" height="46" rx="16" fill="rgba(255,255,255,0.05)" stroke="#8CE6BD" strokeWidth="2.5" />
          <rect x="48" y="41" width="44" height="27" rx="10" fill="#081A14" />
          <rect className="mb-eye" x="56" y="49" width="9" height="11" rx="4.5" fill="#4BECD6" />
          <rect className="mb-eye" x="75" y="49" width="9" height="11" rx="4.5" fill="#4BECD6" />
          <rect x="42" y="82" width="56" height="50" rx="18" fill="rgba(61,166,114,0.15)" stroke="#8CE6BD" strokeWidth="2.5" />
          <path className="mb-heart" d="M70 116 C66 112 60 108 60 103 C60 99 64 97 67 99 C68.5 100 70 102 70 102 C70 102 71.5 100 73 99 C76 97 80 99 80 103 C80 108 74 112 70 116 Z" fill="#FF5C77" />
        </svg>

        <div className="glass-bubble" style={{ flex: 1, minWidth: 200, padding: "18px 22px" }}>
          <h3 dir="auto" style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#ffffff", lineHeight: 1.4, letterSpacing: 0.3 }}>{headline}</h3>
          <p style={{ fontSize: 18, color: "#E5EFE9", margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
            {summary || (lang === "en" ? "Upload a medical record and I'll break it down into plain English for you." : "Upload a medical record and I will translate the complex medical terms for you.")}
          </p>
        </div>
      </div>
    </div>
  );
}