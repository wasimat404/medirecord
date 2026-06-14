"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

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
    <div style={{ marginBottom: 18, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 16, padding: "18px 20px", boxShadow: "0 4px 18px rgba(45,100,80,.05)" }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: MUTE, textTransform: "uppercase", margin: "0 0 13px" }}>Smart upload</p>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); processFile(e.dataTransfer.files?.[0]); }}
        style={{
          border: `1.5px dashed ${drag ? GREEN : "#BCDDCD"}`,
          background: drag ? "#EDF9F4" : "#FBFEFD",
          borderRadius: 14, padding: "1.6rem 1rem", textAlign: "center",
          cursor: "pointer", transition: "all .25s ease",
        }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 6 }}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>
        <p style={{ fontSize: 14.5, fontWeight: 600, margin: "0 0 3px", color: INK }}>Scan or drop a document</p>
        <p style={{ fontSize: 12, color: MUTE, margin: 0 }}>PDF or photo · we'll read it for you · or tap to browse</p>
        <input ref={inputRef} type="file" accept="image/*,application/pdf" style={{ display: "none" }}
          onChange={(e) => processFile(e.target.files?.[0])} />
      </div>

      {status !== "idle" && (
        <div style={{ background: "#FBFEFD", border: `1px solid ${LINE}`, borderRadius: 14, padding: "13px 16px", marginTop: 11 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: INK }}>
              {status === "reading" ? "Reading your document…" : status === "done" ? "Added to your records" : "Couldn't read this one"}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999,
              background: status === "done" ? "#DCF1E4" : status === "error" ? "#FCEBEB" : "#FFF4D6",
              color: status === "done" ? "#2E9E63" : status === "error" ? "#A32D2D" : "#854F0B",
            }}>
              {fileName && fileName.length > 24 ? fileName.slice(0, 22) + "…" : fileName}
            </span>
          </div>

          {status === "reading" && (
            <div style={{ height: 6, background: "#EAF6F0", borderRadius: 99, overflow: "hidden", marginTop: 10 }}>
              <div style={{ width: "100%", height: "100%", background: GREEN, borderRadius: 99, animation: "pulseBar 1.2s ease-in-out infinite" }} />
            </div>
          )}

          {status === "done" && detected && (detected.category || detected.source || date) && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 11 }}>
              {detected.category && <Tag label="Type" value={catLabel[detected.category] || "Document"} />}
              {detected.source && <Tag label="From" value={detected.source} />}
              {date && <Tag label="Date" value={date} />}
            </div>
          )}

          {status === "error" && errMsg && (
            <p style={{ fontSize: 12, color: "#A32D2D", margin: "8px 0 0", lineHeight: 1.5, wordBreak: "break-word" }}>{errMsg}</p>
          )}
          <style>{`@keyframes pulseBar { 0%,100%{opacity:.5} 50%{opacity:1} }`}</style>
        </div>
      )}
    </div>
  );
}