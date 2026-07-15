import Link from "next/link";

export function ProsConsSection({
  stoneai,
  competitor,
}: {
  stoneai: { pros: string[]; cons: string[] };
  competitor: { name: string; pros: string[]; cons: string[] };
}) {
  return (
    <div className="seo-pros-cons-grid">
      <div className="seo-pros-cons-card">
        <h3>StoneAI — Pros &amp; Cons</h3>
        <h4>Pros</h4>
        <ul>
          {stoneai.pros.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h4>Cons</h4>
        <ul className="cons">
          {stoneai.cons.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="seo-pros-cons-card">
        <h3>{competitor.name} — Pros &amp; Cons</h3>
        <h4>Pros</h4>
        <ul>
          {competitor.pros.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h4>Cons</h4>
        <ul className="cons">
          {competitor.cons.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <p className="seo-migration-cta">
        Ready to switch?{" "}
        <Link href="/signup">Migrate to StoneAI free</Link>
      </p>
    </div>
  );
}
