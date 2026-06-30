import { NextRequest, NextResponse } from "next/server";
import { generateContentBalanced } from "@/lib/llm";

export const maxDuration = 60; // Allow Vercel to run up to 60s to wait out Gemini rate limits

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ short: "Lab Report" });
    
    const short = await generateContentBalanced(`Extract the core medical test name from this text in exactly 1 to 3 words (e.g. 'Urine Test', 'Complete Blood Count', 'X-Ray'). Return ONLY the 1-3 words without any punctuation or conversational filler. Text: ${text}`);
    
    return NextResponse.json({ short: short.trim().replace(/['"]/g, "") });
  } catch (err) {
    return NextResponse.json({ short: "Lab Report" });
  }
}
