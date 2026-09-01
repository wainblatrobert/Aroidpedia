/* Round-4 inspection on LIVE v20.23: which node paints (a) the regions-view
   line at Sudan-South Sudan, (b) the countries-view mesh while hovering
   northern Sudan. Dumps classes + computed paint for the cast of suspects. */
import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/journal', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(14000);
await p.evaluate(() => { const fb = Array.from(document.querySelectorAll('button')).find(x => /filter/i.test(x.textContent)); if (fb) fb.click(); });
await p.waitForTimeout(1200);
await p.evaluate(() => { const r = document.querySelector('.ap-jr-svg').getBoundingClientRect(); window.scrollTo(0, r.top + window.scrollY - 80); });
await p.waitForTimeout(500);

const CAST = ['Sudan', 'Sudan-South Sudan', 'Ethiopia', 'Eritrea', 'Khartoum', 'Northern', 'Chad', 'Cameroon', 'Nigeria', 'Bhutan'];
const dump = () => p.evaluate(tags => {
  const svg = document.querySelector('.ap-jr-svg');
  const out = { svgClass: svg.className.baseVal || svg.getAttribute('class') };
  out.rows = tags.map(t => {
    const n = svg.querySelector('[data-tag="' + t + '"], [data-place="' + t + '"]');
    if (!n) return t + ': ABSENT';
    const cs = getComputedStyle(n);
    return t + ': [' + (n.getAttribute('class') || '') + '] fill=' + cs.fill +
      ' stroke=' + cs.stroke + ' sw=' + cs.strokeWidth + ' pe=' + cs.pointerEvents;
  });
  return out;
}, CAST);

for (const v of ['regions', 'countries']) {
  await p.evaluate(vv => document.querySelector('.ap-jr-view[data-view="' + vv + '"]').click(), v);
  await p.waitForTimeout(700);
  console.log('== VIEW', v, 'BASE ==');
  console.log(JSON.stringify(await dump(), null, 1));
  // real-mouse hover at the centroid of Sudan's own shape (northern Sudan)
  const pt = await p.evaluate(() => {
    const n = document.querySelector('.ap-jr-svg [data-tag="Sudan"], .ap-jr-svg [data-place="Sudan"]');
    if (!n) return null;
    const r = n.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height * 0.35 };
  });
  if (pt) {
    await p.mouse.move(pt.x, pt.y);
    await p.waitForTimeout(500);
    const tip = await p.evaluate(() => {
      const t = document.querySelector('.ap-jr-tip, .ap-jr-tooltip, [class*="tip"]');
      return t ? t.textContent.trim() : '(no tip node)';
    });
    console.log('== VIEW', v, 'HOVER N-SUDAN == tip:', tip);
    console.log(JSON.stringify(await dump(), null, 1));
    await p.mouse.move(5, 5);
    await p.waitForTimeout(400);
  }
}
await b.close();
