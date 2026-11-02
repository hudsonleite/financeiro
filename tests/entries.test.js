import test from "node:test";
import assert from "node:assert/strict";
import { validateEntryData, validateEntries } from "../src/utils/entryValidation.js";
import { loadEntries, saveEntries, STORAGE_KEY } from "../src/services/entriesStorage.js";
import { createEntry, sumEntries, markEntryDeleted } from "../src/utils/entries.js";
import { parseMoney } from "../src/utils/money.js";
const entry = {id:"one", createdAt:"2026-10-20T12:00:00Z", date:"2026-10-20", amount:1234.56, description:"Pix", type:"entrada", method:"Pix"};
test("local deletion preserves the record and persists its audit date while removing it from totals", () => {
  const original = [{...entry}];
  const deleted = markEntryDeleted(original, entry.id);
  assert.equal(original[0].deletedAt, undefined);
  assert.equal(deleted.length, 1);
  assert.equal(deleted[0].amount, entry.amount);
  assert.ok(Number.isFinite(Date.parse(deleted[0].deletedAt)));
  assert.equal(sumEntries(deleted), 0);
  const target = storage();
  saveEntries(deleted, target);
  assert.deepEqual(loadEntries(target), deleted);
  assert.equal(markEntryDeleted(deleted, entry.id), deleted);
  assert.throws(() => markEntryDeleted(original, "missing"));
});
function storage(raw = null) {
  return { raw, getItem(key) { assert.equal(key, STORAGE_KEY); return this.raw; }, setItem(key, value) { assert.equal(key, STORAGE_KEY); this.raw = value; } };
}
test("validates real calendar dates, types, methods, descriptions and monetary precision", () => {
  assert.equal(validateEntryData(entry).amount, 1234.56);
  for (const change of [{date:"2026-02-30"},{date:"invalid"},{amount:NaN},{amount:Infinity},{amount:0},{amount:-1},{amount:1.001},{amount:Number.MAX_VALUE},{type:"other"},{method:"other"},{description:" "}]) assert.throws(() => validateEntryData({...entry,...change}));
});
test("parses Brazilian amounts strictly without silently accepting malformed values", () => {
  assert.equal(parseMoney("1.234,56"),1234.56);
  assert.equal(parseMoney("12,50"),12.5);
  for (const value of ["", "1.23", "1,234", "Infinity", "abc", "1e3", "-1", "1,2,3"]) assert.ok(Number.isNaN(parseMoney(value)));
});
test("identity cannot be overwritten by submitted data", () => {
  const result = createEntry({...entry,id:"forged",createdAt:"invalid",deletedAt:"forged"});
  assert.notEqual(result.id,"forged");
  assert.ok(Number.isFinite(Date.parse(result.createdAt)));
  assert.equal(result.deletedAt,undefined);
});
test("rejects corrupt records and duplicate identifiers without touching original bytes", () => {
  for (const raw of ["{", "{}", "null", JSON.stringify([{...entry,amount:null}]),JSON.stringify([entry,entry])]) {
    const target = storage(raw);
    assert.throws(() => loadEntries(target));
    assert.equal(target.raw,raw);
  }
});
test("round trips valid existing records, including deleted records", () => {
  const entries = [entry,{...entry,id:"two",deletedAt:"2026-10-20T13:00:00Z"}];
  const target = storage();
  assert.deepEqual(loadEntries(target),[]);
  saveEntries(entries,target);
  assert.deepEqual(loadEntries(target),entries);
  assert.equal(sumEntries(entries),1234.56);
});
test("storage read and write failures are propagated and original records preserved", () => {
  const target = storage(JSON.stringify([entry]));
  const original = target.raw;
  target.setItem = () => { throw new Error("QuotaExceededError"); };
  assert.throws(() => saveEntries([],target),/QuotaExceededError/);
  assert.equal(target.raw,original);
  assert.throws(() => loadEntries({ getItem() { throw new Error("SecurityError"); } }),/SecurityError/);
});
test("invalid writes never reach storage", () => {
  let wrote = false;
  assert.throws(() => saveEntries([{...entry,amount:-1}],{setItem(){wrote=true;}}));
  assert.equal(wrote,false);
  assert.throws(() => validateEntries([{...entry,deletedAt:"invalid"}]));
});
