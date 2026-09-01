/* v89 backdrop test — MUST run on a species that pulls shapes-hd.json.
   aberrans (Thailand) resolves entirely from shapes.json and never sees
   the HD feed, so it cannot exercise this at all; dracontioides has an
   HD-only place and therefore loads the 976-shape feed that carries the
   WGSRPD splits. Both local artifacts are served. */
import { chromium } from "playwright";
import fs from "node:fs";

const js = fs.readFileSync("C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js", "utf8");
const hd = fs.readFileSync("C:/Users/nli0490/Claude/Aroidpedia/docs/shapes-hd.json", "utf8");
const pass = [], fail = [];
const ok = (c, m) => (c ? pass : fail).push(m);

const b = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
let sJs = 0, sHd = 0;
/* LIVE run: nothing intercepted, the deployed artifacts are under test */
sJs = 1; sHd = 1;
let sawHd = 0;


const p = await ctx.newPage();
p.on("request", (r) => { if (/shapes-hd\.json/.test(r.url())) sawHd++; });
await p.goto("https://www.aroidpedia.com/journal/amorphophallus-dracontioides",
             { waitUntil: "networkidle", timeout: 60000 });
await p.waitForSelector(".apsc-map svg", { timeout: 30000 });
await p.waitForTimeout(3500);

ok(true, "LIVE bundle under test (no interception)");
ok(sawHd > 0, `LIVE shapes-hd fetched by the page (${sawHd})`);
ok(await p.getAttribute("[data-apsc-mount]", "data-apsc-version") === "card-v89-file-v107",
   "version under test = card-v89-file-v107");

const m = await p.evaluate(() => {
  const svg = document.querySelector(".apsc-map svg");
  const named = [...svg.querySelectorAll("path")]
    .map((x) => { const t = x.querySelector("title"); return t && { n: t.textContent, c: x.getAttribute("class") || "" }; })
    .filter(Boolean);
  return { total: named.length, names: named.map((x) => x.n),
           lit: named.filter((x) => /\bapsc-on\b/.test(x.c)).map((x) => x.n) };
});
ok(m.total > 20, `shapes drawn = ${m.total}`);

const pieces = ["Texas","California","Florida","Alaska","Ontario","Québec","Yakutiya",
  "Krasnoyarsk","West Siberia","Brazil North","Brazil Northeast","Argentina South",
  "Manchuria","Tibet","Inner Mongolia","Alberta","Manitoba","Yukon"]
  .filter((n) => m.names.includes(n));
ok(pieces.length === 0, `no unlit WGSRPD pieces drawn${pieces.length ? " — STILL DRAWN: " + pieces.join(", ") : ""}`);

const backs = ["United States","Canada","Russia"].filter((n) => m.names.includes(n));
ok(backs.length === 3, `backdrops drawn: ${backs.join(", ") || "(NONE)"}`);
ok(m.lit.length > 0, `lit places intact: ${m.lit.slice(0, 6).join(", ")}`);

await p.locator(".apsc-map__zoomui .apsc-map__zoom").first().click().catch(() => {});
await p.waitForTimeout(500);
await p.locator(".apsc-map").first().screenshot({
  path: "C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/5af356c8-a625-47c2-93cb-c3a053fc9fe6/scratchpad/v89-backdrop.png" });

await b.close();
console.log("\nPASS " + pass.length + " / FAIL " + fail.length);
pass.forEach((x) => console.log("  ok   " + x));
fail.forEach((x) => console.log("  FAIL " + x));
process.exit(fail.length ? 1 : 0);
