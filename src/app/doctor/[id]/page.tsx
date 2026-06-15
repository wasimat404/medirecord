import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";
import PrescribeBox from "./PrescribeBox";
import MetricCharts from "./MetricCharts";
import DocSidebar from "../DocSidebar";
import { buildHealth, fmtD } from "@/lib/health";
import type { RecordRow } from "@/lib/types";

const GREEN = "#0B5C43", RED = "#A3422E", AMBER = "#BA7517", MUTE = "#75857D", LINE = "#E6ECE9", BG = "#F4F7F5";
const catLabel: Record<string, string> = { blood_test: "Lab", imaging: "Imaging", prescription: "Rx", bill: "Bill", other: "Doc" };

export default async function PatientView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");
  const { data: me } = await sb.from("profiles").select("role, full_name, specialty").eq("id", user.id).single();
  if (me?.role !== "doctor") redirect("/dashboard");
  const { data: grant } = await sb.from("access_grants").select("id").eq("doctor_id", user.id).eq("patient_id", id).maybeSingle();
  if (!grant) notFound();

  const { data: patient } = await sb.from("profiles").select("*").eq("id", id).single();
  const { data: records } = await sb.from("records").select("*").eq("patient_id", id).order("report_date", { ascending: false });
  const recs = records || [];
  // eslint-disable-next-line react-hooks/purity -- async server component, evaluated once per request
  const age = patient?.dob ? Math.floor((Date.now() - new Date(patient.dob).getTime()) / 3.156e10) : null;

  const { metrics, vitals, points: pts } = buildHealth(recs, patient);

  const primary = metrics[0];
  const insights: { tone: string; text: string }[] = [];
  metrics.forEach((m) => {
    if (m.verdict === "worsening" || m.verdict === "high") insights.push({ tone: "red", text: `${m.test} ${m.verdict} — latest ${m.latestLabel}${m.unit ? ` ${m.unit}` : ""}. Review.` });
    else if (m.verdict === "elevated") insights.push({ tone: "amber", text: `${m.test} elevated (${m.latestLabel} ${m.unit}). Monitor.` });
    else if (m.verdict === "improving") insights.push({ tone: "green", text: `${m.test} improving across ${m.count} readings.` });
  });
  const flaggedCount = pts.filter((p) => p.flag === "high" || p.flag === "low").length;
  if (flaggedCount) insights.unshift({ tone: "amber", text: `${flaggedCount} reading${flaggedCount > 1 ? "s" : ""} outside normal range on record.` });
  const recentReports = recs.slice(0, 4);

  return (
    <main style={{ minHeight: "100vh", background: BG, display: "flex", fontFamily: "ui-sans-serif, system-ui, sans-serif", color: "#16241E" }}>
      <style>{`@keyframes rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.r-in{animation:rise .55s cubic-bezier(.22,1,.36,1) both}.pcard{transition:box-shadow .3s,transform .3s}.pcard:hover{box-shadow:0 12px 30px rgba(11,92,67,.07);transform:translateY(-2px)}@media (prefers-reduced-motion:reduce){.r-in{animation:none}}`}</style>

      <DocSidebar patientId={id} patientName={patient?.full_name} doctorName={me?.full_name} specialty={me?.specialty} />

      <section style={{ flex: 1, minWidth: 0, padding: "20px 26px 40px" }}>
        <div className="r-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: MUTE, fontSize: 12.5, marginBottom: 18 }}>
          <span style={{ color: GREEN, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontSize: 11 }}>Doctor portal</span>
          <span>{new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
        </div>

        <div className="r-in pcard" style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 16, padding: "1.25rem 1.5rem", marginBottom: 18, display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <span style={{ width: 52, height: 52, borderRadius: "50%", background: "#EAF3EF", color: GREEN, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 20, fontFamily: "Georgia, serif", flexShrink: 0 }}>{(patient?.full_name || "?")[0]}</span>
          <div style={{ flexShrink: 0 }}>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0, fontFamily: "Georgia, serif" }}>{patient?.full_name || "Patient"}</h1>
            <p style={{ fontSize: 12, color: MUTE, margin: "2px 0 0" }}>{age ? `${age} yrs` : "—"}{patient?.blood_group ? ` · ${patient.blood_group}` : ""} · {patient?.patient_code}</p>
          </div>
          <div style={{ display: "flex", gap: 10, marginLeft: "auto", flexWrap: "wrap" }}>
            {vitals.map((v) => (
              <div key={v.label} style={{ background: BG, borderRadius: 12, padding: "8px 12px", minWidth: 78 }}>
                <p style={{ fontSize: 10.5, color: MUTE, margin: 0, textTransform: "uppercase", letterSpacing: .5 }}>{v.label}</p>
                <p style={{ fontSize: 16, fontWeight: 600, margin: "1px 0 0", color: v.ok ? GREEN : AMBER, fontFamily: "Georgia, serif" }}>{v.value}<span style={{ fontSize: 10, color: MUTE, fontWeight: 400, fontFamily: "ui-sans-serif" }}>{v.unit ? ` ${v.unit}` : ""}</span></p>
                {v.spark && <svg width="60" height="18" viewBox="0 0 60 18" style={{ display: "block", marginTop: 2 }}><polyline points={v.spark} fill="none" stroke={v.ok ? GREEN : AMBER} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: "2 1 440px", minWidth: 0 }}>
            {metrics.length > 0 ? <MetricCharts metrics={metrics} /> : (
              <div className="pcard" style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 14, padding: "2.5rem", textAlign: "center", color: MUTE, marginBottom: 18 }}>Trends appear once this patient has 2+ readings of the same test.</div>
            )}

            <div className="r-in pcard" style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 14, padding: "1.2rem 1.4rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <p style={{ color: MUTE, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>Recent reports</p>
                <Link href={`/doctor/${id}/reports`} style={{ fontSize: 12, color: GREEN, fontWeight: 600, textDecoration: "none" }}>View all &rarr;</Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10 }}>
                {recentReports.map((r: RecordRow) => (
                  <div key={r.id} style={{ background: BG, borderRadius: 10, padding: "10px 12px" }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: GREEN, margin: 0 }}>{catLabel[r.category || "other"] || "Doc"}</p>
                    <p style={{ fontSize: 11, color: MUTE, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.source || "—"}</p>
                    <p style={{ fontSize: 10.5, color: MUTE, margin: "3px 0 0" }}>{fmtD(r.report_date || r.created_at)}</p>
                  </div>
                ))}
                {recentReports.length === 0 && <p style={{ fontSize: 13, color: MUTE, margin: 0 }}>No reports yet.</p>}
              </div>
            </div>
          </div>

          <div style={{ flex: "1 1 280px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            {primary && (
              <div className="r-in pcard" style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 14, padding: "1.3rem 1.4rem" }}>
                <p style={{ color: MUTE, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 12px" }}>Clinical record</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: MUTE }}>Latest {primary.test}</span>
                  <span style={{ fontSize: 20, fontWeight: 600, color: primary.vColor, fontFamily: "Georgia, serif" }}>{primary.latestLabel}<span style={{ fontSize: 11, color: MUTE, fontFamily: "ui-sans-serif" }}>{primary.unit ? ` ${primary.unit}` : ""}</span></span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 12.5, color: MUTE }}>Readings tracked</span><span style={{ fontSize: 13, fontWeight: 600 }}>{primary.count}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 12.5, color: MUTE }}>Status</span><span style={{ fontSize: 12, fontWeight: 700, color: primary.vColor, textTransform: "uppercase", letterSpacing: .5 }}>{primary.verdict}</span></div>
              </div>
            )}

            <div className="r-in pcard" style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 14, padding: "1.3rem 1.4rem" }}>
              <p style={{ color: MUTE, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 12px" }}>Insights &amp; alerts</p>
              {insights.length === 0 && <p style={{ fontSize: 13, color: MUTE, margin: 0 }}>No alerts. Readings within expected ranges.</p>}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {insights.slice(0, 5).map((ins, i) => {
                  const col = ins.tone === "red" ? RED : ins.tone === "amber" ? AMBER : GREEN;
                  return (
                    <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: col, marginTop: 6, flexShrink: 0 }} />
                      <span style={{ fontSize: 12.5, color: "#3D4B45", lineHeight: 1.45 }}>{ins.text}</span>
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: 10.5, color: MUTE, margin: "12px 0 0", lineHeight: 1.4, fontStyle: "italic" }}>Auto-generated from readings — clinical judgment required.</p>
            </div>

            <div className="r-in"><PrescribeBox patientId={id} doctorName={me?.full_name || "Doctor"} /></div>
          </div>
        </div>
      </section>
    </main>
  );
}