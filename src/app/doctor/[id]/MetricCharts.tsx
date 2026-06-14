"use client";
import { useState, useRef } from "react";

const GREEN = "#0B5C43", BLUE = "#185FA5", BAND = "#DCEDE5", GRID = "#EAF0ED";

function useHover(n: number) {
  const [hi, setHi] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  function move(e: React.MouseEvent) {
    const r = ref.current!.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    setHi(Math.max(0, Math.min(n - 1, Math.round(x * (n - 1)))));
  }
  return { hi, ref, move, clear: () => setHi(null) };
}

function Single({ m }: any) {
  const n = m.points.length;
  const W = 320, H = 128, P = 16;
  const span = (m.max - m.min) || 1;
  const Y = (v: number) => H - P - ((v - m.min) / span) * (H - 2 * P);
  const X = (i: number) => P + (i / (n - 1)) * (W - 2 * P);
  const pts = m.points.map((p: any, i: number) => [X(i), Y(p.v)]);
  const line = pts.map((p: any) => p.join(",")).join(" ");
  const area = `${P},${H - P} ` + line + ` ${W - P},${H - P}`;
  const bT = m.hi != null ? Y(m.hi) : null, bB = m.lo != null ? Y(m.lo) : null;
  const { hi, ref, move, clear } = useHover(n);
  const hp = hi != null ? m.points[hi] : null;

  return (
    <div ref={ref} style={{ position: "relative", paddingTop: 6 }} onMouseMove={move} onMouseLeave={clear}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height: 134, display: "block" }}>
        {bT != null && bB != null && <rect x={P} width={W - 2 * P} y={Math.min(bT, bB)} height={Math.abs(bB - bT)} fill={BAND} opacity="0.7" rx="3" />}
        {bT != null && bB == null && <rect x={P} width={W - 2 * P} y={bT} height={H - P - bT} fill={BAND} opacity="0.7" rx="3" />}
        {[0.33, 0.66].map((t) => <line key={t} x1={P} x2={W - P} y1={P + t * (H - 2 * P)} y2={P + t * (H - 2 * P)} stroke={GRID} strokeWidth="1" />)}
        <polygon points={area} fill={GREEN} opacity="0.06" />
        <polyline className="cdraw" points={line} fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p: any, i: number) => <circle key={i} cx={p[0]} cy={p[1]} r={i === n - 1 ? 3.5 : 2} fill={i === n - 1 ? GREEN : "#fff"} stroke={GREEN} strokeWidth="1.3" />)}
      </svg>
      {hi != null && (
        <>
          <div style={{ position: "absolute", top: 6, bottom: 0, left: `${(X(hi) / W) * 100}%`, width: 1, background: "rgba(11,92,67,.22)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", left: `${(X(hi) / W) * 100}%`, top: `calc(6px + ${(Y(hp.v) / H) * 100}% * (128/134))`, width: 9, height: 9, borderRadius: "50%", background: GREEN, border: "2px solid #fff", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", left: `${(X(hi) / W) * 100}%`, top: 0, transform: "translate(-50%,-2px)", background: "#16241E", color: "#fff", fontSize: 11, padding: "3px 8px", borderRadius: 6, whiteSpace: "nowrap", pointerEvents: "none", zIndex: 3 }}>
            {hp.v}{m.unit ? ` ${m.unit}` : ""} · {hp.label}
          </div>
        </>
      )}
    </div>
  );
}

function Dual({ m }: any) {
  const n = m.points.length;
  const W = 320, H = 128, P = 16;
  const span = (m.max - m.min) || 1;
  const Y = (v: number) => H - P - ((v - m.min) / span) * (H - 2 * P);
  const X = (i: number) => P + (i / (n - 1)) * (W - 2 * P);
  const sys = m.points.map((p: any, i: number) => [X(i), Y(p.sys)]);
  const dia = m.points.map((p: any, i: number) => [X(i), Y(p.dia)]);
  const sl = sys.map((p: any) => p.join(",")).join(" ");
  const dl = dia.map((p: any) => p.join(",")).join(" ");
  const { hi, ref, move, clear } = useHover(n);
  const hp = hi != null ? m.points[hi] : null;

  return (
    <div ref={ref} style={{ position: "relative", paddingTop: 6 }} onMouseMove={move} onMouseLeave={clear}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height: 134, display: "block" }}>
        {[0.33, 0.66].map((t) => <line key={t} x1={P} x2={W - P} y1={P + t * (H - 2 * P)} y2={P + t * (H - 2 * P)} stroke={GRID} strokeWidth="1" />)}
        <polyline className="cdraw" points={sl} fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline className="cdraw" points={dl} fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {sys.map((p: any, i: number) => <circle key={i} cx={p[0]} cy={p[1]} r="2.4" fill={GREEN} />)}
        {dia.map((p: any, i: number) => <circle key={i} cx={p[0]} cy={p[1]} r="2.4" fill={BLUE} />)}
      </svg>
      {hi != null && (
        <>
          <div style={{ position: "absolute", top: 6, bottom: 0, left: `${(X(hi) / W) * 100}%`, width: 1, background: "rgba(11,92,67,.22)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", left: `${(X(hi) / W) * 100}%`, top: 0, transform: "translate(-50%,-2px)", background: "#16241E", color: "#fff", fontSize: 11, padding: "3px 8px", borderRadius: 6, whiteSpace: "nowrap", pointerEvents: "none", zIndex: 3 }}>
            {hp.sys}/{hp.dia} mmHg · {hp.label}
          </div>
        </>
      )}
    </div>
  );
}

export default function MetricCharts({ metrics }: { metrics: any[] }) {
  if (!metrics.length) return null;
  return (
    <>
      <style>{`@keyframes cdraw{from{stroke-dashoffset:1000}to{stroke-dashoffset:0}}.cdraw{stroke-dasharray:1000;animation:cdraw 1.6s cubic-bezier(.45,0,.2,1) .2s both}@media (prefers-reduced-motion:reduce){.cdraw{animation:none}}`}</style>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 24 }}>
        {metrics.map((m, i) => (
          <div key={m.test} style={{ gridColumn: i === 0 ? "1 / -1" : "auto", background: "#fff", border: "1px solid #E3EAE6", borderRadius: 14, padding: "1.25rem 1.4rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <p style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{m.test}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: m.vColor }}>{m.verdict}</span>
                <span style={{ fontSize: 19, fontWeight: 600, fontFamily: "Georgia, serif", color: m.vColor }}>{m.latestLabel}<span style={{ fontSize: 11, color: "#75857D", fontFamily: "ui-sans-serif" }}>{m.unit ? ` ${m.unit}` : ""}</span></span>
              </div>
            </div>
            <p style={{ color: "#75857D", fontSize: 11.5, margin: "2px 0 0" }}>
              {m.count} readings · {m.first} – {m.last}
              {m.dual && <span style={{ marginLeft: 10 }}><span style={{ color: GREEN, fontWeight: 700 }}>—</span> systolic <span style={{ color: BLUE, fontWeight: 700, marginLeft: 6 }}>—</span> diastolic</span>}
            </p>
            {m.dual ? <Dual m={m} /> : <Single m={m} />}
          </div>
        ))}
      </div>
    </>
  );
}