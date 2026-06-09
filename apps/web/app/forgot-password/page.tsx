"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthMessage, AuthShell } from "@/components/auth/AuthShell";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setLoading(false);

    setMessage(error ? error.message : "Check your email for the secure reset link.");
  };

  return (
    <AuthShell eyebrow="Forgot password" title="Recover access." subtitle="Send a reset link to the email attached to your StoneAI account.">
      <form onSubmit={handleReset} style={{ display: "grid", gap: 16 }}>
        <label>
          <span className="stone-auth-label">Email</span>
          <input className="stone-auth-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <button className="stone-auth-button" type="submit" disabled={loading} style={{ background: "#fafafa", color: "#050505" }}>
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>
      <AuthMessage message={message} />
      <p style={{ color: "#71717a", fontSize: 13, margin: "20px 0 0", textAlign: "center" }}>
        Back to <Link href="/login" style={{ color: "#fafafa", textDecoration: "none" }}>Login</Link>
      </p>
    </AuthShell>
  );
}
