"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthMessage, AuthShell, SocialAuthButtons } from "@/components/auth/AuthShell";
import { resolveLoginErrorMessage } from "@/lib/auth/loginErrors";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(
    resolveLoginErrorMessage(searchParams.get("error")),
  );

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.replace(searchParams.get("next") ?? "/dashboard");
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setMessage(null);

    const next = searchParams.get("next") ?? "/dashboard";
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (error) {
      setMessage(error.message);
      setGoogleLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Login"
      title="Enter your StoneAI workspace."
      subtitle="Your projects, websites, and editor sessions are attached to your account."
    >
      <SocialAuthButtons onGoogle={handleGoogleLogin} googleLoading={googleLoading} />
      <form onSubmit={handleLogin} style={{ display: "grid", gap: 16 }}>
        <label>
          <span className="stone-auth-label">Email</span>
          <input className="stone-auth-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label>
          <span className="stone-auth-label">Password</span>
          <div style={{ position: "relative" }}>
            <input className="stone-auth-input" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required style={{ paddingRight: 54 }} />
            <button type="button" onClick={() => setShowPassword((value) => !value)} style={{ background: "transparent", border: 0, color: "#71717a", cursor: "pointer", fontSize: 12, position: "absolute", right: 12, top: 12 }}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
          <label style={{ alignItems: "center", color: "#71717a", display: "flex", fontSize: 12, gap: 8 }}>
            <input type="checkbox" checked={remember} onChange={() => setRemember((value) => !value)} />
            Remember me
          </label>
          <Link href="/forgot-password" style={{ color: "#a1a1aa", fontSize: 12, textDecoration: "none" }}>
            Forgot password?
          </Link>
        </div>
        <button className="stone-auth-button" type="submit" disabled={loading} style={{ background: "#fafafa", color: "#050505" }}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
      <AuthMessage message={message} />
      <p style={{ color: "#71717a", fontSize: 13, margin: "20px 0 0", textAlign: "center" }}>
        No account? <Link href="/signup" style={{ color: "#fafafa", textDecoration: "none" }}>Create one</Link>
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
