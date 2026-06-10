export function DashboardSkeleton() {
  return (
    <div className="dashboard-content-inner space-y-4">
      <div className="dash-skeleton h-8 w-48" />
      <div className="dash-metrics-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="dash-skeleton h-[108px] rounded-[10px]" />
        ))}
      </div>
      <div className="dash-split-main">
        <div className="dash-skeleton h-80 rounded-[10px]" />
        <div className="dash-skeleton h-80 rounded-[10px]" />
      </div>
    </div>
  );
}
