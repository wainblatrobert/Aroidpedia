import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/journal', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(14000);
await p.evaluate(() => { const fb = Array.from(document.querySelectorAll('button')).find(b => /filter/i.test(b.textContent)); if (fb) fb.click(); });
await p.waitForTimeout(1200);
const get = async t => await p.evaluate(tag => {
  const svg = document.querySelector('.ap-jr-svg');
  const el = svg.querySelector('[data-tag="' + tag + '"], [data-place="' + tag + '"]');
  if (!el) return null;
  const cs = getComputedStyle(el);
  return { cls: el.getAttribute('class'), fill: cs.fill, stroke: cs.stroke, heat: el.style.getPropertyValue('--heat') };
}, t);
await p.evaluate(() => document.querySelector('.ap-jr-view[data-view="countries"]').click());
await p.waitForTimeout(700);
console.log('COUNTRIES view:');
for (const t of ['Sudan', 'Sudan-South Sudan', 'Kassala', 'Khartoum', 'Bhutan', 'Thimphu']) {
  console.log(' ', t, JSON.stringify(await get(t)));
}
await p.evaluate(() => document.querySelector('.ap-jr-view[data-view="subzones"]').click());
await p.waitForTimeout(700);
console.log('ZONES view:');
for (const t of ['Sylhet', 'Moulvibazar', 'Bangladesh', 'Dhaka', 'Chiang Mai']) {
  console.log(' ', t, JSON.stringify(await get(t)));
}
const stamp = await p.evaluate(() => { let s=''; return s; });
await b.close();
