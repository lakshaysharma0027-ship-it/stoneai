"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthMessage, AuthShell } from "@/components/auth/AuthShell";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.replace("/");
    router.refresh();
  };

  return (
    <AuthShell eyebrow="Reset password" title="Choose a new password." subtitle="Set a fresh password for your StoneAI account.">
      <form onSubmit={handleUpdate} style={{ display: "grid", gap: 16 }}>
        <label><span className="stone-auth-label">New password</span><input className="stone-auth-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        <label><span className="stone-auth-label">Confirm password</span><input className="stone-auth-input" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required /></label>
        <button className="stone-auth-button" type="submit" disabled={loading} style={{ background: "#fafafa", color: "#050505" }}>{loading ? "Updating..." : "Reset password"}</button>
      </form>
      <AuthMessage message={message} />
    </AuthShell>
  );
}
