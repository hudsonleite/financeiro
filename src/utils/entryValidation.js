import { ENTRY_TYPES, PAYMENT_METHODS } from "../constants/entries.js";
export function validateEntryData(data) {
  if (!data || typeof data !== "object") throw new Error("Lançamento inválido.");
  if (typeof data.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data.date) || !Number.isFinite(Date.parse(`${data.date}T12:00:00Z`)) || new Date(`${data.date}T12:00:00Z`).toISOString().slice(0,10) !== data.date) throw new Error("Data inválida.");
  if (!Number.isFinite(data.amount) || data.amount <= 0 || !Number.isSafeInteger(Math.round(data.amount * 100)) || Math.abs(data.amount * 100 - Math.round(data.amount * 100)) > 0.0001) throw new Error("Informe um valor positivo com até duas casas decimais.");
  if (!ENTRY_TYPES.some(({value}) => value === data.type)) throw new Error("Tipo inválido.");
  if (!PAYMENT_METHODS.includes(data.method)) throw new Error("Forma de pagamento inválida.");
  if (typeof data.description !== "string" || !data.description.trim() || data.description.length > 200) throw new Error("Descrição inválida (máximo de 200 caracteres).");
  return {date: data.date, amount: data.amount, type: data.type, method: data.method, description: data.description.trim()};
}
export function validateEntries(entries) {
  if (!Array.isArray(entries)) throw new Error("Os dados salvos não são uma lista.");
  const ids = new Set();
  for (const entry of entries) {
    validateEntryData(entry);
    if (typeof entry.id !== "string" || !entry.id || ids.has(entry.id)) throw new Error("Identificador inválido ou duplicado.");
    ids.add(entry.id);
    if (typeof entry.createdAt !== "string" || !Number.isFinite(Date.parse(entry.createdAt)) || (entry.deletedAt != null && (typeof entry.deletedAt !== "string" || !Number.isFinite(Date.parse(entry.deletedAt))))) throw new Error("Data de auditoria inválida.");
  }
  return entries;
}
