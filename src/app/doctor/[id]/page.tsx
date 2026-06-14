import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";
import PrescribeBox from "./PrescribeBox";
import MetricCharts from "./MetricCharts";
import DocSidebar from "../DocSidebar";

const GREEN = "#0B5C43", RED = "#A3422E", AMBER = "#BA7517", MUTE = "#75857D", LINE = "#E6ECE9", BG = "#F4F7F5";
const catLabel: Record<string, string> = { blood_test: "Lab", imaging: "Imaging", prescription: "Rx", bill: "Bill", other: "Doc" };

function parseRange(s?: string) {
  if (!s) return null; const t = String(s); const nums = t.match(/\d+\.?\d*/g)?.map(Number) ?? [];
  if (/</.test(t) && nums.length) return { lo: null, hi: nums[0] };
  if (/>/.test(t) && nums.length) return { lo: nums[0], hi: null };
  if (nums.length >= 2) return { lo: Math.min(nums[0], nums[1]), hi: Math.max(nums[0], nums[1]) };
  return null;
}
function distOutside(v: number, r: any) { if (r.lo !== null && v < r.lo) return r.lo - v; if (r.hi !== null && v > r.hi) return v - r.hi; return 0; }
const fmtD = (s: string) => { const d = new Date(s); return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }); };

function mini(vals: number[]) {
  if (vals.length < 2) return null;
  const mn = Math.min(...vals), mx = Math.max(...vals), rg = mx - mn || 1;
  return vals.map((v, i) => `${(i / (vals.length - 1)) * 58 + 1},${17 - ((v - mn) / rg) * 14}`).join(" ");
}

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
  const age = patient?.dob ? Math.floor((Date.now() - new Date(patient.dob).getTime()) / 3.156e10) : null;
  const bmi = patient?.height_cm && patient?.weight_kg ? (patient.weight_kg / Math.pow(patient.height_cm / 100, 2)).toFixed(1) : null;

  const pts = recs.flatMap((r: any) => (r.data_points || []).map((d: any) => ({ ...d, date: r.report_date || r.created_at })));
  const series: Record<string, any[]> = {};
  for (const p of pts) {
    if (!p.test) continue;
    const raw = String(p.value ?? "").trim();
    const bp = raw.match(/^(\d+\.?\d*)\s*\/\s*(\d+\.?\d*)$/);
    if (bp) (series[p.test] ||= []).push({ date: p.date, sys: +bp[1], dia: +bp[2], dual: true, unit: p.unit, nr: p.normal_range });
    else { const v = parseFloat(raw); if (isNaN(v)) continue; (series[p.test] ||= []).push({ date: p.date, v, unit: p.unit, nr: p.normal_range }); }
  }
  Object.values(series).forEach((a) => a.sort((x, y) => new Date(x.date).getTime() - new Date(y.date).getTime()));

  const metrics = Object.entries(series).filter(([, a]) => a.length >= 2).map(([test, arr]) => {
    const unit = arr[arr.length - 1].unit || "", last = arr[arr.length - 1];
    if (arr[0].dual) {
      const all = arr.flatMap((a) => [a.sys, a.dia]); let min = Math.min(...all), max = Math.max(...all); const pad = (max - min) * 0.18 || 6; min -= pad; max += pad;
      let verdict = "normal", vColor = GREEN;
      if (last.sys >= 140 || last.dia >= 90) { verdict = "high"; vColor = RED; } else if (last.sys >= 130 || last.dia >= 85) { verdict = "elevated"; vColor = AMBER; }
      return { test, unit: "mmHg", dual: true, points: arr.map((a) => ({ label: fmtD(a.date), sys: a.sys, dia: a.dia })), min, max, latestLabel: `${last.sys}/${last.dia}`, verdict, vColor, count: arr.length, first: fmtD(arr[0].date), last: fmtD(last.date) };
    }
    const range = parseRange(last.nr); const vals = arr.map((a) => a.v); let min = Math.min(...vals), max = Math.max(...vals);
    if (range?.lo != null) min = Math.min(min, range.lo); if (range?.hi != null) max = Math.max(max, range.hi);
    const pad = (max - min) * 0.14 || 1; min -= pad; max += pad;
    let verdict = "", vColor = MUTE;
    if (range) { const d0 = distOutside(arr[0].v, range), d1 = distOutside(last.v, range);
      if (d1 === 0 && d0 === 0) { verdict = "in range"; vColor = GREEN; } else if (d1 < d0) { verdict = "improving"; vColor = GREEN; } else if (d1 > d0) { verdict = "worsening"; vColor = RED; } else { verdict = d1 > 0 ? "out of range" : "stable"; vColor = d1 > 0 ? RED : MUTE; }
    } else { const dl = last.v - arr[arr.length - 2].v; verdict = dl > 0 ? "rising" : dl < 0 ? "falling" : "stable"; }
    return { test, unit, dual: false, lo: range?.lo ?? null, hi: range?.hi ?? null, points: arr.map((a) => ({ label: fmtD(a.date), v: a.v })), min, max, latestLabel: String(last.v), verdict, vColor, count: arr.length, first: fmtD(arr[0].date), last: fmtD(last.date) };
  }).sort((a, b) => b.count - a.count);

  const findSeries = (re: RegExp) => Object.entries(series).find(([t]) => re.test(t));
  const vital = (re: RegExp, label: string) => {
    const s = findSeries(re); if (!s) return null;
    const arr = s[1]; const last = arr[arr.length - 1];
    if (last.dual) return { label, value: `${last.sys}/${last.dia}`, unit: "mmHg", spark: mini(arr.map((a: any) => a.sys)), ok: last.sys < 130 && last.dia < 85 };
    return { label, value: `${last.v}`, unit: last.unit || "", spark: mini(arr.map((a: any) => a.v)), ok: last.flag ? last.flag === "normal" : true };
  };
  const vitals = [vital(/heart rate|pulse/i, "Heart rate"), vital(/blood pressure|^bp\b/i, "Blood pressure"), vital(/spo2|oxygen|sao2/i, "SpO₂"), vital(/temp/i, "Temp")].filter(Boolean) as any[];
  if (bmi) vitals.push({ label: "BMI", value: bmi, unit: "", spark: null, ok: +bmi >= 18.5 && +bmi <= 24.9 });

  const primary = metrics[0];
  const insights: { tone: string; text: string }[] = [];
  metrics.forEach((m) => {
    if (m.verdict === "worsening" || m.verdict === "high") insights.push({ tone: "red", text: `${m.test} ${m.verdict} — latest ${m.latestLabel}${m.unit ? ` ${m.unit}` : ""}. Review.` });
    else if (m.verdict === "elevated") insights.push({ tone: "amber", text: `${m.test} elevated (${m.latestLabel} ${m.unit}). Monitor.` });
    else if (m.verdict === "improving") insights.push({ tone: "green", text: `${m.test} improving across ${m.count} readings.` });
  });
  const flaggedCount = pts.filter((p: any) => p.flag === "high" || p.flag === "low").length;
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
                {recentReports.map((r: any) => (
                  <div key={r.id} style={{ background: BG, borderRadius: 10, padding: "10px 12px" }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: GREEN, margin: 0 }}>{catLabel[r.category] || "Doc"}</p>
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