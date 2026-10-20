import test from "node:test";
import assert from "node:assert/strict";
import {parseMoney} from "../src/utils/money.js";
import {validateEntry,sumEntries} from "../src/utils/entries.js";
const base={date:"2026-10-19",amount:125.50,type:"entrada",method:"Pix"};
test("conversão de valores brasileiros",()=>{
 assert.equal(parseMoney("1.234,56"),1234.56);
 assert.equal(parseMoney("15,00"),15);
 assert.equal(parseMoney("12.50"),12.5);
 assert.ok(Number.isNaN(parseMoney("1,234.56")));
 assert.ok(Number.isNaN(parseMoney("15,999")));
 assert.ok(Number.isNaN(parseMoney("abc")));
});
test("validação de lançamento",()=>{
 assert.equal(validateEntry(base).amount,125.5);
 assert.throws(()=>validateEntry({...base,date:"2026-02-30"}),/Data inválida/);
 assert.throws(()=>validateEntry({...base,amount:0}),/Valor inválido/);
 assert.throws(()=>validateEntry({...base,type:"outro"}),/Tipo inválido/);
 assert.throws(()=>validateEntry({...base,method:"desconhecido"}),/Forma de pagamento inválida/);
});
test("exclusão lógica não entra nos totais",()=>{
 const entries=[{...base},{...base,amount:12,deletedAt:"2026-10-19T12:00:00Z"}];
 assert.equal(sumEntries(entries,"entrada"),125.5);
});
