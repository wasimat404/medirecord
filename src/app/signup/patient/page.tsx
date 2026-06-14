"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PatientSignup() {
  const router = useRouter();
  const [f, setF] = useState<any>({ preferred_language: "en" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(k: string, v: any) { setF((p: any) => ({ ...p, [k]: v })); }

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
    <main style={{ maxWidth: 460, margin: "0 auto", padding: "2.5rem 1.25rem", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>Create your account</h1>
      <p style={{ color: "var(--ink-soft)", marginBottom: 24 }}>Patient sign up.</p>

      <label className="label">Full name</label>
      <input className="field" value={f.full_name || ""} onChange={(e) => set("full_name", e.target.value)} style={{ marginBottom: 14 }} />
      <label className="label">Email</label>
      <input className="field" type="email" value={f.email || ""} onChange={(e) => set("email", e.target.value)} style={{ marginBottom: 14 }} />
      <label className="label">Phone</label>
      <input className="field" value={f.phone || ""} onChange={(e) => set("phone", e.target.value)} style={{ marginBottom: 14 }} />
      <label className="label">Password</label>
      <input className="field" type="password" value={f.password || ""} onChange={(e) => set("password", e.target.value)} style={{ marginBottom: 14 }} />
      <label className="label">Date of birth</label>
      <input className="field" type="date" value={f.dob || ""} onChange={(e) => set("dob", e.target.value)} style={{ marginBottom: 14 }} />

      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label className="label">Height (cm)</label>
          <input className="field" type="number" value={f.height_cm || ""} onChange={(e) => set("height_cm", e.target.value)} style={{ marginBottom: 14 }} />
        </div>
        <div style={{ flex: 1 }}>
          <label className="label">Weight (kg)</label>
          <input className="field" type="number" value={f.weight_kg || ""} onChange={(e) => set("weight_kg", e.target.value)} style={{ marginBottom: 14 }} />
        </div>
      </div>
      <label className="label">Blood group</label>
      <input className="field" value={f.blood_group || ""} onChange={(e) => set("blood_group", e.target.value)} placeholder="e.g. O+" style={{ marginBottom: 14 }} />
      <label className="label">Preferred language</label>
      <select className="field" value={f.preferred_language} onChange={(e) => set("preferred_language", e.target.value)} style={{ marginBottom: 20 }}>
        <option value="en">English</option>
        <option value="bn">Bengali</option>
        <option value="hi">Hindi</option>
        <option value="ta">Tamil</option>
        <option value="te">Telugu</option>
        <option value="mr">Marathi</option>
        <option value="or">Odia</option>
        <option value="as">Assamese</option>
        <option value="kn">Kannada</option>
        <option value="gu">Gujarati</option>
        <option value="ml">Malayalam</option>
        <option value="pa">Punjabi</option>
        <option value="ur">Urdu</option>
      </select>
      {error && <p style={{ color: "#c00", marginBottom: 14 }}>{error}</p>}
      <button className="btn" onClick={submit} disabled={loading} style={{ width: "100%" }}>
        {loading ? "Creating account..." : "Create account"}
      </button>
      <p style={{ textAlign: "center", marginTop: 16, fontSize: 14, color: "var(--ink-soft)" }}>
        Already have an account? <a href="/login" style={{ color: "var(--teal-dark)", fontWeight: 600 }}>Log in</a>
      </p>
    </main>
  );
}
