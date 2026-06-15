import { redirect, notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
import DocSidebar from "../../DocSidebar";
import type { RecordRow, DataPoint } from "@/lib/types";

const GREEN = "#0B5C43", RED = "#A3422E", MUTE = "#75857D", LINE = "#E6ECE9", BG = "#F4F7F5";

const cat: Record<string, { label: string; bg: string; fg: string }> = {
  blood_test: { label: "Lab test", bg: "#E1F5EE", fg: "#0F6E56" },
  imaging: { label: "Imaging", bg: "#EEEDFE", fg: "#3C3489" },
  prescription: { label: "Prescription", bg: "#E6F1FB", fg: "#185FA5" },
  bill: { label: "Bill", bg: "#FAEEDA", fg: "#854F0B" },
  other: { label: "Document", bg: "#F1EFE8", fg: "#5F5E5A" },
};
const fmtD = (s?: string) => { const d = new Date(s || ""); return isNaN(d.getTime()) ? "Undated" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }); };
const flagCol = (f?: string) => (f === "high" || f === "low" ? { bg: "#FCEBEB", fg: RED } : f === "normal" ? { bg: "#EAF7E1", fg: "#3B6D11" } : { bg: BG, fg: MUTE });

export default async function ReportsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");
  const { data: me } = await sb.from("profiles").select("role, full_name, specialty").eq("id", user.id).single();
  if (me?.role !== "doctor") redirect("/dashboard");
  const { data: grant } = await sb.from("access_grants").select("id").eq("doctor_id", user.id).eq("patient_id", id).maybeSingle();
  if (!grant) notFound();

  const { data: patient } = await sb.from("profiles").select("full_name, patient_code").eq("id", id).single();
  const { data: records } = await sb.from("records").select("*").eq("patient_id", id).order("report_date", { ascending: false });
  const recs = records || [];

  const counts: Record<string, number> = {};
  recs.forEach((r: RecordRow) => { const k = r.category || "other"; counts[k] = (counts[k] || 0) + 1; });

  return (
    <main style={{ minHeight: "100vh", background: BG, display: "flex", fontFamily: "ui-sans-serif, system-ui, sans-serif", color: "#16241E" }}>
      <style>{`@keyframes rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.r-in{animation:rise .5s cubic-bezier(.22,1,.36,1) both}.pcard{transition:box-shadow .3s,transform .3s}.pcard:hover{box-shadow:0 12px 30px rgba(11,92,67,.08);transform:translateY(-2px)}@media (prefers-reduced-motion:reduce){.r-in{animation:none}}`}</style>

      <DocSidebar patientId={id} patientName={patient?.full_name} doctorName={me?.full_name} specialty={me?.specialty} />

      <section style={{ flex: 1, minWidth: 0, padding: "24px 30px 40px" }}>
        <div className="r-in" style={{ color: GREEN, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontSize: 11, marginBottom: 18 }}>Reports</div>

        <div className="r-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, paddingBottom: 18, borderBottom: `2px solid #16241E`, marginBottom: 22 }}>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 500, margin: 0, fontFamily: "Georgia, serif" }}>All reports</h1>
            <p style={{ color: MUTE, fontSize: 13, margin: "5px 0 0" }}>{patient?.full_name} · {patient?.patient_code} · {recs.length} documents</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(counts).map(([k, n]) => {
              const c = cat[k] || cat.other;
              return <span key={k} style={{ fontSize: 12, fontWeight: 600, background: c.bg, color: c.fg, padding: "5px 12px", borderRadius: 999 }}>{c.label} · {n}</span>;
            })}
          </div>
        </div>

        {recs.length === 0 && (
          <div className="pcard" style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 14, padding: "2.5rem", textAlign: "center", color: MUTE }}>No reports for this patient yet.</div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {recs.map((r: RecordRow, i: number) => {
            const c = cat[r.category || "other"] || cat.other;
            const dps = r.data_points || [];
            return (
              <div key={r.id} className="pcard r-in" style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 14, padding: "1.25rem 1.4rem", animationDelay: `${i * 0.04}s`, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 600, background: c.bg, color: c.fg, padding: "3px 11px", borderRadius: 999 }}>{c.label}</span>
                  <span style={{ fontSize: 12, color: MUTE, fontWeight: 500 }}>{fmtD(r.report_date || r.created_at)}</span>
                </div>

                {r.source && <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 8px", color: "#2A3A33" }}>{r.source}</p>}

                <p style={{ fontSize: 13, lineHeight: 1.6, color: "#3D4B45", margin: "0 0 12px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{r.summary_en}</p>

                {dps.length > 0 && (
                  <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: "auto", paddingTop: 10, borderTop: `1px solid ${LINE}` }}>
                    {dps.slice(0, 5).map((d: DataPoint, j: number) => {
                      const fc = flagCol(d.flag);
                      return <span key={j} style={{ fontSize: 11.5, fontWeight: 600, background: fc.bg, color: fc.fg, padding: "3px 9px", borderRadius: 8 }}>{d.test}: {d.value}{d.unit ? ` ${d.unit}` : ""}</span>;
                    })}
                    {dps.length > 5 && <span style={{ fontSize: 11.5, color: MUTE, padding: "3px 4px" }}>+{dps.length - 5}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}