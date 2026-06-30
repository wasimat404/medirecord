"use client";
import { useState } from "react";
import type { RecordRow } from "@/lib/types";

const INK = "#22332C", MUTE = "#6B7C74", LINE = "#E5EFE9";

export default function PatientVitals({ profile, records }: { profile: any, records: RecordRow[] }) {
  const [expanded, setExpanded] = useState(false);

  // Calculate age
  const age = profile?.dob ? new Date().getFullYear() - new Date(profile.dob).getFullYear() : "--";
  const height = profile?.height_cm ? `${profile.height_cm} cm` : "--";
  const weight = profile?.weight_kg ? `${profile.weight_kg} kg` : "--";
  const blood = profile?.blood_group || "--";

  // Get abnormal readings from all records
  const abnormal: { test: string, value: string, unit?: string, flag: string, date: string }[] = [];
  records.forEach(r => {
    const d = r.report_date ? new Date(r.report_date).toLocaleDateString("en-GB", { month: "short", day: "numeric" }) : "Unknown";
    (r.data_points || []).forEach(p => {
      if (p.flag === "high" || p.flag === "low") {
        abnormal.push({ test: p.test, value: p.value, unit: p.unit, flag: p.flag, date: d });
      }
    });
  });

  const displayedAbnormal = expanded ? abnormal : abnormal.slice(0, 3);
  const reaction = abnormal.length > 0 ? { label: "Attention Needed", color: "#B23B2E", bg: "#FCE9E7" } : { label: "Perfectly Healthy", color: "#2E9E63", bg: "#EAF6F0" };

  return (
    <div style={{
      background: "linear-gradient(145deg, #ffffff, #fdfefe)",
      border: `1px solid ${LINE}`,
      borderRadius: 24,
      padding: "24px",
      boxShadow: "0 10px 40px rgba(31, 174, 148, 0.06)",
      display: "flex", flexDirection: "column", gap: 16
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, letterSpacing: 1.2, color: "#2E9E63", textTransform: "uppercase", margin: 0 }}>🫀 Physical Profile</h3>
        <span style={{ fontSize: 12, fontWeight: 800, color: reaction.color, background: reaction.bg, padding: "6px 12px", borderRadius: 999, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {reaction.label}
        </span>
      </div>
      
      {/* Basic Stats Table */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ background: "#F4FBF7", borderRadius: 14, padding: "12px 14px", border: "1px solid #EAF6F0" }}>
          <p style={{ fontSize: 11, color: MUTE, margin: "0 0 2px", fontWeight: 700, letterSpacing: 0.5 }}>AGE</p>
          <p style={{ fontSize: 18, color: INK, margin: 0, fontWeight: 800 }}>{age}</p>
        </div>
        <div style={{ background: "#F4FBF7", borderRadius: 14, padding: "12px 14px", border: "1px solid #EAF6F0" }}>
          <p style={{ fontSize: 11, color: MUTE, margin: "0 0 2px", fontWeight: 700, letterSpacing: 0.5 }}>BLOOD</p>
          <p style={{ fontSize: 18, color: INK, margin: 0, fontWeight: 800 }}>{blood}</p>
        </div>
        <div style={{ background: "#F4FBF7", borderRadius: 14, padding: "12px 14px", border: "1px solid #EAF6F0" }}>
          <p style={{ fontSize: 11, color: MUTE, margin: "0 0 2px", fontWeight: 700, letterSpacing: 0.5 }}>HEIGHT</p>
          <p style={{ fontSize: 18, color: INK, margin: 0, fontWeight: 800 }}>{height}</p>
        </div>
        <div style={{ background: "#F4FBF7", borderRadius: 14, padding: "12px 14px", border: "1px solid #EAF6F0" }}>
          <p style={{ fontSize: 11, color: MUTE, margin: "0 0 2px", fontWeight: 700, letterSpacing: 0.5 }}>WEIGHT</p>
          <p style={{ fontSize: 18, color: INK, margin: 0, fontWeight: 800 }}>{weight}</p>
        </div>
      </div>

      <div style={{ height: 1, background: LINE, margin: "4px 0" }} />

      <h3 style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.2, color: "#B23B2E", textTransform: "uppercase", margin: 0 }}>⚠️ Flagged Readings</h3>
      
      {abnormal.length === 0 ? (
        <p style={{ fontSize: 14, color: "#4A5D54", margin: 0, fontWeight: 600 }}>All clear! No abnormal readings detected yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {displayedAbnormal.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FCF3F2", padding: "12px 16px", borderRadius: 14, border: "1px solid rgba(178,59,46,0.1)" }}>
              <div style={{ overflow: "hidden", paddingRight: 8 }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#8A2A20", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.test}</p>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#B23B2E", margin: 0, opacity: 0.8 }}>{item.date}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: "#B23B2E", margin: 0, lineHeight: 1 }}>{item.value} <span style={{ fontSize: 12, fontWeight: 700 }}>{item.unit}</span></p>
                <p style={{ fontSize: 10, fontWeight: 800, color: "#fff", background: "#B23B2E", padding: "2px 8px", borderRadius: 6, display: "inline-block", margin: "5px 0 0", textTransform: "uppercase", letterSpacing: 0.5 }}>{item.flag}</p>
              </div>
            </div>
          ))}
          
          {abnormal.length > 3 && (
            <button 
              onClick={() => setExpanded(!expanded)}
              style={{ background: "transparent", border: "none", color: "#2E9E63", fontSize: 14, fontWeight: 700, cursor: "pointer", padding: "6px 0", alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6 }}
            >
              {expanded ? "Show less" : `View ${abnormal.length - 3} more flags`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
