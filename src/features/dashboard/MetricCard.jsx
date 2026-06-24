export function MetricCard({ label, value, variant = "" }) {
  return (
    <article className={`metric-card ${variant}`.trim()}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
