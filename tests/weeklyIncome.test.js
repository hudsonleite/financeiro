import test from "node:test";
import assert from "node:assert/strict";
import { getWeeklyIncome } from "../src/features/dashboard/weeklyIncome.js";

test("weekly expense series includes future dates and excludes income and deleted expenses", () => {
  const records = [
    { date: "2026-11-03", type: "entrada", amount: 5000 },
    { date: "2026-11-03", type: "saida", amount: 3500 },
    { date: "2026-11-04", type: "entrada", amount: 7500 },
    { date: "2026-11-04", type: "saida", amount: 3800 },
    { date: "2026-11-04", type: "saida", amount: 100, deletedAt: "deleted" },
  ];
  const income = getWeeklyIncome(records, 0, new Date(2026, 10, 2))[0];
  const expense = getWeeklyIncome(records, 0, new Date(2026, 10, 2), "saida")[0];
  assert.equal(expense.days[1].amount, 3500);
  assert.equal(expense.days[2].amount, 3800);
  assert.equal(expense.total, 7300);
  assert.equal(income.days[1].amount - expense.days[1].amount, 1500);
  assert.equal(income.days[2].amount - expense.days[2].amount, 3700);
});

test("weekly income includes future dated income, crosses months and excludes expenses/deletions", () => {
  const entries = [
    { date: "2026-11-02", type: "entrada", amount: 0.1 },
    { date: "2026-11-02", type: "entrada", amount: 0.2 },
    { date: "2026-11-02", type: "saida", amount: 50 },
    { date: "2026-11-02", type: "entrada", amount: 90, deletedAt: "deleted" },
    { date: "2026-11-03", type: "entrada", amount: 100 },
    { date: "2026-11-01", type: "entrada", amount: 80 },
    { date: "2026-10-26", type: "entrada", amount: 20 },
  ];
  const weeks = getWeeklyIncome(entries, 1, new Date(2026, 10, 2));
  assert.equal(weeks[0].total, 100.3);
  assert.equal(weeks[0].days[1].date, "2026-11-03");
  assert.equal(weeks[0].days[1].amount, 100);
  assert.equal(weeks[0].days[2].amount, 0);
  assert.equal(weeks[1].days[0].date, "2026-10-26");
  assert.equal(weeks[1].total, 100);
  assert.equal(weeks[1].days[6].amount, 80);
});

test("Sunday belongs to the ending week, including year boundaries and empty weeks", () => {
  const weeks = getWeeklyIncome([], 12, new Date(2027, 0, 3));
  assert.equal(weeks.length, 13);
  assert.equal(weeks[0].days[0].date, "2026-12-28");
  assert.equal(weeks[0].days[6].date, "2027-01-03");
  assert.ok(weeks.every((week) => week.total === 0 && week.days.every((day) => day.amount === 0)));
});
