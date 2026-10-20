import test from "node:test";
import assert from "node:assert/strict";
import {loadEntries,saveEntries} from "../src/services/entriesStorage.js";
test("armazenamento persiste e recupera lançamentos",()=>{
 const data=new Map();
 globalThis.localStorage={getItem:key=>data.get(key)??null,setItem:(key,val)=>data.set(key,val)};
 const entries=[{id:"1",amount:12}];
 saveEntries(entries);
 assert.deepEqual(loadEntries(),entries);
});
test("dados corrompidos são reportados sem sobrescrita",()=>{
 globalThis.localStorage={getItem:()=>"{corrompido"};
 assert.throws(()=>loadEntries(),/corrompidos/);
});
test("erro de gravação é propagado",()=>{
 globalThis.localStorage={setItem:()=>{throw new Error("QuotaExceededError");}};
 assert.throws(()=>saveEntries([]),/QuotaExceededError/);
});
