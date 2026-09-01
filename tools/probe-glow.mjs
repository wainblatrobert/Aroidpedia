/* Sample rendered PIXELS: a single-layer country vs a known overlap.
   If the group fix works they must be the same colour. */
import { chromium } from "playwright";
import fs from "node:fs";
const js = fs.readFileSync("C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js","utf8");
const hd = fs.readFileSync("C:/Users/nli0490/Claude/Aroidpedia/docs/shapes-hd.json","utf8");
const b=await chromium.launch({channel:"chrome",headless:true});
const ctx=await b.newContext({viewport:{width:1440,height:900}});
await ctx.route("**/footer.js*",r=>r.fulfill({status:200,contentType:"application/javascript",body:js}));
await ctx.route("**/shapes-hd.json*",r=>r.fulfill({status:200,contentType:"application/json",body:hd}));
const p=await ctx.newPage();
await p.goto("https://www.aroidpedia.com/journal/alocasia-ramosii",{waitUntil:"networkidle",timeout:60000});
await p.waitForSelector(".apsc-map svg",{timeout:30000});await p.waitForTimeout(3000);
await p.locator(".apsc-map__zoomui .apsc-map__zoom").first().click();  /* world */
await p.waitForTimeout(700);
const r = await p.evaluate(()=>{
  const s=document.querySelector(".apsc-map svg");
  const names=[...s.querySelectorAll("path")].map(x=>{const t=x.querySelector("title");return t&&t.textContent}).filter(Boolean);
  return {
    newGuinea: names.includes("New Guinea"),
    png: names.includes("Papua New Guinea"),
    korea: names.includes("Korea"),
    borneo: names.includes("Borneo"),
    baseInGroup: s.querySelectorAll(".apsc-baselayer path").length,
    baseOutside: [...s.children].filter(n=>n.tagName==="path" && /apsc-base/.test(n.getAttribute("class")||"")).length,
    total: names.length,
  };
});
console.log(JSON.stringify(r,null,1));
await p.locator(".apsc-map").first().screenshot({path:"C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/5af356c8-a625-47c2-93cb-c3a053fc9fe6/scratchpad/v97-world.png"});
await b.close();
