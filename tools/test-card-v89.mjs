/* card v88 verification — run the LIVE page but serve the LOCAL bundle.
   The repo copy is never pushed until this passes. */
import { chromium } from "playwright";
import fs from "node:fs";

const BUNDLE = "C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js";
const URL = process.env.SP || "https://www.aroidpedia.com/journal/amorphophallus-aberrans";
const js = fs.readFileSync(BUNDLE, "utf8");

const pass = [], fail = [];
const ok = (c, m) => (c ? pass : fail).push(m);

const b = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });

let served = 0;
await ctx.route("**/footer.js*", (r) => {
  served++;
  r.fulfill({ status: 200, contentType: "application/javascript", body: js });
});
/* the card reads shapes-hd.json separately — without this the LIVE feed
   is used and the backdrops it does not yet carry cannot appear. */
const hd = fs.readFileSync("C:/Users/nli0490/Claude/Aroidpedia/docs/shapes-hd.json", "utf8");
let servedHd = 0;
await ctx.route("**/shapes-hd.json*", (r) => {
  servedHd++;
  r.fulfill({ status: 200, contentType: "application/json", body: hd });
});

const p = await ctx.newPage();
await p.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
await p.waitForSelector("[data-apsc-mount]", { timeout: 30000 });
await p.waitForTimeout(3500);

ok(served > 0, `local bundle intercepted (${served})`);
ok(true, `shapes-hd requests on this page: ${servedHd} (0 is correct — aberrans resolves from shapes.json alone)`);

const stamp = await p.getAttribute("[data-apsc-mount]", "data-apsc-version");
ok(stamp === "card-v99-file-v117", `version under test = ${stamp}`);

/* ---- 3 · unlit subunits are not drawn ---- */
const map = await p.evaluate(() => {
  const svg = document.querySelector(".apsc-map svg");
  if (!svg) return null;
  const paths = [...svg.querySelectorAll("path")];
  const named = paths.map((x) => {
    const t = x.querySelector("title");
    return { name: t ? t.textContent : null, cls: x.getAttribute("class") || "" };
  }).filter((x) => x.name);
  return {
    total: named.length,
    lit: named.filter((x) => /\bapsc-on\b/.test(x.cls)).map((x) => x.name),
    ctx: named.filter((x) => /apsc-ctx/.test(x.cls)).map((x) => x.name),
    base: named.filter((x) => /apsc-base/.test(x.cls)).length,
    names: named.map((x) => x.name),
  };
});
ok(!!map, "card map rendered");
if (map) {
  ok(map.total > 50 && map.total < 400, `shapes drawn = ${map.total} (was 710; must be neither 0 nor ~710)`);
  ok(map.lit.includes("Uthai Thani") && map.lit.includes("Tak"),
     `lit subunits still drawn: ${map.lit.join(", ")}`);
  // provinces of unrelated L4 countries must be gone
  const strays = ["Kaduna", "Kerala", "Luzon", "Sarawak", "Karnataka", "Mindanao"]
    .filter((n) => map.names.includes(n));
  ok(strays.length === 0, `no unrelated subunits drawn${strays.length ? " — STRAYS: " + strays.join(", ") : ""}`);
  // v89: the WGSRPD split layer must be gone, the backdrops present
  const pieces = ["Texas", "California", "Ontario", "Yakutiya", "Brazil North",
                  "Argentina South", "Manchuria", "Alaska", "Quebec", "Québec"]
    .filter((n) => map.names.includes(n));
  ok(pieces.length === 0, `no unlit WGSRPD pieces drawn${pieces.length ? " — STILL DRAWN: " + pieces.join(", ") : ""}`);
  // backdrops only exist in the HD feed; see test-backdrop.mjs
}

