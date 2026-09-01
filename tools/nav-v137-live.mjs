/* NAV v137 — LIVE verification. No ctx.route, no scratch bundle: this is
   the deployed footer.js as a reader gets it. */
import { chromium } from "playwright";

const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1500, height: 1000 } });
const pg = await ctx.newPage();
const errs = [];
pg.on("pageerror", e => errs.push(String(e)));

await pg.goto("https://www.aroidpedia.com/aroid-morphology",
              { waitUntil: "domcontentloaded", timeout: 60000 });
await pg.waitForTimeout(6000);
console.log("LIVE bundle stamp:", await pg.evaluate(() => window.__apFooterBundle || "(none)"));

const out = await pg.evaluate(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const root = document.querySelector(".header-display-desktop") || document;
  const link = [...root.querySelectorAll(".header-nav-folder-item a")]
    .find(a => (a.getAttribute("href") || "") === "/aroid-morphology");
  if (!link) return { err: "no /aroid-morphology nav row" };
  const item = link.closest(".header-nav-item--folder");
  item.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
  item.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
  await sleep(300);
  link.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
  link.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
  await sleep(600);
  const fly = [...document.querySelectorAll(".ap-subnav.ap-sub-open")].pop();
  if (!fly) return { err: "flyout did not open" };
  return {
    rows: [...fly.querySelectorAll(":scope > a")].map(a => ({
      label: a.textContent.replace(/\s+/g, " ").trim(),
      href: a.getAttribute("href")
    }))
  };
});

if (out.err) { console.log("FAIL: " + out.err); }
else {
  console.log("\n=== LIVE morphology flyout ===");
  out.rows.forEach(r => console.log("   " + r.label.padEnd(26) + " -> " + r.href));
}
console.log("\nerrors:", errs.length ? errs.slice(0, 3) : "none");

/* and every href actually resolves */
console.log("\n=== each row followed ===");
for (const r of (out.rows || [])) {
  const p2 = await ctx.newPage();
  const resp = await p2.goto("https://www.aroidpedia.com" + r.href,
                             { waitUntil: "domcontentloaded", timeout: 60000 });
  const t = await p2.title();
  console.log("   " + String(resp.status()) + "  " + r.href.padEnd(26) + " :: " + t);
  await p2.close();
}
await pg.screenshot({ path: "nav-v137-live.png" });
await b.close();
