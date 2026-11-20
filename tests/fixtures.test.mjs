import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  budget,
  cashflow,
  formatMoney,
  transactions,
} from "../src/components/personal-os/finance/data.ts";
import {
  packingItems,
  itinerary,
} from "../src/components/personal-os/travel/data.ts";
import { courses } from "../src/components/personal-os/learning/data.ts";
import {
  initialTasks,
  weeklyMinutes,
} from "../src/components/personal-os/today/data.ts";
import { initialJobs } from "../src/components/personal-os/agents/data.ts";

test("November spending reconciles across transactions, budget, and cashflow", () => {
  assert.equal(
    transactions.reduce((sum, transaction) => sum + transaction.amount, 0),
    budget.spent,
  );
  assert.equal(cashflow.expenses.at(-1), budget.spent);
  assert.equal(cashflow.income.at(-1), budget.income);
  assert.equal(budget.limit - budget.spent, 820);
  assert.equal(formatMoney(budget.spent), "$3,180");
  assert.equal(
    new Set(transactions.map((item) => item.id)).size,
    transactions.length,
  );
  assert.ok(
    transactions.every(
      (item) => item.amount > 0 && item.date.startsWith("2026-11-"),
    ),
  );
});

test("learning, travel and agent fixtures form a valid demo workspace", () => {
  assert.equal(
    weeklyMinutes.reduce((sum, value) => sum + value, 0),
    140,
  );
  assert.ok(
    courses.every(
      (course) => course.minutes >= 0 && course.minutes < course.totalMinutes,
    ),
  );
  assert.equal(packingItems.filter((item) => item.checked).length, 2);
  assert.deepEqual(
    itinerary.map((item) => Number(item.day)),
    [26, 27, 28, 29, 30],
  );
  assert.equal(initialTasks.filter((task) => task.done).length, 1);
  assert.equal(initialJobs.length, 3);
  assert.ok(initialJobs.every((job) => job.status === "queued"));
});

test("TailAdmin MIT attribution is retained verbatim", () => {
  const license = readFileSync(new URL("../LICENSE", import.meta.url), "utf8");
  assert.ok(
    license.startsWith("MIT License\n\nCopyright (c) 2023 TailAdmin\n"),
  );
  assert.ok(
    license.includes(
      "The above copyright notice and this permission notice shall be included in all",
    ),
  );
  assert.ok(license.includes('THE SOFTWARE IS PROVIDED "AS IS"'));
});
