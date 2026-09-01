import { chromium } from 'playwright';
import fs from 'fs';
const MODE = process.argv[2] || 'local';
const JS = MODE==='local' ? fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js','utf8') : null;
const b = await chromium.launch({ channel: 'chrome', headless: true });
for (const g of ['arum','alocasia','amorphophallus']) {
  const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
  if (JS) await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType:'application/javascript', headers:{'access-control-allow-origin':'*'} }));
  await p.goto('https://www.aroidpedia.com/'+g, { waitUntil:'networkidle', timeout:120000 });
  await p.waitForTimeout(13000);
  const stat = () => p.evaluate(() => {
    const svg = document.querySelector('.apgm svg');
    const sig = [...svg.querySelectorAll('.apgm-zone')].map(el=>{
      const cs = getComputedStyle(el);
      return (el.getAttribute('data-zone')||'') + ':' + (+parseFloat(cs.fillOpacity).toFixed(2)) + ':' + cs.fill;
    }).join('|');
    return { cov: svg.querySelectorAll('.apgm-zone.apgm-cov').length, sig };
  });
  const a = await stat();
  await p.evaluate(() => { [...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view==='range').click(); });
  await p.waitForTimeout(700);
  await p.evaluate(() => { [...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view==='countries').click(); });
  await p.waitForTimeout(900);
  const c = await stat();
  console.log(MODE, g.padEnd(15), 'covAtLoad=' + a.cov, 'covAfter=' + c.cov,
    '| first paint identical to settled:', a.sig === c.sig);
  await p.close();
}
await b.close();
