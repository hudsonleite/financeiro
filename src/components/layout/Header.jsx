export function Header({ onOpenToday }) {
  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">Financeiro</span>
        <h1>Dashboard de lancamentos</h1>
      </div>
      <button className="primary-action" onClick={onOpenToday}>
        + Lancar hoje
      </button>
    </header>
  );
}
