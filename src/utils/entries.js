import { ENTRY_TYPES, PAYMENT_METHODS } from "../constants/entries.js";
export function validateEntry(data) {
  if (!data || typeof data !== "object") throw new Error("Lançamento inválido.");
  const {date, amount, type, method} = data;
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Data inválida.");
  const [year,month,day] = date.split("-").map(Number);
  const d = new Date(year, month-1, day);
  if (d.getFullYear() !== year || d.getMonth() !== month-1 || d.getDate() !== day) throw new Error("Data inválida.");
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0 || !Number.isSafeInteger(Math.round(amount*100)) || Math.abs(amount*100-Math.round(amount*100)) > 1e-7) throw new Error("Valor inválido.");
  if (!ENTRY_TYPES.some(item=>item.value===type)) throw new Error("Tipo inválido.");
  if (!PAYMENT_METHODS.includes(method)) throw new Error("Forma de pagamento inválida.");
  return {date,amount:Math.round(amount*100)/100,type,method,description:typeof data.description==="string"&&data.description.trim()?data.description.trim().slice(0,200):method};
}
export function createEntry(data) { return {id:crypto.randomUUID(),createdAt:new Date().toISOString(),...validateEntry(data)}; }
export function sumEntries(entries,type=null) {return entries.filter(e=>!e.deletedAt&&(!type||e.type===type)).reduce((sum,e)=>sum+e.amount,0);}
