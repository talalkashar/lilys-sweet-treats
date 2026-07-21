/**
 * Lily's Sweet Treats — automated UI smoke
 * Usage:
 *   BASE_URL=http://localhost:3000 npm run smoke
 *   # or: node scripts/smoke.mjs
 *
 * Install once: npm run smoke:install
 * Screenshots + smoke.json → .tmp/smoke/ (gitignored)
 */
import fs from "fs";
import path from "path";
import { pathToFileURL, fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = process.env.SMOKE_OUT || path.join(ROOT, ".tmp", "smoke");
const BASE = process.env.BASE_URL || "http://localhost:3000";
fs.mkdirSync(OUT, { recursive: true });

async function loadPlaywright() {
  const candidates = [
    path.join(ROOT, "node_modules", "playwright"),
    path.join(process.env.HOME || "", "Library/Caches/bakery-mcp-auto/node_modules/playwright"),
    path.join(process.env.HOME || "", "Library/Caches/bakery-mcp-auto/node_modules/playwright/index.mjs"),
  ];
  for (const c of candidates) {
    const pkg = c.endsWith(".mjs") ? path.dirname(c) : c;
    const entryMjs = path.join(pkg, "index.mjs");
    const entryJs = path.join(pkg, "index.js");
    if (fs.existsSync(entryMjs)) {
      return import(pathToFileURL(entryMjs).href);
    }
    if (fs.existsSync(entryJs)) {
      return import(pathToFileURL(entryJs).href);
    }
  }
  try {
    return await import("playwright");
  } catch (e) {
    console.error(
      "Playwright not found. Run: npm run smoke:install\n" +
        "Or: cd ~/Library/Caches/bakery-mcp-auto && npm i playwright",
    );
    throw e;
  }
}

const results = {
  ok: true,
  base: BASE,
  startedAt: new Date().toISOString(),
  checks: [],
  errors: [],
  consoleErrors: [],
};

function check(name, pass, detail = "") {
  results.checks.push({ name, pass, detail });
  if (!pass) results.ok = false;
  console.log(`${pass ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
}

async function attachConsole(page) {
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const t = msg.text();
    if (
      /webpack|hmr|hot-update|WebSocket|Failed to fetch|_next\/static|React DevTools|Fast Refresh/i.test(
        t,
      )
    ) {
      return;
    }
    results.consoleErrors.push(t.slice(0, 400));
  });
  page.on("pageerror", (err) => {
    results.consoleErrors.push(String(err.message || err).slice(0, 400));
  });
}

async function main() {
  const { chromium } = await loadPlaywright();
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: "chrome" });
  } catch {
    browser = await chromium.launch({ headless: true });
  }

  try {
    {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      await attachConsole(page);
      await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForTimeout(1000);
      check("desktop.home.hero", (await page.locator(".hero-video").count()) === 1);
      const stickyVisible =
        (await page.locator(".mobile-sticky-cta").count()) > 0 &&
        (await page.locator(".mobile-sticky-cta").first().isVisible().catch(() => false));
      check("desktop.home.sticky_hidden", !stickyVisible);
      const title = (await page.locator("h1.hero-video-title").textContent()) || "";
      check("desktop.home.title", /Baked with love/i.test(title), title.trim());
      check("desktop.home.nav", (await page.locator(".header-nav-desktop a").count()) >= 3);
      await page.screenshot({ path: path.join(OUT, "desktop-home.png") });
      await ctx.close();
    }

    {
      const ctx = await browser.newContext({
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      });
      const page = await ctx.newPage();
      await attachConsole(page);
      await page.goto(`${BASE}/?view=mobile`, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForTimeout(1100);
      check(
        "mobile.home.data-view",
        (await page.locator("html").getAttribute("data-view")) === "mobile",
      );
      const sticky = page.locator(".mobile-sticky-cta");
      check(
        "mobile.home.sticky_visible",
        (await sticky.count()) > 0 && (await sticky.first().isVisible()),
      );
      check(
        "mobile.home.sticky_link",
        (await page.locator('.mobile-sticky-cta a[href="/order"]').count()) === 1,
      );
      check(
        "mobile.home.hamburger",
        await page.locator(".header-menu-btn").isVisible().catch(() => false),
      );
      if ((await page.locator("#menu").count()) > 0) {
        await page.locator("#menu").scrollIntoViewIfNeeded();
        await page.waitForTimeout(350);
        const cards = await page.locator("article.card-product").count();
        check("mobile.home.menu_cards", cards > 0, `cards=${cards}`);
      }
      await page.screenshot({ path: path.join(OUT, "mobile-home.png") });
      await ctx.close();
    }

    {
      const ctx = await browser.newContext({
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      });
      const page = await ctx.newPage();
      await attachConsole(page);
      await page.goto(`${BASE}/order?view=mobile`, {
        waitUntil: "domcontentloaded",
        timeout: 45000,
      });
      await page.waitForTimeout(1100);
      check("mobile.order.no_sticky", (await page.locator(".mobile-sticky-cta").count()) === 0);
      const bodyText = await page.locator("body").innerText();
      check("mobile.order.schedule", /Fri|Sat|pickup|Order window|Mon/i.test(bodyText));
      const name = page
        .locator('input[name="name"], input#name, input[autocomplete="name"]')
        .first();
      const email = page
        .locator('input[name="email"], input#email, input[type="email"]')
        .first();
      check("mobile.order.form_name", (await name.count()) > 0);
      check("mobile.order.form_email", (await email.count()) > 0);
      if ((await name.count()) > 0) await name.fill("Smoke Test");
      if ((await email.count()) > 0) await email.fill("smoke@example.com");
      const phone = page
        .locator('input[name="phone"], input#phone, input[type="tel"]')
        .first();
      if ((await phone.count()) > 0) await phone.fill("5551234567");
      const pack = page
        .locator("button, [role='button']")
        .filter({ hasText: /4-pack|8-pack|tray|TAP TO ADD|\+/i })
        .first();
      if ((await pack.count()) > 0) {
        await pack.click({ force: true }).catch(() => {});
        check("mobile.order.interact", true, "clicked pack");
      } else {
        check("mobile.order.interact", false, "no pack control");
      }
      await page.screenshot({ path: path.join(OUT, "mobile-order.png") });
      await ctx.close();
    }

    {
      const ctx = await browser.newContext({
        viewport: { width: 390, height: 844 },
        isMobile: true,
      });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/?view=desktop`, {
        waitUntil: "domcontentloaded",
        timeout: 45000,
      });
      await page.waitForTimeout(600);
      check(
        "force.desktop.data-view",
        (await page.locator("html").getAttribute("data-view")) === "desktop",
      );
      await ctx.close();
    }

    {
      const page = await browser.newPage();
      for (const url of [
        "/brand/video/peach-cobbler-higgsfield.mp4?v=3",
        "/brand/video/peach-cobbler-roll-poster.jpg?v=3",
      ]) {
        const res = await page.goto(`${BASE}${url}`, { timeout: 30000 });
        check(
          `asset ${url.split("?")[0]}`,
          !!res && res.status() >= 200 && res.status() < 400,
          `status=${res?.status()}`,
        );
      }
      await page.close();
    }

    results.consoleErrorCount = results.consoleErrors.length;
    if (results.consoleErrors.length > 8) results.ok = false;
  } catch (e) {
    results.ok = false;
    results.errors.push(String(e?.stack || e));
    console.error(e);
  } finally {
    await browser?.close?.().catch(() => {});
    results.finishedAt = new Date().toISOString();
    fs.writeFileSync(path.join(OUT, "smoke.json"), JSON.stringify(results, null, 2));
    console.log(`\nReport: ${path.join(OUT, "smoke.json")}`);
    console.log(results.ok ? "SMOKE PASS" : "SMOKE FAIL");
    process.exit(results.ok ? 0 : 1);
  }
}

main();
