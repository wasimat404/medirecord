"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DoctorSignup() {
  const router = useRouter();
  const [f, setF] = useState<Record<string, string>>({ role: "doctor" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: string, v: string) => setF((p: Record<string, string>) => ({ ...p, [k]: v }));

  async function submit() {
    setLoading(true); setError(null);
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(f),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Signup failed"); return; }
    router.push("/login");
  }

  return (
    <main style={{ maxWidth: 440, margin: "0 auto", padding: "3rem 1.25rem", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>Doctor sign up</h1>
      <p style={{ color: "var(--ink-soft)", marginBottom: 24 }}>Access patient histories with their permission.</p>

      <label className="label">Full name</label>
      <input className="field" value={f.full_name || ""} onChange={(e) => set("full_name", e.target.value)} placeholder="Dr. ..." style={{ marginBottom: 14 }} />
      <label className="label">Specialty</label>
      <input className="field" value={f.specialty || ""} onChange={(e) => set("specialty", e.target.value)} placeholder="e.g. General physician" style={{ marginBottom: 14 }} />
      <label className="label">Email</label>
      <input className="field" type="email" value={f.email || ""} onChange={(e) => set("email", e.target.value)} style={{ marginBottom: 14 }} />
      <label className="label">Password</label>
      <input className="field" type="password" value={f.password || ""} onChange={(e) => set("password", e.target.value)} style={{ marginBottom: 20 }} />

      {error && <p style={{ color: "#c00", marginBottom: 14 }}>{error}</p>}
      <button className="btn" onClick={submit} disabled={loading} style={{ width: "100%" }}>
        {loading ? "Creating account..." : "Create doctor account"}
      </button>
      <p style={{ textAlign: "center", marginTop: 16, fontSize: 14, color: "var(--ink-soft)" }}>
        Already have an account? <a href="/login" style={{ color: "var(--teal-dark)", fontWeight: 600 }}>Log in</a>
      </p>
    </main>
  );
}