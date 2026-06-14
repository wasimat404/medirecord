"use client";
import { useState } from "react";

export default function CopyId({ code }: { code: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(code); setDone(true); setTimeout(() => setDone(false), 1500); }}
      style={{ background: "rgba(255,255,255,.6)", border: "1px solid rgba(15,110,86,.25)", color: "#0F6E56", borderRadius: 8, padding: "5px 12px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
      {done ? "Copied ✓" : "Copy ID"}
    </button>
  );
}