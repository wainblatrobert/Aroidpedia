import { chromium } from 'playwright';
import fs from 'fs';
const JS = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js','utf8');
const b = await chromium.launch({ channel: 'chrome', headless: true });
for (const g of ['arum','alocasia']) {
  const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
  await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType:'application/javascript', headers:{'access-control-allow-origin':'*'} }));
  await p.goto('https://www.aroidpedia.com/'+g, { waitUntil:'networkidle', timeout:120000 });
  await p.waitForTimeout(13000);
  const snap = () => p.evaluate(() => { const o={};
    document.querySelectorAll('.apgm svg .apgm-zone').forEach(el=>{ const cs=getComputedStyle(el);
      o[(el.getAttribute('data-zone')||'?')+(el.classList.contains('apgm-cg')?'#g':'')] =
        (+parseFloat(cs.fillOpacity).toFixed(2))+' '+cs.fill; });
    return o; });
  const a = await snap();
  await p.evaluate(() => { [...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view==='range').click(); });
  await p.waitForTimeout(700);
  await p.evaluate(() => { [...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view==='countries').click(); });
  await p.waitForTimeout(900);
  const c = await snap();
  const diff = Object.keys({...a,...c}).filter(k=>a[k]!==c[k]);
  console.log('==', g, 'differing nodes:', diff.length);
  diff.slice(0,12).forEach(k=>console.log('   ', k.padEnd(28), 'load:', a[k], ' -> settled:', c[k]));
  await p.close();
}
await b.close();
