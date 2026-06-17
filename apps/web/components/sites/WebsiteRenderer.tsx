import type { CSSProperties } from "react";
import { CinematicWebsiteShell } from "@/components/cinematic/CinematicWebsiteShell";
import type {
  ButtonComponentProps,
  ContactFormComponentProps,
  FAQListComponentProps,
  FeatureListComponentProps,
  ImageComponentProps,
  LinkListComponentProps,
  LogoComponentProps,
  PricingTableComponentProps,
  Section,
  TestimonialListComponentProps,
  TextComponentProps,
  Website,
  WebsiteComponent,
} from "@/lib/editor/schema";

const sectionStyle = (section: Section): CSSProperties => ({
  backgroundColor: section.styles.background?.color ?? "#ffffff",
  backgroundImage:
    section.styles.background?.image ?? section.settings.backgroundImage
      ? `url(${section.styles.background?.image ?? section.settings.backgroundImage})`
      : undefined,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  color: section.styles.typography?.color ?? "#111827",
  display: section.visibility === "hidden" ? "none" : undefined,
  paddingTop: section.styles.spacing?.paddingTop ?? "80px",
  paddingRight: section.styles.spacing?.paddingRight ?? "24px",
  paddingBottom: section.styles.spacing?.paddingBottom ?? "80px",
  paddingLeft: section.styles.spacing?.paddingLeft ?? "24px",
});

const componentTextStyle = (component: WebsiteComponent): CSSProperties => ({
  color: component.styles.typography?.color,
  fontFamily: component.styles.typography?.fontFamily,
  fontSize: component.styles.typography?.fontSize,
  fontWeight: component.styles.typography?.fontWeight,
  textAlign: component.styles.typography?.textAlign,
  lineHeight: component.styles.typography?.lineHeight,
  letterSpacing: component.styles.typography?.letterSpacing,
});

const componentBoxStyle = (component: WebsiteComponent): CSSProperties => ({
  background: component.styles.background?.color,
  borderColor: component.styles.border?.color,
  borderWidth: component.styles.border?.width,
  borderRadius: component.styles.border?.radius,
  paddingTop: component.styles.spacing?.paddingTop,
  paddingRight: component.styles.spacing?.paddingRight,
  paddingBottom: component.styles.spacing?.paddingBottom,
  paddingLeft: component.styles.spacing?.paddingLeft,
});

function SafeImage({ src, alt, className, style }: {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
}) {
  if (!src) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} style={style} loading="lazy" />
  );
}

