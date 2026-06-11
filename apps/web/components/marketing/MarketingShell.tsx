import { MarketingFooter } from "./MarketingFooter";
import { MarketingNav } from "./MarketingNav";
import "./marketing.css";

export function MarketingShell({
  children,
  priorityLogo = false,
}: {
  children: React.ReactNode;
  priorityLogo?: boolean;
}) {
  return (
    <main className="marketing-shell">
      <MarketingNav priorityLogo={priorityLogo} />
      {children}
      <MarketingFooter />
    </main>
  );
}
