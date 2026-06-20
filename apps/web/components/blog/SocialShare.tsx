"use client";

import { useState } from "react";

export function SocialShare({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/blog/${slug}` : `https://stoneai.in/blog/${slug}`;
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="blog-social-share">
      <span>Share</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${text}&url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
      >
        X
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
      >
        in
      </a>
      <button type="button" onClick={copyLink} aria-label="Copy link">
        {copied ? "Copied" : "Link"}
      </button>
    </div>
  );
}
