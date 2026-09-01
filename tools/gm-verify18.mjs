/* usage: node gm-verify18.mjs local|live — label clamp on both genera */
import { chromium } from 'playwright';
import fs from 'fs';
const MODE = process.argv[2] || 'local';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
for (const g of ['alocasia', 'amorphophallus']) {
  const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
  if (MODE === 'local') {
    const JS = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js', 'utf8');
    await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' } }));
  }
  await p.goto('https://www.aroidpedia.com/' + g, { waitUntil: 'networkidle', timeout: 120000 });
  await p.waitForTimeout(12000);
  console.log(MODE, g, await p.evaluate(() => {
    const svg = document.querySelector('.apgm svg');
    const stamp = document.querySelector('.apgm').getAttribute('data-apgm-version');
    const t = svg.querySelector('.apgm-maplabel');
    const r = t ? t.getBoundingClientRect() : null;
    return 'stamp=' + stamp + ' fontSize=' + (t ? t.getAttribute('font-size') : '?') +
      ' labelPx=' + (r ? Math.round(r.height) : '?');
  }));
  if (g === 'amorphophallus') {
    const svgH = await p.$('.apgm svg');
    await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
    await svgH.screenshot({ path: SP + 'v33-amorph-' + MODE + '.png', animations: 'disabled' });
  }
  await p.close();
}
console.log('done');
await b.close();
