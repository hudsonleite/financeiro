import { useCallback, useState } from "react";
import { loadEntries, saveEntries } from "../../services/entriesStorage.js";
import { createEntry } from "../../utils/entries.js";

export function useEntries() {
  const [entries, setEntries] = useState(loadEntries);

  const persistEntries = useCallback((nextEntries) => {
    setEntries(nextEntries);
    saveEntries(nextEntries);
  }, []);

  const addEntry = useCallback(
    (entryData) => {
      persistEntries([...entries, createEntry(entryData)]);
    },
    [entries, persistEntries],
  );

  const entriesForDate = useCallback(
    (dateKey) =>
      entries
        .filter((entry) => entry.date === dateKey)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [entries],
  );

  return {
    entries,
    addEntry,
    entriesForDate,
  };
}
