const STORAGE_KEY = "financeiro:lancamentos:v1";
export function loadEntries() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return [];
  let result;
  try {result=JSON.parse(raw);}
  catch {throw new Error("Dados locais corrompidos. Recupere o backup antes de gravar.");}
  if (!Array.isArray(result)) throw new Error("Formato de dados inválido.");
  return result;
}
export function saveEntries(entries) {
  const content=JSON.stringify(entries);
  localStorage.setItem(STORAGE_KEY,content);
  if (localStorage.getItem(STORAGE_KEY)!==content) throw new Error("Gravação não confirmada.");
}
export function exportEntriesBackup(entries) {
  const blob=new Blob([JSON.stringify({version:1,exportedAt:new Date().toISOString(),entries},null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download="financeiro-backup-"+new Date().toISOString().slice(0,10)+".json";
  document.body.append(a);
  try {a.click();} finally {a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
}
