import Link from "next/link";
import Image from "next/image";

// Placeholder SVG icons for Tech Partners
const TechLogo = ({ name }: { name: string }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "0 50px" }}>
      <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--teal-tint)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--teal-dark)", fontWeight: 800, fontSize: 20 }}>
        {name.charAt(0)}
      </div>
      <span style={{ fontSize: 32, fontWeight: 800, color: "var(--ink)", opacity: 0.8, letterSpacing: "-1px" }}>{name}</span>
    </div>
  );
};

// Placeholder SVG icons for Hospitals
const HospitalLogo = ({ name }: { name: string }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "0 50px" }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        <path d="M12 8v8M8 12h8" />
      </svg>
      <span style={{ fontSize: 28, fontWeight: 700, color: "var(--ink-soft)", letterSpacing: "-0.5px" }}>{name}</span>
    </div>
  );
};

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
            {["Google", "Microsoft", "X", "ChatGPT", "Adobe", "OpenAI", "AWS", "NVIDIA", "Meta", "Google", "Microsoft", "X", "ChatGPT", "Adobe", "OpenAI", "AWS", "NVIDIA", "Meta"].map((partner, i) => (
              <TechLogo key={`${partner}-${i}`} name={partner} />
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
            {["Apollo Hospitals", "Fortis Healthcare", "Max Super Speciality", "AIIMS", "Mount Sinai", "Mayo Clinic", "Cleveland Clinic", "Johns Hopkins", "Mass General", "Apollo Hospitals", "Fortis Healthcare", "Max Super Speciality", "AIIMS", "Mount Sinai", "Mayo Clinic", "Cleveland Clinic", "Johns Hopkins", "Mass General"].map((hospital, i) => (
              <HospitalLogo key={`${hospital}-${i}`} name={hospital} />
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