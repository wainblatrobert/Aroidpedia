/* NAV v137 test — Monstera + Philodendron in the morphology flyout.
   Runs the SCRATCH bundle against the LIVE site via ctx.route, because
   the master is edited concurrently by other lanes and docs/footer.js
   must not be written until this passes. */
import { chromium } from "playwright";
import fs from "fs";

const BUNDLE = "C:/Users/nli0490/Claude/aroidpedia-climate/footer-v16-scratch.js";
const js = fs.readFileSync(BUNDLE, "utf8");
console.log("scratch bundle: " + (js.length / 1024).toFixed(1) + " KB");

const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1500, height: 1000 } });
let served = 0;
await ctx.route("**/footer.js*", r => {
  served++;
  r.fulfill({ status: 200, contentType: "application/javascript", body: js });
});

const pg = await ctx.newPage();
const errs = [];
pg.on("pageerror", e => errs.push(String(e)));
pg.on("console", m => { if (m.type() === "error") errs.push("console: " + m.text()); });

await pg.goto("https://www.aroidpedia.com/aroid-morphology", { waitUntil: "networkidle" });
await pg.waitForTimeout(2500);
console.log("footer.js intercepted: " + served + "x");
console.log("bundle stamp on page:",
  await pg.evaluate(() => (window.__apFooterBundle || "(none)")));

/* find the folder holding the /aroid-morphology row, open it, hover the row */
const out = await pg.evaluate(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const root = document.querySelector(".header-display-desktop") || document;

  function rowsFor(href) {
    const link = [...root.querySelectorAll(".header-nav-folder-item a")]
      .find(a => (a.getAttribute("href") || "") === href);
    if (!link) return { err: "no nav row for " + href };
    const item = link.closest(".header-nav-item--folder");
    if (!item) return { err: "row not inside a folder: " + href };
    return { link, item };
  }

  async function openFly(href) {
    const f = rowsFor(href);
    if (f.err) return f;
    f.item.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    f.item.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await sleep(280);
    f.link.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    f.link.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await sleep(500);
    const flys = [...document.querySelectorAll(".ap-subnav.ap-sub-open")];
    const fly = flys[flys.length - 1];
    if (!fly) return { err: "no open flyout for " + href,
                       anyPanels: document.querySelectorAll(".ap-subnav").length };
    const r = fly.getBoundingClientRect();
    return {
      rows: [...fly.querySelectorAll(":scope > a")].map(a => ({
        label: a.textContent.replace(/\s+/g, " ").trim(),
        href: a.getAttribute("href"),
        group: a.classList.contains("ap-sub-group"),
        cue: !!a.querySelector(".ap-subcue")
      })),
      box: { w: Math.round(r.width), h: Math.round(r.height),
             onscreen: r.left >= 0 && r.right <= innerWidth + 1 },
      holdCount: document.querySelectorAll(".ap-subhold").length
    };
  }

  const morph = await openFly("/aroid-morphology");
  /* close everything, then the regression check on the sibling key */
  document.body.dispatchEvent(new MouseEvent("mousemove", { bubbles: true }));
  [...root.querySelectorAll(".header-nav-item--folder")].forEach(i =>
    i.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true })));
  await sleep(700);
  const strandedHold = document.querySelectorAll(".ap-subhold").length;
  const strandedOpen = document.querySelectorAll(".ap-subnav.ap-sub-open").length;

  const repro = await openFly("/aroid-reproduction");
  return { morph, repro, strandedHold, strandedOpen };
});

console.log("\n=== MORPHOLOGY FLYOUT ===");
if (out.morph.err) { console.log("  ERROR: " + out.morph.err, out.morph); }
else {
  out.morph.rows.forEach(r =>
    console.log("   " + (r.group ? "[grp] " : "      ") + r.label.padEnd(26) + " -> " + r.href));
  console.log("   panel " + out.morph.box.w + "x" + out.morph.box.h +
              "  fully on screen: " + out.morph.box.onscreen);
}

console.log("\n=== REPRODUCTION FLYOUT (regression: two keys, one folder) ===");
if (out.repro.err) console.log("  ERROR: " + out.repro.err, out.repro);
else {
  console.log("   " + out.repro.rows.length + " rows, group row present: " +
              out.repro.rows.some(r => r.group) +
              ", its cue rendered: " + out.repro.rows.filter(r => r.group).every(r => r.cue));
}

console.log("\n=== .ap-subhold reference counting ===");
console.log("   stranded .ap-subhold after closing everything: " + out.strandedHold +
            (out.strandedHold === 0 ? "  (correct)" : "  <-- LEAK"));
console.log("   stranded open flyouts: " + out.strandedOpen +
            (out.strandedOpen === 0 ? "  (correct)" : "  <-- LEAK"));

console.log("\nerrors: " + (errs.length ? JSON.stringify(errs.slice(0, 5), null, 1) : "none"));
await pg.screenshot({ path: "nav-v137.png" });
await b.close();
