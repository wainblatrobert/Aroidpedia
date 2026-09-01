import { chromium } from "playwright";
const b = await chromium.launch({ channel:"chrome", headless:true });
const ctx = await b.newContext({ viewport:{width:1440,height:900} });
const p = await ctx.newPage();
for (const [n,u] of [["micholitziana","https://www.aroidpedia.com/journal/alocasia-micholitziana"],
                     ["puber","https://www.aroidpedia.com/journal/alocasia-puber"]]) {
  await p.goto(u,{waitUntil:"networkidle",timeout:60000});
  await p.waitForSelector(".apsc-map svg",{timeout:30000});
  await p.waitForTimeout(3000);
  const r = await p.evaluate(()=>({
    v: document.querySelector("[data-apsc-mount]").getAttribute("data-apsc-version"),
    vb: document.querySelector(".apsc-map svg").getAttribute("viewBox")
  }));
  console.log(`  ${n}: ${r.v}  frame width ${parseFloat(r.vb.split(/\s+/)[2]).toFixed(2)}°`);
}
await b.close();
