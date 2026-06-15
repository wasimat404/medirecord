import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
import type { RecordRow } from "@/lib/types";
import { translateText } from "@/lib/translate";
import LangToggle from "./LangToggle";
import LogoutButton from "./LogoutButton";
import CopyId from "./CopyId";
import Timeline from "./Timeline";
import JustAsk from "./JustAsk";
import DocumentVault from "./DocumentVault";
import HealthJourney from "./HealthJourney";
import SmartUpload from "./SmartUpload";
import TranslateBot from "./TranslateBot";

const GREEN_DEEP = "#2E9E63", TEAL = "#1FAE94", INK = "#22332C", MUTE = "#6B7C74", LINE = "#E5EFE9";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang: forceEn } = await searchParams;
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await sb
    .from("profiles")
    .select("full_name, patient_code, preferred_language")
    .eq("id", user.id).single();

  const { data: records } = await sb
    .from("records").select("*").order("report_date", { ascending: false });
  const recs = records || [];

  const patientLang = profile?.preferred_language || "en";
  const lang = forceEn === "en" ? "en" : patientLang;
  if (lang !== "en") {
    await Promise.all(recs.map(async (r: RecordRow) => {
      if (r.summary_en) r.summary_display = await translateText(r.summary_en, lang);
    }));
  }
  const latest = recs.find((r: RecordRow) => r.summary_display || r.summary_en);
  const latestSummary = latest ? (latest.summary_display ?? latest.summary_en) : null;
  const heroHeadline = lang !== "en"
    ? await translateText("According to your last report", lang)
    : "According to your last report";

  const first = profile?.full_name ? profile.full_name.split(" ")[0] : "there";
  const lastInit = profile?.full_name ? (profile.full_name.split(" ").slice(-1)[0]?.[0] || "") : "";
  const hour = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })).getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <main style={{ background: "linear-gradient(135deg,#E9F6EF 0%,#DBEFE6 100%)", minHeight: "100vh", fontFamily: "ui-sans-serif, system-ui, sans-serif", color: INK }}>
      <style>{`@keyframes rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.r-in{animation:rise .5s cubic-bezier(.22,1,.36,1) both}.pcard{transition:box-shadow .25s,transform .25s}.pcard:hover{transform:translateY(-2px)}@media (prefers-reduced-motion:reduce){.r-in{animation:none}}@media (max-width:860px){.dash-top{grid-template-columns:1fr !important}.dash-pad{padding-left:1.1rem !important;padding-right:1.1rem !important}}`}</style>

      <header style={{ background: "#fff", borderBottom: `1px solid ${LINE}`, padding: "12px 0" }}>
        <div className="dash-pad" style={{ maxWidth: 1680, margin: "0 auto", padding: "0 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, background: "#DCF1E4", color: TEAL, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            </span>
            <span style={{ fontWeight: 600, fontSize: 15.5 }}>MediRecord</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {patientLang !== "en" && <LangToggle lang={patientLang} />}
            {profile?.patient_code && <CopyId code={profile.patient_code} />}
            <span style={{ width: 32, height: 32, borderRadius: "50%", background: "#DCF1E4", color: GREEN_DEEP, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 13, fontFamily: "Georgia, serif" }}>{(first[0] || "?").toUpperCase()}{lastInit.toUpperCase()}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="dash-pad" style={{ maxWidth: 1680, margin: "0 auto", padding: "1.75rem 2rem 4rem" }}>
        <p style={{ color: MUTE, fontSize: 13.5, margin: "0 0 3px" }}>{greet},</p>
        <h1 style={{ fontSize: 30, fontWeight: 600, margin: "0 0 4px", fontFamily: "Georgia, 'Times New Roman', serif" }}>{first}</h1>
        <p style={{ fontSize: 14, color: MUTE, margin: "0 0 24px" }}>How can we help you understand your health today?</p>

        <div className="dash-top" style={{ display: "grid", gridTemplateColumns: "300px minmax(0, 1fr)", gap: 18, marginBottom: 18, alignItems: "start" }}>
          <div className="r-in"><HealthJourney records={recs} /></div>
          <div className="r-in" style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>
            <JustAsk />
            <TranslateBot headline={heroHeadline} summary={latestSummary} lang={lang} />
          </div>
        </div>

        <div className="r-in"><DocumentVault records={recs} /></div>
        <div className="r-in"><SmartUpload /></div>

        <div className="r-in">
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: MUTE, textTransform: "uppercase", margin: "0 0 12px" }}>Your records</p>
          <Timeline records={recs} />
        </div>
      </div>
    </main>
  );
}