import { AppIcon } from "../icons/AppIcon.jsx";

export function SidebarNavItem({ item, active, collapsed, onSelect }) {
  return (
    <button
      className={`sidebar-link ${active ? "active" : ""}`}
      onClick={() => onSelect(item.id)}
      title={collapsed ? item.label : undefined}
    >
      <span className="nav-icon"><AppIcon name={item.icon} /></span>
      <span className="nav-label">{item.label}</span>
    </button>
  );
}
