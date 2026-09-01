import fs from 'node:fs'; import http from 'node:http'; import { chromium } from 'playwright';
const B = fs.readFileSync('G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/GENERA PAGES/Arum/GENUS ARUM INTRO 8.30.26 v1.txt','utf8');
const mk = extra => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>*{box-sizing:border-box}html{font-size:13px}body{margin:0}.fluid-engine{overflow-x:clip;display:grid;max-width:1200px;margin:0 auto}.fe-block{grid-area:1/1/2/2;width:100%}</style>
</head><body><div class="page-section"><div class="fluid-engine"><div class="fe-block">${B}</div></div></div><style>${extra}</style></body></html>`;
let EXTRA = '';
const srv = http.createServer((_,r)=>{r.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});r.end(mk(EXTRA))});
await new Promise(r=>srv.listen(4604,r));
const br = await chromium.launch({channel:'chrome',args:['--disable-gpu']});
async function measure(label){
  const ctx = await br.newContext({viewport:{width:280,height:800}}); const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4604/',{waitUntil:'networkidle'}); await p.waitForTimeout(1800);
  const r = await p.evaluate(()=>{
    const g=document.querySelector('.ap-genus');
    const items=[...document.querySelectorAll('.ap-cols > *')].map(n=>({cls:n.className||'(bare)',w:Math.round(n.getBoundingClientRect().width*10)/10,sw:n.scrollWidth}));
    return {apGenus:Math.round(g.getBoundingClientRect().width*10)/10, docSW:document.documentElement.scrollWidth, items};
  });
  console.log(label, JSON.stringify(r)); await ctx.close();
}
await measure('baseline          ');
EXTRA = '.ap-cols{grid-template-columns:minmax(0,1fr) !important}'; await measure('minmax(0,1fr)     ');
EXTRA = '@media(max-width:900px){.ap-cols{grid-template-columns:minmax(0,1fr) !important}} .ap-eco-cols,.ap-clim-cols{grid-template-columns:minmax(0,1fr) !important}'; await measure('all three grids   ');
EXTRA = '.ap-genus,.ap-genus *{min-width:0 !important}'; await measure('min-width:0 on all');
await br.close(); srv.close();
