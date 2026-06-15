"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import TemplatePreviewModal from "@/components/templates/TemplatePreviewModal";
import { getTemplateCategories } from "@/lib/template-catalog";
import type { Template } from "@/app/templates/lib/templates";

const filters = ["All", ...getTemplateCategories()];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", { month: "short", year: "2-digit" }).format(
    new Date(value),
  );

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
          fontSize: 10,
          justifyContent: "center",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Preview missing
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} style={style} onError={() => setFailed(true)} />
  );
}

function SkeletonCard() {
  return (
    <article style={{ background: "#000" }}>
      <div style={{ aspectRatio: "16 / 10", background: "#111" }} />
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ animation: "pulse 1.5s ease-in-out infinite alternate", background: "#111", borderRadius: 4, height: 10, marginBottom: 10, width: "60%" }} />
        <div style={{ animation: "pulse 1.5s ease-in-out infinite alternate", background: "#111", borderRadius: 4, height: 10, width: "85%" }} />
      </div>
    </article>
  );
}

export type TemplateGalleryProps = {
  templates: Template[];
  mode: "public" | "dashboard";
  isLoading?: boolean;
  onUseTemplate?: (template: Template) => void;
  creatingTemplateId?: string | null;
};

export function TemplateGallery({
  templates,
  mode,
  isLoading = false,
  onUseTemplate,
  creatingTemplateId = null,
}: TemplateGalleryProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("popular");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const filtered = useMemo(
    () =>
      templates
        .filter((template) => activeFilter === "All" || template.category === activeFilter)
        .filter(
          (template) =>
            template.name.toLowerCase().includes(search.toLowerCase()) ||
            template.description.toLowerCase().includes(search.toLowerCase()) ||
            template.category.toLowerCase().includes(search.toLowerCase()),
        )
        .sort((a, b) => {
          if (sortOrder === "name") return a.name.localeCompare(b.name);
          if (sortOrder === "newest") {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          }
          return b.uses - a.uses;
        }),
    [activeFilter, search, sortOrder, templates],
  );

  const handleUse = (template: Template) => {
    if (mode === "public") return;
    onUseTemplate?.(template);
  };

  const showToolbar = mode === "dashboard";

  return (
    <>
      <style>
        {`
        @keyframes pulse { from { opacity: 0.4 } to { opacity: 0.8 } }
        .templates-grid {
          display: grid;
          gap: 1px;
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 900px) {
          .templates-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .templates-grid { grid-template-columns: 1fr; }
        }
        `}
      </style>

      {showToolbar ? (
        <>
          <div style={{ marginBottom: 24 }}>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search templates..."
              className="stone-auth-input"
              style={{ maxWidth: 420, width: "100%" }}
            />
          </div>
          <div
            style={{
              alignItems: "center",
              borderBottom: "0.5px solid #1a1a1a",
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "space-between",
              marginBottom: 24,
              paddingBottom: 16,
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {filters.map((filter) => {
                const active = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={active ? "btn btn-primary btn-sm" : "btn btn-sm"}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
            <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
              <span style={{ color: "#71717a", fontSize: 12 }}>
                {filtered.length} template{filtered.length === 1 ? "" : "s"}
              </span>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="stone-auth-input"
                style={{ fontSize: 12, padding: "6px 12px", width: "auto" }}
              >
                <option value="popular">Most popular</option>
                <option value="newest">Newest</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>
        </>
      ) : null}

      {filtered.length === 0 && !isLoading ? (
        <div style={{ padding: "48px 0", textAlign: "center" }}>
          <p style={{ color: "#71717a", fontSize: 14, margin: 0 }}>No templates found.</p>
        </div>
      ) : (
        <section
          className="templates-grid"
          style={{
            background: mode === "public" ? "#1a1a1a" : "transparent",
            borderRadius: mode === "public" ? 12 : 0,
            gap: mode === "dashboard" ? 16 : 1,
            overflow: "hidden",
          }}
        >
          {isLoading
            ? Array.from({ length: mode === "public" ? 8 : 6 }, (_, index) => (
                <SkeletonCard key={index} />
              ))
            : filtered.map((template) => {
                const isCreating = creatingTemplateId === template.id;

                return (
                  <article
                    key={template.id}
                    style={{
                      background: mode === "public" ? (template.bgColor === "#000" ? "#000" : "#0a0a0a") : "#0a0a0a",
                      border: mode === "dashboard" ? "0.5px solid #1a1a1a" : undefined,
                      borderRadius: mode === "dashboard" ? 10 : 0,
                      minWidth: 0,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        aspectRatio: "16 / 10",
                        background: template.bgColor || "#111",
                        overflow: "hidden",
                        position: "relative",
                      }}
                      onMouseEnter={(event) => {
                        const overlay = event.currentTarget.querySelector(
                          "[data-overlay]",
                        ) as HTMLDivElement | null;
                        if (overlay) overlay.style.opacity = "1";
                      }}
                      onMouseLeave={(event) => {
                        const overlay = event.currentTarget.querySelector(
                          "[data-overlay]",
                        ) as HTMLDivElement | null;
                        if (overlay) overlay.style.opacity = "0";
                      }}
                    >
                      <PreviewImage
                        src={template.desktopScreenshot}
                        alt={`${template.name} preview`}
                        style={{
                          display: "block",
                          height: "100%",
                          objectFit: "cover",
                          width: "100%",
                        }}
                      />
                      <div
                        style={{
                          background: "rgba(0,0,0,0.7)",
                          border: "0.5px solid rgba(255,255,255,0.1)",
                          borderRadius: 3,
                          color: "#aaa",
                          fontSize: 10,
                          left: 12,
                          letterSpacing: "0.08em",
                          padding: "3px 8px",
                          position: "absolute",
                          textTransform: "uppercase",
                          top: 12,
                        }}
                      >
                        {template.category}
                      </div>
                      {template.featured ? (
                        <div
                          style={{
                            background: "#fff",
                            borderRadius: 3,
                            color: "#000",
                            fontSize: 9,
                            fontWeight: 500,
                            padding: "2px 7px",
                            position: "absolute",
                            right: 12,
                            top: 12,
                          }}
                        >
                          Featured
                        </div>
                      ) : null}
                      <div
                        data-overlay
                        style={{
                          alignItems: "center",
                          background: "rgba(0,0,0,0.6)",
                          display: "flex",
                          gap: 8,
                          inset: 0,
                          justifyContent: "center",
                          opacity: 0,
                          position: "absolute",
                          transition: "opacity 160ms ease",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setPreviewTemplate(template)}
                          className="btn btn-sm"
                        >
                          Preview
                        </button>
                        {mode === "dashboard" ? (
                          <button
                            type="button"
                            onClick={() => handleUse(template)}
                            disabled={isCreating}
                            className="btn btn-primary btn-sm"
                          >
                            {isCreating ? "Starting…" : "Use Template"}
                          </button>
                        ) : (
                          <Link href="/signup" className="btn btn-primary btn-sm">
                            Sign up to use
                          </Link>
                        )}
                      </div>
                    </div>
                    <div style={{ padding: "14px 16px 16px" }}>
                      <h2 style={{ color: "#fff", fontSize: 14, fontWeight: 500, margin: "0 0 4px" }}>
                        {template.name}
                      </h2>
                      <p style={{ color: "#71717a", fontSize: 12, lineHeight: 1.5, margin: 0 }}>
                        {template.description}
                      </p>
                    </div>
                    <div
                      style={{
                        alignItems: "center",
                        borderTop: "0.5px solid #1a1a1a",
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px 16px",
                      }}
                    >
                      <div style={{ color: "#71717a", display: "flex", fontSize: 11, gap: 10 }}>
                        <span>{template.pages} sections</span>
                        <span>{template.uses.toLocaleString()} uses</span>
                      </div>
                      <span style={{ color: "#3f3f46", fontSize: 11 }}>{formatDate(template.updatedAt)}</span>
                    </div>
                  </article>
                );
              })}
        </section>
      )}

      {previewTemplate ? (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUseTemplate={mode === "dashboard" ? handleUse : undefined}
          isCreating={creatingTemplateId === previewTemplate.id}
          publicMode={mode === "public"}
        />
      ) : null}
    </>
  );
}
