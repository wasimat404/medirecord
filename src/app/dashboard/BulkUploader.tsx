"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function BulkUploader() {
  const router = useRouter();
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "reading" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File | undefined) {
    if (!file || status === "reading") return;
    setFileName(file.name);
    setStatus("reading");
    setErrMsg(null);
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
        router.refresh();
      }
    } catch (e) {
      setStatus("error");
      setErrMsg(String(e));
    }
  }

  return (
    <div style={{ marginBottom: 22 }}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); processFile(e.dataTransfer.files?.[0]); }}
        style={{
          border: `1.5px dashed ${drag ? "#1D9E75" : "#bcd9ce"}`,
          background: drag ? "#EDF9F4" : "#fbfdfc",
          borderRadius: 18, padding: "1.5rem 1rem", textAlign: "center",
          cursor: "pointer", transition: "all .25s ease",
        }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 6 }}><path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2" /><path d="M12 12v9M8 17l4-4 4 4" /></svg>
        <p style={{ fontSize: 14.5, fontWeight: 600, margin: "0 0 3px" }}>Drop a report here</p>
        <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: 0 }}>PDF or photo · one at a time for now · or tap to browse</p>
        <input ref={inputRef} type="file" accept="image/*,application/pdf" style={{ display: "none" }}
          onChange={(e) => processFile(e.target.files?.[0])} />
      </div>

      {status !== "idle" && (
        <div style={{ background: "#fff", border: "1px solid #e8eeec", borderRadius: 16, padding: "12px 16px", marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              {status === "reading" ? "Reading your report…" : status === "done" ? "Added to your history ✓" : "Couldn't read this one"}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999,
              background: status === "done" ? "#EAF7E1" : status === "error" ? "#FCEBEB" : "#FFF4D6",
              color: status === "done" ? "#3B6D11" : status === "error" ? "#A32D2D" : "#854F0B",
            }}>
              {fileName && fileName.length > 26 ? fileName.slice(0, 24) + "…" : fileName}
            </span>
          </div>
          {status === "reading" && (
            <div style={{ height: 5, background: "#e8eeec", borderRadius: 99, overflow: "hidden", marginTop: 9 }}>
              <div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg,#5DCAA5,#1D9E75)", borderRadius: 99, animation: "pulseBar 1.2s ease-in-out infinite" }} />
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