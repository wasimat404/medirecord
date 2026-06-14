import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { data: me } = await sb.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "doctor") return NextResponse.json({ error: "Doctors only" }, { status: 403 });

  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "Patient ID required" }, { status: 400 });

  const admin = supabaseAdmin();
  const { data: patient } = await admin.from("profiles")
    .select("id, full_name").eq("patient_code", code.trim().toUpperCase()).eq("role", "patient").maybeSingle();
  if (!patient) return NextResponse.json({ error: "No patient found with that ID" }, { status: 404 });

  const { error } = await admin.from("access_grants")
    .upsert({ doctor_id: user.id, patient_id: patient.id }, { onConflict: "doctor_id,patient_id" });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true, id: patient.id, name: patient.full_name });
}