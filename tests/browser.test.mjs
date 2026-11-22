import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { createTranslator } from "next-intl";
const messages = JSON.parse(
  readFileSync(new URL("../src/messages/zh-TW.json", import.meta.url), "utf8"),
);
const tzh = createTranslator({ locale: "zh-TW", messages });
import test from "node:test";

const require = createRequire(import.meta.url);
const { chromium, webkit, devices } = require(
  process.env.PLAYWRIGHT_MODULE || "playwright",
);
const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
const cases = [
  {
    name: "Desktop Chromium",
    engine: chromium,
    options: { viewport: { width: 1440, height: 1000 } },
  },
  {
    name: "iPhone Safari WebKit",
    engine: webkit,
    options: { ...devices["iPhone 13"], reducedMotion: "reduce" },
  },
];

for (const scenario of cases) {
  test(scenario.name, { timeout: 120000 }, async (t) => {
    const browser = await scenario.engine.launch({
      headless: true,
      ...(scenario.engine === webkit && process.env.WEBKIT_EXECUTABLE_PATH
        ? { executablePath: process.env.WEBKIT_EXECUTABLE_PATH }
        : {}),
      ...(scenario.engine === chromium ? { args: ["--no-sandbox"] } : {}),
    });
    const context = await browser.newContext(scenario.options);
    const page = await context.newPage();
    const errors = [];
    const externalRequests = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      if (!request.url().startsWith(baseURL) && /^https?:/.test(request.url()))
        externalRequests.push(request.url());
    });
    t.after(async () => {
      await context.close();
      await browser.close();
    });
    await page.goto(baseURL, { waitUntil: "networkidle" });
    assert.equal(await page.locator("html").getAttribute("lang"), "zh-TW");
    await page
      .getByRole("heading", {
        level: 1,
        name: tzh("os.greeting"),
      })
      .waitFor();
    await page
      .locator('[data-testid="weekly-chart"] .apexcharts-canvas')
      .waitFor();

    await t.test(
      "Today focus list, completion empty state and local brief loading",
      async () => {
        await page
          .getByRole("textbox", { name: tzh("os.newFocus") })
          .fill("閱讀一章");
        await page
          .getByRole("button", { name: tzh("os.add"), exact: true })
          .click();
        await page.getByRole("checkbox", { name: "閱讀一章" }).waitFor();
        while (await page.getByRole("checkbox").count())
          await page.getByRole("checkbox").first().click();
        await page.getByRole("heading", { name: tzh("os.allDone") }).waitFor();
        await page
          .getByRole("button", { name: tzh("os.refreshBrief"), exact: true })
          .click();
        assert.equal(
          await page
            .getByRole("button", {
              name: tzh("os.refreshingButton"),
              exact: true,
            })
            .isDisabled(),
          true,
        );
        await page.getByText(tzh("os.refreshed"), { exact: true }).waitFor();
      },
    );

    await t.test("dark mode survives reload", async () => {
      await page
        .getByRole("button", { name: tzh("osShell.switchDark") })
        .click();
      await page.waitForFunction(() =>
        document.documentElement.classList.contains("dark"),
      );
      await page.reload({ waitUntil: "networkidle" });
      assert.equal(
        await page.locator("html").getAttribute("data-color-scheme"),
        "dark",
      );
      await page
        .getByRole("button", { name: tzh("osShell.switchLight") })
        .click();
    });

    async function navigate(name, path) {
      if (scenario.name.includes("iPhone"))
        await page
          .getByRole("button", {
            name: tzh("osShell.openNavigation"),
            exact: true,
          })
          .click();
      await page
        .getByRole("navigation", { name: tzh("osShell.navigationLabel") })
        .getByRole("link", { name, exact: true })
        .click();
      await page.waitForURL(
        (url) =>
          url.origin === new URL(baseURL).origin &&
          url.pathname.replace(/\/$/, "") === path,
      );
      await page
        .getByRole("heading", { level: 1, name, exact: true })
        .waitFor();
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${name} overflows the viewport`,
      );
      if (scenario.name.includes("iPhone"))
        await page.getByRole("dialog").waitFor({ state: "hidden" });
    }

    await t.test(
      "navigation and Finance search/reset empty state",
      async () => {
        await navigate(tzh("osSections.finance.title"), "/finance");
        await page.locator(".apexcharts-canvas").waitFor();
        const search = page.getByRole("searchbox", {
          name: tzh("osSections.finance.searchLabel"),
        });
        await search.fill("河畔");
        await page
          .getByText(tzh("osSections.finance.merchants.tx-1"), { exact: true })
          .waitFor();
        await search.fill(tzh("osSections.finance.categories.food"));
        await page
          .getByText(tzh("osSections.finance.merchants.tx-2"), { exact: true })
          .waitFor();
        await search.fill("找不到的項目");
        await page
          .getByRole("heading", { name: tzh("osSections.finance.emptyTitle") })
          .waitFor();
        await page
          .getByRole("button", { name: tzh("osSections.finance.clearSearch") })
          .click();
        await page
          .getByText(tzh("osSections.finance.merchants.tx-1"), { exact: true })
          .waitFor();
        assert.equal(await search.inputValue(), "");
      },
    );

    await t.test("Travel packing checklist reaches completion", async () => {
      await navigate(tzh("osSections.travel.title"), "/travel");
      for (const checkbox of await page.getByRole("checkbox").all())
        if (!(await checkbox.isChecked())) await checkbox.click();
      await page
        .getByText(tzh("osSections.travel.packingComplete"), { exact: true })
        .waitFor();
    });

    await t.test(
      "Learning logs a session and caps completed courses",
      async () => {
        await navigate(tzh("osLearning.title"), "/learning");
        await page
          .getByRole("heading", { name: tzh("osLearning.emptyTitle") })
          .waitFor();
        await page
          .getByRole("button", { name: tzh("osLearning.logSession") })
          .first()
          .click();
        await page
          .getByText(tzh("osLearning.minuteValue", { minutes: 155 }), {
            exact: true,
          })
          .waitFor();
        for (let i = 0; i < 4; i++)
          await page
            .getByRole("button", { name: tzh("osLearning.logSession") })
            .first()
            .click();
        assert.equal(
          await page
            .getByRole("button", {
              name: tzh("osLearning.completed"),
              exact: true,
            })
            .isDisabled(),
          true,
        );
      },
    );

    await t.test(
      "Agents pause, simulate loading, finish and reset",
      async () => {
        await navigate(tzh("osAgents.title"), "/agents");
        await page.getByRole("button", { name: tzh("osAgents.pause") }).click();
        assert.equal(
          await page
            .getByRole("button", { name: tzh("osAgents.runNext") })
            .isDisabled(),
          true,
        );
        await page
          .getByRole("button", { name: tzh("osAgents.resume") })
          .click();
        for (let i = 0; i < 3; i++) {
          await page
            .getByRole("button", { name: tzh("osAgents.runNext") })
            .click();
          assert.equal(
            await page
              .getByRole("button", {
                name: tzh("osAgents.running"),
                exact: true,
              })
              .isDisabled(),
            true,
          );
          await page
            .getByRole("button", {
              name: i === 2 ? tzh("osAgents.reset") : tzh("osAgents.runNext"),
            })
            .waitFor();
        }
        await page.getByRole("button", { name: tzh("osAgents.reset") }).click();
        await page
          .getByRole("heading", {
            name: tzh("osAgents.emptyTitle"),
          })
          .waitFor();
      },
    );

    await t.test(
      "all routes fit dark mode at narrow widths without external requests",
      async () => {
        const widths = scenario.name.includes("iPhone")
          ? [320, 375, 390, 430]
          : [768, 1024, 1440];
        for (const width of widths) {
          await page.setViewportSize({ width, height: 900 });
          for (const path of [
            "/",
            "/finance",
            "/travel",
            "/learning",
            "/agents",
          ]) {
            await page.goto(`${baseURL}${path}`, { waitUntil: "networkidle" });
            const darkToggle = page.getByRole("button", {
              name: tzh("osShell.switchDark"),
            });
            if (await darkToggle.count()) await darkToggle.click();
            const chartData = page.getByText(tzh("os.chartData"), {
              exact: true,
            });
            if (await chartData.count()) await chartData.click();
            assert.ok(
              await page.evaluate(
                () => document.documentElement.scrollWidth <= innerWidth + 1,
              ),
              `Overflow at ${path} ${width}px`,
            );
            assert.equal(
              await page.getByRole("heading", { level: 1 }).count(),
              1,
            );
          }
        }
        await mkdir("test-results", { recursive: true });
        await page.goto(baseURL, { waitUntil: "networkidle" });
        await page.screenshot({
          path: `test-results/${scenario.engine === chromium ? "desktop" : "iphone"}-dark.png`,
          fullPage: true,
        });
        assert.deepEqual(errors, []);
        assert.deepEqual(externalRequests, []);
      },
    );

    await t.test(
      "theme remains usable when Safari storage is denied",
      async () => {
        await context.addInitScript(() => {
          Object.defineProperty(window, "localStorage", {
            get() {
              throw new DOMException("Blocked", "SecurityError");
            },
          });
        });
        await page.goto(baseURL, { waitUntil: "networkidle" });
        const button = page.getByRole("button", {
          name: tzh("osShell.switchDark"),
        });
        await button.click();
        await page
          .getByRole("button", { name: tzh("osShell.switchLight") })
          .waitFor();
        assert.deepEqual(errors, []);
      },
    );
  });
}
