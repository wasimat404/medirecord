import Link from "next/link";

export default function DoctorSignup() {
  return (
    <main style={{ maxWidth: 460, margin: "0 auto", padding: "4rem 1.25rem", textAlign: "center", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <div className="fade-up">
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#E6F1FB", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4M8 6a4 4 0 0 0 8 0V2" /><path d="M6 6v4a6 6 0 0 0 12 0V6" /><circle cx="20" cy="14" r="2" /><path d="M20 16v1a6 6 0 0 1-12 0v-1" /></svg>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 600, marginBottom: 10 }}>Doctor access is coming soon</h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
          We&apos;re building secure tools for doctors to view a patient&apos;s history using their unique ID — with the patient&apos;s permission. Check back shortly.
        </p>
        <Link href="/signup" style={{ color: "var(--teal-dark)", fontWeight: 600, textDecoration: "none" }}>&larr; Back</Link>
      </div>
    </main>
  );
}