"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

const GREEN = "#3DA672", GREEN_DEEP = "#2E9E63", MUTE = "#6B7C74", LINE = "#E5EFE9", INK = "#22332C";

const catLabel: Record<string, string> = {
  blood_test: "Lab report", imaging: "Imaging", prescription: "Prescription", bill: "Bill", other: "Document",
};

const fmtD = (s?: string) => {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
};

type Detected = { category?: string; source?: string; date?: string };

const Tag = ({ label, value }: { label: string; value: string }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#EAF6F0", borderRadius: 999, padding: "4px 11px" }}>
    <span style={{ fontSize: 10.5, color: MUTE, fontWeight: 600 }}>{label}</span>
    <span style={{ fontSize: 12, color: GREEN_DEEP, fontWeight: 600 }}>{value}</span>
  </span>
);

export default function SmartUpload() {
  const router = useRouter();
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "reading" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [detected, setDetected] = useState<Detected | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File | undefined) {
    if (!file || status === "reading") return;
    setFileName(file.name);
    setStatus("reading");
    setErrMsg(null);
    setDetected(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/analyze", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrMsg(data.detail || data.error || `Failed (${res.status})`);
      } else {
        setStatus("done");
        setDetected({ category: data.category, source: data.source, date: data.report_date });
        router.refresh();
      }
    } catch (e) {
      setStatus("error");
      setErrMsg(String(e));
    }
  }

  const date = fmtD(detected?.date);

  return (
    <div
      className="upload-card"
      style={{
        marginBottom: 26,
        background: "linear-gradient(145deg, #ffffff, #fdfefe)",
        border: `1px solid ${LINE}`,
        borderRadius: 24,
        padding: "26px 28px",
        boxShadow: "0 10px 40px rgba(31, 174, 148, 0.08)",
        transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <style>{`
        .upload-card:hover { transform: translateY(-4px); box-shadow: 0 16px 50px rgba(31, 174, 148, 0.15); border-color: #A3D9C9; }
        .upload-area { animation: float 6s ease-in-out infinite; }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-4px); } 100% { transform: translateY(0px); } }
        .pulse-bg { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(31,174,148,0.03) 0%, transparent 60%); z-index: 0; animation: spin 20s linear infinite; pointer-events: none; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulseBar { 0%,100%{opacity:.5} 50%{opacity:1} }
      `}</style>
      <div className="pulse-bg" />
      
      <div style={{ position: "relative", zIndex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.5, color: GREEN_DEEP, textTransform: "uppercase", margin: "0 0 18px" }}>✨ Smart Upload</p>

        <div
          className="upload-area"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); processFile(e.dataTransfer.files?.[0]); }}
          style={{
            border: `2px dashed ${drag ? GREEN : "#B4E4D3"}`,
            background: drag ? "#EDF9F4" : "#ffffff",
            borderRadius: 20, padding: "3rem 1.5rem", textAlign: "center",
            cursor: "pointer", transition: "all .3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: drag ? "inset 0 4px 20px rgba(61,166,114,0.1)" : "0 4px 15px rgba(0,0,0,0.02)"
          }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", background: drag ? "#D2EFE1" : "#EAF6F0",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
            color: GREEN, transition: "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)", transform: drag ? "scale(1.15)" : "scale(1)"
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 6px", color: "#1A2420", fontFamily: "Georgia, serif" }}>Smart Upload</h3>
          <p style={{ fontSize: 16, color: "#4A5D54", margin: 0, fontWeight: 500 }}>Drop any report, bill, or prescription. Our AI instantly translates and organizes it.</p>
          <input ref={inputRef} type="file" accept="image/*,application/pdf" style={{ display: "none" }}
            onChange={(e) => processFile(e.target.files?.[0])} />
        </div>

        {status !== "idle" && (
          <div style={{ background: "#FBFEFD", border: `1px solid ${LINE}`, borderRadius: 16, padding: "16px 20px", marginTop: 16, boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#2E9E63" }}>
              {status === "reading" ? "AI Processing..." : status === "done" ? "Added to your records" : "Couldn't read this one"}
            </span>
              <span style={{
                fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 999,
                background: status === "done" ? "#DCF1E4" : status === "error" ? "#FCEBEB" : "#FFF4D6",
                color: status === "done" ? "#2E9E63" : status === "error" ? "#A32D2D" : "#854F0B",
              }}>
                {fileName && fileName.length > 24 ? fileName.slice(0, 22) + "…" : fileName}
              </span>
            </div>

            {status === "reading" && (
              <div style={{ marginTop: 24, marginBottom: 8, display: "flex", justifyContent: "center" }}>
                <Loader size={36} color="#2E9E63" text="AI is extracting medical data..." />
              </div>
            )}

            {status === "done" && detected && (detected.category || detected.source || date) && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                {detected.category && <Tag label="Type" value={catLabel[detected.category] || "Document"} />}
                {detected.source && <Tag label="From" value={detected.source} />}
                {date && <Tag label="Date" value={date} />}
              </div>
            )}

            {status === "error" && errMsg && (
              <p style={{ fontSize: 13, color: "#A32D2D", margin: "10px 0 0", lineHeight: 1.5, wordBreak: "break-word" }}>{errMsg}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}