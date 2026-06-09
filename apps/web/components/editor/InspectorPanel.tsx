"use client";

import InspectorSection from "./InspectorSection";
import { ComponentRegistry } from "./componentRegistry";
import { useEditorStore } from "./store";
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
  WebsiteComponent,
} from "./types";
import { Icon } from "./ui/Icon";
import { ColorSwatch, InspectorInput, Slider, Switch } from "./ui/primitives";

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number";
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-widest text-[#3D3D3D]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 w-full rounded-[5px] border border-[#161616] bg-[#050505] px-2 text-[11px] text-[#9CA3AF] outline-none transition-colors duration-75 focus:border-[#1E1E1E] focus:text-white"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-widest text-[#3D3D3D]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-16 w-full resize-y rounded-[5px] border border-[#161616] bg-[#050505] px-2 py-1.5 text-[11px] text-[#9CA3AF] outline-none transition-colors duration-75 focus:border-[#1E1E1E] focus:text-white"
      />
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-widest text-[#3D3D3D]">{label}</span>
      <div className="flex h-8 items-center rounded-[5px] border border-[#161616] bg-[#050505] focus-within:border-[#1E1E1E]">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="ml-2 h-4 w-4 cursor-pointer border-0 bg-transparent p-0"
        />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent px-2 font-mono text-[11px] text-[#9CA3AF] outline-none focus:text-white"
        />
      </div>
    </label>
  );
}

function FileField({
  label,
  onChange,
}: {
  label: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-widest text-[#3D3D3D]">{label}</span>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === "string") onChange(reader.result);
          };
          reader.readAsDataURL(file);
        }}
        className="block w-full cursor-pointer rounded-[5px] border border-[#161616] bg-[#050505] text-[11px] text-[#6B7280] file:mr-2 file:h-8 file:border-0 file:bg-[#111] file:px-2 file:text-[11px] file:text-[#D1D5DB]"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-widest text-[#3D3D3D]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 w-full rounded-[5px] border border-[#161616] bg-[#050505] px-2 text-[11px] text-[#9CA3AF] outline-none transition-colors duration-75 focus:border-[#1E1E1E] focus:text-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ComponentContentEditor({
  component,
}: {
  component: WebsiteComponent;
}) {
  const updateComponent = useEditorStore((state) => state.updateComponent);

  switch (component.type) {
    case "text":
    case "richText": {
      const props = component.props as TextComponentProps;
      return (
        <InspectorSection title="Content">
          <div className="mt-2 space-y-3">
            <TextAreaField
              label="Content"
              value={props.text.raw}
              onChange={(value) =>
                updateComponent(component.id, {
                  props: { text: { raw: value } },
                })
              }
            />
            <SelectField
              label="Role"
              value={props.semanticRole ?? "body"}
              options={[
                { value: "eyebrow", label: "Eyebrow" },
                { value: "heading", label: "Heading" },
                { value: "body", label: "Body" },
                { value: "caption", label: "Caption" },
                { value: "legal", label: "Legal" },
              ]}
              onChange={(value) =>
                updateComponent(component.id, {
                  props: {
                    semanticRole: value as TextComponentProps["semanticRole"],
                  },
                })
              }
            />
          </div>
        </InspectorSection>
      );
    }

    case "button": {
      const props = component.props as ButtonComponentProps;
      return (
        <InspectorSection title="Button">
          <div className="mt-2 space-y-3">
            <TextField
              label="Label"
              value={props.label}
              onChange={(value) =>
                updateComponent(component.id, { props: { label: value } })
              }
            />
            <TextField
              label="Href"
              value={props.href}
              onChange={(value) =>
                updateComponent(component.id, { props: { href: value } })
              }
            />
            <SelectField
              label="Variant"
              value={props.variant}
              options={[
                { value: "primary", label: "Primary" },
                { value: "secondary", label: "Secondary" },
                { value: "ghost", label: "Ghost" },
              ]}
              onChange={(value) =>
                updateComponent(component.id, {
                  props: {
                    variant: value as ButtonComponentProps["variant"],
                  },
                })
              }
            />
          </div>
        </InspectorSection>
      );
    }

    case "image": {
      const props = component.props as ImageComponentProps;
      return (
        <InspectorSection title="Image">
          <div className="mt-2 space-y-3">
            <TextField
              label="Source"
              value={props.src}
              onChange={(value) =>
                updateComponent(component.id, { props: { src: value } })
              }
            />
            <TextField
              label="Alt text"
              value={props.alt}
              onChange={(value) =>
                updateComponent(component.id, { props: { alt: value } })
              }
            />
            <FileField
              label="Upload image"
              onChange={(value) =>
                updateComponent(component.id, { props: { src: value } })
              }
            />
            <FileField
              label="Replace image"
              onChange={(value) =>
                updateComponent(component.id, { props: { src: value } })
              }
            />
          </div>
        </InspectorSection>
      );
    }

    case "featureList": {
      const props = component.props as FeatureListComponentProps;
      return (
        <InspectorSection title="Features">
          <div className="mt-2 space-y-3">
            <SelectField
              label="Columns"
              value={String(props.columns)}
              options={[
                { value: "2", label: "2 Columns" },
                { value: "3", label: "3 Columns" },
                { value: "4", label: "4 Columns" },
              ]}
              onChange={(value) =>
                updateComponent(component.id, {
                  props: { columns: Number(value) as 2 | 3 | 4 },
                })
              }
            />
            <div className="text-[11px] text-[#555]">
              {props.items.length} feature item{props.items.length === 1 ? "" : "s"}
            </div>
          </div>
        </InspectorSection>
      );
    }

    case "pricingTable": {
      const props = component.props as PricingTableComponentProps;
      return (
        <InspectorSection title="Pricing">
          <div className="mt-2 space-y-3">
            <TextField
              label="Currency"
              value={props.currency}
              onChange={(value) =>
                updateComponent(component.id, { props: { currency: value } })
              }
            />
            <div className="text-[11px] text-[#555]">
              {props.tiers.length} pricing tier{props.tiers.length === 1 ? "" : "s"}
            </div>
          </div>
        </InspectorSection>
      );
    }

    case "testimonialList": {
      const props = component.props as TestimonialListComponentProps;
      return (
        <InspectorSection title="Testimonials">
          <div className="mt-2 space-y-3">
            <SelectField
              label="Display"
              value={props.displayStyle}
              options={[
                { value: "grid", label: "Grid" },
                { value: "carousel", label: "Carousel" },
                { value: "masonry", label: "Masonry" },
              ]}
              onChange={(value) =>
                updateComponent(component.id, {
                  props: {
                    displayStyle:
                      value as TestimonialListComponentProps["displayStyle"],
                  },
                })
              }
            />
            <div className="text-[11px] text-[#555]">
              {props.items.length} testimonial{props.items.length === 1 ? "" : "s"}
            </div>
          </div>
        </InspectorSection>
      );
    }

    case "faqList": {
      const props = component.props as FAQListComponentProps;
      return (
        <InspectorSection title="FAQ">
          <div className="mt-2 text-[11px] text-[#555]">
            {props.items.length} question{props.items.length === 1 ? "" : "s"}
          </div>
        </InspectorSection>
      );
    }

    case "contactForm": {
      const props = component.props as ContactFormComponentProps;
      return (
        <InspectorSection title="Form">
          <div className="mt-2 space-y-3">
            <TextField
              label="Submit Label"
              value={props.submitLabel}
              onChange={(value) =>
                updateComponent(component.id, {
                  props: { submitLabel: value },
                })
              }
            />
            <div className="text-[11px] text-[#555]">
              {props.fields.length} form field{props.fields.length === 1 ? "" : "s"}
            </div>
          </div>
        </InspectorSection>
      );
    }

    case "linkList":
    case "navbarLinks": {
      const props = component.props as LinkListComponentProps;
      return (
        <InspectorSection title="Links">
          <div className="mt-2 text-[11px] text-[#555]">
            {props.links.length} link{props.links.length === 1 ? "" : "s"}
          </div>
        </InspectorSection>
      );
    }

    case "logo": {
      const props = component.props as LogoComponentProps;
      return (
        <InspectorSection title="Logo">
          <div className="mt-2 space-y-3">
            <TextField
              label="Text"
              value={props.text}
              onChange={(value) =>
                updateComponent(component.id, { props: { text: value } })
              }
            />
          </div>
        </InspectorSection>
      );
    }
  }
}

