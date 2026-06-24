import { sumEntries } from "../../utils/entries.js";
import { formatCurrency } from "../../utils/money.js";
import { MetricCard } from "./MetricCard.jsx";

export function Dashboard({ entries, todayEntries }) {
  const income = sumEntries(entries, "entrada");
  const expense = sumEntries(entries, "saida");
  const balance = income - expense;
  const todayTotal = sumEntries(todayEntries);

  return (
    <section className="dashboard-grid">
      <MetricCard label="Saldo do mes" value={formatCurrency(balance)} variant="balance" />
      <MetricCard label="Entradas" value={formatCurrency(income)} variant="income" />
      <MetricCard label="Saidas" value={formatCurrency(expense)} variant="expense" />
      <MetricCard label="Hoje" value={formatCurrency(todayTotal)} />
    </section>
  );
}
