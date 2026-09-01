import fs from 'node:fs'; import http from 'node:http'; import { chromium } from 'playwright';
const B=fs.readFileSync('G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/GENERA PAGES/Arum/GENUS ARUM INTRO 8.30.26 v1.txt','utf8');
let EXTRA='';
const mk=()=>`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>*{box-sizing:border-box}html{font-size:13px}body{margin:0}.fluid-engine{overflow-x:clip;display:grid;max-width:1200px;margin:0 auto}.fe-block{grid-area:1/1/2/2;width:100%}</style>
</head><body><div class="page-section"><div class="fluid-engine"><div class="fe-block">${B}</div></div></div><style>${EXTRA}</style></body></html>`;
const srv=http.createServer((_,r)=>{r.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});r.end(mk())});
await new Promise(r=>srv.listen(4606,r));
const br=await chromium.launch({channel:'chrome',args:['--disable-gpu']});
async function m(label){
  const row={label};
  for(const w of [280,320,375,1440]){
    const ctx=await br.newContext({viewport:{width:w,height:800}}); const p=await ctx.newPage();
    await p.goto('http://127.0.0.1:4606/',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(900);
    row['w'+w]=await p.evaluate(()=>{
      const g=document.querySelector('.ap-genus');
      const h=[...document.querySelectorAll('.ap-h2')].map(n=>({fs:getComputedStyle(n).fontSize,over:n.scrollWidth-Math.ceil(n.getBoundingClientRect().width)}));
      return {card:Math.round(g.getBoundingClientRect().width*10)/10, docSW:document.documentElement.scrollWidth, h2fs:h[0].fs, maxOver:Math.max(...h.map(x=>x.over))};
    });
    await ctx.close();
  }
  console.log(JSON.stringify(row));
}
await m('baseline flat 42px');
for(const c of ['clamp(30px, 11vw, 42px)','clamp(30px, 11.2vw, 42px)','clamp(30px, 5vw, 42px)']){
  EXTRA=`.ap-h2{font-size:${c} !important}`; await m(c);
}
await br.close(); srv.close();