function ComponentStyleEditor({ component }: { component: WebsiteComponent }) {
  const updateComponent = useEditorStore((state) => state.updateComponent);
  const typography = component.styles.typography ?? {};
  const background = component.styles.background ?? {};
  const border = component.styles.border ?? {};
  const isTextLike = component.type === "text" || component.type === "richText";
  const isButton = component.type === "button";

  return (
    <>
      {isTextLike && (
        <InspectorSection title="Typography">
          <div className="mt-2 space-y-3">
            <SelectField
              label="Font Family"
              value={typography.fontFamily ?? "Inter, system-ui, sans-serif"}
              options={[
                { value: "Inter, system-ui, sans-serif", label: "Inter" },
                { value: "Georgia, serif", label: "Georgia" },
                { value: "Arial, sans-serif", label: "Arial" },
                { value: "ui-monospace, SFMono-Regular, monospace", label: "Mono" },
              ]}
              onChange={(value) =>
                updateComponent(component.id, {
                  styles: { typography: { fontFamily: value } },
                })
              }
            />
            <div className="grid grid-cols-2 gap-2">
              <TextField
                label="Font Size"
                value={typography.fontSize ?? ""}
                onChange={(value) =>
                  updateComponent(component.id, {
                    styles: { typography: { fontSize: value } },
                  })
                }
              />
              <TextField
                label="Font Weight"
                value={typography.fontWeight ?? ""}
                onChange={(value) =>
                  updateComponent(component.id, {
                    styles: { typography: { fontWeight: value } },
                  })
                }
              />
            </div>
            <ColorField
              label="Text Color"
              value={typography.color ?? "#111827"}
              onChange={(value) =>
                updateComponent(component.id, {
                  styles: { typography: { color: value } },
                })
              }
            />
          </div>
        </InspectorSection>
      )}

      {isButton && (
        <InspectorSection title="Button Style">
          <div className="mt-2 space-y-3">
            <ColorField
              label="Background Color"
              value={background.color ?? "#111827"}
              onChange={(value) =>
                updateComponent(component.id, {
                  styles: { background: { color: value } },
                })
              }
            />
            <ColorField
              label="Text Color"
              value={typography.color ?? "#ffffff"}
              onChange={(value) =>
                updateComponent(component.id, {
                  styles: { typography: { color: value } },
                })
              }
            />
            <TextField
              label="Border Radius"
              value={border.radius ?? "8px"}
              onChange={(value) =>
                updateComponent(component.id, {
                  styles: { border: { radius: value } },
                })
              }
            />
          </div>
        </InspectorSection>
      )}

      <InspectorSection title="Color">
        <div className="mt-2 space-y-3">
          {(isTextLike || isButton) && (
            <ColorField
              label="Text"
              value={typography.color ?? "#111827"}
              onChange={(value) =>
                updateComponent(component.id, {
                  styles: { typography: { color: value } },
                })
              }
            />
          )}
          {isButton && (
            <ColorField
              label="Button"
              value={background.color ?? "#111827"}
              onChange={(value) =>
                updateComponent(component.id, {
                  styles: { background: { color: value } },
                })
              }
            />
          )}
          <ColorField
            label="Border"
            value={border.color ?? "#111827"}
            onChange={(value) =>
              updateComponent(component.id, {
                styles: { border: { color: value, width: border.width ?? "1px" } },
              })
            }
          />
        </div>
      </InspectorSection>
    </>
  );
}

