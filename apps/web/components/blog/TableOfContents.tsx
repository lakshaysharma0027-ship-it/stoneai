"use client";

import { useEffect, useState } from "react";
import type { ContentBlock } from "@/lib/blog/types";
import { extractToc } from "@/lib/blog/utils";

export function TableOfContents({ content }: { content: ContentBlock[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const toc = extractToc(content);

  useEffect(() => {
    const headings = toc.map((item) => document.getElementById(item.id)).filter(Boolean);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );

    headings.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [toc]);

  if (toc.length < 3) return null;

  return (
    <nav className="blog-toc" aria-label="Table of contents">
      <p className="blog-toc-label">On this page</p>
      <ul>
        {toc.map((item) => (
          <li key={item.id} className={item.level === 3 ? "blog-toc-sub" : undefined}>
            <a
              href={`#${item.id}`}
              className={activeId === item.id ? "active" : undefined}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                setActiveId(item.id);
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
