export function Header({ title = "Dashboard", onOpenToday }) {
  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">Financeiro</span>
        <h1>{title}</h1>
      </div>
      <button className="primary-action" onClick={onOpenToday}>
        + Lancar hoje
      </button>
    </header>
  );
}
