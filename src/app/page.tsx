import Link from "next/link";

export default function Landing() {
  return (
    <main style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif", color: "var(--ink)" }}>
      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1080, margin: "0 auto", padding: "18px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ width: 30, height: 30, borderRadius: 8, background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }}>M</span>
          <span style={{ fontWeight: 600, fontSize: 18 }}>MediRecord</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link href="/login" style={{ color: "var(--ink-soft)", textDecoration: "none", fontSize: 14, padding: "8px 12px" }}>Log in</Link>
          <Link href="/signup" className="btn" style={{ textDecoration: "none", padding: "9px 18px", fontSize: 14 }}>Sign up</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="fade-up" style={{ textAlign: "center", maxWidth: 760, margin: "0 auto", padding: "4rem 24px 3rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--teal-tint)", color: "var(--teal-dark)", padding: "5px 14px", borderRadius: 999, fontSize: 13, marginBottom: 22 }}>
          AI-powered · free to start
        </div>
        <h1 style={{ fontSize: 44, fontWeight: 600, lineHeight: 1.15, margin: "0 0 18px" }}>
          Your medical history,<br />finally readable.
        </h1>
        <p style={{ fontSize: 18, color: "var(--ink-soft)", lineHeight: 1.6, maxWidth: 540, margin: "0 auto 28px" }}>
          Upload prescriptions, bills, and lab reports. Get a clear summary — in your own language — and watch your health trends over time.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/signup" className="btn" style={{ textDecoration: "none", fontSize: 16, padding: "13px 26px" }}>Get started free</Link>
          <a href="#about" style={{ textDecoration: "none", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: 10, padding: "13px 26px", fontSize: 16 }}>Learn more</a>
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ maxWidth: 820, margin: "0 auto", padding: "3rem 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 14 }}>Why MediRecord</h2>
        <p style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.7 }}>
          Patients under ongoing treatment end up with folders full of prescriptions, bills, and test reports — scattered, hard to read, often in a language they don't fully understand. Doctors get minutes to make sense of years of history. MediRecord turns that pile into a clear, searchable, translated record that patients own and doctors can trust.
        </p>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "2rem 24px 3rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
        {[
          { t: "Reads anything", d: "Handwritten prescriptions, lab PDFs, pharmacy bills — our AI pulls out what matters." },
          { t: "In your language", d: "Summaries translated into Bengali, Tamil, Hindi, and more, so you understand your own health." },
          { t: "See the trend", d: "Sugar, blood pressure and more, tracked over months — patterns a doctor can read in seconds." },
        ].map((f) => (
          <div key={f.t} className="card card-hover" style={{ padding: "1.75rem" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--teal-tint)", marginBottom: 14 }} />
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{f.t}</h3>
            <p style={{ color: "var(--ink-soft)", lineHeight: 1.6, fontSize: 15 }}>{f.d}</p>
          </div>
        ))}
      </section>

      {/* Partners (mock) */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "2rem 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 22 }}>Trusted by clinics and labs</p>
        <div style={{ display: "flex", gap: 30, justifyContent: "center", flexWrap: "wrap", opacity: 0.6 }}>
          {["CareLab", "MediTrust", "HealthBridge", "CityClinic", "PulsePharma"].map((p) => (
            <span key={p} style={{ fontSize: 18, fontWeight: 600, color: "var(--ink-soft)" }}>{p}</span>
          ))}
        </div>
      </section>

      {/* Testimonials (mock) */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "3rem 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
        {[
          { q: "I finally understand my own reports. The Bengali summaries made my mother cry — she gets her own health now.", n: "Ananya, patient" },
          { q: "Seeing three years of a patient's sugar trend in one glance changed how I consult. This saves real time.", n: "Dr. Rao, physician" },
          { q: "No more carrying a fat folder to every appointment. It's all just there, organized.", n: "Imran, patient" },
        ].map((t) => (
          <div key={t.n} className="card" style={{ padding: "1.5rem" }}>
            <p style={{ fontSize: 15, lineHeight: 1.65, marginBottom: 14 }}>“{t.q}”</p>
            <p style={{ fontSize: 13, color: "var(--teal-dark)", fontWeight: 600 }}>{t.n}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center", padding: "3rem 24px 4rem" }}>
        <h2 style={{ fontSize: 30, fontWeight: 600, marginBottom: 14 }}>Take control of your health records</h2>
        <Link href="/signup" className="btn" style={{ textDecoration: "none", fontSize: 16, padding: "14px 30px" }}>Get started free</Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--line)", padding: "24px", textAlign: "center", color: "var(--ink-soft)", fontSize: 13 }}>
        © 2026 MediRecord · A space to understand your health
      </footer>
    </main>
  );
}