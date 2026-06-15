// Shared clinical-derivation logic.
// Builds trend metrics, vitals, and patient-safe insights from a patient's
// records. Used by the patient dashboard (health snapshot + report patterns),
// the doctor view, and the doctor-ready shared summary. One source of truth.

import type { Range, Profile, DataPoint, RecordRow, SeriesPoint, DualPoint, SinglePoint, MetricPoint } from "./types";
export const GREEN = "#0B5C43", RED = "#A3422E", AMBER = "#BA7517", MUTE = "#75857D";

export type Metric = {
  test: string;
  unit: string;
  dual: boolean;
  lo?: number | null;
  hi?: number | null;
  points: MetricPoint[];
  min: number;
  max: number;
  latestLabel: string;
  verdict: string;
  vColor: string;
  count: number;
  first: string;
  last: string;
};
export type Vital = { label: string; value: string; unit: string; spark: string | null; ok: boolean };
export type Insight = { tone: "red" | "amber" | "green"; text: string };

// --- helpers ---------------------------------------------------------------

export function parseRange(s?: string) {
  if (!s) return null;
  const t = String(s);
  const nums = t.match(/\d+\.?\d*/g)?.map(Number) ?? [];
  if (/</.test(t) && nums.length) return { lo: null, hi: nums[0] };
  if (/>/.test(t) && nums.length) return { lo: nums[0], hi: null };
  if (nums.length >= 2) return { lo: Math.min(nums[0], nums[1]), hi: Math.max(nums[0], nums[1]) };
  return null;
}

export function distOutside(v: number, r: Range) {
  if (r.lo !== null && v < r.lo) return r.lo - v;
  if (r.hi !== null && v > r.hi) return v - r.hi;
  return 0;
}

export const fmtD = (s?: string) => {
  const d = new Date(s || "");
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
};

// sparkline points string for a small inline svg (viewBox ~60x18)
export function mini(vals: number[]) {
  if (vals.length < 2) return null;
  const mn = Math.min(...vals), mx = Math.max(...vals), rg = mx - mn || 1;
  return vals.map((v, i) => `${(i / (vals.length - 1)) * 58 + 1},${17 - ((v - mn) / rg) * 14}`).join(" ");
}

export function bmiOf(profile: Profile): string | null {
  return profile?.height_cm && profile?.weight_kg
    ? (profile.weight_kg / Math.pow(profile.height_cm / 100, 2)).toFixed(1)
    : null;
}

export function ageOf(profile: Profile): number | null {
  return profile?.dob ? Math.floor((Date.now() - new Date(profile.dob).getTime()) / 3.156e10) : null;
}

// --- core ------------------------------------------------------------------

// Flatten records -> time-sorted series per test name, plus the raw points.
export function buildSeries(records: RecordRow[]) {
  const recs = records || [];
  const points = recs.flatMap((r: RecordRow) =>
    (r.data_points || []).map((d: DataPoint) => ({ ...d, date: r.report_date || r.created_at }))
  );

  const series: Record<string, SeriesPoint[]> = {};
  for (const p of points) {
    if (!p.test) continue;
    const raw = String(p.value ?? "").trim();
    const bp = raw.match(/^(\d+\.?\d*)\s*\/\s*(\d+\.?\d*)$/);
    if (bp) {
      (series[p.test] ||= []).push({ date: p.date || "", sys: +bp[1], dia: +bp[2], dual: true, unit: p.unit, nr: p.normal_range, flag: p.flag });
    } else {
      const v = parseFloat(raw);
      if (isNaN(v)) continue;
      (series[p.test] ||= []).push({ date: p.date || "", v, unit: p.unit, nr: p.normal_range, flag: p.flag });
    }
  }
  Object.values(series).forEach((a) => a.sort((x, y) => new Date(x.date).getTime() - new Date(y.date).getTime()));
  return { series, points };
}

