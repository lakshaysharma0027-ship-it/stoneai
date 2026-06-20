import Link from "next/link";

export function NewsletterCTA() {
  return (
    <section className="blog-newsletter">
      <div className="blog-newsletter-inner">
        <p className="blog-eyebrow">Newsletter</p>
        <h2>Ship smarter websites</h2>
        <p>
          Get AI website builder insights, conversion tactics, and product updates—no spam, unsubscribe anytime.
        </p>
        <form
          className="blog-newsletter-form"
          action="https://stoneai.in/contact"
          method="get"
        >
          <input type="email" name="email" placeholder="you@company.com" required aria-label="Email address" />
          <button type="submit">Subscribe</button>
        </form>
        <p className="blog-newsletter-note">
          Or <Link href="/signup">start building free</Link> and get updates in your dashboard.
        </p>
      </div>
    </section>
  );
}
