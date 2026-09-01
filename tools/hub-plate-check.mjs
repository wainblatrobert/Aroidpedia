import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
const pg = await b.newPage({ viewport: { width: 1400, height: 1000 } });
await pg.goto("https://www.aroidpedia.com/aroid-reproduction", { waitUntil: "domcontentloaded", timeout: 60000 });
await pg.waitForTimeout(5000);
await pg.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=800){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,80));} window.scrollTo(0,0); });
await pg.waitForTimeout(2500);
const r = await pg.evaluate(() => {
  const imgs=[...document.querySelectorAll("img")].filter(i=>/plate-(bi|uni)sexual/.test(i.currentSrc||i.src||""));
  return imgs.map(i=>({src:(i.currentSrc||i.src).split("/").pop(), nat:i.naturalWidth+"x"+i.naturalHeight,
    box:Math.round(i.getBoundingClientRect().width)+"x"+Math.round(i.getBoundingClientRect().height), ok:i.complete&&i.naturalWidth>0}));
});
console.log("plates rendered on /aroid-reproduction:", r.length);
r.forEach(x=>console.log("   "+x.src+"  natural "+x.nat+"  box "+x.box+"  painted:"+x.ok));
await b.close();
