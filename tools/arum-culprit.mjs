import fs from 'node:fs'; import http from 'node:http'; import { chromium } from 'playwright';
const G='G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/GENERA PAGES/';
const files={arum:G+'Arum/GENUS ARUM INTRO 8.30.26 v1.txt',amorph:G+'Amorphophallus/GENUS AMORPHOPHALLUS INTRO 8.16.26 v6.txt'};
const which=process.argv[2]||'arum';
const B=fs.readFileSync(files[which],'utf8');
const S=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>*{box-sizing:border-box}html{font-size:13px}body{margin:0}.fluid-engine{overflow-x:clip;display:grid;max-width:1200px;margin:0 auto}.fe-block{grid-area:1/1/2/2;width:100%}
.ap-cols{grid-template-columns:minmax(0,1fr) !important}</style></head><body>
<div class="page-section"><div class="fluid-engine"><div class="fe-block">${B}</div></div></div></body></html>`;
const srv=http.createServer((_,r)=>{r.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});r.end(S)});
await new Promise(r=>srv.listen(4605,r));
const br=await chromium.launch({channel:'chrome',args:['--disable-gpu']});
const ctx=await br.newContext({viewport:{width:280,height:800}}); const p=await ctx.newPage();
await p.goto('http://127.0.0.1:4605/',{waitUntil:'networkidle'}); await p.waitForTimeout(1800);
console.log(which, JSON.stringify(await p.evaluate(()=>{
  const out=[];
  document.querySelectorAll('.ap-cols *').forEach(n=>{
    const r=n.getBoundingClientRect();
    if(r.width<=0) return;
    if(n.scrollWidth - Math.ceil(r.width) > 1){
      const childOver=[...n.children].some(c=>c.scrollWidth - Math.ceil(c.getBoundingClientRect().width) > 1);
      if(!childOver) out.push({tag:n.tagName.toLowerCase(),cls:String(n.className||'(bare)'),w:Math.round(r.width),sw:n.scrollWidth,txt:(n.textContent||'').trim().slice(0,44)});
    }
  });
  return out.slice(0,10);
},null),null,1));
await br.close(); srv.close();
