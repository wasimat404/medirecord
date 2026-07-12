import Link from "next/link";
import Image from "next/image";

/* Inline SVG brand icons — no external CDN needed, always loads */
const brandIcons: Record<string, React.ReactNode> = {
  Google: (
    <svg viewBox="0 0 24 24" width="32" height="32"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.94 10.94 0 0 0 1 12c0 1.77.42 3.44 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
  ),
  Microsoft: (
    <svg viewBox="0 0 24 24" width="32" height="32"><path fill="#F25022" d="M1 1h10v10H1z"/><path fill="#7FBA00" d="M13 1h10v10H13z"/><path fill="#00A4EF" d="M1 13h10v10H1z"/><path fill="#FFB900" d="M13 13h10v10H13z"/></svg>
  ),
  X: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="#000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  ),
  ChatGPT: (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="#10A37F"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.998 5.998 0 0 0-3.998 2.9 6.042 6.042 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg>
  ),
  Adobe: (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="#FF0000"><path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm6.232 0H24v21.248z"/></svg>
  ),
  OpenAI: (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="#412991"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.998 5.998 0 0 0-3.998 2.9 6.042 6.042 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg>
  ),
  AWS: (
    <svg viewBox="0 0 24 24" width="32" height="32"><path fill="#FF9900" d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.374 6.18 6.18 0 0 1-.248-.467c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103a6.395 6.395 0 0 0-.862.279 2.288 2.288 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167 4.648 4.648 0 0 1 1.005-.36 4.748 4.748 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.343c0-.136.068-.208.2-.208h.783c.152 0 .256.024.32.08.063.048.112.16.16.311l1.342 5.284 1.245-5.284c.04-.16.088-.263.152-.311a.533.533 0 0 1 .32-.08h.638c.152 0 .256.024.32.08.063.048.12.16.152.311l1.261 5.348 1.381-5.348c.048-.16.104-.263.168-.311a.517.517 0 0 1 .32-.08h.743c.136 0 .208.064.208.208 0 .04-.008.08-.016.128a1.137 1.137 0 0 1-.056.216l-1.923 6.17c-.048.16-.104.263-.168.312a.517.517 0 0 1-.32.08h-.687c-.152 0-.256-.024-.32-.08-.063-.056-.12-.16-.152-.32l-1.237-5.141-1.23 5.133c-.04.168-.088.272-.152.328-.064.048-.176.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.216-.151-.248-.223a.567.567 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024s.12.048.2.08c.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.415-.287-.806-.414l-1.158-.367c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.176 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.694 0 .223.08.415.24.567.159.152.454.303.878.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.742.167-1.142.167z"/><path fill="#FF9900" d="M21.214 16.71c-2.677 1.976-6.559 3.023-9.898 3.023-4.681 0-8.9-1.732-12.091-4.613-.248-.224-.024-.535.28-.36 3.445 2.007 7.706 3.214 12.107 3.214 2.966 0 6.231-.614 9.233-1.892.455-.191.83.303.37.628z"/><path fill="#FF9900" d="M22.268 15.49c-.344-.44-2.247-.208-3.103-.104-.263.032-.303-.2-.064-.367 1.518-1.07 4.013-.758 4.302-.4.288.367-.08 2.891-1.502 4.098-.216.184-.423.088-.327-.152.32-.79 1.037-2.639.694-3.075z"/></svg>
  ),
  NVIDIA: (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="#76B900"><path d="M8.948 8.798v-1.43a6.7 6.7 0 0 1 .424-.018c3.922-.124 6.417 3.394 6.417 3.394s-2.745 3.753-5.642 3.753a4.159 4.159 0 0 1-1.2-.18v-4.794l-.003-.015c.005-.164.085-1.098 1.2-1.098 1.204 0 1.16 1.399 1.16 1.399l2.28-1.553s-1.477-2.618-3.89-2.618c-1.222 0-2.57.635-3.223 1.552V6.35c.394-.048.8-.072 1.2-.072 5.17 0 8.49 4.134 8.49 4.134s-3.703 5.09-7.445 5.09a6.03 6.03 0 0 1-2.248-.434V5.413c-.72.092-1.4.223-2.047.39v12.36A13.95 13.95 0 0 1 2 17.11v-2.063s.64.397 1.623.667V6.116c-.574.22-1.12.48-1.623.784V4.874c2.71-1.712 5.7-1.818 5.7-1.818s-1.564 3.39-1.564 3.39v.018a6.42 6.42 0 0 1 2.812 2.334zm14.243-.5l.809-1.07V22.5h-2.28v-10.22l-1.2 1.558V22.5h-2.282v-8.14l-1.2 1.6V22.5h-2.28V6.35h2.28v8.082L18.44 12.5V6.35h2.28v4.38l1.2-1.534V6.35h1.272z"/></svg>
  ),
  Meta: (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="#0081FB"><path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a4.892 4.892 0 0 0 .703 1.728c.32.45.763.839 1.35 1.082.585.244 1.207.37 1.89.37 1.464 0 2.86-.625 4.122-1.77.896-.81 1.727-1.904 2.489-3.292.004.022.032.152.083.397l.138.618.107.436.149.544.064.21c.659 2.072 1.736 3.556 3.158 3.556.677 0 1.296-.127 1.878-.366.588-.243 1.033-.632 1.355-1.084.321-.453.558-.96.703-1.73.139-.604.209-1.267.209-1.972 0-2.566-.703-5.24-2.044-7.306C15.135 5.31 13.42 4.03 11.453 4.03c-1.566 0-2.823.56-3.817 1.487-.142-.127-.287-.254-.436-.38-.508-.426-1.142-.82-1.857-1.006a4.89 4.89 0 0 0-1.25-.1zm7.594 2.39c1.262.011 2.434.96 3.372 2.46 1.08 1.728 1.69 4.012 1.69 6.204 0 .543-.053 1.054-.156 1.496a2.198 2.198 0 0 1-.327.793c-.12.168-.259.254-.449.333-.186.077-.44.127-.722.127-.618 0-1.2-.399-1.69-1.26a11.877 11.877 0 0 1-.426-.887l-.117-.287-.202-.527-.085-.239-.158-.472-.117-.373a65.362 65.362 0 0 1-.139-.481 2.63 2.63 0 0 0-.076-.254c-.103-.338-.21-.523-.325-.666a.51.51 0 0 0-.138-.122.392.392 0 0 0-.162-.04h-.005c-.044.003-.088.018-.156.058a.72.72 0 0 0-.178.175c-.148.193-.29.478-.444.896-.06.16-.134.38-.218.645l-.065.2c-.268.853-.535 1.86-.885 2.853-.397 1.123-.87 2.128-1.462 2.879-1.022 1.3-2.138 1.957-3.243 1.957-.426 0-.795-.062-1.077-.182a1.354 1.354 0 0 1-.59-.466 2.21 2.21 0 0 1-.33-.793 5.603 5.603 0 0 1-.155-1.496c0-2.192.61-4.476 1.69-6.204.938-1.5 2.11-2.449 3.372-2.46h.024z"/></svg>
  ),
};

