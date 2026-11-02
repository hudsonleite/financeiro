import test from "node:test";
import assert from "node:assert/strict";
import { generateMockEntries, appendMockEntries, appendMockExpenses } from "../src/features/entries/mockEntries.js";
import { validateEntries } from "../src/utils/entryValidation.js";

test("historical examples cover January 2024 through September 2026 including leap day", () => {
  const end = new Date(2026, 8, 1);
  const start = new Date(2024, 0, 1);
  const records = generateMockEntries(end, start);
  validateEntries(records);
  assert.equal(records.length, 4875);
  assert.equal(new Set(records.map((entry) => entry.date)).size, 975);
  assert.ok(records.every((entry) => entry.date >= "2024-01-01" && entry.date <= "2026-09-01"));
  for (const date of ["2024-01-01", "2024-02-29", "2026-09-01"]) assert.equal(records.filter((entry) => entry.date === date).length, 5);
  assert.deepEqual(appendMockEntries(records, end, start), records);
});

test("expense examples cover October 18 through today inclusively without duplicates", () => {
  const today = new Date(2026, 10, 2);
  const records = appendMockExpenses([], today);
  validateEntries(records);
  assert.equal(records.length, 32);
  assert.ok(records.every((entry) => entry.type === "saida" && entry.date >= "2026-10-18" && entry.date <= "2026-11-02"));
  assert.equal(records.filter((entry) => entry.date === "2026-10-18").length, 2);
  assert.equal(records.filter((entry) => entry.date === "2026-11-02").length, 2);
  assert.deepEqual(appendMockExpenses(records, today), records);
  assert.equal(appendMockExpenses(records, new Date(2026, 10, 3)).length, 34);
});

test("examples cover September 1 to October 18 and preserve existing records without duplicates", () => {
  const mock = generateMockEntries();
  assert.ok(mock.every((entry) => entry.date >= "2026-09-01" && entry.date < "2026-10-19"));
  assert.equal(mock.map((entry) => entry.date).sort()[0], "2026-09-01");
  assert.equal(mock.map((entry) => entry.date).sort().at(-1), "2026-10-18");
  assert.equal(mock.length, 240);
  assert.equal(mock.filter((entry) => entry.date >= "2026-10-12" && entry.date <= "2026-10-18").length, 35);
  validateEntries(mock);
  assert.equal(new Set(mock.map((entry) => entry.date)).size, 48);
  assert.ok(mock.every((entry) => entry.description.startsWith("[EXEMPLO]")));
  const existing = { ...mock[0], id: "real", description: "Real" };
  const combined = appendMockEntries([existing]);
  assert.equal(combined[0], existing);
  assert.equal(combined.length, 241);
  assert.deepEqual(appendMockEntries(combined), combined);
});
