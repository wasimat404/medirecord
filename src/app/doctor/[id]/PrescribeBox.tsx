"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function PrescribeBox({ patientId, doctorName }: { patientId: string; doctorName: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    if (!note.trim()) return;
    setBusy(true); setMsg(null);
    const { error } = await supabaseBrowser.from("records").insert({
      patient_id: patientId,
      category: "prescription",
      report_date: new Date().toISOString().slice(0, 10),
      source: doctorName,
      summary_en: note.trim(),
      data_points: [],
    });
    setBusy(false);
    if (error) { setMsg(error.message); return; }
    setNote(""); setMsg("Added to patient record ✓");
    router.refresh();
  }

  return (
    <div style={{ background: "#fff", border: "1px solid #E3EAE6", borderLeft: "3px solid #0B5C43", borderRadius: 14, padding: "1.3rem 1.4rem" }}>
      <p style={{ color: "#75857D", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px" }}>New prescription</p>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4}
        placeholder="e.g. Metformin 500mg twice daily after meals. Review in 3 months with fasting sugar + HbA1c."
        style={{ width: "100%", background: "#FBFCFB", border: "1px solid #E3EAE6", borderRadius: 10, padding: "11px 13px", color: "#16241E", fontSize: 13.5, lineHeight: 1.6, outline: "none", resize: "vertical", fontFamily: "inherit" }} />
      <button onClick={save} disabled={busy || !note.trim()}
        style={{ marginTop: 10, width: "100%", background: "#0B5C43", border: "none", borderRadius: 10, padding: "11px", color: "#fff", fontWeight: 600, fontSize: 13.5, cursor: "pointer", opacity: busy || !note.trim() ? .5 : 1, letterSpacing: .3 }}>
        {busy ? "Saving…" : "Add to record"}
      </button>
      {msg && <p style={{ fontSize: 12.5, margin: "9px 0 0", color: msg.includes("✓") ? "#0B5C43" : "#A3422E" }}>{msg}</p>}
    </div>
  );
}