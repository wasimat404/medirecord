import Loader from "@/components/Loader";

export default function Loading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#F4FBF7" }}>
      <Loader size={64} color="#1FAE94" />
      <h2 style={{ marginTop: 36, fontSize: 26, fontWeight: 800, color: "#1A2420", fontFamily: "Georgia, serif" }}>Loading your health records...</h2>
      <p style={{ marginTop: 12, fontSize: 16, color: "#4A5D54", fontWeight: 500 }}>Decrypting and organizing your medical data securely.</p>
    </div>
  );
}
