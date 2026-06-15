"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Template } from "@/app/templates/lib/templates";

type TemplatePreviewModalProps = {
  template: Template;
  onClose: () => void;
  onUseTemplate?: (template: Template) => void;
  isCreating?: boolean;
  publicMode?: boolean;
};

function PreviewImage({
  src,
  alt,
  style,
}: {
  src?: string;
  alt: string;
  style: React.CSSProperties;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        style={{
          ...style,
          alignItems: "center",
          background: "#111",
          color: "#555",
          display: "flex",
          fontSize: 11,
          justifyContent: "center",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Preview unavailable
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} style={style} onError={() => setFailed(true)} />
  );
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", { month: "short", year: "2-digit" }).format(
    new Date(value),
  );

export default function TemplatePreviewModal({
  template,
  onClose,
  onUseTemplate,
  isCreating = false,
  publicMode = false,
}: TemplatePreviewModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{
        alignItems: "center",
        background: "rgba(0,0,0,0.88)",
        display: "flex",
        inset: 0,
        justifyContent: "center",
        padding: 24,
        position: "fixed",
        zIndex: 999,
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          background: "#111",
          border: "0.5px solid #242424",
          borderRadius: 14,
          maxHeight: "90vh",
          maxWidth: 860,
          overflowY: "auto",
          position: "relative",
          width: "100%",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          style={{
            alignItems: "center",
            background: "#1a1a1a",
            border: "0.5px solid #242424",
            borderRadius: 6,
            color: "#888",
            cursor: "pointer",
            display: "flex",
            height: 32,
            justifyContent: "center",
            position: "absolute",
            right: 16,
            top: 16,
            width: 32,
            zIndex: 2,
          }}
        >
          X
        </button>

        <div
          style={{
            background: "#1a1a1a",
            borderRadius: "14px 14px 0 0",
            display: "grid",
            gap: 1,
            gridTemplateColumns: "1fr 0.38fr",
            overflow: "hidden",
          }}
        >
          <PreviewImage
            src={template.desktopScreenshot}
            alt={`${template.name} desktop screenshot`}
            style={{
              aspectRatio: "16 / 10",
              background: "#111",
              objectFit: "cover",
              width: "100%",
            }}
          />
          <div
            style={{
              alignItems: "center",
              background: "#0a0a0a",
              display: "flex",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <div
              style={{
                border: "2px solid #242424",
                borderRadius: 14,
                maxWidth: 110,
                overflow: "hidden",
                width: "100%",
              }}
            >
              <PreviewImage
                src={template.mobileScreenshot ?? template.desktopScreenshot}
                alt={`${template.name} mobile screenshot`}
                style={{
                  aspectRatio: "9 / 16",
                  background: "#111",
                  objectFit: "cover",
                  width: "100%",
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ padding: "24px 28px 28px" }}>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                border: "0.5px solid #333",
                borderRadius: 3,
                color: "#555",
                fontSize: 10,
                letterSpacing: "0.08em",
                padding: "3px 9px",
                textTransform: "uppercase",
              }}
            >
              {template.category}
            </span>
            {template.featured ? (
              <span
                style={{
                  background: "#fff",
                  borderRadius: 3,
                  color: "#000",
                  fontSize: 9,
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  padding: "2px 7px",
                  textTransform: "uppercase",
                }}
              >
                Featured
              </span>
            ) : null}
          </div>

          <h2
            style={{
              color: "#fff",
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: "-0.03em",
              margin: "0 0 10px",
            }}
          >
            {template.name}
          </h2>
          <p
            style={{
              color: "#555",
              fontSize: 14,
              letterSpacing: "-0.01em",
              lineHeight: 1.65,
              margin: "0 0 24px",
              maxWidth: 540,
            }}
          >
            {template.description}
          </p>

          <div
            style={{
              background: "#1a1a1a",
              borderRadius: 8,
              display: "grid",
              gap: 1,
              gridTemplateColumns: "repeat(4, 1fr)",
              marginBottom: 24,
              overflow: "hidden",
            }}
          >
            {[
              ["Pages", template.pages],
              ["Components", template.components],
              ["Uses", template.uses.toLocaleString()],
              ["Updated", formatDate(template.updatedAt)],
            ].map(([label, value]) => (
              <div key={label} style={{ background: "#0a0a0a", padding: "14px 16px" }}>
                <div
                  style={{
                    color: "#444",
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    marginBottom: 4,
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {publicMode ? (
              <>
                <Link
                  href="/signup"
                  style={{
                    background: "#fff",
                    border: "none",
                    borderRadius: 8,
                    color: "#000",
                    flex: 1,
                    fontSize: 13,
                    fontWeight: 500,
                    padding: "12px 24px",
                    textAlign: "center",
                    textDecoration: "none",
                  }}
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  style={{
                    background: "transparent",
                    border: "0.5px solid #242424",
                    borderRadius: 8,
                    color: "#fafafa",
                    fontSize: 13,
                    padding: "12px 20px",
                    textAlign: "center",
                    textDecoration: "none",
                  }}
                >
                  Login
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={() => onUseTemplate?.(template)}
                disabled={isCreating}
                style={{
                  background: "#fff",
                  border: "none",
                  borderRadius: 8,
                  color: "#000",
                  cursor: isCreating ? "wait" : "pointer",
                  flex: 1,
                  fontSize: 13,
                  fontWeight: 500,
                  padding: "12px 24px",
                }}
              >
                {isCreating ? "Creating Project..." : "Use Template"}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (template.htmlPath) {
                  window.open(template.htmlPath, "_blank", "noopener,noreferrer");
                }
              }}
              style={{
                background: "transparent",
                border: "0.5px solid #242424",
                borderRadius: 8,
                color: "#888",
                cursor: "pointer",
                fontSize: 13,
                padding: "12px 20px",
              }}
            >
              Live Preview
            </button>
            <button
              type="button"
              aria-label="Bookmark template"
              style={{
                background: "transparent",
                border: "0.5px solid #242424",
                borderRadius: 8,
                color: "#888",
                cursor: "pointer",
                fontSize: 13,
                padding: "12px 0",
                width: 44,
              }}
            >
              ☆
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
