import type { RecordRow } from "@/lib/types";
const INK = "#22332C", MUTE = "#6B7C74", LINE = "#E5EFE9";

const fmtD = (s?: string) => {
  const d = new Date(s || "");
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
};

const EVENT: Record<string, { verb: string; color: string }> = {
  prescription: { verb: "Prescription added", color: "#2E9E63" },
  blood_test: { verb: "Lab results added", color: "#3B82C4" },
  imaging: { verb: "Imaging added", color: "#3B82C4" },
  bill: { verb: "Bill recorded", color: "#2BA89A" },
  other: { verb: "Document added", color: "#6B7C74" },
};

export default function HealthJourney({ records }: { records: RecordRow[] }) {
  const recs = (records || [])
    .slice()
    .sort((a: RecordRow, b: RecordRow) => new Date(b.report_date || b.created_at || "").getTime() - new Date(a.report_date || a.created_at || "").getTime())
    .slice(0, 8);

  return (
    <div style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 16, padding: "16px 18px", boxShadow: "0 4px 18px rgba(45,100,80,.05)" }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: .9, color: MUTE, textTransform: "uppercase", margin: "0 0 16px" }}>Health journey</p>

      {recs.length === 0 ? (
        <p style={{ fontSize: 13, color: MUTE, margin: 0, lineHeight: 1.5 }}>Your timeline builds itself as you add reports, prescriptions and bills.</p>
      ) : (
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 5, top: 5, bottom: 5, width: 2, background: "#E5EFE9" }} />
          {recs.map((r: RecordRow, i: number) => {
            const ev = EVENT[r.category as string] || EVENT.other;
            return (
              <div key={r.id ?? i} style={{ position: "relative", paddingLeft: 22, paddingBottom: i < recs.length - 1 ? 15 : 0 }}>
                <span style={{ position: "absolute", left: 0, top: 3, width: 11, height: 11, borderRadius: "50%", background: ev.color, border: "2px solid #fff", boxShadow: `0 0 0 2px ${ev.color}22` }} />
                <p style={{ fontSize: 11, color: MUTE, margin: 0, fontWeight: 500 }}>{fmtD(r.report_date || r.created_at)}</p>
                <p style={{ fontSize: 13, fontWeight: 600, margin: "1px 0 0", color: INK, lineHeight: 1.35 }}>{ev.verb}</p>
                {r.source && <p style={{ fontSize: 11.5, color: MUTE, margin: "1px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.source}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}