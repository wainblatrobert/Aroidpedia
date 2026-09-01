import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/arum', { waitUntil:'networkidle', timeout:120000 });
await p.waitForTimeout(13000);
const svgH = await p.$('.apgm svg'); await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
await p.evaluate(() => { [...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view==='countries').click(); });
await p.waitForTimeout(900);
console.log(await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const vb = svg.viewBox.baseVal, r = svg.getBoundingClientRect();
  const out = ['frame lat ' + (-(vb.y+vb.height)).toFixed(1) + '..' + (-vb.y).toFixed(1) +
               '  lon ' + vb.x.toFixed(1) + '..' + (vb.x+vb.width).toFixed(1)];
  const el = svg.querySelector('[data-zone="India"]');
  const bb = el.getBBox();
  out.push('India ghost bbox lat ' + (-(bb.y+bb.height)).toFixed(1) + '..' + (-bb.y).toFixed(1) +
           ' subpaths=' + ((el.getAttribute('d')||'').match(/M/g)||[]).length +
           ' fo=' + getComputedStyle(el).fillOpacity);
  /* walk down 78E and report the topmost svg element at each latitude */
  for (let lat = 34; lat >= 10; lat -= 2) {
    const x = r.x + (78 - vb.x)/vb.width*r.width;
    const y = r.y + (-lat - vb.y)/vb.height*r.height;
    const hit = document.elementFromPoint(x, y);
    const z = hit && hit.getAttribute ? (hit.getAttribute('data-zone') || hit.getAttribute('class') || hit.tagName) : 'none';
    const fo = hit && hit.getAttribute ? getComputedStyle(hit).fillOpacity : '-';
    out.push('  lat ' + String(lat).padStart(2) + '  top=' + z + ' fo=' + fo);
  }
  return out.join('\n');
}));
await b.close();
