/* v93 — the wash now comes from geo-hierarchy.json. Regression set taken
   from the cases the OLD code's own comments name as having broken it. */
import { chromium } from "playwright";
import fs from "node:fs";

const js = fs.readFileSync("C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js", "utf8");
const hd = fs.readFileSync("C:/Users/nli0490/Claude/Aroidpedia/docs/shapes-hd.json", "utf8");
const pass = [], fail = [];
const ok = (c, m) => (c ? pass : fail).push(m);

const CASES = [
  // slug,                 expected wash,                       must NOT wash
  ["alocasia-puber",       ["Java","Peninsular Malaysia"], ["Indonesia","Sumatra"]],
  ["alocasia-micholitziana", ["Luzon"],                          ["Philippines"]],
  ["amorphophallus-aberrans", ["Thailand"],                      []],
];

const b = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.route("**/footer.js*", (r) => r.fulfill({ status: 200, contentType: "application/javascript", body: js }));
await ctx.route("**/shapes-hd.json*", (r) => r.fulfill({ status: 200, contentType: "application/json", body: hd }));

for (const [slug, want, banned] of CASES) {
  const p = await ctx.newPage();
  let sawHier = 0;
  p.on("request", (r) => { if (/geo-hierarchy\.json/.test(r.url())) sawHier++; });
  await p.goto("https://www.aroidpedia.com/journal/" + slug, { waitUntil: "networkidle", timeout: 60000 });
  await p.waitForSelector(".apsc-map svg", { timeout: 30000 });
  await p.waitForTimeout(3500);
  const r = await p.evaluate(() => {
    const svg = document.querySelector(".apsc-map svg");
    const named = [...svg.querySelectorAll("path")]
      .map((x) => { const t = x.querySelector("title"); return t && { n: t.textContent, c: x.getAttribute("class") || "" }; })
      .filter(Boolean);
    return {
      v: document.querySelector("[data-apsc-mount]").getAttribute("data-apsc-version"),
      ctx: named.filter((x) => /apsc-ctx/.test(x.c)).map((x) => x.n),
      lit: named.filter((x) => /\bapsc-on\b/.test(x.c)).map((x) => x.n),
      chips: [...document.querySelectorAll(".apsc-facts--follow .apsc-chips .apsc-chip")].map((c) => c.textContent.trim()),
      vb: svg.getAttribute("viewBox"),
    };
  });
  const s = slug.split("-").pop();
  ok(sawHier > 0, `${s}: geo-hierarchy fetched (${sawHier})`);
  ok(r.v === "card-v99-file-v117", `${s}: ${r.v}`);
  const got = r.ctx.slice().sort().join(", ");
  ok(want.every((w) => r.ctx.includes(w)) && r.ctx.length === want.length,
     `${s}: wash = [${got}]  expected [${want.slice().sort().join(", ")}]`);
  const bad = banned.filter((x) => r.ctx.includes(x));
  ok(bad.length === 0, `${s}: does not wash [${banned.join(", ")}]${bad.length ? " — LEAKED " + bad.join(", ") : ""}`);
  console.log(`   ${s}: chips = ${r.chips.join(" | ")}`);
  console.log(`   ${s}: frame ${parseFloat(r.vb.split(/\s+/)[2]).toFixed(2)}deg, lit ${r.lit.length}`);
  await p.close();
}

/* zoom + pan interactions, on one page */
const p = await ctx.newPage();
await p.goto("https://www.aroidpedia.com/journal/alocasia-micholitziana", { waitUntil: "networkidle", timeout: 60000 });
await p.waitForSelector(".apsc-map svg", { timeout: 30000 });
await p.waitForTimeout(3000);
const vb0 = await p.evaluate(() => document.querySelector(".apsc-map svg").getAttribute("viewBox"));
ok(Math.abs(parseFloat(vb0.split(/\s+/)[2]) - 10) < 0.01, `MAP_MIN_DEG 10 in force (frame ${parseFloat(vb0.split(/\s+/)[2]).toFixed(2)})`);

const box = await p.locator(".apsc-map svg").boundingBox();
await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await p.mouse.wheel(0, -240);
await p.waitForTimeout(250);
const w1 = await p.evaluate(() => parseFloat(document.querySelector(".apsc-map svg").getAttribute("viewBox").split(/\s+/)[2]));
ok(w1 < parseFloat(vb0.split(/\s+/)[2]), `wheel zooms in (${parseFloat(vb0.split(/\s+/)[2]).toFixed(2)} -> ${w1.toFixed(2)})`);

const before = await p.evaluate(() => document.querySelector(".apsc-map svg").getAttribute("viewBox"));
await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await p.mouse.down();
await p.mouse.move(box.x + box.width / 2 - 60, box.y + box.height / 2, { steps: 8 });
await p.mouse.up();
await p.waitForTimeout(250);
const after = await p.evaluate(() => document.querySelector(".apsc-map svg").getAttribute("viewBox"));
ok(before !== after, `drag pans the map (${before.split(/\s+/)[0]} -> ${after.split(/\s+/)[0]})`);
const sameW = Math.abs(parseFloat(before.split(/\s+/)[2]) - parseFloat(after.split(/\s+/)[2])) < 0.001;
ok(sameW, "drag pans without changing zoom");
await b.close();

console.log("\nPASS " + pass.length + " / FAIL " + fail.length);
pass.forEach((x) => console.log("  ok   " + x));
fail.forEach((x) => console.log("  FAIL " + x));
process.exit(fail.length ? 1 : 0);
