"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Uploader() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze() {
    if (!file) return;
    setLoading(true); setError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/analyze", { method: "POST", body: fd });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.detail || data.error || "Failed"); return; }
    setFile(null);
    router.refresh();
  }

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: "1.25rem", marginBottom: 24 }}>
      <p style={{ fontWeight: 500, marginBottom: 12 }}>Add a report</p>
      <input type="file" accept="image/*,application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        style={{ display: "block", marginBottom: 12 }} />
      <button onClick={analyze} disabled={!file || loading}
        style={{ padding: "10px 18px", borderRadius: 8, border: "none",
          background: "#1D9E75", color: "#fff", fontSize: 14, fontWeight: 500,
          cursor: !file || loading ? "default" : "pointer", opacity: !file || loading ? 0.5 : 1 }}>
        {loading ? "Reading..." : "Analyze & save"}
      </button>
      {error && <p style={{ color: "#c00", marginTop: 12 }}>{error}</p>}
    </div>
  );
}
