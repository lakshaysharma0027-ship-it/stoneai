type SpecSparklineProps = {
  values: number[];
  variant?: "default" | "green";
};

export function SpecSparkline({ values, variant = "default" }: SpecSparklineProps) {
  const max = Math.max(...values, 1);
  const height = 28;
  const width = 120;
  const step = values.length > 1 ? width / (values.length - 1) : width;

  const points = values
    .map((value, index) => {
      const x = index * step;
      const normalized = value / max;
      const y = height - 4 - normalized * (height - 8);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline
        className={variant === "green" ? "sparkline-polyline--green" : undefined}
        points={points}
        fill="none"
        stroke="#2a2a2a"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
