const GREEN = "#3DA672", GREEN_DEEP = "#2E9E63", TEAL = "#1FAE94", INK = "#22332C", MUTE = "#6B7C74", LINE = "#DCEAE3";

const NAMES: Record<string, string> = { bn: "বাংলা", hi: "हिन्दी", ta: "தமிழ்", te: "తెలుగు", mr: "मराठी", gu: "ગુજરાતી", kn: "ಕನ್ನಡ", ml: "മലയാളം", pa: "ਪੰਜਾਬੀ", ur: "اردو", or: "ଓଡ଼ିଆ", as: "অসমীয়া", en: "English" };

export default function TranslateBot({ headline, summary, lang }: { headline: string; summary: string | null; lang: string }) {
  const langName = NAMES[lang] || lang.toUpperCase();

  return (
    <div style={{ background: "linear-gradient(135deg,#EAF7F0 0%,#DCF1E7 100%)", border: `1px solid ${LINE}`, borderRadius: 16, padding: "20px 22px", flex: 1, display: "flex", flexDirection: "column", minHeight: 210 }}>
      <style>{`
        @keyframes mbFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes mbPulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes mbBlink{0%,92%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
        @keyframes mbBeat{0%,100%{transform:scale(1)}15%{transform:scale(1.18)}30%{transform:scale(1)}45%{transform:scale(1.12)}60%{transform:scale(1)}}
        .mb-bot{animation:mbFloat 3.2s ease-in-out infinite}
        .mb-dot{animation:mbPulse 1.6s ease-in-out infinite}
        .mb-eye{animation:mbBlink 4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
        .mb-heart{animation:mbBeat 2.2s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
        @media (prefers-reduced-motion:reduce){.mb-bot,.mb-dot,.mb-eye,.mb-heart{animation:none}}
      `}</style>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1, color: MUTE, textTransform: "uppercase" }}>Your report, explained</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: GREEN_DEEP, background: "#fff", borderRadius: 999, padding: "2px 10px" }}>in {langName}</span>
      </div>

      <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap", flex: 1 }}>
        <svg className="mb-bot" width="116" height="130" viewBox="0 0 140 150" style={{ flexShrink: 0 }} role="img" aria-label="Friendly medical assistant robot">
          <line x1="70" y1="32" x2="70" y2="16" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
          <circle className="mb-dot" cx="70" cy="13" r="5" fill={TEAL} />
          <rect x="28" y="88" width="11" height="26" rx="5.5" fill="#fff" stroke={GREEN} strokeWidth="2.5" />
          <rect x="101" y="88" width="11" height="26" rx="5.5" fill="#fff" stroke={GREEN} strokeWidth="2.5" />
          <rect x="63" y="74" width="14" height="9" fill={GREEN} />
          <rect x="40" y="32" width="60" height="46" rx="15" fill="#fff" stroke={GREEN} strokeWidth="2.5" />
          <rect x="48" y="41" width="44" height="27" rx="10" fill="#14463A" />
          <rect className="mb-eye" x="57" y="49" width="8" height="11" rx="4" fill="#6FE3C4" />
          <rect className="mb-eye" x="75" y="49" width="8" height="11" rx="4" fill="#6FE3C4" />
          <rect x="44" y="82" width="52" height="46" rx="15" fill="#DCF1E4" stroke={GREEN} strokeWidth="2.5" />
          <path className="mb-heart" d="M70 114 C66 110 60 106 60 101 C60 97 64 95 67 97 C68.5 98 70 100 70 100 C70 100 71.5 98 73 97 C76 95 80 97 80 101 C80 106 74 110 70 114 Z" fill={GREEN} />
        </svg>

        <div style={{ flex: 1, minWidth: 190, background: "#fff", borderRadius: 14, padding: "15px 17px", position: "relative" }}>
          <span style={{ position: "absolute", left: -7, top: 26, width: 0, height: 0, borderTop: "7px solid transparent", borderBottom: "7px solid transparent", borderRight: "8px solid #fff" }} />
          <h3 dir="auto" style={{ fontSize: 17, fontWeight: 600, margin: 0, color: INK, fontFamily: "Georgia, serif", lineHeight: 1.4 }}>{headline}</h3>
          <p dir="auto" style={{ fontSize: 13.5, color: "#3D4B45", margin: "9px 0 0", lineHeight: 1.6 }}>
            {summary || `Upload a report and I'll explain it to you here in ${langName}.`}
          </p>
        </div>
      </div>
    </div>
  );
}