/* Does the "Other Genera Reproduction" group row show that it expands?
   Measured on the LIVE bundle, desktop and mobile. No interception. */
import { chromium } from "playwright";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("https://www.aroidpedia.com/journal", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(5000);
console.log("bundle:", await page.evaluate(() => window.__apFooterBundle));

await page.locator(".header-display-desktop .header-nav-folder-title", { hasText: "THE AROID GUIDE" }).first().hover();
await page.waitForTimeout(400);
await page.locator('.header-display-desktop .header-nav-folder-content a[href="/aroid-reproduction"]').first().hover();
await page.waitForTimeout(700);

const d = await page.evaluate(() => {
  const out = { rows: [] };
  const fly = [...document.querySelectorAll(".ap-subnav.ap-sub-open")][0];
  if (!fly) return { error: "no flyout open" };
  for (const a of fly.querySelectorAll("a")) {
    const cue = a.querySelector(".ap-subcue");
    const r = cue ? cue.getBoundingClientRect() : null;
    const cs = cue ? getComputedStyle(cue) : null;
    out.rows.push({
      label: a.textContent.trim().slice(0, 30),
      group: a.classList.contains("ap-sub-group"),
      cueInDom: !!cue,
      cueBox: r ? Math.round(r.width) + "x" + Math.round(r.height) : "-",
      borders: cs ? cs.borderLeftWidth + "/" + cs.borderBottomWidth : "-"
    });
  }
  // the level-1 parent row's cue, for comparison - that one is known to work
  const link = document.querySelector('.header-display-desktop .header-nav-folder-content a[href="/aroid-reproduction"]');
  const pc = link.querySelector(".ap-subcue");
  const pr = pc.getBoundingClientRect();
  out.parentRowCue = Math.round(pr.width) + "x" + Math.round(pr.height) +
    "  borders " + getComputedStyle(pc).borderLeftWidth + "/" + getComputedStyle(pc).borderBottomWidth;
  return out;
});
console.log("\n--- DESKTOP: cue box per flyout row ---");
console.log("   the level-1 parent row (known good):", d.parentRowCue);
for (const r of d.rows)
  console.log("   " + (r.group ? "GROUP " : "link  ") + r.label.padEnd(32) +
    " cue in DOM: " + r.cueInDom + "   box " + r.cueBox + "   borders " + r.borders);

console.log("\n--- MOBILE: does the group heading say it expands? ---");
const m = await ctx.newPage();
await m.setViewportSize({ width: 375, height: 812 });
await m.goto("https://www.aroidpedia.com/journal", { waitUntil: "domcontentloaded", timeout: 60000 });
await m.waitForTimeout(5000);
const mob = await m.evaluate(() => {
  const g = document.querySelector(".ap-subnav-mobile--group");
  if (!g) return { found: false };
  const a = g.querySelector("a");
  const holder = a.querySelector(".header-menu-nav-item-content") || a;
  const cs = getComputedStyle(holder, "::after");
  const cs2 = getComputedStyle(holder, "::before");
  return {
    found: true,
    text: a.textContent.trim(),
    hasCueSpan: !!a.querySelector(".ap-subcue"),
    afterContent: cs.content, beforeContent: cs2.content,
    ariaExpanded: a.getAttribute("aria-expanded")
  };
});
console.log("   ", JSON.stringify(mob));

await browser.close();
