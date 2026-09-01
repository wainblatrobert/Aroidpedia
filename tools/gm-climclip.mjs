import { chromium } from 'playwright';
import fs from 'fs';
const R = 'C:/Users/nli0490/Claude/Aroidpedia/docs/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.route('**/footer.js*', r => r.fulfill({ body: fs.readFileSync(R+'footer.js','utf8'), contentType:'application/javascript', headers:{'access-control-allow-origin':'*'} }));
await p.route('**/climate-zones.json*', r => r.fulfill({ body: fs.readFileSync(R+'climate-zones.json','utf8'), contentType:'application/json', headers:{'access-control-allow-origin':'*'} }));
await p.route('**/climate-zones.png*', r => r.fulfill({ body: fs.readFileSync(R+'climate-zones.png'), contentType:'image/png', headers:{'access-control-allow-origin':'*'} }));
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil:'networkidle', timeout:120000 });
await p.waitForTimeout(13000);
await p.evaluate(() => { [...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view==='climate').click(); });
await p.waitForTimeout(3500);
console.log(await p.evaluate(() => {
  const svg=document.querySelector('.apgm svg');
  const cp=svg.querySelector('clipPath[id^=apgm-climclip]');
  const q=t=>{ const e=svg.querySelector('[data-zone="'+t+'"]'); return t+'='+(e? (e.classList.contains('apgm-cg')?'GHOST':'zone') : 'none'); };
  // is the whole-Australia outline inside the clip? compare clip child count to zone count
  return 'clip paths=' + cp.children.length +
    '\n  ' + ['Australia','China','Queensland','New South Wales','Western Australia'].map(q).join('  ') +
    '\n  lit ghosts now: ' + [...svg.querySelectorAll('.apgm-cg.apgm-famrow')].map(e=>e.getAttribute('data-zone')).join(', ');
}));
await b.close();
