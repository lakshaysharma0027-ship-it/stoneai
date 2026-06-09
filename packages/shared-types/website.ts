export interface Project {
  id: string;
  name: string;
  pages: Page[];
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  sections: Section[];
}

export interface Section {
  id: string;
  type: string;
  components: Component[];
}

export interface Component {
  id: string;
  type: string;
  props: Record<string, any>;
}