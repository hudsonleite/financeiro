export function PanelHeader({ eyebrow, title, actions = null }) {
  return (
    <div className="panel-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {actions}
    </div>
  );
}