/* ---- 2 · zoom buttons beside World ---- */
const zoom = await p.evaluate(() => {
  const ui = document.querySelector(".apsc-map__zoomui");
  if (!ui) return null;
  const btns = [...ui.querySelectorAll("button")].map((b) => b.textContent.trim());
  const svg = document.querySelector(".apsc-map svg");
  return { btns, vb: svg.getAttribute("viewBox") };
});
ok(!!zoom, "zoom UI present");
if (zoom) {
  ok(zoom.btns.length === 3, `three controls: ${JSON.stringify(zoom.btns)}`);
  ok(zoom.btns.includes("World"), "World pill kept beside the steppers");

  const w0 = parseFloat(zoom.vb.split(/\s+/)[2]);
  await p.click(".apsc-map__zoomui button[aria-label='Zoom in']");
  await p.waitForTimeout(200);
  const w1 = await p.evaluate(() => parseFloat(
    document.querySelector(".apsc-map svg").getAttribute("viewBox").split(/\s+/)[2]));
  ok(w1 < w0, `+ zooms in (${w0.toFixed(1)} -> ${w1.toFixed(1)})`);

  await p.click(".apsc-map__zoomui button[aria-label='Zoom out']");
  await p.waitForTimeout(200);
  const w2 = await p.evaluate(() => parseFloat(
    document.querySelector(".apsc-map svg").getAttribute("viewBox").split(/\s+/)[2]));
  ok(Math.abs(w2 - w0) < 0.01, `- returns to the framed width (${w2.toFixed(1)})`);

  await p.click(".apsc-map__zoomui .apsc-map__zoom");
  await p.waitForTimeout(250);
  const world = await p.evaluate(() => ({
    vb: document.querySelector(".apsc-map svg").getAttribute("viewBox"),
    label: document.querySelector(".apsc-map__zoomui .apsc-map__zoom").textContent.trim(),
  }));
  ok(parseFloat(world.vb.split(/\s+/)[2]) > w0, "World widens to the whole world");
  ok(world.label === "Close in", `label flips to "${world.label}"`);
  await p.click(".apsc-map__zoomui .apsc-map__zoom");
  await p.waitForTimeout(200);
}

/* ---- 1 · continent leads the pinned row ---- */
const chipOrder = await p.evaluate(async () => {
  const follow = document.querySelector(".apsc-facts--follow");
  if (!follow) return { err: "no follow panel" };
  // pin it: the compact class is applied on scroll
  window.scrollTo(0, document.body.scrollHeight * 0.45);
  await new Promise((r) => setTimeout(r, 900));
  const compact = follow.classList.contains("apsc--compact");
  const chips = [...follow.querySelectorAll(".apsc-chips .apsc-chip")];
  const dom = chips.map((c) => c.textContent.trim());
  const visual = chips
    .map((c) => ({ t: c.textContent.trim(), x: c.getBoundingClientRect().left,
                   y: Math.round(c.getBoundingClientRect().top) }))
    .sort((a, b2) => (a.y - b2.y) || (a.x - b2.x))
    .map((c) => c.t);
  const cont = follow.querySelector(".apsc-chip--continent");
  return { compact, dom, visual, order: cont ? getComputedStyle(cont).order : null };
});
ok(!chipOrder.err, "follow panel found");
if (!chipOrder.err) {
  ok(chipOrder.compact, "follow panel is pinned/compact");
  ok(chipOrder.order === "-1", `continent computed order = ${chipOrder.order}`);
  ok(/asia/i.test(chipOrder.visual[0] || ""),
     `visual order: ${chipOrder.visual.join(" | ")}`);
  ok(/asia/i.test(chipOrder.dom[chipOrder.dom.length - 1] || ""),
     `DOM order unchanged (continent still last): ${chipOrder.dom.join(" | ")}`);
}

await b.close();
console.log("\nPASS " + pass.length + " / FAIL " + fail.length);
pass.forEach((m) => console.log("  ok   " + m));
fail.forEach((m) => console.log("  FAIL " + m));
process.exit(fail.length ? 1 : 0);
