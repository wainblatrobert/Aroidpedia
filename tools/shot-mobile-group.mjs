/* Open the phone overlay and look at the group heading, shut then open. */
import { chromium } from "playwright";
import fs from "fs";
const js = fs.readFileSync("C:/Users/nli0490/Claude/aroidpedia-climate/footer-v16-scratch.js", "utf8");

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await ctx.route("**/footer.js*", r => r.fulfill({ status: 200, contentType: "application/javascript", body: js }));
const p = await ctx.newPage();
await p.goto("https://www.aroidpedia.com/journal", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(4500);

// open the burger
const sel = await p.evaluate(() => {
  const cands = [...document.querySelectorAll("button, a")]
    .filter(b => /burger|menu|nav-toggle/i.test(b.className + " " + (b.getAttribute("aria-label")||"")))
    .map(b => ({ cls: b.className, label: b.getAttribute("aria-label"), vis: b.getBoundingClientRect().width > 0 }));
  return cands;
});
console.log("burger candidates:", JSON.stringify(sel, null, 1));
await p.evaluate(() => {
  const b = [...document.querySelectorAll("button, a")]
    .find(x => /burger/i.test(x.className) && x.getBoundingClientRect().width > 0);
  if (b) b.click();
});
await p.waitForTimeout(1200);

// the overlay opens with folders collapsed - expand THE AROID GUIDE
await p.evaluate(() => {
  const f = [...document.querySelectorAll(".header-menu-nav-item--folder a, .header-menu-nav-item--folder button, .header-menu-nav-folder-item a, .header-menu-nav-item a")]
    .find(x => /THE AROID GUIDE/i.test(x.textContent));
  if (f) f.click();
});
await p.waitForTimeout(1400);

const info = await p.evaluate(() => {
  const g = document.querySelector(".ap-subnav-mobile--group");
  if (!g) return { found: false };
  g.scrollIntoView({ block: "center" });
  const r = g.getBoundingClientRect();
  return { found: true, top: Math.round(r.top), h: Math.round(r.height), text: g.textContent.trim() };
});
console.log("group row:", JSON.stringify(info));
await p.waitForTimeout(500);
await p.screenshot({ path: "C:/Users/nli0490/Claude/aroidpedia-climate/v178-mobile-shut.png" });

await p.evaluate(() => document.querySelector(".ap-subnav-mobile--group a")
  .dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })));
await p.waitForTimeout(700);
await p.evaluate(() => document.querySelector(".ap-subnav-mobile--group").scrollIntoView({ block: "center" }));
await p.waitForTimeout(400);
await p.screenshot({ path: "C:/Users/nli0490/Claude/aroidpedia-climate/v178-mobile-open.png" });
console.log("shots written");
await browser.close();
