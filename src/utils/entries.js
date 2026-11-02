import { validateEntryData } from "./entryValidation.js";
export function createEntry(entryData) {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...validateEntryData(entryData),
  };
}

export function sumEntries(entries, type = null) {
  return entries
    .filter((entry) => !entry.deletedAt && (!type || entry.type === type))
    .reduce((total, entry) => total + entry.amount, 0);
}

export function markEntryDeleted(entries, id) {
  const entry = entries.find((item) => item.id === id);
  if (!entry) throw new Error("Lançamento não encontrado. Atualize a tela e tente novamente.");
  if (entry.deletedAt) return entries;
  return entries.map((item) => item.id === id ? { ...item, deletedAt: new Date().toISOString() } : item);
}
