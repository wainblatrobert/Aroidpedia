import { chromium } from 'playwright';
import fs from 'fs';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const JS = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js', 'utf8');
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' } }));
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
console.log('stamp:', await p.evaluate(() => document.querySelector('.apgm').getAttribute('data-apgm-version')));
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded();
for (const v of ['countries','continents','range']) {
  await p.evaluate(vv => {
    const z = Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => (x.dataset.view||'') === vv);
    if (z) z.click();
  }, v);
  await p.waitForTimeout(800);
  console.log(v + ': ' + await p.evaluate(() => {
    const svg = document.querySelector('.apgm svg');
    const g = t => {
      const n = svg.querySelector('[data-zone="' + t + '"], .apgm-ghost[data-zone="' + t + '"]');
      if (!n) return t + '=?';
      const cs = getComputedStyle(n);
      return t + '=' + Math.round(parseFloat(cs.fillOpacity) * 100) / 100 + (n.classList.contains('apgm-famrow') ? ' FAM' : '') + (n.classList.contains('apgm-cov') ? ' COV' : '');
    };
    return ['Australia','Queensland','New South Wales','Indonesia','Malaysia','Borneo','Jawa','China South-Central'].map(g).join('  ');
  }));
  await p.waitForTimeout(200);
  await svgH.screenshot({ path: SP + 'v22-' + v + '.png', animations: 'disabled' });
}
console.log('label:', await p.evaluate(() => {
  const lbl = [...document.querySelectorAll('.apgm-maplabel')].find(t => t.textContent === 'Borneo');
  return lbl ? lbl.getAttribute('x') + ',' + lbl.getAttribute('y') : 'MISSING';
}));
console.log('done');
await b.close();
