import Link from "next/link";

const CTA_COPY = {
  top: {
    title: "Build Your Website With AI",
    description: "Describe your brand, pick a direction, and launch a production-ready site in minutes—not weeks.",
    button: "Start Building Free",
  },
  middle: {
    title: "Generate A Professional Website In Minutes",
    description: "StoneAI turns your prompt into a polished, editable website with hosting, domains, and AI media built in.",
    button: "Try StoneAI Free",
  },
  bottom: {
    title: "Start Building With StoneAI",
    description: "Join founders, agencies, and growth teams shipping high-converting websites with AI.",
    button: "Create Your Website",
  },
} as const;

export function BlogCTA({ variant }: { variant: "top" | "middle" | "bottom" }) {
  const copy = CTA_COPY[variant];
  return (
    <aside className={`blog-cta blog-cta-${variant}`}>
      <div className="blog-cta-glow" aria-hidden />
      <div className="blog-cta-inner">
        <h3>{copy.title}</h3>
        <p>{copy.description}</p>
        <Link href="/signup" className="blog-cta-btn">
          {copy.button}
        </Link>
      </div>
    </aside>
  );
}
