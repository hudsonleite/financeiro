import { useState } from "react";
import { formatPaymentMethod } from "../../constants/entries.js";
import { AppIcon } from "../../components/icons/AppIcon.jsx";
import { formatDate } from "../../utils/date.js";
import { formatCurrency } from "../../utils/money.js";

export function EntryList({ entries, onDeleteEntry }) {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function closeConfirmation() {
    setSelectedEntry(null);
    setUsername("");
    setPassword("");
    setError("");
  }

  function confirmDeletion(event) {
    event.preventDefault();

    if (username !== "admin" || password !== "admin") {
      setError("Usuário ou senha inválidos.");
      return;
    }

    onDeleteEntry(selectedEntry.id);
    closeConfirmation();
  }

  if (!entries.length) {
    return <div className="empty-state">Nenhum lançamento neste período. Clique em um dia para começar.</div>;
  }

  return (
    <div className="entry-list">
      {entries
        .slice()
        .reverse()
        .map((entry) => (
          <div
            className={`entry-row ${entry.type} ${entry.deletedAt ? "deleted" : ""}`}
            key={entry.id}
          >
            <div className="entry-main">
              <span className="entry-type-icon" title={entry.type === "entrada" ? "Entrada" : "Saída"}>
                <AppIcon name={entry.type === "entrada" ? "income" : "expense"} />
              </span>
              <div className="entry-copy">
                <strong>{formatPaymentMethod(entry.description)}</strong>
                <span>
                  {formatDate(entry.date)} - {formatPaymentMethod(entry.method)}
                </span>
              </div>
            </div>
            <div className="entry-actions">
              <span className={`entry-value ${entry.type === "entrada" ? "positive" : "negative"}`}>
                {entry.type === "entrada" ? "+" : "-"} {formatCurrency(entry.amount)}
              </span>
              {!entry.deletedAt ? (
                <button
                  className="entry-delete-button"
                  aria-label={`Excluir lançamento ${formatPaymentMethod(entry.description)}`}
                  title="Excluir lançamento"
                  onClick={() => setSelectedEntry(entry)}
                  type="button"
                >
                  <AppIcon name="trash" />
                </button>
              ) : null}
            </div>
          </div>
        ))}

      {selectedEntry ? (
        <div className="confirmation-backdrop" onClick={closeConfirmation}>
          <section
            className="confirmation-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="eyebrow">Confirmação de segurança</span>
            <h2 id="delete-title">Excluir lançamento?</h2>
            <p>
              O registro <strong>{formatPaymentMethod(selectedEntry.description)}</strong> ficará visível, marcado como excluído,
              e não será considerado nos totais.
            </p>

            <form className="confirmation-form" onSubmit={confirmDeletion}>
              <label>
                Usuário
                <input autoFocus value={username} onChange={(event) => setUsername(event.target.value)} />
              </label>
              <label>
                Senha
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
              {error ? <span className="confirmation-error" role="alert">{error}</span> : null}
              <div className="confirmation-actions">
                <button className="ghost-button" onClick={closeConfirmation} type="button">Cancelar</button>
                <button className="danger-button" type="submit">Confirmar exclusão</button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  );
}
