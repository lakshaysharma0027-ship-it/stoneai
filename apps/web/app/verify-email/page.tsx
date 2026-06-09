"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";

function VerifyEmailContent() {
  const state = useSearchParams().get("state");
  const [mode, setMode] = useState<"pending" | "success">(state === "pending" ? "pending" : "success");

  return (
    <AuthShell
      eyebrow="Email verification"
      title={mode === "success" ? "Email verified." : "Check your email."}
      subtitle={mode === "success" ? "Your StoneAI workspace is ready." : "Open the verification link from Supabase to activate your workspace."}
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <button type="button" onClick={() => setMode("success")} style={{ background: mode === "success" ? "#fafafa" : "transparent", border: "1px solid #242427", borderRadius: 8, color: mode === "success" ? "#050505" : "#a1a1aa", cursor: "pointer", flex: 1, fontSize: 12, padding: "9px 10px" }}>Success</button>
        <button type="button" onClick={() => setMode("pending")} style={{ background: mode === "pending" ? "#fafafa" : "transparent", border: "1px solid #242427", borderRadius: 8, color: mode === "pending" ? "#050505" : "#a1a1aa", cursor: "pointer", flex: 1, fontSize: 12, padding: "9px 10px" }}>Pending</button>
      </div>
      <ol style={{ color: "#a1a1aa", display: "grid", fontSize: 14, gap: 12, lineHeight: 1.5, margin: "0 0 24px", paddingLeft: 20 }}>
        <li>Open the message sent to your inbox.</li>
        <li>Click the StoneAI verification link.</li>
        <li>Return to the dashboard and start building.</li>
      </ol>
      <Link href={mode === "success" ? "/" : "/login"} style={{ background: "#fafafa", borderRadius: 8, color: "#050505", display: "block", fontSize: 13, fontWeight: 700, padding: "12px 16px", textAlign: "center", textDecoration: "none" }}>
        {mode === "success" ? "Open dashboard" : "Back to login"}
      </Link>
    </AuthShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
