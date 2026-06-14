import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function makeCode(prefix: string) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = prefix;
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    if (!b.email || !b.password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    const role = b.role === "doctor" ? "doctor" : "patient";
    const admin = supabaseAdmin();

    const { data: created, error: authErr } = await admin.auth.admin.createUser({
      email: b.email,
      password: b.password,
      email_confirm: true,
    });
    if (authErr || !created.user) {
      return NextResponse.json({ error: authErr?.message || "Could not create account" }, { status: 400 });
    }

    const { error: profErr } = await admin.from("profiles").insert({
      id: created.user.id,
      role,
      patient_code: role === "patient" ? makeCode("MED-") : makeCode("DOC-"),
      full_name: b.full_name || null,
      phone: b.phone || null,
      dob: b.dob || null,
      height_cm: b.height_cm || null,
      weight_kg: b.weight_kg || null,
      blood_group: b.blood_group || null,
      specialty: b.specialty || null,
      preferred_language: b.preferred_language || "en",
    });
    if (profErr) return NextResponse.json({ error: profErr.message }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}