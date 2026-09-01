import { chromium } from 'playwright';
const CSS = `
.ap-jr-svg.is-hov .s.merged:not(.hot):not(.pick){ stroke: color-mix(in srgb, var(--heat, #35402F) 68%, #0E140F) !important; }
.ap-jr-svg.is-hov .s.on:not(.hot):not(.pick),
.ap-jr-svg.is-hov .d.on:not(.hot):not(.pick){ fill: color-mix(in srgb, var(--heat, #35402F) 68%, #0E140F) !important; fill-opacity:1 !important; }
.ap-jr-svg.is-vcountries .s:not(.on):not(.off):not(.pick):not(.hot){ fill:none !important; }
.ap-jr-svg.is-vcontinents .s.sub:not(.on):not(.off):not(.pick):not(.hot),
.ap-jr-svg.is-vregions .s.sub:not(.on):not(.off):not(.pick):not(.hot),
.ap-jr-svg.is-vcountries .s.sub:not(.on):not(.off):not(.pick):not(.hot){ fill:none !important; stroke:transparent !important; }
`;
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/journal', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(14000);
await p.evaluate(css => { const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st); }, CSS);
await p.evaluate(() => { const fb = Array.from(document.querySelectorAll('button')).find(b => /filter/i.test(b.textContent)); if (fb) fb.click(); });
await p.waitForTimeout(1200);
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';

// scene 1: regions view, zoom to Africa, hover WC Tropical Africa (the f04 mesh scene)
await p.evaluate(() => {
  const m = document.querySelector('.ap-jr-mapwrap') || document.querySelector('.ap-jr-svg');
  if (m) m.scrollIntoView({ block: 'center' });
  const v = document.querySelector('.ap-jr-view[data-view="regions"]');
  if (v) v.click();
});
await p.waitForTimeout(800);
await p.evaluate(() => {
  const svg = document.querySelector('.ap-jr-svg');
  const g = svg.querySelector('[data-tag="Gabon"], [data-place="Gabon"]');
  if (g) g.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
});
await p.waitForTimeout(500);
await p.evaluate(() => { const r = document.querySelector('.ap-jr-svg').getBoundingClientRect(); window.scrollTo(0, r.top + window.scrollY - 80); });
await p.waitForTimeout(700);
console.log('scrollY', await p.evaluate(() => window.scrollY));
await p.screenshot({ path: SP + 'v2022-regions-dim.png', animations: 'disabled' });

// scene 2: countries view (Sudan + Bhutan)
await p.evaluate(() => { document.querySelector('.ap-jr-view[data-view="countries"]').click(); });
await p.waitForTimeout(800);
await p.evaluate(() => { const svg=document.querySelector('.ap-jr-svg'); svg.dispatchEvent(new MouseEvent('mouseleave',{bubbles:true})); });
await p.waitForTimeout(500);
await p.screenshot({ path: SP + 'v2022-countries-base.png', animations: 'disabled' });
await p.evaluate(() => {
  const svg = document.querySelector('.ap-jr-svg');
  const c = svg.querySelector('[data-tag="China"], [data-place="China Southeast"]');
  if (c) c.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
});
await p.waitForTimeout(500);
await p.evaluate(() => { const r = document.querySelector('.ap-jr-svg').getBoundingClientRect(); window.scrollTo(0, r.top + window.scrollY - 80); });
await p.waitForTimeout(500);
await p.screenshot({ path: SP + 'v2022-countries.png', animations: 'disabled' });
console.log('shots saved');
await b.close();
