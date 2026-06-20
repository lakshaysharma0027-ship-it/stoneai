import type { FAQItem } from "@/lib/blog/types";

export function FAQSection({ faq, title = "Frequently asked questions" }: { faq: FAQItem[]; title?: string }) {
  if (faq.length === 0) return null;
  return (
    <section className="blog-faq">
      <h2>{title}</h2>
      <div className="blog-faq-list">
        {faq.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
