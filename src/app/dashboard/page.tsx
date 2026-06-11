import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
import LogoutButton from "./LogoutButton";

export default async function Dashboard() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await sb
    .from("profiles")
    .select("full_name, patient_code, preferred_language")
    .eq("id", user.id)
    .single();

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "2.5rem 1.25rem", fontFamily: "system-ui" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500 }}>
          Hi{profile?.full_name ? `, ${profile.full_name}` : ""}
        </h1>
        <LogoutButton />
      </div>

      <div style={{ background: "#E1F5EE", borderRadius: 12, padding: "1.25rem 1.5rem", marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: "#0F6E56", margin: 0 }}>Your patient ID</p>
        <p style={{ fontSize: 24, fontWeight: 500, color: "#0F6E56", margin: "4px 0 0", letterSpacing: 1 }}>
          {profile?.patient_code || "—"}
        </p>
        <p style={{ fontSize: 12, color: "#0F6E56", margin: "6px 0 0", opacity: 0.8 }}>
          Share this with your doctor to give them access to your records.
        </p>
      </div>

      <p style={{ color: "#666" }}>Your records and uploads will appear here soon.</p>
    </main>
  );
}
