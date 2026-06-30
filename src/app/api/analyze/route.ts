import { NextRequest, NextResponse } from "next/server";
import { generateContentBalanced, EXTRACTION_PROMPT } from "@/lib/llm";
import { supabaseServer } from "@/lib/supabaseServer";

export const maxDuration = 60; // Allow Vercel to run up to 60s to wait out Gemini rate limits

export async function POST(req: NextRequest) {
  try {
    const sb = await supabaseServer();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
    
    // Call the balanced LLM provider
    const rawText = await generateContentBalanced(EXTRACTION_PROMPT, { mimeType: file.type, data: base64 });
    const raw = rawText.trim().replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(raw);

    const { data: saved, error: saveErr } = await sb.from("records").insert({
      patient_id: user.id,
      category: parsed.category || null,
      report_date: parsed.date || null,
      source: parsed.source || null,
      data_points: parsed.data_points || [],
      summary_en: parsed.summary_en || null,
    }).select().single();

    if (saveErr) return NextResponse.json({ error: saveErr.message }, { status: 400 });

    return NextResponse.json(saved);
  } catch (err) {
    return NextResponse.json({ error: "Could not analyze", detail: String(err) }, { status: 500 });
  }
}
