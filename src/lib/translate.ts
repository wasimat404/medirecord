import crypto from "crypto";
import { model } from "./gemini";
import { supabaseServer } from "./supabaseServer";

// English names so Gemini knows the target. Add more as needed.
export const LANGUAGES: Record<string, string> = {
  en: "English",
  bn: "Bengali",
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
  mr: "Marathi",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
  pa: "Punjabi",
  ur: "Urdu",
  or: "Odia",
  as: "Assamese",
};

const hash = (s: string) => crypto.createHash("md5").update(s).digest("hex");

export async function translateText(text: string, lang: string): Promise<string> {
  // no-op cases
  if (!text || !text.trim()) return text;
  if (lang === "en" || !LANGUAGES[lang]) return text;

  const sb = await supabaseServer();
  const source_hash = hash(text);

  // 1. cache hit?
  const { data: cached } = await sb
    .from("translations")
    .select("translated")
    .eq("source_hash", source_hash)
    .eq("target_lang", lang)
    .maybeSingle();
  if (cached?.translated) return cached.translated;

  // 2. miss -> Gemini
  const prompt = [
    `Translate the following medical text into ${LANGUAGES[lang]}.`,
    "Keep medical test names, numbers, and units accurate. Use simple, patient-friendly wording.",
    "Return ONLY the translation, no notes, no quotes, no markdown.",
    "",
    text,
  ].join("\n");

  let translated = text;
  try {
    const res = await model.generateContent(prompt);
    translated = res.response.text().trim();
  } catch (e) {
    console.error("translateText failed:", e);
    return text; // fail open -> show English rather than break the page
  }

  // 3. write back (ignore unique-collision races)
  await sb.from("translations").insert({
    source_hash,
    target_lang: lang,
    source_text: text,
    translated,
  });

  return translated;
}

// translate many strings in parallel, preserving order
export async function translateMany(texts: string[], lang: string): Promise<string[]> {
  if (lang === "en") return texts;
  return Promise.all(texts.map((t) => translateText(t, lang)));
}