function SectionEditor({ section }: { section: Section }) {
  const updateSection = useEditorStore((state) => state.updateSection);
  const paddingTop = section.styles.spacing?.paddingTop ?? "80px";
  const paddingBottom = section.styles.spacing?.paddingBottom ?? "80px";
  const background = section.styles.background?.color ?? "#ffffff";
  const textColor = section.styles.typography?.color ?? "#111827";
  const visible = section.visibility === "visible";

  return (
    <>
      <InspectorSection title="Section">
        <div className="mt-2 space-y-3">
          <TextField
            label="Name"
            value={section.name}
            onChange={(value) => updateSection(section.id, { name: value })}
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#666]">Visible</span>
            <Switch
              on={visible}
              onChange={() =>
                updateSection(section.id, {
                  visibility: visible ? "hidden" : "visible",
                })
              }
            />
          </div>
        </div>
      </InspectorSection>
      <InspectorSection title="Spacing">
        <div className="mt-2 flex flex-wrap gap-2">
          <InspectorInput
            label="Top"
            value={paddingTop.replace("px", "")}
            unit="px"
            width="half"
          />
          <InspectorInput
            label="Bottom"
            value={paddingBottom.replace("px", "")}
            unit="px"
            width="half"
          />
        </div>
        <div className="mt-3 space-y-3">
          <TextField
            label="Padding Top"
            value={paddingTop}
            onChange={(value) =>
              updateSection(section.id, {
                styles: { spacing: { paddingTop: value } },
              })
            }
          />
          <TextField
            label="Padding Bottom"
            value={paddingBottom}
            onChange={(value) =>
              updateSection(section.id, {
                styles: { spacing: { paddingBottom: value } },
              })
            }
          />
        </div>
      </InspectorSection>
      <InspectorSection title="Fill">
        <div className="mt-2 space-y-3">
          <ColorSwatch color={background} label="Background" />
          <ColorField
            label="Background"
            value={background}
            onChange={(value) =>
              updateSection(section.id, {
                styles: { background: { color: value } },
              })
            }
          />
          <ColorField
            label="Text"
            value={textColor}
            onChange={(value) =>
              updateSection(section.id, {
                styles: { typography: { color: value } },
              })
            }
          />
        </div>
      </InspectorSection>
      <InspectorSection title="Effects" defaultOpen={false}>
        <div className="mt-2">
          <div className="mb-1.5 text-[10px] text-[#444]">Opacity</div>
          <Slider
            value={section.visibility === "visible" ? 100 : 40}
            onChange={(value) =>
              updateSection(section.id, {
                visibility: value > 50 ? "visible" : "hidden",
              })
            }
          />
        </div>
      </InspectorSection>
    </>
  );
}

