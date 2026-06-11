"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function analyze() {
    if (!file) return;
    setLoading(true); setError(null); setResult(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/analyze", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) setError(data.detail || data.error || "Failed");
    else setResult(data);
    setLoading(false);
  }

  return (
    <main className="max-w-2xl mx-auto p-8 font-sans">
      <h1 className="text-2xl font-medium mb-1">MediRecord</h1>
      <p className="text-gray-500 mb-6">Upload a medical report to read it.</p>

      <input type="file" accept="image/*,application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="block mb-4" />

      <button onClick={analyze} disabled={!file || loading}
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-40">
        {loading ? "Reading..." : "Analyze"}
      </button>

      {error && <p className="mt-6 text-red-600 whitespace-pre-wrap">{error}</p>}

      {result && (
        <div className="mt-8 space-y-4">
          <div className="text-sm text-gray-500">
            {result.category} · {result.date ?? "no date"} · {result.source ?? "no source"}
          </div>
          <div>
            <h2 className="font-medium mb-2">Summary</h2>
            <p className="whitespace-pre-wrap">{result.summary_en}</p>
          </div>
          <div>
            <h2 className="font-medium mb-2">Data points</h2>
            <ul className="space-y-1">
              {(result.data_points ?? []).map((d: any, i: number) => (
                <li key={i} className="text-sm">
                  {d.test}: <b>{d.value}</b> {d.unit ?? ""} {d.flag && d.flag !== "normal" ? `(${d.flag})` : ""}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
