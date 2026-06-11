"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [f, setF] = useState<any>({ preferred_language: "en" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(k: string, v: any) {
    setF((p: any) => ({ ...p, [k]: v }));
  }

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
    <main style={{ maxWidth: 460, margin: "0 auto", padding: "2.5rem 1.25rem", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 4 }}>Create your account</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>Patient sign up — it only takes a minute.</p>

      <label style={{ fontSize: 13, color: "#444" }}>Full name</label>
      <input value={f.full_name || ""} onChange={(e) => set("full_name", e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 14, borderRadius: 8, border: "1px solid #ddd" }} />

      <label style={{ fontSize: 13, color: "#444" }}>Email</label>
      <input type="email" value={f.email || ""} onChange={(e) => set("email", e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 14, borderRadius: 8, border: "1px solid #ddd" }} />

      <label style={{ fontSize: 13, color: "#444" }}>Phone</label>
      <input value={f.phone || ""} onChange={(e) => set("phone", e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 14, borderRadius: 8, border: "1px solid #ddd" }} />

      <label style={{ fontSize: 13, color: "#444" }}>Password</label>
      <input type="password" value={f.password || ""} onChange={(e) => set("password", e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 14, borderRadius: 8, border: "1px solid #ddd" }} />


      <label style={{ fontSize: 13, color: "#444" }}>Date of birth</label>
      <input type="date" value={f.dob || ""} onChange={(e) => set("dob", e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 14, borderRadius: 8, border: "1px solid #ddd" }} />

      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 13, color: "#444" }}>Height (cm)</label>
          <input type="number" value={f.height_cm || ""} onChange={(e) => set("height_cm", e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 14, borderRadius: 8, border: "1px solid #ddd" }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 13, color: "#444" }}>Weight (kg)</label>
          <input type="number" value={f.weight_kg || ""} onChange={(e) => set("weight_kg", e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 14, borderRadius: 8, border: "1px solid #ddd" }} />
        </div>
      </div>

      <label style={{ fontSize: 13, color: "#444" }}>Blood group</label>
      <input value={f.blood_group || ""} onChange={(e) => set("blood_group", e.target.value)} placeholder="e.g. O+"
        style={{ width: "100%", padding: 10, marginBottom: 14, borderRadius: 8, border: "1px solid #ddd" }} />

      <label style={{ fontSize: 13, color: "#444" }}>Preferred language</label>
      <select value={f.preferred_language} onChange={(e) => set("preferred_language", e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 20, borderRadius: 8, border: "1px solid #ddd" }}>
        <option value="en">English</option>
        <option value="bn">Bengali</option>
        <option value="hi">Hindi</option>
        <option value="ta">Tamil</option>
        <option value="te">Telugu</option>
        <option value="mr">Marathi</option>
        <option value="or">Odia</option>
        <option value="as">Assamese</option>
        <option value="kn">Kannada</option>
      </select>

      {error && <p style={{ color: "#c00", marginBottom: 14 }}>{error}</p>}

      <button onClick={submit} disabled={loading}
        style={{ width: "100%", padding: 12, borderRadius: 8, border: "none",
          background: "#1D9E75", color: "#fff", fontSize: 15, fontWeight: 500,
          cursor: loading ? "default" : "pointer", opacity: loading ? 0.6 : 1 }}>
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p style={{ textAlign: "center", marginTop: 16, fontSize: 14, color: "#666" }}>
        Already have an account? <a href="/login" style={{ color: "#1D9E75" }}>Log in</a>
      </p>
    </main>
  );
}
