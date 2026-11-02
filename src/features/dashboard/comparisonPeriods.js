import { toDateKey } from "../../utils/date.js";

export function getComparisonPeriods(entries, mode, monthComparison = "previous", today = new Date(), baseMonth = null) {
  const year = mode === "month" && baseMonth ? Number(baseMonth.slice(0, 4)) : today.getFullYear();
  const month = mode === "month" && baseMonth ? Number(baseMonth.slice(5, 7)) - 1 : today.getMonth();
  const monthRange = (y, m, current) => ({
    start: toDateKey(new Date(y, m, 1)), end: toDateKey(new Date(y, m + 1, 0)), current,
    label: new Date(y, m, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
  });
  const ranges = mode === "year"
    ? [year, year - 1].map((y) => ({ start: `${y}-01-01`, end: `${y}-12-31`, current: y === year, label: String(y) }))
    : [monthRange(year, month, true), monthComparison === "previous" ? monthRange(year, month - 1, false) : monthRange(year - 1, month, false)];
  return ranges.map((range) => {
    let income = 0;
    let expense = 0;
    for (const entry of entries) {
      if (entry.deletedAt || entry.date < range.start || entry.date > range.end) continue;
      if (entry.type === "entrada") income += Math.round(entry.amount * 100);
      if (entry.type === "saida") expense += Math.round(entry.amount * 100);
    }
    return { ...range, income: income / 100, expense: expense / 100 };
  });
}
