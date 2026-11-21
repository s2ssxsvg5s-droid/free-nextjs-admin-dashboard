import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
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
    await page
      .getByRole("heading", {
        level: 1,
        name: "A little clarity for your day.",
      })
      .waitFor();
    await page
      .locator('[data-testid="weekly-chart"] .apexcharts-canvas')
      .waitFor();

    await t.test(
      "Today focus list, completion empty state and local brief loading",
      async () => {
        await page
          .getByRole("textbox", { name: "Add a focus item" })
          .fill("Read a chapter");
        await page.getByRole("button", { name: "Add", exact: true }).click();
        await page.getByRole("checkbox", { name: "Read a chapter" }).waitFor();
        while (await page.getByRole("checkbox").count())
          await page.getByRole("checkbox").first().click();
        await page
          .getByRole("heading", { name: "A clear list. A clearer head." })
          .waitFor();
        await page
          .getByRole("button", { name: "Refresh brief", exact: true })
          .click();
        assert.equal(
          await page
            .getByRole("button", { name: "Refreshing…", exact: true })
            .isDisabled(),
          true,
        );
        await page
          .getByText(
            "Brief refreshed from sample data. No AI service was called.",
            { exact: true },
          )
          .waitFor();
      },
    );

    await t.test("dark mode survives reload", async () => {
      await page.getByRole("button", { name: "Switch to dark mode" }).click();
      await page.waitForFunction(() =>
        document.documentElement.classList.contains("dark"),
      );
      await page.reload({ waitUntil: "networkidle" });
      assert.equal(
        await page.locator("html").getAttribute("data-color-scheme"),
        "dark",
      );
      await page.getByRole("button", { name: "Switch to light mode" }).click();
    });

    async function navigate(name, path) {
      if (scenario.name.includes("iPhone"))
        await page
          .getByRole("button", { name: "Open navigation", exact: true })
          .click();
      await page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name, exact: true })
        .click();
      await page.waitForURL(`${baseURL}${path}`);
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
        await navigate("Finance", "/finance");
        await page.locator(".apexcharts-canvas").waitFor();
        const search = page.getByRole("searchbox", {
          name: "Search transactions",
        });
        await search.fill("no-match-demo");
        await page
          .getByRole("heading", { name: "No spending found" })
          .waitFor();
        await page.getByRole("button", { name: "Clear search" }).click();
        await page.getByText("Riverside Apartments", { exact: true }).waitFor();
        assert.equal(await search.inputValue(), "");
      },
    );

    await t.test("Travel packing checklist reaches completion", async () => {
      await navigate("Travel", "/travel");
      for (const checkbox of await page.getByRole("checkbox").all())
        if (!(await checkbox.isChecked())) await checkbox.click();
      await page
        .getByText(
          "All essentials packed. You’re ready for the next adventure.",
          { exact: true },
        )
        .waitFor();
    });

    await t.test(
      "Learning logs a session and caps completed courses",
      async () => {
        await navigate("Learning", "/learning");
        await page
          .getByRole("heading", { name: "Your next small step starts here" })
          .waitFor();
        await page
          .getByRole("button", { name: "Log 15-minute session" })
          .first()
          .click();
        await page.getByText("155 min", { exact: true }).waitFor();
        for (let i = 0; i < 4; i++)
          await page
            .getByRole("button", { name: "Log 15-minute session" })
            .first()
            .click();
        assert.equal(
          await page
            .getByRole("button", { name: "Course completed", exact: true })
            .isDisabled(),
          true,
        );
      },
    );

    await t.test(
      "Agents pause, simulate loading, finish and reset",
      async () => {
        await navigate("AI Agents", "/agents");
        await page.getByRole("button", { name: "Pause queue" }).click();
        assert.equal(
          await page
            .getByRole("button", { name: "Run next demo" })
            .isDisabled(),
          true,
        );
        await page.getByRole("button", { name: "Resume queue" }).click();
        for (let i = 0; i < 3; i++) {
          await page.getByRole("button", { name: "Run next demo" }).click();
          assert.equal(
            await page
              .getByRole("button", { name: "Running demo…", exact: true })
              .isDisabled(),
            true,
          );
          await page
            .getByRole("button", {
              name: i === 2 ? "Reset demo" : "Run next demo",
            })
            .waitFor();
        }
        await page.getByRole("button", { name: "Reset demo" }).click();
        await page
          .getByRole("heading", {
            name: "A clear activity log, from the start",
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
              name: "Switch to dark mode",
            });
            if (await darkToggle.count()) await darkToggle.click();
            const chartData = page.getByText("View chart data", {
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
          name: "Switch to dark mode",
        });
        await button.click();
        await page
          .getByRole("button", { name: "Switch to light mode" })
          .waitFor();
        assert.deepEqual(errors, []);
      },
    );
  });
}
