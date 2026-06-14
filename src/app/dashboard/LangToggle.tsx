"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CSSProperties } from "react";

const NAMES: Record<string, string> = {
  bn: "বাংলা", hi: "हिन्दी", ta: "தமிழ்", te: "తెలుగు", mr: "मराठी",
  gu: "ગુજરાતી", kn: "ಕನ್ನಡ", ml: "മലയാളം", pa: "ਪੰਜਾਬੀ", ur: "اردو", or: "ଓଡ଼ିଆ", as: "অসমীয়া",
};

export default function LangToggle({ lang }: { lang: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  if (lang === "en") return null;

  const showingEnglish = params.get("lang") === "en";
  const nativeName = NAMES[lang] || lang.toUpperCase();

  const go = (en: boolean) => {
    const q = new URLSearchParams(params.toString());
    if (en) q.set("lang", "en");
    else q.delete("lang");
    const qs = q.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const base: CSSProperties = {
    border: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 600,
    padding: "5px 13px", borderRadius: 999, transition: "all .2s",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
  };
  const active: CSSProperties = { ...base, background: "#3DA672", color: "#fff" };
  const idle: CSSProperties = { ...base, background: "transparent", color: "#6B7C74" };

  return (
    <div style={{ display: "inline-flex", gap: 4, background: "#EAF6F0", padding: 3, borderRadius: 999 }}>
      <button onClick={() => go(false)} style={showingEnglish ? idle : active}>{nativeName}</button>
      <button onClick={() => go(true)} style={showingEnglish ? active : idle}>English</button>
    </div>
  );
}