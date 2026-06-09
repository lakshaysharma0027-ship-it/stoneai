import type { SectionStyles, SectionType } from "@/lib/editor/schema";

export type GeneratedSectionContent = {
  heading?: string;
  body?: string;
  buttonLabel?: string;
  logo?: string;
  features?: Array<{
    id: string;
    title: string;
    description: string;
    imageSrc?: string;
  }>;
  pricing?: Array<{
    id: string;
    name: string;
    price: number;
    description: string;
    features: string[];
    highlighted?: boolean;
  }>;
  testimonials?: Array<{
    id: string;
    quote: string;
    author: string;
    role?: string;
  }>;
  faqs?: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
  gallery?: Array<{
    id: string;
    src: string;
    alt: string;
  }>;
  footerLegal?: string;
  submitLabel?: string;
};

export type SectionRegistryEntry = {
  id: string;
  type: SectionType;
  defaultContent: GeneratedSectionContent;
  defaultStyles: SectionStyles;
};
