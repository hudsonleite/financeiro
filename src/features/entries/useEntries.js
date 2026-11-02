import { useCallback, useRef, useState } from "react";
import { loadEntries, saveEntries, exportEntries } from "../../services/entriesStorage.js";
import { createEntry, markEntryDeleted } from "../../utils/entries.js";
import { appendMockEntries } from "./mockEntries.js";

export function useEntries() {
  const [initial] = useState(() => {
    try { return { entries: loadEntries(), error: "" }; }
    catch { return { entries: [], error: "Não foi possível ler os registros. Novas gravações estão bloqueadas para preservar os dados. Exporte o backup para recuperação." }; }
  });
  const [entries, setEntries] = useState(initial.entries);
  const current = useRef(initial.entries);
  const [storageError, setStorageError] = useState(initial.error);
  const persistEntries = useCallback((nextEntries) => {
    if (initial.error) throw new Error(initial.error);
    try { saveEntries(nextEntries); }
    catch { throw new Error("Não foi possível salvar. Os dados anteriores foram mantidos. Verifique o espaço e as permissões do navegador e tente novamente."); }
    current.current = nextEntries;
    setEntries(nextEntries);
  }, [initial]);
  const addEntry = useCallback((data) => {
    persistEntries([...current.current, createEntry(data)]);
  }, [persistEntries]);
  const loadMockEntries = useCallback(() => {
    const next = appendMockEntries(current.current);
    const count = next.length - current.current.length;
    persistEntries(next);
    return count;
  }, [persistEntries]);
  const deleteEntry = useCallback((id) => {
    persistEntries(markEntryDeleted(current.current, id));
  }, [persistEntries]);
  const exportBackup = useCallback(() => {
    try { exportEntries(); }
    catch { setStorageError("Não foi possível exportar o backup. Verifique as permissões do navegador e tente novamente."); }
  }, []);
  const entriesForDate = useCallback((dateKey) => entries.filter((entry) => entry.date === dateKey).sort((a,b) => a.createdAt.localeCompare(b.createdAt)), [entries]);
  return {entries, addEntry, deleteEntry, entriesForDate, storageError, exportBackup, loadMockEntries};
}
