import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
import type { RecordRow } from "@/lib/types";
import { translateText } from "@/lib/translate";
import DashboardClient from "./DashboardClient";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang: forceEn } = await searchParams;
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await sb
    .from("profiles")
    .select("*")
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

  return (
    <DashboardClient 
      records={recs} 
      profile={profile} 
      lang={lang} 
      latestSummary={latestSummary} 
      heroHeadline={heroHeadline} 
      first={first} 
      lastInit={lastInit} 
      patientLang={patientLang} 
    />
  );
}