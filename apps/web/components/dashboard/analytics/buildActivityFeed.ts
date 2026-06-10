import type {
  AiHistoryRow,
  CreditTransactionRow,
  CustomDomainRow,
  PublishedSiteRow,
} from "../types";
import { formatShortDate } from "../utils";

export type ActivityFeedItem = {
  id: string;
  title: string;
  meta: string;
  timestamp: number;
};

export const buildActivityFeed = ({
  publishedSites,
  connectedDomains,
  aiHistory,
  creditTransactions,
}: {
  publishedSites: PublishedSiteRow[];
  connectedDomains: CustomDomainRow[];
  aiHistory: AiHistoryRow[];
  creditTransactions: CreditTransactionRow[];
}): ActivityFeedItem[] => {
  const items: ActivityFeedItem[] = [];

  for (const site of publishedSites) {
    if (site.status !== "published") continue;
    items.push({
      id: `site-${site.id}`,
      title: "Site published",
      meta: site.seo_title ?? site.slug,
      timestamp: new Date(site.updated_at).getTime(),
    });
  }

  for (const domain of connectedDomains) {
    items.push({
      id: `domain-connect-${domain.id}`,
      title: "Domain connected",
      meta: domain.domain,
      timestamp: new Date(domain.createdAt).getTime(),
    });
    if (domain.verifiedAt) {
      items.push({
        id: `domain-verify-${domain.id}`,
        title: "Domain verified",
        meta: domain.domain,
        timestamp: new Date(domain.verifiedAt).getTime(),
      });
    }
  }

  for (const entry of aiHistory.slice(0, 10)) {
    items.push({
      id: `ai-${entry.id}`,
      title: "Generation completed",
      meta: entry.prompt.slice(0, 80),
      timestamp: new Date(entry.created_at).getTime(),
    });
  }

  for (const txn of creditTransactions) {
    if (txn.amount >= 0) continue;
    items.push({
      id: `credit-${txn.id}`,
      title: "Credits consumed",
      meta: `${Math.abs(txn.amount)} credits · ${txn.type.replaceAll("_", " ")}`,
      timestamp: new Date(txn.created_at).getTime(),
    });
  }

  return items
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 12)
    .map((item) => ({
      ...item,
      meta: `${formatShortDate(item.timestamp)} · ${item.meta}`,
    }));
};
