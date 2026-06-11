"use client";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await supabaseBrowser.auth.signOut();
    router.push("/login");
  }
  return (
    <button onClick={logout}
      style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #ddd",
        background: "#fff", fontSize: 14, cursor: "pointer" }}>
      Log out
    </button>
  );
}
