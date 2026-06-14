"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

const GREEN = "#0B5C43", MUTE = "#75857D", LINE = "#E6ECE9", BG = "#F4F7F5", RED = "#A3422E";

type Doctor = { id: string; name: string; specialty?: string | null };

const card: CSSProperties = { background: "#fff", border: `1px solid ${LINE}`, borderRadius: 14, padding: "16px 18px", display: "flex", flexDirection: "column" };
const heading: CSSProperties = { fontSize: 12, fontWeight: 700, letterSpacing: 1, color: MUTE, textTransform: "uppercase", margin: "0 0 12px" };
const docRow: CSSProperties = { display: "flex", alignItems: "center", gap: 11, background: BG, borderRadius: 11, padding: "10px 12px", marginBottom: 12 };
const avatar: CSSProperties = { width: 36, height: 36, borderRadius: "50%", background: "#EAF3EF", color: GREEN, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 13, fontFamily: "Georgia, serif", flexShrink: 0 };
const sendBtn: CSSProperties = { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: GREEN, color: "#fff", border: "none", borderRadius: 10, padding: 11, fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "ui-sans-serif, system-ui, sans-serif" };
const sentBox: CSSProperties = { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#EAF3EF", color: GREEN, borderRadius: 10, padding: 11, fontSize: 13, fontWeight: 600 };
const hint: CSSProperties = { fontSize: 11, color: MUTE, margin: "10px 0 0", lineHeight: 1.5 };
const linkBtn: CSSProperties = { background: "none", border: "none", color: GREEN, fontSize: 12, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 10, textAlign: "left" };
const noteBox: CSSProperties = { width: "100%", border: `1px solid ${LINE}`, borderRadius: 10, padding: "9px 11px", fontSize: 13, fontFamily: "ui-sans-serif, system-ui, sans-serif", resize: "vertical", marginBottom: 10, color: "#16241E", boxSizing: "border-box" };

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
);
const CheckIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);

export default function ShareDoctor({ doctor }: { doctor: Doctor | null }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);

  async function send() {
    setState("sending");
    setErr(null);
    try {
      const res = await fetch("/api/share-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctor_id: doctor?.id, note: note.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || "Could not send.");
        setState("error");
        return;
      }
      setState("sent");
    } catch {
      setErr("Network error. Please try again.");
      setState("error");
    }
  }

  if (!doctor) {
    return (
      <div style={card}>
        <p style={heading}>Share with your doctor</p>
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <p style={{ fontSize: 13, color: MUTE, margin: 0, lineHeight: 1.5 }}>
            No doctor linked yet. Share your patient ID with your doctor so they can connect to your records.
          </p>
        </div>
      </div>
    );
  }

  const initials = (doctor.name || "Dr")
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div style={card}>
      <p style={heading}>Share with your doctor</p>

      <div style={docRow}>
        <span style={avatar}>{initials}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13.5, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doctor.name}</p>
          <p style={{ fontSize: 11, color: MUTE, margin: "1px 0 0" }}>{doctor.specialty || "Doctor"} · linked</p>
        </div>
        <span style={{ color: GREEN, display: "inline-flex" }}><CheckIcon /></span>
      </div>

      {showNote ? (
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note for your doctor (optional)"
          rows={2}
          maxLength={1000}
          style={noteBox}
          disabled={state === "sending" || state === "sent"}
        />
      ) : (
        state !== "sent" && (
          <button onClick={() => setShowNote(true)} style={linkBtn}>+ Add a note</button>
        )
      )}

      {state === "sent" ? (
        <div style={sentBox}>
          <CheckIcon size={16} /> Summary sent to {doctor.name}
        </div>
      ) : (
        <button onClick={send} disabled={state === "sending"} style={{ ...sendBtn, opacity: state === "sending" ? 0.7 : 1, cursor: state === "sending" ? "default" : "pointer" }}>
          {state === "sending" ? "Sending…" : (<><SendIcon /> Send report summary</>)}
        </button>
      )}

      {state === "error" && <p style={{ fontSize: 12, color: RED, margin: "8px 0 0" }}>{err}</p>}

      {state !== "sent" && (
        <p style={hint}>Generates a doctor-ready summary of your latest trends and reports, sent straight to {doctor.name}.</p>
      )}
    </div>
  );
}
