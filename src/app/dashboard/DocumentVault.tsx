import type { RecordRow } from "@/lib/types";
const INK = "#22332C", MUTE = "#6B7C74";

const cats = [
  { key: "prescription", label: "Prescriptions", color: "#2E9E63", tint: "#DCF1E4", icon: "rx", match: (c: string) => c === "prescription" },
  { key: "lab", label: "Lab reports", color: "#3B82C4", tint: "#D9E8F7", icon: "flask", match: (c: string) => c === "blood_test" || c === "imaging" },
  { key: "bill", label: "Bills", color: "#2BA89A", tint: "#D2EFEA", icon: "receipt", match: (c: string) => c === "bill" },
];

const Icon = ({ kind, color }: { kind: string; color: string }) => {
  const common = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (kind === "flask") return (<svg {...common}><path d="M9 3h6M10 3v6L5 19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1l-5-10V3" /><line x1="8" y1="14" x2="16" y2="14" /></svg>);
  if (kind === "receipt") return (<svg {...common}><path d="M5 3v18l2-1 2 1 2-1 2 1 2-1 2 1V3l-2 1-2-1-2 1-2-1-2 1-2-1z" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="9" y1="12" x2="15" y2="12" /></svg>);
  return (<svg {...common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="13" y2="17" /></svg>);
};

export default function DocumentVault({ records }: { records: RecordRow[] }) {
  const recs = records || [];
  return (
    <div style={{ marginBottom: 18 }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: MUTE, textTransform: "uppercase", margin: "0 0 12px" }}>Your document vault</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        {cats.map((c) => {
          const count = recs.filter((r: RecordRow) => c.match(r.category || "")).length;
          return (
            <div key={c.key} className="pcard" style={{ background: c.tint, borderRadius: 18, padding: "18px 16px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 11 }}>
              <span style={{ width: 46, height: 46, borderRadius: 13, background: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
                <Icon kind={c.icon} color={c.color} />
              </span>
              <div>
                <p style={{ fontSize: 26, fontWeight: 600, margin: 0, color: c.color, fontFamily: "Georgia, serif", lineHeight: 1 }}>{count}</p>
                <p style={{ fontSize: 13, fontWeight: 600, margin: "3px 0 0", color: INK }}>{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}