// Per-test trend metrics (only tests with 2+ readings), strongest first.
export function buildMetrics(series: Record<string, SeriesPoint[]>): Metric[] {
  return Object.entries(series)
    .filter(([, a]) => a.length >= 2)
    .map(([test, arr]) => {
      const unit = arr[arr.length - 1].unit || "";
      if (arr[0].dual) {
        const da = arr as DualPoint[];
        const last = da[da.length - 1];
        const all = da.flatMap((a) => [a.sys, a.dia]);
        let min = Math.min(...all), max = Math.max(...all);
        const pad = (max - min) * 0.18 || 6; min -= pad; max += pad;
        let verdict = "normal", vColor = GREEN;
        if (last.sys >= 140 || last.dia >= 90) { verdict = "high"; vColor = RED; }
        else if (last.sys >= 130 || last.dia >= 85) { verdict = "elevated"; vColor = AMBER; }
        return { test, unit: "mmHg", dual: true, points: da.map((a) => ({ label: fmtD(a.date), sys: a.sys, dia: a.dia })), min, max, latestLabel: `${last.sys}/${last.dia}`, verdict, vColor, count: da.length, first: fmtD(da[0].date), last: fmtD(last.date) };
      }
      const sa = arr as SinglePoint[];
      const last = sa[sa.length - 1];
      const range = parseRange(last.nr);
      const vals = sa.map((a) => a.v);
      let min = Math.min(...vals), max = Math.max(...vals);
      if (range?.lo != null) min = Math.min(min, range.lo);
      if (range?.hi != null) max = Math.max(max, range.hi);
      const pad = (max - min) * 0.14 || 1; min -= pad; max += pad;
      let verdict = "", vColor = MUTE;
      if (range) {
        const d0 = distOutside(sa[0].v, range), d1 = distOutside(last.v, range);
        if (d1 === 0 && d0 === 0) { verdict = "in range"; vColor = GREEN; }
        else if (d1 < d0) { verdict = "improving"; vColor = GREEN; }
        else if (d1 > d0) { verdict = "worsening"; vColor = RED; }
        else { verdict = d1 > 0 ? "out of range" : "stable"; vColor = d1 > 0 ? RED : MUTE; }
      } else {
        const dl = last.v - sa[sa.length - 2].v;
        verdict = dl > 0 ? "rising" : dl < 0 ? "falling" : "stable";
      }
      return { test, unit, dual: false, lo: range?.lo ?? null, hi: range?.hi ?? null, points: sa.map((a) => ({ label: fmtD(a.date), v: a.v })), min, max, latestLabel: String(last.v), verdict, vColor, count: sa.length, first: fmtD(sa[0].date), last: fmtD(last.date) };
    })
    .sort((a, b) => b.count - a.count);
}
// Headline vitals for the snapshot strip.
export function buildVitals(series: Record<string, SeriesPoint[]>, profile: Profile): Vital[] {
  const findSeries = (re: RegExp) => Object.entries(series).find(([t]) => re.test(t));
  const vital = (re: RegExp, label: string): Vital | null => {
    const s = findSeries(re);
    if (!s) return null;
    const arr = s[1];
    const last = arr[arr.length - 1];
    if (last.dual) {
      return { label, value: `${last.sys}/${last.dia}`, unit: "mmHg", spark: mini((arr as DualPoint[]).map((a) => a.sys)), ok: last.sys < 130 && last.dia < 85 };
    }
    return { label, value: `${last.v}`, unit: last.unit || "", spark: mini((arr as SinglePoint[]).map((a) => a.v)), ok: last.flag ? last.flag === "normal" : true };
  };

  const vitals = [
    vital(/heart rate|pulse/i, "Heart rate"),
    vital(/blood pressure|^bp\b/i, "Blood pressure"),
    vital(/spo2|oxygen|sao2/i, "SpO\u2082"),
    vital(/temp/i, "Temp"),
  ].filter(Boolean) as Vital[];

  const bmi = bmiOf(profile);
  if (bmi) vitals.push({ label: "BMI", value: bmi, unit: "", spark: null, ok: +bmi >= 18.5 && +bmi <= 24.9 });
  return vitals;
}

// Patient-safe plain-language insights. No treatment instructions.
export function buildInsights(metrics: Metric[], points: { flag?: string }[]): Insight[] {
  const insights: Insight[] = [];
  metrics.forEach((m) => {
    if (m.verdict === "worsening" || m.verdict === "high")
      insights.push({ tone: "red", text: `${m.test} has been ${m.verdict} — latest ${m.latestLabel}${m.unit ? ` ${m.unit}` : ""}. Worth discussing with your doctor.` });
    else if (m.verdict === "elevated")
      insights.push({ tone: "amber", text: `${m.test} is slightly elevated (${m.latestLabel} ${m.unit}).` });
    else if (m.verdict === "improving")
      insights.push({ tone: "green", text: `${m.test} is improving across ${m.count} readings.` });
  });
  const flagged = points.filter((p) => p.flag === "high" || p.flag === "low").length;
  if (flagged) insights.unshift({ tone: "amber", text: `${flagged} reading${flagged > 1 ? "s" : ""} outside the normal range on record.` });
  return insights;
}

// One call -> everything the dashboard + summary need.
export function buildHealth(records: RecordRow[], profile: Profile) {
  const { series, points } = buildSeries(records);
  const metrics = buildMetrics(series);
  const vitals = buildVitals(series, profile);
  const insights = buildInsights(metrics, points);
  return { metrics, vitals, insights, points, primary: metrics[0] || null };
}
