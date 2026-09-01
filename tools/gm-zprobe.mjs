import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
await p.evaluate(() => {
  const z = Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => (x.dataset.view||'') === 'subzones');
  z.click();
});
await p.waitForTimeout(800);
console.log(await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  return ['Sarawak','Sabah','Kapit','Sibu','Kuching','East Kalimantan','Malaysian Borneo','Kalimantan','Morobe','Madang','Sylhet','Chittagong'].map(t => {
    const n = svg.querySelector('[data-zone="' + t + '"]');
    if (!n) return t + ': NO NODE';
    const cs = getComputedStyle(n);
    return t + ': [' + (n.getAttribute('class')||'').replace('apgm-zone','') + '] fo=' + Math.round(parseFloat(cs.fillOpacity)*100)/100 +
      ' so=' + cs.strokeOpacity + ' stroke=' + cs.stroke.slice(0,30);
  }).join('\n');
}));
await b.close();
