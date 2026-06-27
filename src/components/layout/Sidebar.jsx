const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "launches", label: "Lan\u00e7amento" },
];

export function Sidebar({ activeView, onChangeView }) {
  return (
    <aside className="sidebar" aria-label="Menu principal">
      <div className="sidebar-brand">
        <span>Financeiro</span>
        <strong>Controle diario</strong>
      </div>

      <nav className="sidebar-nav">
        {MENU_ITEMS.map((item) => (
          <button
            className={`sidebar-link ${activeView === item.id ? "active" : ""}`}
            key={item.id}
            onClick={() => onChangeView(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
