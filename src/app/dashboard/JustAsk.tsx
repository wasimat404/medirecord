"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import Loader from "@/components/Loader";

const GREEN = "#3DA672", GREEN_DEEP = "#2E9E63", MUTE = "#6B7C74", LINE = "#DCEAE3", INK = "#22332C";

const CHIPS = [
  { label: "Summarize my last visit", color: "#4FB286" },
  { label: "Recent test results", color: "#5495D4" },
  { label: "List my medicines", color: "#4FB286" },
  { label: "Read a prescription", color: "#3CB5A6" },
];

const card: CSSProperties = { background: "#fff", border: `1px solid ${LINE}`, borderRadius: 16, padding: "18px 20px", boxShadow: "0 4px 18px rgba(45,100,80,.05)" };

const SparkIcon = ({ color = GREEN }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" /></svg>
);

export default function JustAsk() {
  const [q, setQ] = useState("");
  const [asked, setAsked] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function ask(text?: string) {
    const query = (text ?? q).trim();
    if (!query) return;
    setQ("");
    setAsked(null);
    setLoading(true);
    
    // Fake AI latency to show off the cool loader
    setTimeout(() => {
      setLoading(false);
      setAsked(query);
    }, 2800);
  }

  return (
    <div style={card}>
      <h2 style={{ fontSize: 19, fontWeight: 600, margin: "0 0 13px", fontFamily: "Georgia, serif", color: INK }}>Have a question? <span style={{ color: GREEN_DEEP }}>Just ask.</span></h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 13 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") ask(); }}
          placeholder="What would you like to know about your health?"
          style={{ flex: 1, border: `1px solid ${LINE}`, borderRadius: 12, padding: "12px 14px", fontSize: 14, fontFamily: "ui-sans-serif, system-ui, sans-serif", color: INK, outline: "none", boxSizing: "border-box", background: "#FBFEFD" }}
        />
        <button onClick={() => ask()} style={{ background: GREEN, color: "#fff", border: "none", borderRadius: 12, padding: "0 18px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
          <SparkIcon color="#fff" /> Ask
        </button>
      </div>

      <p style={{ fontSize: 11.5, color: MUTE, margin: "0 0 8px", fontWeight: 600 }}>Quick-start</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {CHIPS.map((c) => (
          <button key={c.label} onClick={() => ask(c.label)} style={{ background: c.color, color: "#fff", border: "none", borderRadius: 999, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>{c.label}</button>
        ))}
      </div>

      {loading && (
        <div style={{ marginTop: 24, padding: "20px 14px", display: "flex", justifyContent: "center" }}>
          <Loader size={32} color="#3B82C4" text="AI is analyzing your records..." />
        </div>
      )}

      {asked && !loading && (
        <div style={{ marginTop: 15, borderTop: `1px solid #EEF4F1`, paddingTop: 13 }}>
          <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: .8, color: MUTE, textTransform: "uppercase", margin: "0 0 9px" }}>Recent answer</p>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "#DCE9F7", borderRadius: 12, padding: "12px 14px" }}>
            <span style={{ flexShrink: 0, marginTop: 1, color: "#3B82C4" }}><SparkIcon color="#3B82C4" /></span>
            <div>
              <p style={{ fontSize: 13, color: "#1F4368", margin: 0, lineHeight: 1.5, fontWeight: 600 }}>&quot;{asked}&quot;</p>
              <p style={{ fontSize: 12.5, color: "#2A4A6B", margin: "7px 0 0", lineHeight: 1.55 }}>
                Smart answers are coming soon — your answer will appear here, drawn from your records with the source report highlighted so you can verify it.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}