import { redirect } from "next/navigation";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";
import type { Profile } from "@/lib/types";
import LogoutButton from "../dashboard/LogoutButton";
import LinkPatient from "./LinkPatient";

const GREEN = "#0B5C43";
const MUTE = "#75857D";
const LINE = "#E3EAE6";

export default async function DoctorHome() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");
  const { data: me } = await sb.from("profiles").select("role, full_name, specialty").eq("id", user.id).single();
  if (me?.role !== "doctor") redirect("/dashboard");

  const { data: grants } = await sb.from("access_grants")
    .select("patient_id, created_at, patient:profiles!access_grants_patient_id_fkey(id, full_name, patient_code, dob, blood_group)")
    .eq("doctor_id", user.id)
    .order("created_at", { ascending: false });

  const list = (grants || []).flatMap((g: { patient: Profile[] }) => g.patient).filter(Boolean);

  return (
    <main style={{ minHeight: "100vh", background: "#FBFCFB", fontFamily: "ui-sans-serif, system-ui, sans-serif", color: "#16241E" }}>
      <style>{`
        @keyframes rise { from { opacity:0; transform:translateY(14px);} to { opacity:1; transform:translateY(0);} }
        .r-in { animation: rise .6s cubic-bezier(.22,1,.36,1) both; }
        .pcard { background:#fff; border:1px solid ${LINE}; border-radius:14px; transition: box-shadow .35s ease, transform .35s ease; }
        .pcard:hover { box-shadow: 0 14px 36px rgba(11,92,67,.09); transform: translateY(-3px); }
        @media (prefers-reduced-motion: reduce){ .r-in{animation:none;} .pcard{transition:none;} }
      `}</style>

      <div style={{ borderBottom: `1px solid ${LINE}`, background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "1.1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 30, height: 30, borderRadius: 9, background: GREEN, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>M</span>
            <span style={{ fontWeight: 600, fontSize: 15 }}>MediRecord <span style={{ color: GREEN }}>Clinic</span></span>
          </div>
          <LogoutButton />
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2.25rem 1.5rem 4rem" }}>

        <div className="r-in" style={{ paddingBottom: 24, borderBottom: `2px solid #16241E`, marginBottom: 28 }}>
          <p style={{ color: MUTE, fontSize: 12.5, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 8px" }}>{me?.specialty || "Physician"}</p>
          <h1 style={{ fontSize: 38, fontWeight: 500, margin: 0, fontFamily: "Georgia, 'Times New Roman', serif" }}>{me?.full_name || "Doctor"}</h1>
        </div>

        <div className="r-in" style={{ marginBottom: 34 }}><LinkPatient /></div>

        <p className="r-in" style={{ color: MUTE, fontSize: 12, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, margin: "0 0 16px" }}>Your patients · {list.length}</p>

        {list.length === 0 && (
          <p className="r-in" style={{ color: MUTE, fontSize: 14 }}>No patients yet. Fetch one with their ID above.</p>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
          {list.map((p: Profile, i: number) => {
          // eslint-disable-next-line react-hooks/purity -- per-request server component
            const age = p.dob ? Math.floor((Date.now() - new Date(p.dob).getTime()) / 3.156e10) : null;
            return (
              <Link key={p.id} href={`/doctor/${p.id}`} className="pcard r-in"
                style={{ textDecoration: "none", color: "inherit", padding: "1.4rem 1.5rem", animationDelay: `${i * 0.06}s`, display: "block" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#EAF3EF", color: GREEN, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, marginBottom: 12, fontFamily: "Georgia, serif" }}>
                  {(p.full_name || "?")[0]}
                </div>
                <p style={{ fontSize: 16.5, fontWeight: 600, margin: "0 0 3px" }}>{p.full_name || "Unnamed"}</p>
                <p style={{ color: MUTE, fontSize: 12.5, margin: "0 0 10px" }}>{age ? `${age} yrs` : "—"}{p.blood_group ? ` · ${p.blood_group}` : ""}</p>
                <p style={{ color: GREEN, fontSize: 12, fontWeight: 600, letterSpacing: 1, margin: 0 }}>{p.patient_code}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
