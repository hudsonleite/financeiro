import { APP_MENU_ITEMS } from "../../app/viewConfig.js";
import { AppIcon } from "../icons/AppIcon.jsx";
import { SidebarNavItem } from "./SidebarNavItem.jsx";

export function Sidebar({ activeView, collapsed, onChangeView, onToggle }) {
  return (
    <aside className="sidebar" aria-label="Menu principal">
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <span className="brand-mark"><AppIcon name="finance" /></span>
          <div className="brand-copy"><strong>Finan</strong><small>Gestão financeira</small></div>
        </div>
        <button className="sidebar-toggle" onClick={onToggle} aria-label={collapsed ? "Expandir menu" : "Recolher menu"}>
          <AppIcon name="chevron" />
        </button>
      </div>

      <nav className="sidebar-nav">
        {APP_MENU_ITEMS.map((item) => (
          <SidebarNavItem
            key={item.id}
            item={item}
            active={activeView === item.id}
            collapsed={collapsed}
            onSelect={onChangeView}
          />
        ))}
      </nav>
      <div className="sidebar-footer">
        <span className="status-dot" />
        <div className="brand-copy"><strong>Dados locais</strong><small>Salvos neste dispositivo</small></div>
      </div>
    </aside>
  );
}
