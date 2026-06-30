"use client";
import { useState, useEffect } from "react";
import type { RecordRow, Profile } from "@/lib/types";
import LangToggle from "./LangToggle";
import LogoutButton from "./LogoutButton";
import CopyId from "./CopyId";
import Timeline from "./Timeline";
import JustAsk from "./JustAsk";
import DocumentVault from "./DocumentVault";
import HealthJourney from "./HealthJourney";
import SmartUpload from "./SmartUpload";
import TranslateBot from "./TranslateBot";
import PatientVitals from "./PatientVitals";
import LatestHighlight from "./LatestHighlight";

function NavItem({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: string }) {
  const bg = active ? "#DCF1E4" : "transparent";
  const color = active ? "#1FAE94" : "#6B7C74";
  return (
    <button onClick={onClick} style={{ 
      display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 14, 
      background: bg, border: "none", cursor: "pointer", color: color, fontSize: 16, 
      fontWeight: 700, transition: "all 0.2s", textAlign: "left", width: "100%"
    }} className="nav-item">
      <span style={{ fontSize: 20 }}>{icon}</span>
      {label}
      <style>{`.nav-item:hover { background: ${active ? '#DCF1E4' : '#F4FBF7'} !important; }`}</style>
    </button>
  );
}

export default function DashboardClient({
  records, profile, lang, latestSummary, heroHeadline, first, lastInit, patientLang
}: {
  records: RecordRow[], profile: Profile | null, lang: string, latestSummary: string | null, heroHeadline: string, first: string, lastInit: string, patientLang: string
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [greet, setGreet] = useState("Good day");

  useEffect(() => {
    const hour = new Date().getHours();
    const g = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    setTimeout(() => setGreet(g), 0);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4FBF7", color: "#1A2420", overflow: "hidden" }}>
      {/* Background Orbs */}
      <div style={{ position: "fixed", top: 0, left: 260, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50%", height: "50%", background: "radial-gradient(circle, rgba(132, 230, 189, 0.4) 0%, transparent 60%)", filter: "blur(70px)", animation: "drift1 14s infinite alternate ease-in-out" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "60%", height: "60%", background: "radial-gradient(circle, rgba(120, 200, 230, 0.3) 0%, transparent 60%)", filter: "blur(70px)", animation: "drift2 18s infinite alternate-reverse ease-in-out" }} />
      </div>
      <style>{`@keyframes drift1 { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(40px, 50px) scale(1.1); } } @keyframes drift2 { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(-40px, -50px) scale(1.15); } } @keyframes rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.r-in{animation:rise .6s cubic-bezier(.22,1,.36,1) both}@media (max-width:860px){.dash-main{margin-left: 0 !important;} .dash-sidebar{display:none !important;}}`}</style>

      {/* Sidebar */}
      <aside className="dash-sidebar" style={{ width: 280, background: "#ffffff", borderRight: "1px solid #E5EFE9", display: "flex", flexDirection: "column", height: "100vh", position: "fixed", left: 0, top: 0, zIndex: 10, boxShadow: "4px 0 24px rgba(0,0,0,0.02)" }}>
        {/* Logo */}
        <div style={{ padding: "30px 24px 40px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 42, height: 42, borderRadius: 12, background: "#DCF1E4", color: "#1FAE94", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
          </span>
          <span style={{ fontWeight: 800, fontSize: 22, color: "#1A2420", letterSpacing: -0.5 }}>MediRecord</span>
        </div>

        {/* Navigation */}
        <nav style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          <NavItem active={activeTab==="overview"} onClick={() => setActiveTab("overview")} icon="📊" label="Overview" />
          <NavItem active={activeTab==="journey"} onClick={() => setActiveTab("journey")} icon="📈" label="Health Journey" />
          <NavItem active={activeTab==="vault"} onClick={() => setActiveTab("vault")} icon="🗄️" label="Document Vault" />
        </nav>

        {/* Profile Bottom */}
        <div style={{ padding: "24px", borderTop: "1px solid #E5EFE9", display: "flex", flexDirection: "column", gap: 16, background: "#FAFCFB" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {patientLang !== "en" && <LangToggle lang={patientLang} />}
            {profile?.patient_code && <CopyId code={profile.patient_code} />}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 40, height: 40, borderRadius: "50%", background: "#DCF1E4", color: "#2E9E63", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, fontFamily: "Georgia, serif" }}>
                {(first[0] || "?").toUpperCase()}{lastInit.toUpperCase()}
              </span>
              <span style={{ fontWeight: 700, fontSize: 16, color: "#1A2420" }}>{first}</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dash-main" style={{ marginLeft: 280, flex: 1, height: "100vh", overflowY: "auto", position: "relative", zIndex: 1, padding: "48px 56px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          
          {activeTab === "overview" && (
            <div className="r-in">
              <p style={{ color: "#4A5D54", fontSize: 18, margin: "0 0 4px", fontWeight: 600 }}>{greet},</p>
              <h1 style={{ fontSize: 38, fontWeight: 800, margin: "0 0 8px", fontFamily: "Georgia, 'Times New Roman', serif", color: "#1A2420" }}>{first}</h1>
              <p style={{ fontSize: 17, color: "#4A5D54", margin: "0 0 36px", fontWeight: 500 }}>Here is your health overview at a glance.</p>
              
              <SmartUpload />
              <div style={{ marginTop: 24 }}><LatestHighlight records={records} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 350px", gap: 24, marginTop: 24, alignItems: "start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <JustAsk />
                  <TranslateBot headline={heroHeadline} summary={latestSummary} lang={lang} />
                </div>
                <PatientVitals profile={profile} records={records} />
              </div>
            </div>
          )}

          {activeTab === "journey" && (
            <div className="r-in">
              <h1 style={{ fontSize: 34, fontWeight: 800, margin: "0 0 32px", fontFamily: "Georgia, serif", color: "#1A2420" }}>Health Journey</h1>
              <HealthJourney records={records} />
            </div>
          )}

          {activeTab === "vault" && (
            <div className="r-in">
              <h1 style={{ fontSize: 34, fontWeight: 800, margin: "0 0 32px", fontFamily: "Georgia, serif", color: "#1A2420" }}>Document Vault</h1>
              <DocumentVault records={records} />
              <div style={{ marginTop: 48 }}>
                <p style={{ fontSize: 15, fontWeight: 800, letterSpacing: 1.2, color: "#4A5D54", textTransform: "uppercase", margin: "0 0 16px" }}>Complete History</p>
                <Timeline records={records} />
              </div>
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}
