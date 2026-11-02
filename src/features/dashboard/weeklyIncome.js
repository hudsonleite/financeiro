import { toDateKey } from "../../utils/date.js";

export function getWeeklyIncome(entries, previousWeeks = 1, today = new Date(), type = "entrada") {
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
  const amounts = new Map();
  for (const entry of entries) {
    if (entry.type !== type || entry.deletedAt) continue;
    amounts.set(entry.date, (amounts.get(entry.date) ?? 0) + Math.round(entry.amount * 100));
  }
  return Array.from({ length: previousWeeks + 1 }, (_, index) => {
    const days = Array.from({ length: 7 }, (_, day) => {
      const date = new Date(monday);
      date.setDate(date.getDate() - index * 7 + day);
      const key = toDateKey(date);
      return { date: key, amount: (amounts.get(key) ?? 0) / 100 };
    });
    return { days, total: days.reduce((sum, day) => sum + Math.round((day.amount ?? 0) * 100), 0) / 100 };
  });
}
