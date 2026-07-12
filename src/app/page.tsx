import Link from "next/link";

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
      <section className="fade-up" style={{ textAlign: "center", maxWidth: 860, margin: "0 auto", padding: "6rem 24px 4rem", position: "relative" }}>
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "80%", height: "400px", background: "radial-gradient(circle, var(--teal-tint) 0%, transparent 70%)", zIndex: -1, opacity: 0.6, filter: "blur(60px)" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(225, 245, 238, 0.7)", border: "1px solid rgba(29, 158, 117, 0.2)", backdropFilter: "blur(10px)", color: "var(--teal-dark)", padding: "6px 16px", borderRadius: 999, fontSize: 14, fontWeight: 500, marginBottom: 28 }}>
          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--teal)" }}></span>
          AI-powered · Always free to start
        </div>
        <h1 style={{ fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 24px", letterSpacing: "-1.5px" }}>
          Your medical history,<br />
          <span style={{ background: "linear-gradient(135deg, var(--teal), #0A826B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>finally readable.</span>
        </h1>
        <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "var(--ink-soft)", lineHeight: 1.6, maxWidth: 640, margin: "0 auto 36px" }}>
          Upload prescriptions, bills, and lab reports. Get a clear summary — in your own language — and watch your health trends over time with our state-of-the-art AI.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/signup" className="btn" style={{ textDecoration: "none", fontSize: 16, padding: "14px 32px", borderRadius: 14, boxShadow: "0 8px 24px rgba(29, 158, 117, 0.25)" }}>Get started free</Link>
          <a href="#about" style={{ textDecoration: "none", color: "var(--ink)", background: "rgba(255, 255, 255, 0.5)", backdropFilter: "blur(10px)", border: "1px solid var(--line)", borderRadius: 14, padding: "14px 32px", fontSize: 16, fontWeight: 500, transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = "var(--surface)"} onMouseOut={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.5)"}>Learn more</a>
        </div>
      </section>

      {/* Partners Marquee */}
      <section style={{ margin: "2rem 0 4rem", overflow: "hidden" }}>
        <p style={{ textAlign: "center", fontSize: 13, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: 2, fontWeight: 600, marginBottom: 20 }}>Technology & AI Partners</p>
        <div className="marquee-container" style={{ padding: "20px 0", background: "linear-gradient(to right, transparent, rgba(29, 158, 117, 0.03) 20%, rgba(29, 158, 117, 0.03) 80%, transparent)" }}>
          <div className="marquee-content" style={{ animationDuration: "30s" }}>
            {["Google", "Microsoft", "X", "ChatGPT", "Adobe", "OpenAI", "AWS", "NVIDIA", "Meta", "Google", "Microsoft", "X", "ChatGPT", "Adobe", "OpenAI", "AWS", "NVIDIA", "Meta"].map((partner, i) => (
              <span key={`${partner}-${i}`} style={{ fontSize: 24, fontWeight: 700, color: "var(--ink-soft)", opacity: 0.6, margin: "0 40px" }}>{partner}</span>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ maxWidth: 880, margin: "0 auto", padding: "4rem 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 700, marginBottom: 20, letterSpacing: "-0.5px" }}>Why MediRecord</h2>
        <p style={{ fontSize: 18, color: "var(--ink-soft)", lineHeight: 1.8 }}>
          Patients under ongoing treatment end up with folders full of prescriptions, bills, and test reports — scattered, hard to read, often in a language they don&apos;t fully understand. Doctors get minutes to make sense of years of history. MediRecord turns that pile into a clear, searchable, translated record that patients own and doctors can trust.
        </p>
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
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.3px" }}>{f.t}</h3>
            <p style={{ color: "var(--ink-soft)", lineHeight: 1.7, fontSize: 16 }}>{f.d}</p>
          </div>
        ))}
      </section>

      {/* Hospitals Marquee */}
      <section style={{ margin: "2rem 0 5rem", overflow: "hidden" }}>
        <p style={{ textAlign: "center", fontSize: 13, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: 2, fontWeight: 600, marginBottom: 20 }}>Trusted by world-class clinics & hospitals</p>
        <div className="marquee-container" style={{ padding: "20px 0" }}>
          <div className="marquee-content" style={{ animationDuration: "40s", animationDirection: "reverse" }}>
            {["Apollo Hospitals", "Fortis Healthcare", "Max Super Speciality", "AIIMS", "Mount Sinai", "Mayo Clinic", "Cleveland Clinic", "Johns Hopkins", "Mass General", "Apollo Hospitals", "Fortis Healthcare", "Max Super Speciality", "AIIMS", "Mount Sinai", "Mayo Clinic", "Cleveland Clinic", "Johns Hopkins", "Mass General"].map((hospital, i) => (
              <span key={`${hospital}-${i}`} style={{ fontSize: 20, fontWeight: 600, color: "var(--ink)", opacity: 0.8, margin: "0 40px" }}>{hospital}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 24px 6rem" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 700, marginBottom: 40, letterSpacing: "-0.5px" }}>Loved by patients and doctors</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
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
              <p style={{ fontSize: 16, lineHeight: 1.7, marginBottom: 20, color: "var(--ink)", fontWeight: 500 }}>&quot;{t.q}&quot;</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--teal-tint)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--teal-dark)" }}>{t.n.charAt(0)}</div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{t.n}</p>
                  <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: 0 }}>{t.r}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center", padding: "5rem 24px", background: "linear-gradient(to bottom, transparent, var(--teal-tint))", borderTop: "1px solid var(--line)" }}>
        <h2 style={{ fontSize: "clamp(32px, 5vw, 42px)", fontWeight: 800, marginBottom: 20, letterSpacing: "-1px" }}>Take control of your health records</h2>
        <p style={{ fontSize: 18, color: "var(--ink-soft)", marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>Join thousands of patients and doctors experiencing the future of medical records.</p>
        <Link href="/signup" className="btn" style={{ textDecoration: "none", fontSize: 18, padding: "16px 40px", borderRadius: 14, boxShadow: "0 10px 30px rgba(29, 158, 117, 0.3)" }}>Get started for free</Link>
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