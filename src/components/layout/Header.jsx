export function Header({ title = "Dashboard", onOpenToday }) {
  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">Painel financeiro</span>
        <h1>{title}</h1>
        <p className="page-subtitle">Acompanhe seus resultados e mantenha tudo sob controle.</p>
      </div>
      {onOpenToday ? (
        <button className="primary-action" onClick={onOpenToday}>
          <span>+</span> Novo lançamento
        </button>
      ) : null}
    </header>
  );
}
