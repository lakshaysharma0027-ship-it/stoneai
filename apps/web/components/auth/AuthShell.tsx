"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main
      className="stone-auth-shell"
      style={{
        alignItems: "center",
        background: "#050505",
        color: "#fafafa",
        display: "flex",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 24,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .stone-auth-input {
          background: #050505;
          border: 1px solid #242427;
          border-radius: 8px;
          color: #fafafa;
          font-size: 14px;
          outline: none;
          padding: 12px 13px;
          width: 100%;
        }
        .stone-auth-input:focus { border-color: #52525b; }
        .stone-auth-label {
          color: #71717a;
          display: block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .04em;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .stone-auth-button {
          border: 0;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
          min-height: 44px;
          padding: 12px 16px;
          width: 100%;
        }
        .stone-auth-button:disabled { cursor: wait; opacity: .65; }
        @media (max-width: 480px) {
          .stone-auth-shell { padding: 16px; }
          .stone-auth-card { padding: 22px !important; }
          .stone-auth-shell h1 { font-size: 26px !important; }
        }
      `}</style>
      <section style={{ maxWidth: 420, width: "100%" }}>
        <Link
          href="/"
          aria-label="StoneAI home"
          style={{
            display: "block",
            height: 40,
            margin: "0 auto 22px",
            textDecoration: "none",
            width: 40,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/stoneai-logo.jpg"
            alt="StoneAI"
            width={40}
            height={40}
            style={{ borderRadius: 10, display: "block", height: 40, objectFit: "cover", width: 40 }}
          />
        </Link>
        <div
          className="stone-auth-card"
          style={{
            background: "#0a0a0a",
            border: "1px solid #1a1a1a",
            borderRadius: 14,
            padding: 30,
          }}
        >
          <p
            style={{
              color: "#52525b",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".12em",
              margin: "0 0 12px",
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </p>
          <h1
            style={{
              color: "#fafafa",
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: "-.04em",
              lineHeight: 1.05,
              margin: "0 0 10px",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              color: "#71717a",
              fontSize: 14,
              lineHeight: 1.6,
              margin: "0 0 26px",
            }}
          >
            {subtitle}
          </p>
          {children}
        </div>
      </section>
    </main>
  );
}

export function AuthMessage({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <p
      style={{
        background: "#111",
        border: "1px solid #242427",
        borderRadius: 8,
        color: "#a1a1aa",
        fontSize: 12,
        lineHeight: 1.5,
        margin: "14px 0 0",
        padding: "10px 12px",
      }}
    >
      {message}
    </p>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" height="18" viewBox="0 0 24 24" width="18">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function SocialAuthButtons({
  onGoogle,
  googleLoading = false,
}: {
  onGoogle?: () => void;
  googleLoading?: boolean;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <button
        type="button"
        onClick={onGoogle}
        disabled={!onGoogle || googleLoading}
        style={{
          alignItems: "center",
          background: "transparent",
          border: "1px solid #242427",
          borderRadius: 8,
          color: onGoogle ? "#d4d4d8" : "#71717a",
          cursor: onGoogle && !googleLoading ? "pointer" : "wait",
          display: "flex",
          fontSize: 13,
          fontWeight: 600,
          gap: 10,
          justifyContent: "center",
          minHeight: 44,
          padding: "11px 14px",
          width: "100%",
        }}
      >
        <GoogleIcon />
        {googleLoading ? "Connecting..." : "Continue with Google"}
      </button>
    </div>
  );
}
