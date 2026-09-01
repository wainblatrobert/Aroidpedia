/* Render each new plate component and check the labels actually work.

Structural validity says nothing about whether a label overflows its side,
collides with its neighbour, or runs off the 780x600 overlay. Only a render
answers that. */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import http from "http";

const ROOT = "G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/AROID REPRODUCTION";
const OUT = "C:/Users/nli0490/Claude/aroidpedia-climate/_plate_shots";
fs.mkdirSync(OUT, { recursive: true });

const guides = fs.readdirSync(ROOT).filter(d =>
  fs.existsSync(path.join(ROOT, d)) && fs.statSync(path.join(ROOT, d)).isDirectory());
const targets = [];
for (const g of guides) {
  for (const f of fs.readdirSync(path.join(ROOT, g))) {
    if (f.includes("02 PART I") && f.includes("8.28.26") && f.endsWith(".txt"))
      targets.push([g, path.join(ROOT, g, f)]);
  }
}
console.log("blocks to render: " + targets.length);

let current = "";
const srv = http.createServer((rq, rs) => {
  rs.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  rs.end("<!doctype html><meta charset=utf-8>" +
    "<body style='background:#12150f;margin:0;padding:24px;font-family:Helvetica,Arial'>" +
    current);
}).listen(8823);

const b = await chromium.launch({ channel: "chrome" });
const pg = await b.newPage({ viewport: { width: 1200, height: 1200 } });

for (const [guide, file] of targets) {
  const raw = fs.readFileSync(file, "utf8").replace(/<!--[\s\S]*?-->/g, "");
  current = raw;
  const errs = [];
  pg.removeAllListeners("pageerror");
  pg.on("pageerror", e => errs.push(String(e).slice(0, 70)));
  await pg.goto("http://localhost:8823/?x=" + Date.now(), { waitUntil: "networkidle" });
  await pg.waitForTimeout(2200);

  const r = await pg.evaluate(() => {
    const fig = document.getElementById("apxf-fig");
    if (!fig) return { err: "no mount" };
    const img = fig.querySelector("img");
    const texts = [...fig.querySelectorAll("svg.apxf-notes text")];
    const cap = fig.querySelector(".apxf-cap");
    const legend = fig.querySelectorAll(".apxf-legend li");
    // does any label run outside the 780-wide overlay?
    const over = texts.filter(t => {
      const bb = t.getBBox();
      return bb.x < 0 || bb.x + bb.width > 780;
    }).map(t => t.textContent);
    // vertical collisions between adjacent labels on the same side
    const rows = texts.map(t => {
      const bb = t.getBBox();
      return { s: t.textContent, x: Math.round(bb.x), y: Math.round(bb.y),
               w: Math.round(bb.width), h: Math.round(bb.height) };
    });
    const clash = [];
    for (let i = 0; i < rows.length; i++)
      for (let j = i + 1; j < rows.length; j++) {
        const a = rows[i], c = rows[j];
        const sameSide = (a.x < 390) === (c.x < 390);
        if (sameSide && Math.abs(a.y - c.y) < 9 &&
            a.x < c.x + c.w && c.x < a.x + a.w) clash.push(a.s + " / " + c.s);
      }
    return {
      imgOk: img ? (img.complete && img.naturalWidth > 0) : false,
      nat: img ? img.naturalWidth + "x" + img.naturalHeight : "-",
      texts: texts.length, legend: legend.length,
      cap: cap ? cap.textContent.slice(0, 46) : "(none)",
      over, clash
    };
  });

  console.log("\n=== " + guide);
  if (r.err) { console.log("   ERROR " + r.err); continue; }
  console.log("   image painted %s (%s) | svg labels %d | legend %d",
              r.imgOk ? "yes" : "NO", r.nat, r.texts, r.legend);
  console.log("   caption: " + r.cap);
  console.log("   overflow: " + (r.over.length ? r.over.join(" | ") : "none"));
  console.log("   collisions: " + (r.clash.length ? r.clash.join(" | ") : "none"));
  if (errs.length) console.log("   page errors: " + errs.slice(0, 2).join(" | "));

  const fig = await pg.$("#apxf-fig");
  if (fig) await fig.screenshot({ path: path.join(OUT, guide.split(" ")[0] + ".png") });
}
await b.close();
srv.close();
console.log("\nshots in " + OUT);
