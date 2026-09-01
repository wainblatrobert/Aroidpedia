import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/journal', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(14000);
const r = await p.evaluate(() => {
  const svg = document.querySelector('.ap-jr-svg');
  const out = { stamp: null };
  try { out.stamp = performance.getEntriesByName ? null : null; } catch(e){}
  // countries view
  const btn = document.querySelector('.ap-jr-view[data-view="countries"]');
  if (btn) btn.click();
  return 1;
});
await p.waitForTimeout(800);
const info = await p.evaluate(() => {
  const svg = document.querySelector('.ap-jr-svg');
  const get = t => {
    const el = svg.querySelector('[data-tag="' + t + '"], [data-place="' + t + '"]');
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { cls: el.getAttribute('class'), fill: cs.fill, stroke: cs.stroke,
             heat: el.style.getPropertyValue('--heat') };
  };
  return {
    Sudan: get('Sudan'), Kassala: get('Kassala'), Khartoum: get('Khartoum'),
    Rwanda: get('Rwanda'), India: get('India'), Assam: get('Assam'),
  };
});
console.log(JSON.stringify(info, null, 1));
await p.screenshot({ path: 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/jr-live-countries.png', clip: { x: 0, y: 300, width: 1500, height: 800 } });
await b.close();
