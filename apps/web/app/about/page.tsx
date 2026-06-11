import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { STONEAI_APP_URL, STONEAI_COMPANY, STONEAI_DEFAULT_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "About StoneAI — AI website generation, publishing, and creative workflows for premium teams.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <MarketingShell>
      <article className="marketing-page">
        <div className="marketing-page-inner">
          <h1>About StoneAI</h1>
          <p className="lead">{STONEAI_DEFAULT_DESCRIPTION}</p>

          <section>
            <h2>Our mission</h2>
            <p>
              StoneAI helps teams move from idea to live website in minutes. We combine AI generation, a visual editor,
              publishing infrastructure, custom domains, and media workflows in one platform.
            </p>
          </section>

          <section>
            <h2>Where we operate</h2>
            <p>{STONEAI_COMPANY.locations}</p>
          </section>

          <section>
            <h2>Product</h2>
            <p>
              The StoneAI app lives at{" "}
              <a href={STONEAI_APP_URL} rel="noopener noreferrer">
                {STONEAI_APP_URL.replace("https://", "")}
              </a>
              . Create an account to generate websites, manage projects, track credits, connect domains, and publish to
              production.
            </p>
          </section>

          <section>
            <p>
              <Link href="/signup">Start free</Link> or explore{" "}
              <Link href="/pricing">pricing</Link>.
            </p>
          </section>
        </div>
      </article>
    </MarketingShell>
  );
}
