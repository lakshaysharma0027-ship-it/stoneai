"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AuthMessage, AuthShell, SocialAuthButtons } from "@/components/auth/AuthShell";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const getStrength = (password: string) =>
  [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const strength = useMemo(() => getStrength(password), [password]);

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/verify-email`,
      },
    });
    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    const welcomeResponse = await fetch("/api/email/welcome", {
      method: "POST",
      body: JSON.stringify({ to: email, fullName }),
    }).catch(() => null);

    if (!welcomeResponse?.ok) {
      console.warn("[StoneAI signup] welcome email send failed", {
        email,
        status: welcomeResponse?.status ?? "network-error",
      });
    }

    router.push("/verify-email?state=pending");
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setMessage(null);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      setMessage(error.message);
      setGoogleLoading(false);
    }
  };

  return (
    <AuthShell eyebrow="Signup" title="Create your StoneAI account." subtitle="Start authenticated projects with secure ownership from the first draft.">
      <SocialAuthButtons onGoogle={handleGoogleSignup} googleLoading={googleLoading} />
      <form onSubmit={handleSignup} style={{ display: "grid", gap: 16 }}>
        <label><span className="stone-auth-label">Full name</span><input className="stone-auth-input" value={fullName} onChange={(event) => setFullName(event.target.value)} required /></label>
        <label><span className="stone-auth-label">Email</span><input className="stone-auth-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label>
          <span className="stone-auth-label">Password</span>
          <input className="stone-auth-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <div style={{ display: "grid", gap: 5, gridTemplateColumns: "repeat(4, 1fr)", marginTop: 10 }}>
            {[1, 2, 3, 4].map((bar) => (
              <span key={bar} style={{ background: bar <= strength ? (strength < 3 ? "#ef4444" : strength < 4 ? "#f59e0b" : "#22c55e") : "#18181b", borderRadius: 999, height: 4, transition: "background 160ms ease" }} />
            ))}
          </div>
        </label>
        <button className="stone-auth-button" type="submit" disabled={loading} style={{ background: "#fafafa", color: "#050505" }}>{loading ? "Creating..." : "Create account"}</button>
      </form>
      <AuthMessage message={message} />
      <p style={{ color: "#71717a", fontSize: 13, margin: "20px 0 0", textAlign: "center" }}>
        Already have an account? <Link href="/login" style={{ color: "#fafafa", textDecoration: "none" }}>Login</Link>
      </p>
    </AuthShell>
  );
}
