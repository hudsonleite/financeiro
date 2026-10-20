import { useCallback, useState } from "react";
import { loadEntries,saveEntries,exportEntriesBackup } from "../../services/entriesStorage.js";
import { createEntry } from "../../utils/entries.js";
export function useEntries() {
  const [entries,setEntries]=useState(loadEntries);
  const persistEntries=useCallback(next=>{saveEntries(next);setEntries(next);},[]);
  const addEntry=useCallback(data=>persistEntries([...entries,createEntry(data)]),[entries,persistEntries]);
  const deleteEntry=useCallback(()=>{
    throw new Error("Exclusão temporariamente bloqueada até a implementação de autorização no servidor.");
  },[]);
  const entriesForDate=useCallback(date=>entries.filter(e=>e.date===date).sort((a,b)=>a.createdAt.localeCompare(b.createdAt)),[entries]);
  const exportBackup=useCallback(()=>exportEntriesBackup(entries),[entries]);
  return {entries,addEntry,deleteEntry,entriesForDate,exportBackup};
}
