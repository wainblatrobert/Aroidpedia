import { chromium } from 'playwright';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded();
for (const v of ['range','continents','regions','countries','subzones','subzones2','divisions']) {
  await p.evaluate(vv => {
    const z = Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => (x.dataset.view||'') === vv);
    if (z) z.click();
  }, v);
  await p.waitForTimeout(700);
  await svgH.screenshot({ path: SP + 'sweep-' + v + '.png', animations: 'disabled' });
}
/* probes: range strokes on CSC + Borneo, EHM status; regions fills; countries hover-India */
await p.evaluate(() => {
  const z = Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => (x.dataset.view||'') === 'range');
  z.click();
});
await p.waitForTimeout(700);
console.log('RANGE:', await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  return ['China South-Central','China Southeast','Hainan','Borneo','East Himalaya','India','Assam','Bhutan','Sikkim','Arunachal Pradesh'].map(t => {
    const n = svg.querySelector('[data-zone="' + t + '"]');
    if (!n) return t + '=?';
    const cs = getComputedStyle(n);
    return t + '{fo=' + Math.round(parseFloat(cs.fillOpacity)*100)/100 + ' so=' + cs.strokeOpacity + ' ' + (n.getAttribute('class')||'').replace(/apgm-zone ?/,'') + '}';
  }).join('\n');
}));
await p.evaluate(() => {
  const z = Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => (x.dataset.view||'') === 'regions');
  z.click();
});
await p.waitForTimeout(700);
console.log('REGIONS:', await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  return ['India','Thailand','Vietnam','Borneo','Queensland','Philippines','Japan','Sri Lanka'].map(t => {
    const n = svg.querySelector('[data-zone="' + t + '"]');
    return t + '=' + (n ? Math.round(parseFloat(getComputedStyle(n).fillOpacity)*100)/100 : '?');
  }).join('  ');
}));
await p.evaluate(() => {
  const z = Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => (x.dataset.view||'') === 'countries');
  z.click();
});
await p.waitForTimeout(700);
/* hover India: dispatch mouseover on the India path */
console.log('COUNTRIES hover India:', await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const india = svg.querySelector('[data-zone="India"]');
  india.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
  const hot = [...svg.querySelectorAll('.is-hot')].map(n => n.getAttribute('data-zone'));
  return hot.join(', ');
}));
await p.waitForTimeout(300);
await svgH.screenshot({ path: SP + 'sweep-countries-hoverindia.png', animations: 'disabled' });
console.log('done');
await b.close();
