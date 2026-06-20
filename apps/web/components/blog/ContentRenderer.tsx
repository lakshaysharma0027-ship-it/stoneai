import Link from "next/link";
import type { ContentBlock } from "@/lib/blog/types";
import { BlogCTA } from "./BlogCTA";

function renderInlineLinks(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) {
      const [, label, href] = match;
      if (!href) return part;
      if (href.startsWith("/")) {
        return (
          <Link key={i} href={href}>
            {label}
          </Link>
        );
      }
      return (
        <a key={i} href={href} rel="noopener noreferrer" target="_blank">
          {label}
        </a>
      );
    }
    return part;
  });
}

export function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="blog-content">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={index} id={block.id}>
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={index} id={block.id}>
                {block.text}
              </h3>
            );
          case "p":
            return <p key={index}>{renderInlineLinks(block.text)}</p>;
          case "ul":
            return (
              <ul key={index}>
                {block.items.map((item, j) => (
                  <li key={j}>{renderInlineLinks(item)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={index}>
                {block.items.map((item, j) => (
                  <li key={j}>{renderInlineLinks(item)}</li>
                ))}
              </ol>
            );
          case "blockquote":
            return <blockquote key={index}>{block.text}</blockquote>;
          case "cta":
            return <BlogCTA key={index} variant={block.variant} />;
          case "comparison":
            return (
              <div key={index} className="blog-comparison-wrap">
                <table className="blog-comparison">
                  <thead>
                    <tr>
                      {block.headers.map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => (
                          <td key={ci}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "internal-link":
            return (
              <p key={index} className="blog-internal-link">
                Related:{" "}
                <Link href={`/blog/${block.slug}`}>{block.label}</Link>
              </p>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
