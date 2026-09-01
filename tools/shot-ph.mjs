import { chromium } from "playwright";
import fs from "node:fs";
const js=fs.readFileSync("C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js","utf8");
const hd=fs.readFileSync("C:/Users/nli0490/Claude/Aroidpedia/docs/shapes-hd.json","utf8");
const OUT="C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/5af356c8-a625-47c2-93cb-c3a053fc9fe6/scratchpad";
const b=await chromium.launch({channel:"chrome",headless:true});
const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2});
await ctx.route("**/footer.js*",r=>r.fulfill({status:200,contentType:"application/javascript",body:js}));
await ctx.route("**/shapes-hd.json*",r=>r.fulfill({status:200,contentType:"application/json",body:hd}));
const p=await ctx.newPage();
await p.goto("https://www.aroidpedia.com/journal/alocasia-ramosii",{waitUntil:"networkidle",timeout:60000});
await p.waitForSelector(".apsc-map svg",{timeout:30000});await p.waitForTimeout(3000);
// zoom in twice so the province coastlines are large
for (let i=0;i<3;i++){ await p.click(".apsc-map__zoomui button[aria-label='Zoom in']"); await p.waitForTimeout(220); }
await p.locator(".apsc-map").first().screenshot({path:OUT+"/v4-ph-zoom.png"});
console.log("saved");
await b.close();
