import type { Deployment, Domain, Project, Website } from "./schema";
import { nowIso } from "./websiteFactory";

export type CreateProjectInput = {
  ownerId: string;
  name: string;
  websiteId: string;
};

export type PublishWebsiteInput = {
  project: Project;
  website: Website;
};

export type ConnectDomainInput = {
  projectId: string;
  hostname: string;
};

export type PublishService = {
  createProject: (input: CreateProjectInput) => Promise<Project>;
  publishWebsite: (input: PublishWebsiteInput) => Promise<Deployment>;
  connectDomain: (input: ConnectDomainInput) => Promise<Domain>;
  verifyDomain: (domain: Domain) => Promise<Domain>;
};

export const mockPublishService: PublishService = {
  async createProject({ ownerId, name, websiteId }) {
    const timestamp = nowIso();

    return {
      id: crypto.randomUUID(),
      ownerId,
      name,
      websiteId,
      status: "draft",
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  },

  async publishWebsite({ project, website }) {
    return {
      id: crypto.randomUUID(),
      projectId: project.id,
      websiteVersion: website.version,
      status: "queued",
      url: null,
      errorMessage: null,
      createdAt: nowIso(),
    };
  },

  async connectDomain({ projectId, hostname }) {
    return {
      id: crypto.randomUUID(),
      projectId,
      hostname,
      status: "pending",
      verificationToken: crypto.randomUUID(),
      createdAt: nowIso(),
    };
  },

  async verifyDomain(domain) {
    return {
      ...domain,
      status: "pending",
    };
  },
};
