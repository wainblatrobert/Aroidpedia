import fs from 'node:fs'; import http from 'node:http'; import { chromium } from 'playwright';
const D='G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/GENERA PAGES/Arum/';
const INTRO=fs.readFileSync(D+'GENUS ARUM INTRO 8.31.26 v2.txt','utf8');
let EXTRA='';
const mk=()=>`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>*{box-sizing:border-box}html{font-size:13px}body{margin:0;background:#0B120D}
.fluid-engine{overflow-x:clip;display:grid;max-width:1200px;margin:0 auto}.fe-block{grid-area:1/1/2/2;width:100%}</style>
</head><body><div class="page-section"><div class="fluid-engine"><div class="fe-block">${INTRO}</div></div></div><style>${EXTRA}</style></body></html>`;
const srv=http.createServer((_,r)=>{r.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});r.end(mk())});
await new Promise(r=>srv.listen(4620,r));
const br=await chromium.launch({channel:'chrome',args:['--disable-gpu']});
async function m(label,widths=[1440,1024,768,375]){
  const row=[];
  for(const w of widths){
    const ctx=await br.newContext({viewport:{width:w,height:900}}); const p=await ctx.newPage();
    await p.goto('http://127.0.0.1:4620/',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1200);
    const r=await p.evaluate(()=>{
      const b=[...document.querySelectorAll('.ap-syn')][1];
      b.querySelector('.ap-syn-toggle').click();
      const list=b.querySelector('.ap-syn-list--names');
      const items=[...list.querySelectorAll('.ap-syn-item')];
      const tops=[...new Set(items.map(n=>Math.round(n.getBoundingClientRect().top)))];
      const firstRow=items.filter(n=>Math.round(n.getBoundingClientRect().top)===tops[0]).length;
      const over=items.filter(n=>n.scrollWidth>Math.ceil(n.getBoundingClientRect().width)+1).length;
      return {listW:Math.round(list.getBoundingClientRect().width), cols:firstRow, rows:tops.length,
              listH:Math.round(list.getBoundingClientRect().height), clipped:over,
              docSW:document.documentElement.scrollWidth, clientW:document.documentElement.clientWidth};
    });
    row.push(w+': '+JSON.stringify(r)); await ctx.close();
  }
  console.log(label); row.forEach(x=>console.log('   '+x));
}
await m('minmax(148px,1fr)  [current]');
for(const v of ['118px','126px','134px']){
  EXTRA=`.ap-syn.is-open .ap-syn-list--names{grid-template-columns:repeat(auto-fill,minmax(${v},1fr)) !important}`;
  await m('minmax('+v+',1fr)');
}
await br.close(); srv.close();
