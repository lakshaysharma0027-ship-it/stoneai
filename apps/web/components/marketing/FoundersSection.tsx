import Image from "next/image";
import { STONEAI_FOUNDERS } from "@/lib/site";

type FoundersSectionProps = {
  variant?: "page" | "homepage";
  showEyebrow?: boolean;
};

export function FoundersSection({ variant = "page", showEyebrow = true }: FoundersSectionProps) {
  const isHomepage = variant === "homepage";

  return (
    <section className={isHomepage ? "founders-section founders-section--homepage" : "founders-section"}>
      <div className={isHomepage ? "container" : undefined}>
        {showEyebrow ? (
          <p className={isHomepage ? "founders-eyebrow founders-eyebrow--homepage" : "founders-eyebrow"}>
            Founders
          </p>
        ) : null}
        <h2 className={isHomepage ? "founders-heading founders-heading--homepage" : "founders-heading"}>
          Built by technical founders
        </h2>
        <p className={isHomepage ? "founders-lead founders-lead--homepage" : "founders-lead"}>
          StoneAI is engineered end-to-end by two technical co-founders who write the code, ship the product, and
          obsess over every detail of the builder experience.
        </p>

        <div className="founders-grid">
          {STONEAI_FOUNDERS.map((founder) => (
            <article key={founder.name} className="founder-card">
              <div className="founder-photo-wrap">
                <Image
                  src={founder.image}
                  alt={`${founder.name}, ${founder.role} at StoneAI`}
                  width={400}
                  height={400}
                  className="founder-photo"
                />
              </div>
              <div className="founder-body">
                <h3>{founder.name}</h3>
                <p className="founder-role">{founder.role}</p>
                <p className="founder-bio">{founder.bio}</p>
                <ul className="founder-focus">
                  {founder.focus.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
