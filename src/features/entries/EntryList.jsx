import { formatDate } from "../../utils/date.js";
import { formatCurrency } from "../../utils/money.js";

export function EntryList({ entries }) {
  if (!entries.length) {
    return <div className="empty-state">Nenhum lancamento neste periodo. Clique em um dia para comecar.</div>;
  }

  return (
    <div className="entry-list">
      {entries
        .slice()
        .reverse()
        .map((entry) => (
          <div className="entry-row" key={entry.id}>
            <div>
              <strong>{entry.description}</strong>
              <span>
                {formatDate(entry.date)} - {entry.method}
              </span>
            </div>
            <span className={entry.type === "entrada" ? "positive" : "negative"}>
              {entry.type === "entrada" ? "+" : "-"} {formatCurrency(entry.amount)}
            </span>
          </div>
        ))}
    </div>
  );
}
