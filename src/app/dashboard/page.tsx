import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
import LogoutButton from "./LogoutButton";
import Uploader from "./Uploader";

export default async function Dashboard() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await sb
    .from("profiles").select("full_name, patient_code").eq("id", user.id).single();

  const { data: records } = await sb
    .from("records").select("*").order("created_at", { ascending: false });

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "2.5rem 1.25rem", fontFamily: "system-ui" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500 }}>Hi{profile?.full_name ? `, ${profile.full_name}` : ""}</h1>
        <LogoutButton />
      </div>

      <div style={{ background: "#E1F5EE", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: "#0F6E56", margin: 0 }}>Your patient ID</p>
        <p style={{ fontSize: 22, fontWeight: 500, color: "#0F6E56", margin: "2px 0 0", letterSpacing: 1 }}>{profile?.patient_code || "—"}</p>
      </div>

      <Uploader />

      <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 12 }}>Your records</h2>
      {(!records || records.length === 0) && <p style={{ color: "#888" }}>No records yet. Upload a report above.</p>}
      {(records || []).map((r: any) => (
        <div key={r.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: "1rem", marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: "#888", margin: "0 0 6px" }}>{r.category || "report"} · {r.report_date || "no date"} · {r.source || "unknown"}</p>
          <p style={{ margin: 0, fontSize: 14 }}>{r.summary_en}</p>
        </div>
      ))}
    </main>
  );
}
