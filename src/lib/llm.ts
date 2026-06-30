import { GoogleGenerativeAI } from "@google/generative-ai";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const EXTRACTION_PROMPT = [
  "You are a medical document assistant. You are given an image or PDF of a medical document (a prescription, lab/test report, or bill).",
  "Read it carefully and return ONLY a JSON object (no markdown, no backticks) with this exact shape:",
  '{ "category": "blood_test | prescription | bill | imaging | other", "date": "YYYY-MM-DD or null", "source": "hospital/lab/clinic name or null", "data_points": [ { "test": "name", "value": "number or string", "unit": "unit or null", "normal_range": "text or null", "flag": "low | normal | high | null" } ], "summary_en": "Plain-language summary a patient understands. State what the document shows. If values are abnormal, say so gently. Always end by advising them to discuss with their doctor. Do NOT give treatment instructions." }',
  "If the document is not medical or is unreadable, use the same shape with an explanation in summary_en and an empty data_points list.",
].join("\n");

let currentIndex = 0;

export async function generateContentBalanced(
  textPrompt: string,
  inlineData?: { mimeType: string; data: string }
): Promise<string> {
  const providers = [];

  if (process.env.GEMINI_API_KEY) providers.push("gemini");
  if (process.env.OPENAI_API_KEY) providers.push("openai");

  // Groq recently removed their vision models, so only add Groq if there is no image payload
  if (process.env.GROQ_API_KEY && !inlineData) providers.push("groq");

  if (providers.length === 0) {
    throw new Error("No LLM providers available (missing API keys).");
  }

  let lastError: unknown;

  // Try each provider up to the total number of available providers
  for (let i = 0; i < providers.length; i++) {
    const provider = providers[(currentIndex + i) % providers.length];
    console.log(`[LLM Balancer] Routing request to: ${provider}`);

    try {
      let result;
      switch (provider) {
        case "gemini":
          result = await callGemini(textPrompt, inlineData);
          break;
        case "openai":
          result = await callOpenAI(textPrompt, inlineData);
          break;
        case "groq":
          result = await callGroq(textPrompt, inlineData);
          break;
        default:
          throw new Error(`Unknown provider: ${provider}`);
      }

      // Success! Advance the starting index for the NEXT request
      currentIndex = (currentIndex + i + 1) % providers.length;
      return result;

    } catch (error: unknown) {
      if (provider === "gemini" && error instanceof Error && error.message?.includes("429")) {
        let waitSec = 15;
        const match = error.message.match(/Please retry in ([\d.]+)s/);
        if (match) waitSec = Math.ceil(parseFloat(match[1])) + 1; // buffer
        waitSec = Math.min(waitSec, 60); // Cap at 60s
        
        console.warn(`[LLM Balancer] ⏳ Gemini rate limited (429). Pausing ${waitSec} seconds to recover...`);
        await delay(waitSec * 1000);
        try {
          const result = await callGemini(textPrompt, inlineData);
          currentIndex = (currentIndex + i + 1) % providers.length;
          return result;
        } catch {
          console.warn(`[LLM Balancer] ⚠️ Gemini retry failed. Falling back.`);
        }
      }
      
      console.warn(`[LLM Balancer] ⚠️ ${provider} failed, falling back to next provider. Error:`, String(error));
      lastError = error;
    }
  }

  throw new Error(`All LLM providers failed. Last error: ${lastError}`);
}

async function callGemini(textPrompt: string, inlineData?: { mimeType: string; data: string }): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any[] = [textPrompt];
  if (inlineData) {
    payload.push({ inlineData });
  }
  const res = await model.generateContent(payload);
  return res.response.text();
}

async function callOpenAI(textPrompt: string, inlineData?: { mimeType: string; data: string }): Promise<string> {
  const messages: Record<string, unknown>[] = [];
  
  if (inlineData) {
    messages.push({
      role: "user",
      content: [
        { type: "text", text: textPrompt },
        { type: "image_url", image_url: { url: `data:${inlineData.mimeType};base64,${inlineData.data}` } }
      ]
    });
  } else {
    messages.push({ role: "user", content: textPrompt });
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.2,
    }),
  });

  if (!res.ok) throw new Error(`OpenAI error: ${await res.text()}`);
  const data = await res.json();
  return data.choices[0].message.content;
}


async function callGroq(textPrompt: string, inlineData?: { mimeType: string; data: string }): Promise<string> {
  const messages: Record<string, unknown>[] = [];
  
  if (inlineData) {
    messages.push({
      role: "user",
      content: [
        { type: "text", text: textPrompt },
        { type: "image_url", image_url: { url: `data:${inlineData.mimeType};base64,${inlineData.data}` } }
      ]
    });
  } else {
    messages.push({ role: "user", content: textPrompt });
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      // groq text model (vision models decommissioned)
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.2,
    }),
  });

  if (!res.ok) throw new Error(`Groq error: ${await res.text()}`);
  const data = await res.json();
  return data.choices[0].message.content;
}
