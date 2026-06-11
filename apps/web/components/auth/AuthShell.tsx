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
          padding: 12px 16px;
          width: 100%;
        }
        .stone-auth-button:disabled { cursor: wait; opacity: .65; }
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

export function SocialAuthButtons({
  onGoogle,
  googleLoading = false,
}: {
  onGoogle?: () => void;
  googleLoading?: boolean;
}) {
  return (
    <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
      <button
        type="button"
        onClick={onGoogle}
        disabled={!onGoogle || googleLoading}
        style={{
          background: "transparent",
          border: "1px solid #242427",
          borderRadius: 8,
          color: onGoogle ? "#d4d4d8" : "#71717a",
          cursor: onGoogle && !googleLoading ? "pointer" : "wait",
          fontSize: 13,
          fontWeight: 600,
          padding: "11px 14px",
        }}
      >
        {googleLoading ? "Connecting..." : "Continue with Google"}
      </button>
      <button
        type="button"
        disabled
        style={{
          background: "transparent",
          border: "1px solid #242427",
          borderRadius: 8,
          color: "#71717a",
          cursor: "not-allowed",
          fontSize: 13,
          fontWeight: 600,
          padding: "11px 14px",
        }}
      >
        Continue with Apple
      </button>
    </div>
  );
}
