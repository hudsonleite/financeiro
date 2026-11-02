import test from "node:test";
import assert from "node:assert/strict";
import { getComparisonPeriods } from "../src/features/dashboard/comparisonPeriods.js";

test("annual comparison includes current year plus the selected number of preceding years", () => {
  const today = new Date(2026, 10, 2);
  const records = [
    { date: "2024-06-01", type: "entrada", amount: 150 },
    { date: "2023-06-01", type: "entrada", amount: 900 },
  ];
  const periods = getComparisonPeriods(records, "year", "previous", today, null, 2);
  assert.deepEqual(periods.map((period) => period.label), ["2026", "2025", "2024"]);
  assert.equal(periods[2].income, 150);
  assert.equal(getComparisonPeriods(records, "year", "previous", today, null, 0).length, 1);
  assert.equal(getComparisonPeriods(records, "year", "previous", today, null, 12).length, 13);
});

test("selected base month drives both comparisons without affecting annual comparison", () => {
  const today = new Date(2026, 10, 2);
  const previous = getComparisonPeriods([], "month", "previous", today, "2025-01");
  assert.equal(previous[0].start, "2025-01-01");
  assert.equal(previous[1].start, "2024-12-01");
  const lastYear = getComparisonPeriods([], "month", "lastYear", today, "2025-02");
  assert.equal(lastYear[0].end, "2025-02-28");
  assert.equal(lastYear[1].end, "2024-02-29");
  assert.equal(getComparisonPeriods([], "year", "previous", today, "2025-02")[0].start, "2026-01-01");
});

test("monthly comparison rolls January into December and totals full periods", () => {
  const records = [
    { date: "2027-01-31", type: "entrada", amount: 0.1 },
    { date: "2027-01-31", type: "entrada", amount: 0.2 },
    { date: "2026-12-01", type: "saida", amount: 25 },
    { date: "2027-01-01", type: "saida", amount: 99, deletedAt: "deleted" },
    { date: "2026-11-30", type: "entrada", amount: 88 },
  ];
  const periods = getComparisonPeriods(records, "month", "previous", new Date(2027, 0, 2));
  assert.equal(periods[0].start, "2027-01-01");
  assert.equal(periods[0].end, "2027-01-31");
  assert.equal(periods[0].income, 0.3);
  assert.equal(periods[0].expense, 0);
  assert.equal(periods[1].start, "2026-12-01");
  assert.equal(periods[1].expense, 25);
  assert.equal(periods[1].income, 0);
});

test("same month last year uses correct leap-year boundaries", () => {
  const periods = getComparisonPeriods([], "month", "lastYear", new Date(2025, 1, 15));
  assert.equal(periods[0].end, "2025-02-28");
  assert.equal(periods[1].start, "2024-02-01");
  assert.equal(periods[1].end, "2024-02-29");
});

test("annual comparison sums only current and previous calendar years", () => {
  const periods = getComparisonPeriods([
    { date: "2026-12-31", type: "entrada", amount: 500 },
    { date: "2025-01-01", type: "saida", amount: 200 },
    { date: "2024-12-31", type: "entrada", amount: 900 },
  ], "year", "previous", new Date(2026, 10, 2));
  assert.equal(periods[0].income, 500);
  assert.equal(periods[0].start, "2026-01-01");
  assert.equal(periods[1].end, "2025-12-31");
  assert.equal(periods[1].expense, 200);
  assert.equal(periods[1].income, 0);
});
