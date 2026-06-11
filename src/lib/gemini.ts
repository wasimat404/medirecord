import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("GEMINI_API_KEY is missing from .env.local");

const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const EXTRACTION_PROMPT = [
  "You are a medical document assistant. You are given an image or PDF of a medical document (a prescription, lab/test report, or bill).",
  "Read it carefully and return ONLY a JSON object (no markdown, no backticks) with this exact shape:",
  '{ "category": "blood_test | prescription | bill | imaging | other", "date": "YYYY-MM-DD or null", "source": "hospital/lab/clinic name or null", "data_points": [ { "test": "name", "value": "number or string", "unit": "unit or null", "normal_range": "text or null", "flag": "low | normal | high | null" } ], "summary_en": "Plain-language summary a patient understands. State what the document shows. If values are abnormal, say so gently. Always end by advising them to discuss with their doctor. Do NOT give treatment instructions." }',
  "If the document is not medical or is unreadable, use the same shape with an explanation in summary_en and an empty data_points list.",
].join("\n");
