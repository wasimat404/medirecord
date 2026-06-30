"use client";
import { useState, useEffect } from "react";
import type { RecordRow } from "@/lib/types";

export default function LatestHighlight({ records }: { records: RecordRow[] }) {
  const [shortSummary, setShortSummary] = useState<string>("Analyzing test...");

  // Find the latest record with data points
  const latest = records.find(r => r.data_points && r.data_points.length > 0);
  
  // eslint-disable-next-line
  useEffect(() => {
    if (!latest?.summary_en) {
      setShortSummary("Lab Report");
      return;
    }
    const cacheKey = `shortName_${latest.id}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setShortSummary(cached);
      return;
    }
    fetch("/api/shorten", { method: "POST", body: JSON.stringify({ text: latest.summary_en }) })
      .then(res => res.json())
      .then(data => {
        if (data.short) {
          setShortSummary(data.short);
          localStorage.setItem(cacheKey, data.short);
        }
      }).catch(() => setShortSummary("Lab Report"));
  }, [latest]);

  if (!latest) return null;

  // Extract up to 4 key data points. Prioritize abnormal ones.
  const pts = latest.data_points || [];
  const abnormal = pts.filter(p => p.flag === "high" || p.flag === "low");
  const normal = pts.filter(p => p.flag !== "high" && p.flag !== "low");
  const highlights = [...abnormal, ...normal].slice(0, 4);

  const testName = pts.length === 1 && pts[0].test ? pts[0].test : (latest.category === "blood_test" ? "Lab Report" : "Recent Test");
  const dateStr = new Date(latest.report_date || latest.created_at || "").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  
  const abnormalCount = abnormal.length;
  const reaction = abnormalCount > 0 
    ? { label: "Requires Attention", bg: "#FF6B83", color: "#ffffff" } 
    : { label: "All Good", bg: "#8CE6BD", color: "#0D2B22" };

  return (
    <div style={{ marginBottom: 20, background: "linear-gradient(135deg, #12211C 0%, #09120F 100%)", borderRadius: 24, padding: "22px 28px", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", position: "relative", overflow: "hidden", boxShadow: "0 12px 30px rgba(0,0,0,0.15)" }}>
      {/* Background glowing effects */}
      <div style={{ position: "absolute", right: -50, top: -50, width: 200, height: 200, background: "radial-gradient(circle, rgba(61,166,114,0.2) 0%, transparent 60%)", filter: "blur(20px)", animation: "pulseH 4s infinite alternate" }} />
      <style>{`@keyframes pulseH { 0% { opacity: 0.5; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1.1); } }`}</style>

      {/* Left title section */}
      <div style={{ flexShrink: 0, position: "relative", zIndex: 1, maxWidth: 240 }}>
        <p style={{ fontSize: 13, fontWeight: 800, color: "#8CE6BD", letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 8px" }}>Latest Insights</p>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#ffffff", margin: "0 0 10px", fontFamily: "Georgia, serif", lineHeight: 1.2 }}>{testName}</h2>
        
        <p style={{ fontSize: 16, color: "#E0ECE6", margin: "0 0 10px", lineHeight: 1.4, fontWeight: 600 }}>{shortSummary}</p>
        
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <p style={{ fontSize: 14, color: "#8CE6BD", margin: 0, fontWeight: 700 }}>{dateStr}</p>
          <span style={{ fontSize: 11, fontWeight: 800, background: reaction.bg, color: reaction.color, padding: "4px 10px", borderRadius: 999, textTransform: "uppercase", letterSpacing: 0.5 }}>
            {reaction.label}
          </span>
        </div>
      </div>

      <div style={{ width: 1, height: 50, background: "rgba(255,255,255,0.1)", display: "none" }} className="divider" />
      <style>{`@media (min-width: 768px) { .divider { display: block !important; } }`}</style>

      {/* Metrics Row */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", flex: 1, position: "relative", zIndex: 1 }}>
        {highlights.map((p, i) => {
          const isAbnormal = p.flag === "high" || p.flag === "low";
          const color = isAbnormal ? "#FF6B83" : "#8CE6BD";
          const bg = isAbnormal ? "rgba(255,107,131,0.1)" : "rgba(140,230,189,0.1)";
          const border = isAbnormal ? "rgba(255,107,131,0.25)" : "rgba(140,230,189,0.25)";

          return (
            <div key={i} style={{ 
              background: bg, border: `1px solid ${border}`, borderRadius: 16, padding: "16px 20px",
              display: "flex", flexDirection: "column", gap: 8, minWidth: 120, flex: 1,
              transition: "transform 0.3s ease, box-shadow 0.3s ease", cursor: "default"
            }} className="highlight-card">
              <p style={{ fontSize: 13, fontWeight: 800, color: isAbnormal ? "#FFB5C1" : "#A8C7B9", margin: 0, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.test}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: color, lineHeight: 1 }}>{p.value}</span>
                {p.unit && <span style={{ fontSize: 15, fontWeight: 700, color: color, opacity: 0.9 }}>{p.unit}</span>}
              </div>
            </div>
          );
        })}
        <style>{`.highlight-card:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }`}</style>
      </div>
    </div>
  );
}
