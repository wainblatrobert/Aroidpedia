/* FILE v178 / nav v136 — the group row's cue, desktop and mobile.
   Scratch bundle served by interception; docs/footer.js untouched. */
import { chromium } from "playwright";
import fs from "fs";

const js = fs.readFileSync("C:/Users/nli0490/Claude/aroidpedia-climate/footer-v16-scratch.js", "utf8");
const fails = [];
const ck = (ok, label, extra) => {
  if (!ok) fails.push(label);
  console.log("   " + (ok ? "ok  " : "FAIL") + " " + label + (extra ? "  " + extra : ""));
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.route("**/footer.js*", r =>
  r.fulfill({ status: 200, contentType: "application/javascript", body: js }));

const page = await ctx.newPage();
const errors = [];
page.on("pageerror", e => errors.push(String(e)));
await page.goto("https://www.aroidpedia.com/journal", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(4500);

ck((await page.evaluate(() => window.__apFooterBundle)) === "v178", "bundle under test is v178");

async function openFlyout() {
  await page.locator(".header-display-desktop .header-nav-folder-title", { hasText: "THE AROID GUIDE" }).first().hover();
  await page.waitForTimeout(350);
  await page.locator('.header-display-desktop .header-nav-folder-content a[href="/aroid-reproduction"]').first().hover();
  await page.waitForTimeout(650);
}

console.log("--- DESKTOP: the group row now has a painted cue ---");
await openFlyout();
const d = await page.evaluate(() => {
  const fly = [...document.querySelectorAll(".ap-subnav.ap-sub-open")][0];
  const g = fly.querySelector("a.ap-sub-group");
  const cue = g.querySelector(".ap-subcue");
  const r = cue.getBoundingClientRect(), cs = getComputedStyle(cue);
  const gr = g.getBoundingClientRect();
  // the level-1 cue, as the reference the group row must match
  const p = document.querySelector('.header-display-desktop .header-nav-folder-content a[href="/aroid-reproduction"] .ap-subcue');
  const pcs = getComputedStyle(p), pr = p.getBoundingClientRect();
  return {
    w: Math.round(r.width), h: Math.round(r.height),
    bl: cs.borderLeftWidth, bb: cs.borderBottomWidth,
    opacity: +cs.opacity, transform: cs.transform,
    // is it on the RIGHT edge of its row?
    fromRight: Math.round(gr.right - r.right),
    ref: { w: Math.round(pr.width), bl: pcs.borderLeftWidth, transform: pcs.transform }
  };
});
console.log("      level-1 reference cue:", JSON.stringify(d.ref));
ck(d.w >= 8 && d.h >= 8, "cue has a real box", d.w + "x" + d.h + " (was 0x0)");
ck(parseFloat(d.bl) > 0 && d.bl === d.ref.bl, "borders drawn, same width as the level-1 cue",
   d.bl + "/" + d.bb + " vs ref " + d.ref.bl + "  (was 0px/0px)");
ck(d.w === d.ref.w, "same size as the level-1 cue it mirrors", d.w + " vs " + d.ref.w);
const rot = t => t.replace(/matrix\(([^)]*)\)/, (_, g) => g.split(",").slice(0, 4).map(x => (+x).toFixed(3)).join(","));
ck(rot(d.transform) === rot(d.ref.transform), "same rotation, so it points the same way",
   rot(d.transform) + "  (ref carries a -3px lean because its own panel is open)");
ck(Math.abs(d.opacity - 0.5) < 0.06, "at rest opacity .5", String(d.opacity));
ck(d.fromRight >= 0 && d.fromRight < 25, "sits on the row's right edge", d.fromRight + "px in");

console.log("--- and it responds to hover and to its panel opening ---");
await page.locator(".ap-subnav.ap-sub-open a.ap-sub-group").first().hover();
await page.waitForTimeout(700);
const open2 = await page.evaluate(() => {
  const g = document.querySelector(".ap-subnav.ap-sub-open a.ap-sub-group");
  const cue = g.querySelector(".ap-subcue");
  return {
    parentRow: g.classList.contains("ap-sub-parent-row"),
    opacity: +getComputedStyle(cue).opacity,
    transform: getComputedStyle(cue).transform,
    l2open: document.querySelectorAll(".ap-subnav--l2.ap-sub-open").length
  };
});
ck(open2.l2open === 1, "the second-level panel opened", String(open2.l2open));
ck(open2.parentRow, "the group row is marked ap-sub-parent-row");
ck(open2.opacity > 0.9, "cue goes full opacity while open", String(open2.opacity));
ck(open2.transform !== d.transform, "and leans toward the panel", open2.transform);

await page.screenshot({ path: "C:/Users/nli0490/Claude/aroidpedia-climate/v178-group-cue.png", clip: { x: 300, y: 0, width: 1140, height: 560 } });

console.log("--- the plain link rows did NOT grow a cue ---");
const plain = await page.evaluate(() => {
  const fly = [...document.querySelectorAll(".ap-subnav.ap-sub-open")][0];
  return [...fly.querySelectorAll("a:not(.ap-sub-group)")].filter(a => a.querySelector(".ap-subcue")).length;
});
ck(plain === 0, "no cue on rows that just navigate", String(plain));

console.log("--- MOBILE: the heading says it opens, and says it opened ---");
const m = await ctx.newPage();
await m.setViewportSize({ width: 375, height: 812 });
await m.goto("https://www.aroidpedia.com/journal", { waitUntil: "domcontentloaded", timeout: 60000 });
await m.waitForTimeout(4500);
const read = () => m.evaluate(() => {
  const g = document.querySelector(".ap-subnav-mobile--group");
  const h = g.querySelector(".header-menu-nav-item-content") || g.querySelector("a");
  const cs = getComputedStyle(h, "::after");
  return {
    content: cs.content, w: cs.width, bR: cs.borderRightWidth, bB: cs.borderBottomWidth,
    transform: cs.transform, open: g.classList.contains("ap-sub2-open"),
    kidsVisible: [...document.querySelectorAll(".ap-subnav-mobile--l2")]
                   .filter(k => !k.classList.contains("ap-sub2-hidden")).length
  };
});
const shut = await read();
ck(shut.content === '""', "the ::after exists", shut.content);
ck(shut.w === "6px", "it has a box", shut.w);
ck(parseFloat(shut.bR) > 0 && parseFloat(shut.bB) > 0, "two borders drawn", shut.bR + "/" + shut.bB);
ck(shut.kidsVisible === 0, "children start folded", String(shut.kidsVisible));

await m.evaluate(() => {
  const a = document.querySelector(".ap-subnav-mobile--group a");
  a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
});
await m.waitForTimeout(600);
const opened = await read();
ck(opened.open, "the group toggled open");
ck(opened.kidsVisible === 8, "all eight children unfolded", String(opened.kidsVisible));
ck(opened.transform !== shut.transform, "the chevron flipped", shut.transform + "  ->  " + opened.transform);
await m.screenshot({ path: "C:/Users/nli0490/Claude/aroidpedia-climate/v178-mobile-group.png", fullPage: false });

ck(errors.length === 0, "no page errors", errors.join(" | "));
await browser.close();
console.log(fails.length ? "\nFAILED " + fails.length + ": " + fails.join(", ") : "\nALL PASS");
process.exit(fails.length ? 1 : 0);
