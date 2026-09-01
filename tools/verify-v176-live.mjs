/* v176 LIVE verification — no interception, no local file. Whatever the site
   is actually serving is what is measured. Desktop + mobile + every href. */
import { chromium } from "playwright";

const fails = [];
const ck = (ok, label, extra) => {
  if (!ok) fails.push(label);
  console.log("   " + (ok ? "ok  " : "FAIL") + " " + label + (extra ? "  " + extra : ""));
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", e => errors.push(String(e)));

/* A page that is NOT one of the morphology pages, so nothing about the
   result can be special-cased by the page being visited. */
await page.goto("https://www.aroidpedia.com/journal",
                { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(5000);

console.log("--- what the site is serving ---");
const ver = await page.evaluate(() => window.__apFooterBundle);
ck(ver === "v176", "window.__apFooterBundle", "= " + ver);
const st = await page.evaluate(() => window.__apSubnav && window.__apSubnav.state);
ck(st && st.flyoutsBuilt === 2, "two desktop flyouts built", JSON.stringify(st));

console.log("--- the morphology flyout, on the live bundle ---");
await page.locator(".header-display-desktop .header-nav-folder-title", { hasText: "THE AROID GUIDE" }).first().hover();
await page.waitForTimeout(400);
await page.locator('.header-display-desktop .header-nav-folder-content a[href="/aroid-morphology"]').first().hover();
await page.waitForTimeout(700);
const rows = await page.evaluate(() => {
  const item = document.querySelector('.header-display-desktop .header-nav-folder-content a[href="/aroid-morphology"]').closest(".header-nav-item--folder");
  const open = [...item.querySelectorAll(":scope > .ap-subnav")].find(f => f.classList.contains("ap-sub-open"));
  if (!open) return null;
  return [...open.querySelectorAll("a")].map(a => ({ label: a.textContent.trim(), href: a.getAttribute("href") }));
});
ck(!!rows, "the flyout opens");
ck(rows && rows.length === 2, "two rows", JSON.stringify(rows));

console.log("--- CLICK one, and prove it actually lands ---");
await page.locator(".ap-subnav.ap-sub-open a[href='/anthurium-morphology']").first().click();
await page.waitForLoadState("domcontentloaded");
await page.waitForTimeout(2500);
ck(page.url().indexOf("/anthurium-morphology") >= 0, "clicking Anthurium Morphology navigates there", page.url());
const h1 = await page.evaluate(() => {
  const h = document.querySelector("h1");
  return h ? h.textContent.trim().replace(/\s+/g, " ") : "(none)";
});
ck(h1 !== "(none)" && !/not found/i.test(h1), "and the page is a real page, not a 404", h1);

console.log("--- and the other one ---");
await page.goto("https://www.aroidpedia.com/journal", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(5000);
await page.locator(".header-display-desktop .header-nav-folder-title", { hasText: "THE AROID GUIDE" }).first().hover();
await page.waitForTimeout(400);
await page.locator('.header-display-desktop .header-nav-folder-content a[href="/aroid-morphology"]').first().hover();
await page.waitForTimeout(700);
await page.locator(".ap-subnav.ap-sub-open a[href='/alocasia-morphology']").first().click();
await page.waitForLoadState("domcontentloaded");
await page.waitForTimeout(2500);
ck(page.url().indexOf("/alocasia-morphology") >= 0, "clicking Alocasia Morphology navigates there", page.url());

console.log("--- mobile overlay, live ---");
const m = await ctx.newPage();
await m.setViewportSize({ width: 375, height: 812 });
await m.goto("https://www.aroidpedia.com/journal", { waitUntil: "domcontentloaded", timeout: 60000 });
await m.waitForTimeout(5000);
const mob = await m.evaluate(() => {
  const morphRow = document.querySelector('.header-menu a[href="/aroid-morphology"]');
  const after = [];
  if (morphRow) {
    let n = morphRow.closest(".header-menu-nav-item").nextElementSibling;
    while (n && n.classList.contains("ap-subnav-mobile")) {
      const a = n.querySelector("a");
      after.push(a ? a.getAttribute("href") : null);
      n = n.nextElementSibling;
    }
  }
  return after;
});
ck(mob.length === 2 && mob[0] === "/alocasia-morphology" && mob[1] === "/anthurium-morphology",
   "the two rows are in the phone overlay too", JSON.stringify(mob));

console.log("--- console ---");
ck(errors.length === 0, "no page errors", errors.join(" | "));

await browser.close();
console.log(fails.length ? "\nFAILED " + fails.length + ": " + fails.join(", ") : "\nALL PASS");
process.exit(fails.length ? 1 : 0);