export default function InspectorPanel() {
  const rightWidth = useEditorStore((state) => state.rightWidth);
  const selectedSectionId = useEditorStore((state) => state.selectedSectionId);
  const selectedComponentId = useEditorStore((state) => state.selectedComponentId);
  const website = useEditorStore((state) => state.website);
  const activePageId = useEditorStore((state) => state.activePageId);
  const setAiOpen = useEditorStore((state) => state.setAiOpen);
  const activePage =
    website?.pages.find((page) => page.id === activePageId) ?? null;
  const section =
    activePage?.sections.find((candidate) => candidate.id === selectedSectionId) ??
    null;
  const component =
    section?.components.find((candidate) => candidate.id === selectedComponentId) ??
    null;
  const entry = component
    ? ComponentRegistry.resolveComponent(component.type)
    : section
      ? ComponentRegistry.resolve(section.type)
      : null;

  return (
    <aside
      className="flex flex-shrink-0 flex-col overflow-hidden border-l border-[#0D0D0D] bg-[#0A0A0A]"
      style={{ width: rightWidth }}
    >
      <div className="flex h-10 flex-shrink-0 items-center justify-between border-b border-[#0D0D0D] px-3">
        <span className="text-[10px] font-medium uppercase tracking-widest text-[#3D3D3D]">
          Properties
        </span>
        {entry && (
          <span className="flex items-center gap-1 rounded-[5px] border border-[#161616] bg-[#050505] px-1.5 py-0.5 text-[10px] text-[#4B5563]">
            <Icon name={entry.icon} size={10} />
            {entry.displayName}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {!section ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-[11px] text-[#4B5563]">
            <Icon name="cursor" size={18} />
            Select a section to edit its properties.
          </div>
        ) : component ? (
          <>
            <ComponentContentEditor component={component} />
            <ComponentStyleEditor component={component} />
          </>
        ) : (
          <SectionEditor section={section} />
        )}
      </div>
      <div className="border-t border-[#0D0D0D] p-2">
        <button
          onClick={() => setAiOpen(true)}
          className="flex h-9 w-full items-center gap-2 rounded-[5px] border border-[#161616] bg-[#050505] px-2 text-left text-[11px] text-[#4B5563] transition-colors duration-75 hover:border-[#1E1E1E] hover:text-white"
          type="button"
        >
          <Icon name="sparkle" size={12} />
          Ask StoneAI about this selection
        </button>
      </div>
    </aside>
  );
}
