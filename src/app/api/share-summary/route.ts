import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { buildHealth, ageOf } from "@/lib/health";

export async function POST(req: NextRequest) {
  try {
    const sb = await supabaseServer();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const note: string = (body.note || "").toString().slice(0, 1000);
    let doctorId: string | undefined = body.doctor_id;

    // must be a patient
    const { data: me } = await sb.from("profiles").select("*").eq("id", user.id).single();
    if (!me || me.role !== "patient")
      return NextResponse.json({ error: "Only patients can share summaries." }, { status: 403 });

    // resolve the linked doctor
    if (!doctorId) {
      const { data: grants } = await sb
        .from("access_grants")
        .select("doctor_id")
        .eq("patient_id", user.id);
      if (!grants || grants.length === 0)
        return NextResponse.json({ error: "No doctor is linked to your account yet." }, { status: 400 });
      doctorId = grants[0].doctor_id;
    } else {
      // verify the chosen doctor is actually linked to this patient
      const { data: g } = await sb
        .from("access_grants")
        .select("id")
        .eq("patient_id", user.id)
        .eq("doctor_id", doctorId)
        .maybeSingle();
      if (!g)
        return NextResponse.json({ error: "That doctor isn't linked to your account." }, { status: 400 });
    }

    // pull records -> health digest
    const { data: records } = await sb
      .from("records")
      .select("*")
      .eq("patient_id", user.id)
      .order("report_date", { ascending: false });
    const recs = records || [];
    const { metrics, vitals, insights, points } = buildHealth(recs, me);

    const flagged = points.filter((p: any) => p.flag === "high" || p.flag === "low").length;
    const recent = recs.slice(0, 6).map((r: any) => ({
      category: r.category || "other",
      source: r.source || null,
      date: r.report_date || r.created_at || null,
      summary: r.summary_en || null,
    }));

    const content = {
      generated_at: new Date().toISOString(),
      patient: {
        name: me.full_name || null,
        age: ageOf(me),
        blood_group: me.blood_group || null,
        patient_code: me.patient_code || null,
      },
      vitals: vitals.map((v) => ({ label: v.label, value: v.value, unit: v.unit, ok: v.ok })),
      trends: metrics.map((m) => ({
        test: m.test,
        latest: m.latestLabel,
        unit: m.unit,
        verdict: m.verdict,
        count: m.count,
        first: m.first,
        last: m.last,
      })),
      flagged,
      insights,
      recent_reports: recent,
    };

    const title = `Health summary \u2014 ${me.full_name || "Patient"}`;

    const { data: inserted, error: insErr } = await sb
      .from("shared_summaries")
      .insert({
        patient_id: user.id,
        doctor_id: doctorId,
        title,
        content,
        note: note || null,
      })
      .select("id")
      .single();

    if (insErr) {
      console.error("share-summary insert failed:", insErr);
      return NextResponse.json({ error: "Could not save the summary. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: inserted?.id });
  } catch (e: any) {
    console.error("share-summary error:", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
