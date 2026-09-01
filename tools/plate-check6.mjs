import { chromium } from "playwright";
const P = ["alocasia","dieffenbachia","dracunculus","helicodiceros","homalomena","schismatoglottis"];
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1300, height: 900 } });
for (const g of P) {
  const pg = await ctx.newPage();
  try {
    await pg.goto("https://www.aroidpedia.com/" + g + "-reproduction", { waitUntil: "domcontentloaded", timeout: 60000 });
    await pg.waitForTimeout(4000);
    await pg.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=800){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,70));} });
    await pg.waitForTimeout(2000);
    const r = await pg.evaluate(() => {
      const f = document.getElementById("apxf-fig");
      const i = f && f.querySelector("img");
      return { mount: !!f, painted: !!(i && i.complete && i.naturalWidth > 0),
               cap: f ? (f.querySelector(".apxf-cap")||{}).textContent : null };
    });
    console.log((g + "                ").slice(0,17) + (r.mount ? (r.painted ? "PLATE LIVE   " : "mount, no img") : "no plate     ") + (r.cap ? "  " + r.cap.slice(0,44) : ""));
  } catch(e) { console.log(g + "  ERROR"); }
  await pg.close();
}
await b.close();
