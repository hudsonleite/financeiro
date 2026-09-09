import { sumEntries } from "../../utils/entries.js";
import { formatCurrency } from "../../utils/money.js";

export function EntryTotals({ entries }) {
  const income = sumEntries(entries, "entrada");
  const expense = sumEntries(entries, "saida");
  const balance = income - expense;

  return (
    <section className="entry-totals" aria-label="Totais dos lançamentos" aria-live="polite">
      <dl className="entry-totals-grid">
        <div className="entry-total income">
          <dt>Total de Entradas</dt>
          <dd>{formatCurrency(income)}</dd>
        </div>
        <div className="entry-total expense">
          <dt>Total de Saída</dt>
          <dd>{formatCurrency(expense)}</dd>
        </div>
        <div className={`entry-total balance ${balance < 0 ? "negative" : "positive"}`}>
          <dt>Saldo do Mês</dt>
          <dd>{formatCurrency(balance)}</dd>
        </div>
      </dl>
    </section>
  );
}
