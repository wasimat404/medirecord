"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "../dashboard/LogoutButton";

const GREEN = "#0B5C43", MUTE = "#75857D", LINE = "#E6ECE9";

const baseItems = [
  { label: "Patients", href: "/doctor", d: "M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m5-1a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", match: (p: string) => p === "/doctor" },
];

export default function DocSidebar({ patientId, patientName, doctorName, specialty }: { patientId?: string; patientName?: string; doctorName?: string; specialty?: string }) {
  const path = usePathname();
  const nav = [];
  if (patientId) {
    nav.push({ label: "Dashboard", href: `/doctor/${patientId}`, d: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z", match: (p: string) => p === `/doctor/${patientId}` });
  }
  nav.push(...baseItems);
  if (patientId) {
    nav.push({ label: "Reports", href: `/doctor/${patientId}/reports`, d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6M8 13h8M8 17h8", match: (p: string) => p.endsWith("/reports") });
  }

  return (
    <aside style={{ width: 212, flexShrink: 0, background: "#fff", borderRight: `1px solid ${LINE}`, padding: "20px 14px", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", zIndex: 50, isolation: "isolate"  }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 6px", marginBottom: 24 }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: GREEN, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>M</span>
        <span style={{ fontWeight: 600, fontSize: 15 }}>MediRecord</span>
      </div>

      {patientName && (
        <div style={{ background: "#EAF3EF", borderRadius: 10, padding: "9px 11px", marginBottom: 14 }}>
          <p style={{ fontSize: 10.5, color: MUTE, margin: 0, textTransform: "uppercase", letterSpacing: .5 }}>Viewing</p>
          <p style={{ fontSize: 13.5, fontWeight: 600, color: GREEN, margin: "1px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{patientName}</p>
        </div>
      )}

      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {nav.map((n) => {
          const active = n.match(path);
          return (
            <Link key={n.label} href={n.href} style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 11px", borderRadius: 10, textDecoration: "none", background: active ? "#EAF3EF" : "transparent", color: active ? GREEN : "#475a52", fontWeight: active ? 600 : 400, fontSize: 13.5 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={n.d} /></svg>{n.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto", paddingTop: 16, borderTop: `1px solid ${LINE}` }}>
        <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 2px" }}>{doctorName || "Doctor"}</p>
        <p style={{ fontSize: 11.5, color: MUTE, margin: "0 0 10px" }}>{specialty || "Physician"}</p>
        <LogoutButton />
      </div>
    </aside>
  );
}