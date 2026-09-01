/* Serve the SCRATCH bundle to the live site via request interception and prove
   the nav flyout actually builds. docs/footer.js is never written.
   Run from C:\Users\nli0490\Claude\aroidpedia-climate (playwright lives there). */
import { chromium } from "playwright";
import fs from "fs";

const BUNDLE = "C:/Users/nli0490/AppData/Local/Temp/claude/" +
  "C--Users-nli0490-Claude/b8a4b865-a63d-47e9-a412-30b4aafde260/scratchpad/footer.SCRATCH.js";
const js = fs.readFileSync(BUNDLE, "utf8");
const fails = [];
const ck = (ok, label, extra = "") => {
  if (!ok) fails.push(label);
  console.log(`   ${ok ? "ok  " : "FAIL"} ${label}${extra ? "  " + extra : ""}`);
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

let served = 0;
await ctx.route("**/footer.js*", route => {
  served++;
  route.fulfill({ status: 200, contentType: "application/javascript", body: js });
});

const page = await ctx.newPage();
const errors = [];
page.on("pageerror", e => errors.push(String(e)));

await page.goto("https://www.aroidpedia.com/aroid-reproduction",
                { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(4000);

console.log("--- the scratch bundle is the one under test ---");
ck(served > 0, "footer.js was intercepted and replaced", `(${served}x)`);
const ver = await page.evaluate(() => window.__apFooterBundle);
ck(ver === "v134", "window.__apFooterBundle", `= ${ver}`);

console.log("--- the page itself ---");
ck(page.url().includes("/aroid-reproduction"), "hub page loaded", page.url());

console.log("--- the flyout ---");
const info = await page.evaluate(() => {
  const link = document.querySelector(
    '.header-nav-folder-content a[href="/aroid-reproduction"]');
  if (!link) return { found: false };
  const item = link.closest(".header-nav-item--folder");
  if (!item) return { found: false, reason: "no folder ancestor" };
  item.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
  link.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
  return { found: true };
});
ck(info.found, "the /aroid-reproduction row exists in a folder dropdown",
   info.reason || "");

await page.waitForTimeout(1200);
const fly = await page.evaluate(() => {
  const f = document.querySelector(".ap-subnav");
  if (!f) return null;
  return [...f.querySelectorAll("a")].map(a => ({
    label: a.textContent.trim(), href: a.getAttribute("href") }));
});
ck(Array.isArray(fly), "the flyout was built");
if (fly) {
  console.log("\n   rows the flyout renders:");
  fly.forEach((r, i) => console.log(`     ${String(i + 1).padStart(2)}. ` +
    `${r.label.padEnd(30)} ${r.href}`));
  ck(fly.length === 10, "10 rows", `(got ${fly.length})`);
  ck(fly.every(r => !r.href.includes("-pollination")), "no -pollination href");
  ck(fly.some(r => r.href === "/dracunculus-reproduction"), "Dracunculus present");
  ck(!fly.some(r => r.href === "/homalomena-reproduction"),
     "Homalomena correctly withheld (pending)");
  ck(fly[0].href === "/chromosomes-and-crossing", "cross-genus page first");
  const gen = fly.slice(1).map(r => r.label);
  ck(JSON.stringify(gen) === JSON.stringify([...gen].sort((a, b) => a.localeCompare(b))),
     "genera alphabetical");
}

console.log("--- the section rail on this page ---");
const rail = await page.evaluate(() => {
  const r = document.querySelector('.pn-rail[data-apnav="footer"]');
  if (!r) return null;
  const hub = r.querySelector("a[href*='aroid-']");
  return { ticks: r.querySelectorAll("a,button").length,
           hub: hub ? hub.getAttribute("href") : null };
});
if (rail) {
  ck(!rail.hub || rail.hub.includes("/aroid-reproduction"),
     "rail hub link points at /aroid-reproduction", rail.hub || "(no hub link yet)");
} else {
  console.log("   --   no rail on the hub page (expected: it needs 2+ apol sections)");
}

console.log("--- console health ---");
ck(errors.length === 0, "no uncaught page errors", errors.slice(0, 2).join(" | "));

await browser.close();
console.log("\n" + (fails.length ? "FAILURES: " + fails.join("; ")
                                 : "LIVE-INTERCEPT TEST PASSED"));
process.exit(fails.length ? 1 : 0);