/* Hospital badge with a medical cross icon + name */
const hospitalNames = [
  "Apollo Hospitals", "Fortis Healthcare", "Max Healthcare", "AIIMS",
  "Mount Sinai", "Mayo Clinic", "Cleveland Clinic", "Johns Hopkins", "Mass General",
  // Duplicate for seamless marquee loop
  "Apollo Hospitals", "Fortis Healthcare", "Max Healthcare", "AIIMS",
  "Mount Sinai", "Mayo Clinic", "Cleveland Clinic", "Johns Hopkins", "Mass General",
];

const techPartners = ["Google", "Microsoft", "X", "ChatGPT", "Adobe", "OpenAI", "AWS", "NVIDIA", "Meta",
  "Google", "Microsoft", "X", "ChatGPT", "Adobe", "OpenAI", "AWS", "NVIDIA", "Meta"];

const TechLogo = ({ name }: { name: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "0 50px", flexShrink: 0 }}>
    {brandIcons[name]}
    <span style={{ fontSize: 28, fontWeight: 800, color: "var(--ink)", opacity: 0.85, letterSpacing: "-1px", whiteSpace: "nowrap" }}>{name}</span>
  </div>
);

const HospitalLogo = ({ name }: { name: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "0 50px", flexShrink: 0 }}>
    <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, var(--teal-tint), #d4f0e7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(29,158,117,0.12)" }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--teal-dark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </div>
    <span style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", opacity: 0.8, letterSpacing: "-0.5px", whiteSpace: "nowrap" }}>{name}</span>
  </div>
);

