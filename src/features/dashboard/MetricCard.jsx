import { AppIcon } from "../../components/icons/AppIcon.jsx";

export function MetricCard({ label, value, variant = "", icon }) {
  return (
    <article className={`metric-card ${variant}`.trim()}>
      <div className="metric-card-heading">
        <span className="metric-card-icon"><AppIcon name={icon} /></span>
        <span>{label}</span>
      </div>
      <strong>{value}</strong>
    </article>
  );
}
