"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LinkPatient() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function link() {
    if (!code.trim()) return;
    setBusy(true); setMsg(null);
    const res = await fetch("/api/link-patient", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setMsg({ ok: false, text: data.error || "Failed" }); return; }
    setMsg({ ok: true, text: `${data.name || "Patient"} linked ✓` });
    setCode("");
    router.refresh();
  }

  return (
    <div style={{ background: "#fff", border: "1px solid #E3EAE6", borderRadius: 14, padding: "1.4rem 1.5rem" }}>
      <p style={{ color: "#16241E", fontSize: 14.5, fontWeight: 600, margin: "0 0 4px" }}>Fetch a patient</p>
      <p style={{ color: "#75857D", fontSize: 12.5, margin: "0 0 14px" }}>Enter the patient&apos;s unique ID — they share it to grant you access.</p>
      <div style={{ display: "flex", gap: 10 }}>
        <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && link()}
          placeholder="MED-XXXXXX"
          style={{ flex: 1, background: "#FBFCFB", border: "1px solid #E3EAE6", borderRadius: 10, padding: "11px 14px", color: "#0B5C43", fontFamily: "ui-monospace, Menlo, monospace", fontSize: 15, letterSpacing: 2, outline: "none" }} />
        <button onClick={link} disabled={busy}
          style={{ background: "#0B5C43", border: "none", borderRadius: 10, padding: "11px 24px", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", opacity: busy ? .6 : 1, letterSpacing: .3 }}>
          {busy ? "…" : "Fetch"}
        </button>
      </div>
      {msg && <p style={{ fontSize: 12.5, margin: "10px 0 0", color: msg.ok ? "#0B5C43" : "#A3422E" }}>{msg.text}</p>}
    </div>
  );
}