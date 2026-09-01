import { chromium } from "playwright";
import fs from "node:fs";
const js = fs.readFileSync("C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js", "utf8");
const b = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.route("**/footer.js*", (r) =>
  r.fulfill({ status: 200, contentType: "application/javascript", body: js }));
const p = await ctx.newPage();
await p.goto("https://www.aroidpedia.com/journal/amorphophallus-aberrans",
             { waitUntil: "networkidle", timeout: 60000 });
await p.waitForSelector("[data-apsc-mount]", { timeout: 30000 });
await p.waitForTimeout(3500);

console.log(JSON.stringify(await p.evaluate(() => {
  const out = { mounts: document.querySelectorAll("[data-apsc-mount]").length, svgs: [] };
  document.querySelectorAll("svg").forEach((s, i) => {
    const paths = s.querySelectorAll("path");
    const titled = [...paths].filter((x) => x.querySelector("title"));
    out.svgs.push({
      i,
      cls: s.getAttribute("class"),
      parentCls: s.parentElement ? s.parentElement.getAttribute("class") : null,
      viewBox: s.getAttribute("viewBox"),
      paths: paths.length,
      titled: titled.length,
      firstTitles: titled.slice(0, 4).map((x) => x.querySelector("title").textContent),
      hasZoomUI: !!(s.parentElement && s.parentElement.querySelector(".apsc-map__zoomui")),
    });
  });
  const ui = document.querySelector(".apsc-map__zoomui");
  out.zoomUIParent = ui ? ui.parentElement.getAttribute("class") : null;
  return out;
}, null), null, 1));
await b.close();
