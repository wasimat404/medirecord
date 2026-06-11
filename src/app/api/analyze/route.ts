import { NextRequest, NextResponse } from "next/server";
import { model, EXTRACTION_PROMPT } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
    const result = await model.generateContent([EXTRACTION_PROMPT, { inlineData: { mimeType: file.type, data: base64 } }]);
    const raw = result.response.text().trim().replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
    return NextResponse.json(JSON.parse(raw));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not analyze", detail: String(err) }, { status: 500 });
  }
}
// end
