import { chromium } from "playwright";
import fs from "node:fs";
const js = fs.readFileSync("C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js","utf8");
const hd = fs.readFileSync("C:/Users/nli0490/Claude/Aroidpedia/docs/shapes-hd.json","utf8");
const b=await chromium.launch({channel:"chrome",headless:true});
const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2});
await ctx.route("**/footer.js*",r=>r.fulfill({status:200,contentType:"application/javascript",body:js}));
await ctx.route("**/shapes-hd.json*",r=>r.fulfill({status:200,contentType:"application/json",body:hd}));
const p=await ctx.newPage();
await p.goto("https://www.aroidpedia.com/journal/alocasia-ramosii",{waitUntil:"networkidle",timeout:60000});
await p.waitForSelector(".apsc-map svg",{timeout:30000});await p.waitForTimeout(3000);
await p.locator(".apsc-map__zoomui .apsc-map__zoom").first().click();
await p.waitForTimeout(700);
/* sample the painted colour at the centroid of chosen shapes */
const out = await p.evaluate(()=>{
  const svg=document.querySelector(".apsc-map svg");
  const r=svg.getBoundingClientRect();
  const pick={};
  svg.querySelectorAll("path").forEach(x=>{
    const t=x.querySelector("title"); if(!t) return;
    const n=t.textContent;
    if(["Mongolia","Borneo","Kazakhstan","Sudan","Egypt","Italy","Canada"].indexOf(n)<0) return;
    const bb=x.getBBox();
    pick[n]={cx:bb.x+bb.width/2, cy:bb.y+bb.height/2};
  });
  const vb=svg.getAttribute("viewBox").split(/\s+/).map(Number);
  const sx=r.width/vb[2], sy=r.height/vb[3];
  const px={};
  Object.keys(pick).forEach(n=>{
    px[n]={x:Math.round(r.left+(pick[n].cx-vb[0])*sx), y:Math.round(r.top+(pick[n].cy-vb[1])*sy)};
  });
  return px;
});
console.log(JSON.stringify(out));
await p.screenshot({path:"C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/5af356c8-a625-47c2-93cb-c3a053fc9fe6/scratchpad/v97-full.png"});
fs.writeFileSync("C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/5af356c8-a625-47c2-93cb-c3a053fc9fe6/scratchpad/pixels.json",JSON.stringify(out));
await b.close();
