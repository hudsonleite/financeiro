export function createEntry(entryData) {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...entryData,
  };
}

export function sumEntries(entries, type = null) {
  return entries
    .filter((entry) => !type || entry.type === type)
    .reduce((total, entry) => total + entry.amount, 0);
}
