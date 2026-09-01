import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/journal', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(14000);
console.log('stamp:', await p.evaluate(() => (document.documentElement.outerHTML.match(/journal page v20\.\d+/)||['none'])[0]));
await p.evaluate(() => { const fb=[...document.querySelectorAll('button')].find(x=>/filter/i.test(x.textContent)); if(fb) fb.click(); });
await p.waitForTimeout(1000);
await p.evaluate(() => { const r = document.querySelector('.ap-jr-svg').getBoundingClientRect(); window.scrollTo(0, r.top + window.scrollY - 80); });
await p.waitForTimeout(400);

await p.evaluate(() => document.querySelector('.ap-jr-view[data-view="continents"]').click());
await p.waitForTimeout(800);
console.log('== continents: probes off West Africa ==');
console.log(await p.evaluate(() => {
  const svg = document.querySelector('.ap-jr-svg');
  const vb = svg.viewBox.baseVal;
  const sr = svg.getBoundingClientRect();
  const toScreen = (lon, lat) => ({
    x: sr.x + (lon - vb.x) / vb.width * sr.width,
    y: sr.y + (-lat - vb.y) / vb.height * sr.height });
  const out = [];
  for (const lon of [-25,-23,-20,-17,-15]) for (const lat of [12,15,17]) {
    const pt = toScreen(lon, lat);
    document.elementsFromPoint(pt.x, pt.y)
      .filter(e => e.getAttribute && (e.getAttribute('data-tag')||e.getAttribute('data-place')))
      .forEach(e => {
        const t = e.getAttribute('data-tag')||e.getAttribute('data-place');
        const cs = getComputedStyle(e);
        out.push(lon+','+lat+' -> '+t+' ['+e.getAttribute('class')+'] fill='+cs.fill+' heat='+e.style.getPropertyValue('--heat'));
      });
  }
  return [...new Set(out)].join('\n') || '(nothing)';
}));

await p.evaluate(() => document.querySelector('.ap-jr-view[data-view="regions"]').click());
await p.waitForTimeout(800);
console.log('== regions: stack at Bangladesh / Sylhet / India ==');
console.log(await p.evaluate(() => {
  const svg = document.querySelector('.ap-jr-svg');
  const vb = svg.viewBox.baseVal;
  const sr = svg.getBoundingClientRect();
  const toScreen = (lon, lat) => ({
    x: sr.x + (lon - vb.x) / vb.width * sr.width,
    y: sr.y + (-lat - vb.y) / vb.height * sr.height });
  const out = [];
  [['BD',90.4,23.8],['Sylhet',91.7,24.6],['IN',79,22]].forEach(([lbl,lon,lat]) => {
    const pt = toScreen(lon, lat);
    document.elementsFromPoint(pt.x, pt.y)
      .filter(e => e.getAttribute && (e.getAttribute('data-tag')||e.getAttribute('data-place')))
      .forEach(e => {
        const t = e.getAttribute('data-tag')||e.getAttribute('data-place');
        out.push(lbl+': '+t+' ['+e.getAttribute('class')+'] heat='+e.style.getPropertyValue('--heat')+' fill='+getComputedStyle(e).fill);
      });
  });
  return out.join('\n');
}));
await b.close();
