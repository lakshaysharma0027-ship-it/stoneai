export type LeftTab =
  | "layers"
  | "assets"
  | "components"
  | "pages"
  | "animations"
  | "3d";

export type RightTab =
  | "layout"
  | "style"
  | "effects"
  | "3d"
  | "interactions"
  | "seo";

export type LeftTabConfig = {
  id: LeftTab;
  icon: string;
  label: string;
};

export type RightTabConfig = {
  id: RightTab;
  label: string;
};

export type * from "@/lib/editor/schema";
