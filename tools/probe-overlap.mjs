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
await p.waitForSelector(".apsc-map svg",{timeout:30000});await p.waitForTimeout(3500);
console.log(JSON.stringify(await p.evaluate(()=>{
  const s=document.querySelector(".apsc-map svg");
  const n=[...s.querySelectorAll("path")].map(x=>{const t=x.querySelector("title");return t&&{n:t.textContent,c:x.getAttribute("class")||""}}).filter(Boolean);
  const base=n.filter(x=>/apsc-base/.test(x.c)).map(x=>x.n);
  const want=["Indonesia","Borneo","Java","Sumatra","Sulawesi","Malaysia","Philippines",
              "Sarawak","Sabah","Kalimantan","Brunei","Peninsular Malaysia","New Guinea"];
  return {version:document.querySelector("[data-apsc-mount]").getAttribute("data-apsc-version"),
          totalBase:base.length,
          present:want.filter(w=>base.includes(w)),
          lit:n.filter(x=>/\bapsc-on\b/.test(x.c)).map(x=>x.n),
          ctx:n.filter(x=>/apsc-ctx/.test(x.c)).map(x=>x.n)};
}),null,1));
await b.close();