function RenderComponent({ component }: { component: WebsiteComponent }) {
  if (component.visibility === "hidden") return null;

  const textStyle = componentTextStyle(component);
  const boxStyle = componentBoxStyle(component);

  switch (component.type) {
    case "text":
    case "richText": {
      const props = component.props as TextComponentProps;
      const text = props.text.raw;
      const role = props.semanticRole ?? "body";
      if (!text) return null;

      if (role === "heading") {
        return <h2 className="text-4xl font-semibold tracking-normal md:text-6xl" style={textStyle}>{text}</h2>;
      }

      if (role === "caption" || role === "legal") {
        return <p className="text-xs opacity-60" style={textStyle}>{text}</p>;
      }

      return <p className="max-w-2xl text-base leading-7 opacity-75 md:text-lg" style={textStyle}>{text}</p>;
    }

    case "button": {
      const props = component.props as ButtonComponentProps;
      if (!props.label) return null;
      return (
        <a
          href={props.href || "#"}
          target={props.openInNewTab ? "_blank" : undefined}
          rel={props.openInNewTab ? "noreferrer" : undefined}
          className="inline-flex items-center justify-center rounded-md border border-current px-5 py-3 text-sm font-medium"
          style={{ ...textStyle, ...boxStyle }}
        >
          {props.label}
        </a>
      );
    }

    case "logo": {
      const props = component.props as LogoComponentProps;
      return (
        <div className="inline-flex items-center gap-2 text-base font-semibold" style={textStyle}>
          {props.imageSrc ? (
            <SafeImage src={props.imageSrc} alt={props.text || "Logo"} className="max-h-9 max-w-40" style={{ objectFit: "contain" }} />
          ) : null}
          {props.text}
        </div>
      );
    }

    case "navbarLinks":
    case "linkList": {
      const props = component.props as LinkListComponentProps;
      return (
        <nav className="flex flex-wrap justify-center gap-5 text-sm" style={textStyle}>
          {props.links.map((link) => (
            <a key={link.id} href={link.href}>{link.label}</a>
          ))}
        </nav>
      );
    }

    case "image": {
      const props = component.props as ImageComponentProps;
      return (
        <div className="flex w-full justify-center overflow-hidden rounded-md border border-current/10" style={boxStyle}>
          <SafeImage src={props.src} alt={props.alt} className="max-h-[420px] w-full" style={{ objectFit: props.objectFit }} />
        </div>
      );
    }

    case "featureList": {
      const props = component.props as FeatureListComponentProps;
      return (
        <div className="grid w-full gap-4 md:grid-cols-3" style={boxStyle}>
          {props.items.map((item) => (
            <article key={item.id} className="rounded-md border border-current/10 p-5 text-left">
              {item.imageSrc ? (
                <SafeImage src={item.imageSrc} alt={item.title} className="mb-4 h-20 w-full" style={{ objectFit: "contain" }} />
              ) : null}
              <h3 className="text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 opacity-70">{item.description}</p>
            </article>
          ))}
        </div>
      );
    }

    case "pricingTable": {
      const props = component.props as PricingTableComponentProps;
      return (
        <div className="grid w-full gap-4 md:grid-cols-2" style={boxStyle}>
          {props.tiers.map((tier) => (
            <article key={tier.id} className={`rounded-md border p-6 text-left ${tier.highlighted ? "border-current" : "border-current/10"}`}>
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <p className="mt-3 text-3xl font-semibold">{props.currency} {tier.price}</p>
              <p className="mt-3 text-sm opacity-70">{tier.description}</p>
              <ul className="mt-5 space-y-2 text-sm opacity-80">
                {tier.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
            </article>
          ))}
        </div>
      );
    }

    case "testimonialList": {
      const props = component.props as TestimonialListComponentProps;
      return (
        <div className="grid w-full gap-4 md:grid-cols-2" style={boxStyle}>
          {props.items.map((item) => (
            <figure key={item.id} className="rounded-md border border-current/10 p-5 text-left">
              <blockquote className="leading-7 opacity-80">{item.quote}</blockquote>
              <figcaption className="mt-4 text-sm opacity-60">
                {item.author}{item.role ? `, ${item.role}` : ""}
              </figcaption>
            </figure>
          ))}
        </div>
      );
    }

    case "faqList": {
      const props = component.props as FAQListComponentProps;
      return (
        <div className="w-full space-y-3 text-left" style={boxStyle}>
          {props.items.map((item) => (
            <article key={item.id} className="rounded-md border border-current/10 p-5">
              <h3 className="font-semibold">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 opacity-70">{item.answer}</p>
            </article>
          ))}
        </div>
      );
    }

    case "contactForm": {
      const props = component.props as ContactFormComponentProps;
      return (
        <form className="w-full max-w-xl space-y-3 text-left" style={boxStyle}>
          {props.fields.map((field) => (
            <label key={field.id} className="block text-sm">
              <span className="mb-1 block opacity-70">{field.label}</span>
              {field.type === "textarea" ? (
                <textarea className="min-h-24 w-full rounded-md border border-current/20 bg-transparent p-3" required={field.required} />
              ) : (
                <input className="h-11 w-full rounded-md border border-current/20 bg-transparent px-3" type={field.type} required={field.required} />
              )}
            </label>
          ))}
          <button className="rounded-md border border-current px-5 py-3 text-sm font-medium" type="submit">{props.submitLabel}</button>
        </form>
      );
    }
  }
}

function RenderSection({ section }: { section: Section }) {
  const components = [...section.components].sort((a, b) => a.order - b.order);

  return (
    <section style={sectionStyle(section)}>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        {components.map((component) => (
          <RenderComponent key={component.id} component={component} />
        ))}
      </div>
    </section>
  );
}

export function WebsiteRenderer({ website }: { website: Website }) {
  if (
    website.meta.renderMode === "cinematic_scroll" &&
    website.meta.cinematicExperience
  ) {
    return <CinematicWebsiteShell experience={website.meta.cinematicExperience} />;
  }

  const page = website.pages.find((candidate) => candidate.visibility !== "hidden") ?? website.pages[0];
  const sections = [...(page?.sections ?? [])].sort((a, b) => a.order - b.order);

  return (
    <main
      style={{
        background: website.globalStyles.colors.background,
        color: website.globalStyles.colors.foreground,
        fontFamily: website.globalStyles.typography.fontFamily,
        minHeight: "100vh",
      }}
    >
      {sections.map((section) => (
        <RenderSection key={section.id} section={section} />
      ))}
    </main>
  );
}
