import Link from "next/link";

export default function SignupChoice() {
  return (
    <main style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 620, margin: "0 auto", padding: "3rem 1.25rem", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`
        @keyframes suUp { from { opacity:0; transform:translateY(22px) scale(.96); } to { opacity:1; transform:translateY(0) scale(1); } }
        .su-in { animation: suUp .75s cubic-bezier(.22,1,.36,1) both; }
        .su-card {
          background: rgba(255,255,255,.68);
          backdrop-filter: blur(16px) saturate(150%);
          -webkit-backdrop-filter: blur(16px) saturate(150%);
          border: 1px solid rgba(255,255,255,.75);
          border-radius: 24px;
          box-shadow: 0 8px 30px rgba(15,110,86,.08), inset 0 1px 0 rgba(255,255,255,.7);
          transition: transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s cubic-bezier(.22,1,.36,1);
        }
        .su-card:hover { transform: translateY(-9px) scale(1.018); box-shadow: 0 26px 55px rgba(15,110,86,.16), inset 0 1px 0 rgba(255,255,255,.8); }
        .su-orb { transition: transform .5s cubic-bezier(.22,1,.36,1); }
        .su-card:hover .su-orb { transform: translateY(-5px) scale(1.07); }
        .su-blob { position:absolute; border-radius:50%; filter: blur(70px); opacity:.5; z-index:-1; pointer-events:none; }
        @media (prefers-reduced-motion: reduce) { .su-in, .su-card, .su-orb { animation:none; transition:none; } }
      `}</style>

      <div className="su-blob" style={{ width: 340, height: 340, background: "#9FE1CB", top: -60, left: -40 }} />
      <div className="su-blob" style={{ width: 320, height: 320, background: "#B5D4F4", bottom: -40, right: -30 }} />

      <div className="su-in" style={{ textAlign: "center", marginBottom: 38 }}>
        <span style={{ width: 46, height: 46, borderRadius: 13, background: "linear-gradient(145deg,#5DCAA5,#0F6E56)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 22, marginBottom: 18, boxShadow: "0 8px 18px rgba(29,158,117,.4), inset 0 1px 2px rgba(255,255,255,.5)" }}>M</span>
        <h1 style={{ fontSize: 28, fontWeight: 600, margin: "0 0 8px" }}>Welcome to MediRecord</h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 15.5 }}>How would you like to get started?</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
        <Link href="/signup/patient" className="su-card su-in" style={{ textDecoration: "none", color: "inherit", padding: "2.25rem 1.5rem", textAlign: "center", animationDelay: ".1s" }}>
          <div className="su-orb" style={{ width: 78, height: 78, borderRadius: "50%", background: "radial-gradient(circle at 32% 28%, #7FE0C2, #1D9E75 58%, #0F6E56)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 18, boxShadow: "0 12px 26px rgba(29,158,117,.42), inset 0 3px 7px rgba(255,255,255,.55), inset 0 -7px 14px rgba(15,110,86,.45)" }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          </div>
          <p style={{ fontWeight: 600, fontSize: 18.5, margin: "0 0 7px" }}>I&apos;m a patient</p>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.55, margin: "0 0 18px" }}>Organize my reports and understand them in my language.</p>
          <span style={{ color: "var(--teal-dark)", fontWeight: 600, fontSize: 14.5 }}>Sign up &rarr;</span>
        </Link>

        <Link href="/signup/doctor" className="su-card su-in" style={{ textDecoration: "none", color: "inherit", padding: "2.25rem 1.5rem", textAlign: "center", animationDelay: ".22s" }}>
          <div className="su-orb" style={{ width: 78, height: 78, borderRadius: "50%", background: "radial-gradient(circle at 32% 28%, #A5CBF0, #378ADD 58%, #185FA5)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 18, boxShadow: "0 12px 26px rgba(55,138,221,.42), inset 0 3px 7px rgba(255,255,255,.55), inset 0 -7px 14px rgba(24,95,165,.45)" }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4M8 6a4 4 0 0 0 8 0V2" /><path d="M6 6v4a6 6 0 0 0 12 0V6" /><circle cx="20" cy="14" r="2" /><path d="M20 16v1a6 6 0 0 1-12 0v-1" /></svg>
          </div>
          <p style={{ fontWeight: 600, fontSize: 18.5, margin: "0 0 7px" }}>I&apos;m a doctor</p>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.55, margin: "0 0 18px" }}>Access a patient&apos;s history using their unique ID.</p>
          <span style={{ color: "#185FA5", fontWeight: 600, fontSize: 14.5 }}>Sign up &rarr;</span>
        </Link>
      </div>

      <p style={{ textAlign: "center", marginTop: 32, fontSize: 14, color: "var(--ink-soft)" }}>
        Already have an account? <Link href="/login" style={{ color: "var(--teal-dark)", fontWeight: 600 }}>Log in</Link>
      </p>
    </main>
  );
}