import { validateEntries } from "../utils/entryValidation.js";
export const STORAGE_KEY = "financeiro:lancamentos:v1";
export function loadEntries(storage = localStorage) {
  const raw = storage.getItem(STORAGE_KEY);
  return raw === null ? [] : validateEntries(JSON.parse(raw));
}
export function saveEntries(entries, storage = localStorage) {
  validateEntries(entries);
  storage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
export function exportEntries(storage = localStorage) {
  const raw = storage.getItem(STORAGE_KEY);
  const url = URL.createObjectURL(new Blob([raw ?? "[]"], {type: "application/json;charset=utf-8"}));
  const link = document.createElement("a");
  link.href = url;
  link.download = `financeiro-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
