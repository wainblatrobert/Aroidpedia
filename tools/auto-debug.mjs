import fs from 'node:fs'; import http from 'node:http'; import { chromium } from 'playwright';
const HERO = fs.readFileSync('G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/GENERA PAGES/GENUS HERO 8.31.26 v23.txt','utf8');
const html = `<!doctype html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box}html{font-size:13px}body{margin:0;background:#0B120D}
.fluid-engine{display:grid;max-width:1200px;margin:0 auto}.fe-block{grid-area:1/1/2/2;width:100%}</style></head><body>
<section data-section-id="hero"><div class="fluid-engine"><div class="fe-block">${HERO}</div></div></section>
<section data-section-id="s0"><div class="ax-index" data-mode="species"><h2 class="ax-heading">Species &amp; Cultivars</h2></div></section>
</body></html>`;
const srv=http.createServer((_,r)=>{r.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});r.end(html)});
await new Promise(r=>srv.listen(4640,r));
const br=await chromium.launch({channel:'chrome',args:['--disable-gpu']});
const p=await (await br.newContext({viewport:{width:1440,height:900}})).newPage();
p.on('console',m=>console.log('  console:', m.type(), m.text().slice(0,160)));
p.on('pageerror',e=>console.log('  PAGEERROR:', e.message));
await p.goto('http://127.0.0.1:4640/',{waitUntil:'load'});
await p.waitForTimeout(2000);
console.log(JSON.stringify(await p.evaluate(()=>{
  const c=document.querySelector('.ap-genus-counter');
  return {
    counters: document.querySelectorAll('.ap-genus-counter').length,
    dataStatsRaw: JSON.stringify(c.getAttribute('data-stats')),
    autoAttr: c.getAttribute('data-stats-auto'),
    keys:[...c.querySelectorAll('.ap-gc-num[data-key]')].map(n=>n.dataset.key),
    axIndexTotal: document.querySelectorAll('.ax-index').length,
    hybridsBlock: document.querySelectorAll('.ax-index[data-mode="hybrids"]').length,
    speciesBlock: document.querySelectorAll('.ax-index[data-mode="species"]').length,
  };
}),null,1));
await br.close(); srv.close();
