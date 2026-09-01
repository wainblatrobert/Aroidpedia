import fs from 'node:fs'; import http from 'node:http'; import { chromium } from 'playwright';
const B = fs.readFileSync('G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/GENERA PAGES/Arum/GENUS ARUM INTRO 8.30.26 v1.txt','utf8');
const S = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>*{box-sizing:border-box}html{font-size:13px}body{margin:0}.fluid-engine{overflow-x:clip;display:grid;max-width:1200px;margin:0 auto}.fe-block{grid-area:1/1/2/2;width:100%}</style>
</head><body><div class="page-section"><div class="fluid-engine"><div class="fe-block">${B}</div></div></div></body></html>`;
const srv = http.createServer((_,r)=>{r.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});r.end(S)});
await new Promise(r=>srv.listen(4603,r));
const br = await chromium.launch({channel:'chrome',args:['--disable-gpu']});
const ctx = await br.newContext({viewport:{width:280,height:800}}); const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4603/',{waitUntil:'networkidle'}); await p.waitForTimeout(2200);
console.log(JSON.stringify(await p.evaluate(()=>{
  const g=document.querySelector('.ap-genus');
  const probe=(sel)=>{const n=document.querySelector(sel);if(!n)return null;const r=n.getBoundingClientRect();return {w:Math.round(r.width*10)/10,sw:n.scrollWidth,cs:getComputedStyle(n).minWidth};};
  const before=g.getBoundingClientRect().width;
  const clim=document.querySelector('.ap-clim'); const kept=clim.innerHTML; clim.innerHTML='';
  const withoutClim=g.getBoundingClientRect().width; clim.innerHTML=kept;
  const svgs=[...document.querySelectorAll('#ap-genus-clim svg')].map(s=>{const r=s.getBoundingClientRect();return Math.round(r.width*10)/10;});
  return {before:Math.round(before*10)/10, withoutClim:Math.round(withoutClim*10)/10, svgWidths:svgs,
          climCols:probe('.ap-clim-cols'), clim:probe('.ap-clim'), eco:probe('.ap-eco'), cols:probe('.ap-cols')};
}),null,1));
await br.close(); srv.close();
