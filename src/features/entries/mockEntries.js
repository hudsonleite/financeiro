import { toDateKey } from "../../utils/date.js";

export function appendMockExpenses(entries, today = new Date()) {
  const ids = new Set(entries.map((entry) => entry.id));
  const next = [...entries];
  const date = new Date(2026, 9, 18);
  const end = toDateKey(today);
  let day = 0;
  while (toDateKey(date) <= end) {
    const key = toDateKey(date);
    const items = [
      { method: "Pix", description: "Fornecedor", amount: 1800 + day * 137 % 1900 },
      { method: "Dinheiro", description: "Transporte e operação", amount: 250 + day * 53 % 450 },
    ];
    items.forEach((item, index) => {
      const id = `mock-expense-${key}-${index}`;
      if (!ids.has(id)) next.push({ ...item, id, type: "saida", date: key,
        description: `[EXEMPLO] ${item.description}`,
        createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, index).toISOString(),
      });
    });
    date.setDate(date.getDate() + 1);
    day++;
  }
  return next;
}

export function generateMockEntries(endDate = new Date(2026, 9, 18)) {
  const lastBlockStart = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  lastBlockStart.setDate(lastBlockStart.getDate() - 6);
  const records = [];
  for (let week = 0; week < 7; week++) {
    for (let day = 0; day < 7; day++) {
      const date = new Date(lastBlockStart);
      date.setDate(date.getDate() - week * 7 + day);
      const dateKey = toDateKey(date);
      if (dateKey < "2026-09-01") continue;
      const income = 4200 + ((week * 937 + day * 613) % 4200);
      const expense = day === 4 && week === 2 ? income + 900 : 1800 + ((week * 479 + day * 367) % 2800);
      const items = [
        { type: "entrada", method: "Dinheiro", amount: Math.round(income * .25), label: "Vendas em dinheiro" },
        { type: "entrada", method: "Pix", amount: Math.round(income * .45), label: "Vendas via Pix" },
        { type: "entrada", method: "Credito", amount: income - Math.round(income * .25) - Math.round(income * .45), label: "Vendas no cartão" },
        { type: "saida", method: "Pix", amount: Math.round(expense * .8), label: "Pagamento de fornecedor" },
        { type: "saida", method: "Dinheiro", amount: expense - Math.round(expense * .8), label: "Despesas operacionais" },
      ];
      items.forEach(({ label, ...item }, index) => records.push({
        ...item, id: `mock-${dateKey}-${index}`, date: dateKey,
        description: `[EXEMPLO] ${label}`,
        createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 10, index).toISOString(),
      }));
    }
  }
  return records;
}

export function appendMockEntries(entries, endDate = new Date(2026, 9, 18)) {
  const ids = new Set(entries.map((entry) => entry.id));
  return [...entries, ...generateMockEntries(endDate).filter((entry) => !ids.has(entry.id))];
}
