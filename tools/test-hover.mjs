/* Hover must reach the SUBUNITS inside a washed container.
   Drives a real pointer over several points inside Papua New Guinea on
   alocasia-brancifolia and reads what the card's own readout says. */
import { chromium } from "playwright";
import fs from "node:fs";
const js = fs.readFileSync("C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js", "utf8");
const hd = fs.readFileSync("C:/Users/nli0490/Claude/Aroidpedia/docs/shapes-hd.json", "utf8");
const pass = [], fail = [];
const ok = (c, m) => (c ? pass : fail).push(m);

const b = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.route("**/footer.js*", (r) => r.fulfill({ status: 200, contentType: "application/javascript", body: js }));
await ctx.route("**/shapes-hd.json*", (r) => r.fulfill({ status: 200, contentType: "application/json", body: hd }));
const p = await ctx.newPage();
await p.goto("https://www.aroidpedia.com/journal/alocasia-brancifolia", { waitUntil: "networkidle", timeout: 60000 });
await p.waitForSelector(".apsc-map svg", { timeout: 30000 });
await p.waitForTimeout(3500);

/* screen positions of a few PNG provinces, from their own bboxes */
const targets = await p.evaluate(() => {
  const svg = document.querySelector(".apsc-map svg");
  const r = svg.getBoundingClientRect();
  const vb = svg.getAttribute("viewBox").split(/\s+/).map(Number);
  const want = ["Morobe", "East Sepik", "Madang", "Gulf Province", "Western Highlands"];
  const out = [];
  svg.querySelectorAll("path").forEach((x) => {
    const t = x.querySelector("title");
    if (!t || want.indexOf(t.textContent) < 0) return;
    const bb = x.getBBox();
    out.push({
      name: t.textContent,
      x: r.left + (bb.x + bb.width / 2 - vb[0]) * (r.width / vb[2]),
      y: r.top + (bb.y + bb.height / 2 - vb[1]) * (r.height / vb[3]),
      cls: x.getAttribute("class"),
    });
  });
  return out;
});
ok(targets.length >= 3, `found ${targets.length} PNG provinces drawn: ${targets.map(t=>t.name).join(", ")}`);

for (const t of targets) {
  await p.mouse.move(t.x, t.y);
  await p.waitForTimeout(160);
  const read = await p.evaluate(() => {
    const r = document.querySelector(".apsc-map__hover");
    return r && r.getAttribute("data-on") ? r.textContent.trim() : "(nothing)";
  });
  const hit = read.indexOf(t.name) === 0;
  ok(hit, `hover over ${t.name} -> "${read}"`);
}
await b.close();
console.log("\nPASS " + pass.length + " / FAIL " + fail.length);
pass.forEach((x) => console.log("  ok   " + x));
fail.forEach((x) => console.log("  FAIL " + x));
process.exit(fail.length ? 1 : 0);
