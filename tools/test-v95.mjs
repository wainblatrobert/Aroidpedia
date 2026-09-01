/* v95 — every card now draws HD geometry. Measures the actual point count
   of the rendered path, so this cannot pass on a bundle that merely fetched
   the feed without using it (the v89 `parent` failure mode). */
import { chromium } from "playwright";
import fs from "node:fs";
const js = fs.readFileSync("C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js", "utf8");
const hd = fs.readFileSync("C:/Users/nli0490/Claude/Aroidpedia/docs/shapes-hd.json", "utf8");
const pass = [], fail = [];
const ok = (c, m) => (c ? pass : fail).push(m);

const b = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await ctx.route("**/footer.js*", (r) => r.fulfill({ status: 200, contentType: "application/javascript", body: js }));
await ctx.route("**/shapes-hd.json*", (r) => r.fulfill({ status: 200, contentType: "application/json", body: hd }));

/* aberrans previously did NOT fetch HD at all — the strongest case */
for (const [slug, probe, minPts] of [
  ["alocasia-ramosii", "Luzon", 120],
  ["amorphophallus-aberrans", "Thailand", 100],
]) {
  const p = await ctx.newPage();
  let sawHd = 0;
  p.on("request", (r) => { if (/shapes-hd\.json/.test(r.url())) sawHd++; });
  await p.goto("https://www.aroidpedia.com/journal/" + slug, { waitUntil: "networkidle", timeout: 60000 });
  await p.waitForSelector(".apsc-map svg", { timeout: 30000 });
  await p.waitForTimeout(3500);
  const r = await p.evaluate((probe) => {
    const svg = document.querySelector(".apsc-map svg");
    let d = null;
    svg.querySelectorAll("path").forEach((x) => {
      const t = x.querySelector("title");
      if (t && t.textContent === probe) d = x.getAttribute("d");
    });
    return {
      v: document.querySelector("[data-apsc-mount]").getAttribute("data-apsc-version"),
      pts: d ? (d.match(/-?\d+(\.\d+)?/g) || []).length / 2 : 0,
      total: svg.querySelectorAll("path").length,
    };
  }, probe);
  const s = slug.split("-").pop();
  ok(sawHd > 0, `${s}: HD feed fetched (${sawHd}) — was conditional before`);
  ok(r.v === "card-v99-file-v117", `${s}: ${r.v}`);
  ok(r.pts >= minPts, `${s}: ${probe} drawn with ${Math.round(r.pts)} points (HD threshold ${minPts})`);
  await p.locator(".apsc-map").first().screenshot({
    path: `C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/5af356c8-a625-47c2-93cb-c3a053fc9fe6/scratchpad/v95-${s}.png` });
  await p.close();
}
await b.close();
console.log("\nPASS " + pass.length + " / FAIL " + fail.length);
pass.forEach((x) => console.log("  ok   " + x));
fail.forEach((x) => console.log("  FAIL " + x));
process.exit(fail.length ? 1 : 0);
