"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login() {
    setLoading(true); setError(null);
    const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push("/dashboard");
  }

  return (
    <main style={{ maxWidth: 400, margin: "0 auto", padding: "3rem 1.25rem", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 4 }}>Welcome back</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>Log in to your account.</p>

      <label style={{ fontSize: 13, color: "#444" }}>Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 14, borderRadius: 8, border: "1px solid #ddd" }} />

      <label style={{ fontSize: 13, color: "#444" }}>Password</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 20, borderRadius: 8, border: "1px solid #ddd" }} />

      {error && <p style={{ color: "#c00", marginBottom: 14 }}>{error}</p>}

      <button onClick={login} disabled={loading}
        style={{ width: "100%", padding: 12, borderRadius: 8, border: "none",
          background: "#1D9E75", color: "#fff", fontSize: 15, fontWeight: 500,
          cursor: loading ? "default" : "pointer", opacity: loading ? 0.6 : 1 }}>
        {loading ? "Logging in..." : "Log in"}
      </button>

      <p style={{ textAlign: "center", marginTop: 16, fontSize: 14, color: "#666" }}>
        New here? <a href="/signup" style={{ color: "#1D9E75" }}>Create an account</a>
      </p>
    </main>
  );
}
