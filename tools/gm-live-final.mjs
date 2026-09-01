/* No interception - the real live page after the push. */
import { chromium } from 'playwright';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
console.log('live stamp:', await p.evaluate(() => {
  const m = document.querySelector('.apgm');
  return m ? m.getAttribute('data-apgm-version') : '(none)';
}));
await p.evaluate(() => {
  const z = Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => (x.dataset.view || '') === 'range');
  if (z) z.click();
});
await p.waitForTimeout(900);
console.log(await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  return ['Borneo','New Guinea','Andaman Islands','Nicobar'].map(t => {
    const n = svg.querySelector('[data-zone="' + t + '"]');
    return t + '=' + (n ? getComputedStyle(n).fillOpacity : '?');
  }).join('  ');
}));
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
await svgH.screenshot({ path: SP + 'live-v21-range.png', animations: 'disabled' });
console.log('done');
await b.close();
