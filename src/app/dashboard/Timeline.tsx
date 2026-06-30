"use client";
import { useState } from "react";
import type { RecordRow, DataPoint } from "@/lib/types";

const catMeta: Record<string, { label: string; fg: string; soft: string }> = {
  blood_test: { label: "Lab test", fg: "#0F6E56", soft: "#DEF3EA" },
  imaging: { label: "Imaging", fg: "#4C42B8", soft: "#EBE9FB" },
  prescription: { label: "Prescription", fg: "#185FA5", soft: "#E3F0FC" },
  bill: { label: "Bill", fg: "#8A5A10", soft: "#FBEFDA" },
  other: { label: "Document", fg: "#5F5E5A", soft: "#EFEDE6" },
};

function flagStyle(flag?: string) {
  if (flag === "high" || flag === "low") return { bg: "#FCE9E7", fg: "#B23B2E" };
  if (flag === "normal") return { bg: "#E5F4E0", fg: "#3B6D11" };
  return { bg: "#F1EFE8", fg: "#6b6a64" };
}

function titleOf(r: RecordRow) {
  const pts = r.data_points || [];
  if (pts.length === 1 && pts[0].test) return pts[0].test;
  if (pts.length > 1) {
    const m = catMeta[r.category || "other"] || catMeta.other;
    return `${m.label} · ${pts.length} readings`;
  }
  return (catMeta[r.category || "other"] || catMeta.other).label;
}

const filters = [
  { key: "all", label: "All" },
  { key: "blood_test", label: "Tests" },
  { key: "prescription", label: "Rx" },
  { key: "bill", label: "Bills" },
  { key: "imaging", label: "Imaging" },
];

export default function Timeline({ records }: { records: RecordRow[] }) {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<string | null>(null);

  const shown = records.filter((r) => filter === "all" || r.category === filter);

  const groups: { label: string; items: RecordRow[] }[] = [];
  for (const r of shown) {
    const d = new Date(r.report_date || r.created_at || "");
    const label = isNaN(d.getTime()) ? "Undated" : d.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
    const g = groups.find((g) => g.label === label);
    if (g) g.items.push(r);
    else groups.push({ label, items: [r] });
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "26px 0 14px", flexWrap: "wrap", gap: 8 }}>
        <h2 style={{ fontSize: 19, fontWeight: 600, margin: 0, fontFamily: "Georgia, serif" }}>Your history</h2>
        <div style={{ display: "flex", gap: 6 }}>
          {filters.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              style={{
                fontSize: 12, fontWeight: 600, padding: "5px 13px", borderRadius: 999, cursor: "pointer",
                border: "none",
                background: filter === f.key ? "#0B3D2E" : "#fff",
                color: filter === f.key ? "#fff" : "#7d8a85",
                boxShadow: filter === f.key ? "none" : "0 1px 4px rgba(11,61,46,.08)",
                transition: "all .2s ease",
              }}>{f.label}</button>
          ))}
        </div>
      </div>

      {shown.length === 0 && (
        <div style={{ background: "#fff", borderRadius: 18, padding: "2.5rem", textAlign: "center", color: "#7d8a85", fontSize: 14, boxShadow: "0 1px 4px rgba(11,61,46,.06)" }}>
          Nothing here yet. Drop your reports above.
        </div>
      )}

      {groups.map((g) => (
        <div key={g.label} style={{ marginBottom: 26 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "0 0 12px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#9aa8a2", margin: 0, whiteSpace: "nowrap" }}>{g.label}</p>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #dde7e2, transparent)" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {g.items.map((r) => {
              const m = catMeta[r.category || "other"] || catMeta.other;
              const d = new Date(r.report_date || r.created_at || "");
              const day = isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
              const pts = r.data_points || [];
              const isOpen = open === r.id;
              
              const abnormalCount = pts.filter((p: DataPoint) => p.flag === "high" || p.flag === "low").length;
              const reaction = pts.length > 0 
                ? (abnormalCount > 0 ? { label: "Requires Attention", bg: "#FCE9E7", fg: "#B23B2E" } : { label: "All Good", bg: "#E5F4E0", fg: "#3B6D11" })
                : null;

              return (
                <div key={r.id}
                  onClick={() => setOpen(isOpen ? null : r.id ?? null)}
                  style={{
                    background: "#fff", borderRadius: 18, padding: "16px 18px", cursor: "pointer",
                    boxShadow: isOpen ? "0 14px 40px rgba(11,61,46,.13)" : "0 1px 4px rgba(11,61,46,.07)",
                    transition: "box-shadow .35s ease, transform .35s ease",
                    transform: isOpen ? "scale(1.012)" : "none",
                  }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 13 }}>
                    <span style={{ width: 40, height: 40, borderRadius: 13, background: m.soft, color: m.fg, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 700, fontSize: 15 }}>
                      {m.label[0]}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                          <p style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#1a2420", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{titleOf(r)}</p>
                          {reaction && (
                            <span style={{ fontSize: 12, fontWeight: 800, background: reaction.bg, color: reaction.fg, padding: "4px 10px", borderRadius: 999, textTransform: "uppercase", letterSpacing: 0.5 }}>
                              {reaction.label}
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: 14, color: "#7A8A82", whiteSpace: "nowrap", fontWeight: 500 }}>{day}</span>
                      </div>
                      <p style={{ fontSize: 15, color: "#4A5D54", margin: "4px 0 0", fontWeight: 500 }}>{r.source || "Unknown source"}</p>

                      {pts.length > 0 && !isOpen && (
                        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 10 }}>
                          {pts.slice(0, 3).map((p: DataPoint, i: number) => {
                            const fs = flagStyle(p.flag);
                            return (
                              <span key={i} style={{ fontSize: 12, fontWeight: 600, background: fs.bg, color: fs.fg, padding: "4px 11px", borderRadius: 9 }}>
                                {p.test}: {p.value}{p.unit ? ` ${p.unit}` : ""}
                              </span>
                            );
                          })}
                          {pts.length > 3 && (
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#7d8a85", padding: "4px 8px" }}>+{pts.length - 3} more</span>
                          )}
                        </div>
                      )}

                      {pts.length > 0 && isOpen && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginTop: 18 }}>
                          {pts.map((p: DataPoint, i: number) => {
                            const fs = flagStyle(p.flag);
                            const bg = fs.bg === "#F1EFE8" ? "#FAFAF9" : fs.bg;
                            const bdr = fs.bg === "#F1EFE8" ? "#EAE8E0" : fs.fg + "40";
                            const c = fs.fg;
                            return (
                              <div key={i} style={{ background: fs.bg, borderRadius: 14, padding: "14px 16px", border: `1px solid ${fs.bg === '#F1EFE8' ? '#EAE8E0' : fs.fg + '25'}`, display: "flex", flexDirection: "column", gap: 4 }}>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 6, background: bg, border: `1px solid ${bdr}`, padding: "6px 12px", borderRadius: 8 }}>
                                  <span style={{ fontSize: 14, fontWeight: 700, color: c }}>{p.test}:</span>
                                  <span style={{ fontSize: 15, fontWeight: 800, color: c }}>{p.value} {p.unit}</span>
                                </div>
                                {p.normal_range && <div style={{ fontSize: 11.5, color: fs.fg, opacity: 0.75, marginTop: "auto", paddingTop: 8 }}>Range: {p.normal_range}</div>}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {isOpen && (
                        <p style={{ fontSize: 16, lineHeight: 1.65, color: "#465650", margin: "12px 0 0", borderTop: "1px solid #eef2f0", paddingTop: 14, fontWeight: 500 }}>
                          {r.summary_display ?? r.summary_en}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}