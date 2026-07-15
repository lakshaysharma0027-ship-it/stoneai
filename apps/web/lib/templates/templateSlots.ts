export type TemplateHtmlSlot = {
  id: string;
  label: string;
  hint?: string;
};

export const TEMPLATE_HTML_SLOTS: Record<string, TemplateHtmlSlot[]> = {
  "stone-archive": [
    { id: "title", label: "Browser tab title" },
    { id: "l-title", label: "Loading screen title" },
    { id: "id-name", label: "Full name headline" },
    { id: "id-sub", label: "Role and organization line" },
    {
      id: "id-bio",
      label: "Bio facts",
      hint: "Use <br> between lines and &nbsp; for spacing, matching the template rhythm.",
    },
    { id: "id-tagline", label: "Quoted personal tagline" },
    {
      id: "about-body",
      label: "About narrative",
      hint: "Use <br> and <br><br> for paragraph breaks.",
    },
    {
      id: "about-tags",
      label: "Skill tags",
      hint: 'Return <span class="tag">Label</span> elements only.',
    },
    {
      id: "forge-items",
      label: "Projects and capabilities list",
      hint: "Use <br> between lines; optional muted footer line in a <span style> like the template.",
    },
    { id: "final-name", label: "Closing name" },
    { id: "final-line1", label: "Closing role and location" },
    { id: "final-line2", label: "Closing statement" },
    {
      id: "corner",
      label: "Footer corner",
      hint: "Use <br> between lines.",
    },
  ],
};

export const getTemplateHtmlSlots = (templateId: string): TemplateHtmlSlot[] =>
  TEMPLATE_HTML_SLOTS[templateId] ?? [];
