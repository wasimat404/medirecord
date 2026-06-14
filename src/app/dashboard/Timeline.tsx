"use client";
import { useState } from "react";

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

function titleOf(r: any) {
  const pts = r.data_points || [];
  if (pts.length === 1 && pts[0].test) return pts[0].test;
  if (pts.length > 1) {
    const m = catMeta[r.category] || catMeta.other;
    return `${m.label} · ${pts.length} readings`;
  }
  return (catMeta[r.category] || catMeta.other).label;
}

const filters = [
  { key: "all", label: "All" },
  { key: "blood_test", label: "Tests" },
  { key: "prescription", label: "Rx" },
  { key: "bill", label: "Bills" },
  { key: "imaging", label: "Imaging" },
];

export default function Timeline({ records }: { records: any[] }) {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<string | null>(null);

  const shown = records.filter((r) => filter === "all" || r.category === filter);

  const groups: { label: string; items: any[] }[] = [];
  for (const r of shown) {
    const d = new Date(r.report_date || r.created_at);
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
              const m = catMeta[r.category] || catMeta.other;
              const d = new Date(r.report_date || r.created_at);
              const day = isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
              const pts = r.data_points || [];
              const isOpen = open === r.id;
              return (
                <div key={r.id}
                  onClick={() => setOpen(isOpen ? null : r.id)}
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
                        <p style={{ fontSize: 15.5, fontWeight: 600, margin: 0, color: "#1a2420", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{titleOf(r)}</p>
                        <span style={{ fontSize: 11.5, color: "#9aa8a2", whiteSpace: "nowrap" }}>{day}</span>
                      </div>
                      <p style={{ fontSize: 12.5, color: "#7d8a85", margin: "2px 0 0" }}>{r.source || "Unknown source"}</p>

                      {pts.length > 0 && (
                        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 10 }}>
                          {(isOpen ? pts : pts.slice(0, 3)).map((p: any, i: number) => {
                            const fs = flagStyle(p.flag);
                            return (
                              <span key={i} style={{ fontSize: 12, fontWeight: 600, background: fs.bg, color: fs.fg, padding: "4px 11px", borderRadius: 9 }}>
                                {p.test}: {p.value}{p.unit ? ` ${p.unit}` : ""}
                              </span>
                            );
                          })}
                          {!isOpen && pts.length > 3 && (
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#7d8a85", padding: "4px 8px" }}>+{pts.length - 3} more</span>
                          )}
                        </div>
                      )}

                      {isOpen && (
                        <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "#465650", margin: "12px 0 0", borderTop: "1px solid #eef2f0", paddingTop: 12 }}>
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