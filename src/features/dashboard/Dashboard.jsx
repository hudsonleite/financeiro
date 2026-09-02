import { sumEntries } from "../../utils/entries.js";
import { formatCurrency } from "../../utils/money.js";
import { MetricCard } from "./MetricCard.jsx";

export function Dashboard({ entries, todayEntries }) {
  const income = sumEntries(entries, "entrada");
  const expense = sumEntries(entries, "saida");
  const balance = income - expense;
  const todayIncome = sumEntries(todayEntries, "entrada");
  const todayDiscounts = sumEntries(todayEntries, "saida");
  const todayTotal = todayIncome - todayDiscounts;

  return (
    <section className="dashboard-grid">
      <MetricCard label="Saldo do mês" value={formatCurrency(balance)} variant="balance" icon="wallet" />
      <MetricCard label="Entradas" value={formatCurrency(income)} variant="income" icon="income" />
      <MetricCard label="Saídas" value={formatCurrency(expense)} variant="expense" icon="expense" />
      <MetricCard label="Hoje" value={formatCurrency(todayTotal)} icon="calendar" />
    </section>
  );
}
