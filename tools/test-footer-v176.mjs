/* FILE v176 — the morphology subnav.
   Serves the SCRATCH bundle to the live site by interception. docs/footer.js
   is never written. Run from C:\Users\nli0490\Claude\aroidpedia-climate. */
import { chromium } from "playwright";
import fs from "fs";

const BUNDLE = "C:/Users/nli0490/Claude/aroidpedia-climate/footer-v16-scratch.js";
const js = fs.readFileSync(BUNDLE, "utf8");
const fails = [];
const ck = (ok, label, extra) => {
  if (!ok) fails.push(label);
  console.log("   " + (ok ? "ok  " : "FAIL") + " " + label + (extra ? "  " + extra : ""));
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

await page.goto("https://www.aroidpedia.com/aroid-morphology",
                { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(4500);

console.log("--- the version under test ---");
ck(served > 0, "footer.js intercepted and replaced", "(" + served + "x)");
const ver = await page.evaluate(() => window.__apFooterBundle);
ck(ver === "v176", "window.__apFooterBundle", "= " + ver);

console.log("--- both flyouts are configured and built ---");
const st = await page.evaluate(() => window.__apSubnav && window.__apSubnav.state);
ck(!!st, "window.__apSubnav exists");
ck(st && st.configured.length === 2, "two SUBNAV keys", JSON.stringify(st && st.configured));
ck(st && st.flyoutsBuilt === 2, "two desktop flyouts built", "= " + (st && st.flyoutsBuilt));

async function hoverRow(href) {
  const title = page.locator(".header-display-desktop .header-nav-folder-title", { hasText: "THE AROID GUIDE" }).first();
  await title.hover();
  await page.waitForTimeout(300);
  await page.locator(".header-display-desktop .header-nav-folder-content a[href=\"" + href + "\"]").first().hover();
  await page.waitForTimeout(500);
}

console.log("--- the morphology flyout ---");
await hoverRow("/aroid-morphology");
const morph = await page.evaluate(() => {
  const link = document.querySelector('.header-display-desktop .header-nav-folder-content a[href="/aroid-morphology"]');
  const item = link && link.closest(".header-nav-item--folder");
  const flys = item ? [...item.querySelectorAll(":scope > .ap-subnav")] : [];
  const open = flys.find(f => f.classList.contains("ap-sub-open"));
  if (!open) return { open: false, count: flys.length };
  const r = open.getBoundingClientRect();
  return {
    open: true,
    rows: [...open.querySelectorAll("a")].map(a => ({ label: a.textContent.trim(), href: a.getAttribute("href") })),
    rect: { top: Math.round(r.top), left: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) },
    parentLit: link.closest(".header-nav-folder-item").classList.contains("ap-sub-parent"),
    hold: item.classList.contains("ap-subhold"),
    cue: !!link.querySelector(".ap-subcue")
  };
});
ck(morph.open, "a flyout opened on the morphology row", JSON.stringify(morph));
if (morph.open) {
  ck(morph.rows.length === 2, "exactly two rows", JSON.stringify(morph.rows));
  ck(morph.rows[0] && morph.rows[0].href === "/alocasia-morphology", "row 1 = /alocasia-morphology");
  ck(morph.rows[1] && morph.rows[1].href === "/anthurium-morphology", "row 2 = /anthurium-morphology");
  ck(morph.rows.every(r => !/reproduction/.test(r.href)), "no reproduction rows leaked in");
  ck(morph.rect.left >= 0 && morph.rect.left + morph.rect.w <= 1440, "panel is on screen", JSON.stringify(morph.rect));
  ck(morph.rect.h > 40, "panel has height", morph.rect.h + "px");
  ck(morph.parentLit, "the parent row stays lit");
  ck(morph.hold, "ap-subhold pins the dropdown");
  ck(morph.cue, "the row grew a cue");
}
await page.screenshot({ path: "C:/Users/nli0490/Claude/aroidpedia-climate/v176-morphology-flyout.png", clip: { x: 0, y: 0, width: 1440, height: 620 } });

console.log("--- the reproduction flyout is untouched ---");
await page.mouse.move(720, 700); await page.waitForTimeout(700);
await hoverRow("/aroid-reproduction");
const repro = await page.evaluate(() => {
  const item = document.querySelector('.header-display-desktop .header-nav-folder-content a[href="/aroid-reproduction"]').closest(".header-nav-item--folder");
  const open = [...item.querySelectorAll(":scope > .ap-subnav")].find(f => f.classList.contains("ap-sub-open"));
  if (!open) return { open: false };
  return { open: true, rows: [...open.querySelectorAll("a")].map(a => a.getAttribute("href") || "(group)") };
});
ck(repro.open, "the reproduction flyout still opens");
ck(repro.open && repro.rows.length === 7, "still 7 first-level rows (6 links + 1 group)", JSON.stringify(repro.rows));
ck(repro.open && repro.rows.indexOf("(group)") >= 0, "the Other Genera group survived");

console.log("--- THE RACE: morphology row -> reproduction row, past the 260ms timer ---");
await page.mouse.move(720, 700); await page.waitForTimeout(700);
await hoverRow("/aroid-morphology");
await page.locator('.header-display-desktop .header-nav-folder-content a[href="/aroid-reproduction"]').first().hover();
await page.waitForTimeout(700);
const race = await page.evaluate(() => {
  const item = document.querySelector('.header-display-desktop .header-nav-folder-content a[href="/aroid-reproduction"]').closest(".header-nav-item--folder");
  const panel = item.querySelector(".header-nav-folder-content");
  const openFlys = [...item.querySelectorAll(".ap-subnav.ap-sub-open")];
  const cs = getComputedStyle(panel);
  return {
    hold: item.classList.contains("ap-subhold"),
    openCount: openFlys.length,
    openHrefs: openFlys.map(f => { const a = f.querySelector("a"); return a ? a.getAttribute("href") : null; }),
    panelVisible: cs.visibility !== "hidden" && cs.display !== "none"
  };
});
ck(race.hold, "ap-subhold SURVIVED the stale close timer", JSON.stringify(race));
ck(race.openCount === 1, "exactly one flyout open", "= " + race.openCount);
ck(race.openHrefs[0] === "/chromosomes-and-crossing", "and it is the reproduction one", JSON.stringify(race.openHrefs));
ck(race.panelVisible, "the parent dropdown did not blink shut");

console.log("--- and the hold IS released when nothing is open ---");
await page.mouse.move(720, 780);
await page.waitForTimeout(1200);
const released = await page.evaluate(() => {
  const item = document.querySelector('.header-display-desktop .header-nav-folder-content a[href="/aroid-reproduction"]').closest(".header-nav-item--folder");
  return { hold: item.classList.contains("ap-subhold"),
           open: item.querySelectorAll(".ap-subnav.ap-sub-open").length };
});
ck(!released.hold && released.open === 0, "ap-subhold cleared once both flyouts closed", JSON.stringify(released));

console.log("--- mobile: the overlay rows ---");
const m = await ctx.newPage();
await m.setViewportSize({ width: 375, height: 812 });
await m.goto("https://www.aroidpedia.com/aroid-morphology", { waitUntil: "domcontentloaded", timeout: 60000 });
await m.waitForTimeout(4500);
const mob = await m.evaluate(() => {
  const rows = [...document.querySelectorAll(".ap-subnav-mobile")];
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
  return { total: rows.length, afterMorphology: after };
});
ck(mob.afterMorphology.length === 2, "two cloned rows follow the morphology row", JSON.stringify(mob.afterMorphology));
ck(mob.afterMorphology[0] === "/alocasia-morphology" && mob.afterMorphology[1] === "/anthurium-morphology",
   "and they are the right two");
console.log("   mobile .ap-subnav-mobile rows total = " + mob.total);

console.log("--- console ---");
ck(errors.length === 0, "no page errors", errors.join(" | "));

await browser.close();
console.log(fails.length ? "\nFAILED " + fails.length + ": " + fails.join(", ") : "\nALL PASS");
process.exit(fails.length ? 1 : 0);
