/* Why is there a white band on the C/D photo but not the A/B one?
   Both files are byte-identical to local and both are 1200x1600. */
import { chromium } from "playwright";

const b = await chromium.launch({ channel: "chrome" });
const pg = await b.newPage({ viewport: { width: 1280, height: 1000 } });
await pg.goto("https://www.aroidpedia.com/alocasia-morphology",
              { waitUntil: "domcontentloaded", timeout: 60000 });
await pg.waitForTimeout(6000);

/* scroll it in and WAIT FOR DECODE - the images are loading=lazy and
   measuring before that gives 0x0 naturals and a 2x2 box */
await pg.evaluate(async () => {
  const el = document.querySelector('.apol-photos--pair');
  if (el) el.scrollIntoView({block:'center'});
  await new Promise(r => setTimeout(r, 2500));
  const imgs = [...document.querySelectorAll('.apol-photos--pair img')];
  await Promise.all(imgs.map(i => i.complete ? Promise.resolve() : i.decode().catch(()=>{})));
  await new Promise(r => setTimeout(r, 1200));
});

const out = await pg.evaluate(() => {
  const pair = document.querySelector(".apol-photos--pair");
  if (!pair) return { err: "no .apol-photos--pair on the page" };
  const ps = getComputedStyle(pair);
  const figs = [...pair.querySelectorAll(".apol-photo")].map((f, i) => {
    const img = f.querySelector("img");
    const fs = getComputedStyle(f), is = getComputedStyle(img);
    const fr = f.getBoundingClientRect(), ir = img.getBoundingClientRect();
    const cap = f.querySelector("figcaption");
    return {
      i,
      src: img.getAttribute("src").split("/").pop(),
      natural: img.naturalWidth + "x" + img.naturalHeight,
      figBox: [Math.round(fr.width), Math.round(fr.height)],
      imgBox: [Math.round(ir.width), Math.round(ir.height)],
      imgTopInsideFig: Math.round(ir.top - fr.top),
      imgLeftInsideFig: Math.round(ir.left - fr.left),
      figBg: fs.backgroundColor,
      imgBg: is.backgroundColor,
      figHeightRule: fs.height,
      imgObjectFit: is.objectFit,
      imgHeightRule: is.height,
      imgAspect: is.aspectRatio,
      capLines: cap ? Math.round(cap.getBoundingClientRect().height) : 0,
      figDisplay: fs.display, figAlign: fs.alignItems
    };
  });
  return {
    pairDisplay: ps.display, pairAlign: ps.alignItems, pairGap: ps.gap,
    pairBg: ps.backgroundColor, figs
  };
});

console.log(JSON.stringify(out, null, 1));

const pair = await pg.$(".apol-photos--pair");
if (pair) { await pair.scrollIntoViewIfNeeded(); await pg.waitForTimeout(600);
            await pair.screenshot({ path: "photo-pair.png" }); }
await b.close();
