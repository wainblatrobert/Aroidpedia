import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/journal', { waitUntil:'networkidle', timeout:120000 });
await p.waitForTimeout(14000);
await p.evaluate(() => { const fb=[...document.querySelectorAll('button')].find(x=>/filter/i.test(x.textContent)); if(fb) fb.click(); });
await p.waitForTimeout(1000);
await p.evaluate(() => document.querySelector('.ap-jr-view[data-view="regions"]').click());
await p.waitForTimeout(800);
console.log(await p.evaluate(() => {
  const svg = document.querySelector('.ap-jr-svg');
  const out = [];
  svg.querySelectorAll('text').forEach(t => {
    const cs = getComputedStyle(t);
    out.push(JSON.stringify({ txt: t.textContent, x: t.getAttribute('x'), y: t.getAttribute('y'),
      fill: cs.fill, op: cs.opacity, cls: t.getAttribute('class') }));
  });
  return out.length ? out.join('\n') : '(no text nodes)';
}));
await b.close();