export default function Landing() {
  return (
    <main style={{ fontFamily: "var(--font-outfit), ui-sans-serif, system-ui, sans-serif", color: "var(--ink)", overflowX: "hidden" }}>
      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1200, margin: "0 auto", padding: "18px 24px", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, var(--teal), var(--teal-dark))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 18, boxShadow: "0 4px 12px rgba(29, 158, 117, 0.3)" }}>M</div>
          <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: "-0.5px" }}>MediRecord</span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/login" style={{ color: "var(--ink)", fontWeight: 500, textDecoration: "none", fontSize: 15, padding: "8px 12px", transition: "color 0.2s" }}>Log in</Link>
          <Link href="/signup" className="btn" style={{ textDecoration: "none", padding: "10px 20px", fontSize: 15, borderRadius: 12, boxShadow: "0 4px 14px rgba(29, 158, 117, 0.2)" }}>Sign up</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="fade-up" style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 24px 2rem", position: "relative", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 40 }}>
        <div style={{ flex: "1 1 500px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(225, 245, 238, 0.7)", border: "1px solid rgba(29, 158, 117, 0.2)", backdropFilter: "blur(10px)", color: "var(--teal-dark)", padding: "6px 16px", borderRadius: 999, fontSize: 14, fontWeight: 500, marginBottom: 28 }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--teal)" }}></span>
            AI-powered · Always free to start
          </div>
          <h1 style={{ fontSize: "clamp(48px, 6vw, 72px)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 24px", letterSpacing: "-2px" }}>
            Your medical history,<br />
            <span style={{ background: "linear-gradient(135deg, var(--teal), #0A826B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>finally readable.</span>
          </h1>
          <p style={{ fontSize: "clamp(18px, 2vw, 22px)", color: "var(--ink-soft)", lineHeight: 1.6, maxWidth: 540, margin: "0 0 36px" }}>
            Upload prescriptions, bills, and lab reports. Get a clear summary — in your own language — and watch your health trends over time with our state-of-the-art AI.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link href="/signup" className="btn" style={{ textDecoration: "none", fontSize: 16, padding: "14px 32px", borderRadius: 14, boxShadow: "0 8px 24px rgba(29, 158, 117, 0.25)" }}>Get started free</Link>
            <a href="#about" className="btn-outline" style={{ textDecoration: "none", backdropFilter: "blur(10px)", border: "1px solid var(--line)", borderRadius: 14, padding: "14px 32px", fontSize: 16, fontWeight: 500, transition: "background 0.2s" }}>Learn more</a>
          </div>
        </div>
        
        <div style={{ flex: "1 1 400px", position: "relative" }}>
           <div style={{ position: "absolute", top: -20, right: -20, width: "100%", height: "100%", background: "radial-gradient(circle, var(--teal-tint) 0%, transparent 70%)", zIndex: -1, opacity: 0.8, filter: "blur(40px)" }} />
           <div style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 60px rgba(15, 110, 86, 0.15)", border: "1px solid var(--line)", position: "relative", height: 500 }}>
             <Image src="/images/hero.jpg" alt="Doctor and patient reviewing records" fill style={{ objectFit: "cover" }} priority />
           </div>
        </div>
      </section>

      {/* Partners Marquee */}
      <section style={{ margin: "4rem 0", overflow: "hidden" }}>
        <p style={{ textAlign: "center", fontSize: 14, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, marginBottom: 30 }}>Technology & AI Partners</p>
        <div className="marquee-container" style={{ padding: "30px 0", background: "linear-gradient(to right, transparent, rgba(29, 158, 117, 0.04) 20%, rgba(29, 158, 117, 0.04) 80%, transparent)" }}>
          <div className="marquee-content" style={{ animationDuration: "35s" }}>
            {techPartners.map((name, i) => (
              <TechLogo key={`${name}-${i}`} name={name} />
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 60 }}>
        <div style={{ flex: "1 1 400px", position: "relative", height: 400, borderRadius: 24, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.05)" }}>
           <Image src="/images/abstract.jpg" alt="Abstract technology background" fill style={{ objectFit: "cover" }} />
           <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent, rgba(255,255,255,0.2))" }} />
        </div>
        <div style={{ flex: "1 1 500px" }}>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 42px)", fontWeight: 800, marginBottom: 24, letterSpacing: "-1px" }}>Why MediRecord?</h2>
          <p style={{ fontSize: 20, color: "var(--ink-soft)", lineHeight: 1.8, marginBottom: 20 }}>
            Patients under ongoing treatment end up with folders full of prescriptions, bills, and test reports — scattered, hard to read, often in a language they don&apos;t fully understand. 
          </p>
          <p style={{ fontSize: 20, color: "var(--ink-soft)", lineHeight: 1.8 }}>
            Doctors get minutes to make sense of years of history. MediRecord turns that pile into a clear, searchable, translated record that patients own and doctors can trust.
          </p>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 24px 5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        {[
          { t: "Reads anything", d: "Handwritten prescriptions, lab PDFs, pharmacy bills — our cutting-edge AI pulls out what matters with pinpoint accuracy." },
          { t: "In your language", d: "Summaries seamlessly translated into Bengali, Tamil, Hindi, and more, empowering you to understand your own health." },
          { t: "See the trend", d: "Sugar, blood pressure, cholesterol, and more, tracked over months — surfacing vital patterns a doctor can read in seconds." },
        ].map((f) => (
          <div key={f.t} className="card card-hover" style={{ padding: "2.5rem", borderRadius: 20, background: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(10px)" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, var(--teal-tint), #c3eadd)", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 2px 4px rgba(255,255,255,0.8)" }}>
              <span style={{ color: "var(--teal-dark)", fontSize: 24 }}>✦</span>
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.5px" }}>{f.t}</h3>
            <p style={{ color: "var(--ink-soft)", lineHeight: 1.7, fontSize: 17 }}>{f.d}</p>
          </div>
        ))}
      </section>

      {/* Hospitals Marquee */}
      <section style={{ margin: "2rem 0 5rem", overflow: "hidden" }}>
        <p style={{ textAlign: "center", fontSize: 14, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, marginBottom: 30 }}>Trusted by world-class clinics & hospitals</p>
        <div className="marquee-container" style={{ padding: "20px 0" }}>
          <div className="marquee-content" style={{ animationDuration: "45s", animationDirection: "reverse" }}>
            {hospitalNames.map((name, i) => (
              <HospitalLogo key={`${name}-${i}`} name={name} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 24px 6rem" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(32px, 5vw, 42px)", fontWeight: 800, marginBottom: 50, letterSpacing: "-1px" }}>Loved by patients and doctors</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24 }}>
          {[
            { q: "I finally understand my own reports. The Bengali summaries made my mother cry — she gets her own health now.", n: "Ananya", r: "Patient" },
            { q: "Seeing three years of a patient's sugar trend in one glance changed how I consult. This saves real time and saves lives.", n: "Dr. Rao", r: "Endocrinologist" },
            { q: "No more carrying a fat folder to every appointment. It's all just there, perfectly organized. Highly recommend this.", n: "Imran", r: "Patient" },
            { q: "The AI's ability to read handwritten notes is unbelievable. It picks up dosages I sometimes miss myself.", n: "Dr. Sharma", r: "General Physician" },
            { q: "My father has 5 different doctors. MediRecord keeps them all on the same page. It's been a total gamechanger for our family.", n: "Priya", r: "Caregiver" },
            { q: "Integrating this into our clinic workflow reduced our administrative overhead by 40%. It's phenomenal.", n: "Dr. Patel", r: "Clinic Director" },
          ].map((t, i) => (
            <div key={i} className="card card-hover" style={{ padding: "2rem", borderRadius: 20, background: "rgba(255, 255, 255, 0.8)" }}>
              <div style={{ display: "flex", gap: 4, color: "#FFB800", marginBottom: 16 }}>
                {"★★★★★".split("").map((star, i) => <span key={i}>{star}</span>)}
              </div>
              <p style={{ fontSize: 17, lineHeight: 1.7, marginBottom: 24, color: "var(--ink)", fontWeight: 500 }}>&quot;{t.q}&quot;</p>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--teal-tint)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--teal-dark)", fontSize: 20 }}>{t.n.charAt(0)}</div>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{t.n}</p>
                  <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: 0 }}>{t.r}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center", padding: "6rem 24px", background: "linear-gradient(to bottom, transparent, var(--teal-tint))", borderTop: "1px solid var(--line)" }}>
        <h2 style={{ fontSize: "clamp(36px, 5vw, 48px)", fontWeight: 800, marginBottom: 24, letterSpacing: "-1px" }}>Take control of your health records</h2>
        <p style={{ fontSize: 20, color: "var(--ink-soft)", marginBottom: 40, maxWidth: 600, margin: "0 auto 40px" }}>Join thousands of patients and doctors experiencing the future of medical records.</p>
        <Link href="/signup" className="btn" style={{ textDecoration: "none", fontSize: 18, padding: "18px 48px", borderRadius: 16, boxShadow: "0 10px 30px rgba(29, 158, 117, 0.3)", fontWeight: 600 }}>Get started for free</Link>
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--surface)", padding: "40px 24px", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
             <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12 }}>M</div>
             <span style={{ fontWeight: 700, fontSize: 16 }}>MediRecord</span>
          </div>
          <div style={{ color: "var(--ink-soft)", fontSize: 14 }}>
            © 2026 MediRecord. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}