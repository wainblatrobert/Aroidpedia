import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
const pg = await b.newPage({ viewport: { width: 1180, height: 1200 } });
pg.setDefaultTimeout(25000);
await pg.goto("https://www.aroidpedia.com/alocasia-morphology", { waitUntil: "commit", timeout: 40000 });
await pg.waitForTimeout(9000);
await pg.evaluate(() => {
  const el = document.querySelector(".apol-photos--pair");
  if (el) el.scrollIntoView({ block: "center" });
});
await pg.waitForTimeout(4000);
const info = await pg.evaluate(() => {
  const figs = [...document.querySelectorAll(".apol-photos--pair .apol-photo")];
  return figs.map(f => {
    const i = f.querySelector("img"), r = i.getBoundingClientRect();
    const cs = getComputedStyle(i);
    return { src: i.src.split("/").pop(), nat: i.naturalWidth + "x" + i.naturalHeight,
             box: Math.round(r.width) + "x" + Math.round(r.height),
             border: cs.borderTopWidth + " " + cs.borderTopColor,
             bg: cs.backgroundColor, maxH: cs.maxHeight, complete: i.complete };
  });
});
console.log(JSON.stringify(info, null, 1));
const el = await pg.$(".apol-photos--pair");
if (el) await el.screenshot({ path: "pair-shot.png" });
await b.close();
