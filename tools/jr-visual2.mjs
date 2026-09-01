import { chromium } from 'playwright';
const CSS = `
.ap-jr-svg .ap-jr-borders { stroke: transparent !important; }
.ap-jr-svg .s { stroke: transparent; }
.ap-jr-svg .s.on { stroke: rgba(200,214,191,.30); }
.ap-jr-svg.is-vsubzones .s.sub:not(.on), .ap-jr-svg.is-vsubzones2 .s.sub:not(.on),
.ap-jr-svg.is-vdivisions .s.sub:not(.on) { stroke: transparent !important; }
.ap-jr-svg.is-vsubzones .s.on:not(.ganchor), .ap-jr-svg.is-vsubzones2 .s.on:not(.ganchor),
.ap-jr-svg.is-vdivisions .s.on:not(.ganchor) { stroke: var(--heat, #35402F); }
.ap-jr-svg.is-vsubzones .s.on.ganchor { stroke: rgba(200,214,191,.42); }
.ap-jr-svg.is-vcontinents .s.on:not(.sub):not(.pick),
.ap-jr-svg.is-vregions .s.on:not(.sub):not(.pick),
.ap-jr-svg.is-vcountries .s.on:not(.sub):not(.pick) { stroke: rgba(200,214,191,.42); stroke-width: .3; }
.ap-jr-svg.is-vcontinents .s.sub.hot:not(.pick),
.ap-jr-svg.is-vregions .s.sub.hot:not(.pick),
.ap-jr-svg.is-vcountries .s.sub.hot:not(.pick) { stroke: #B9C8AA !important; }
`;
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/journal', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(14000);
await p.evaluate(css => { const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st); }, CSS);
await p.evaluate(() => { const fb = Array.from(document.querySelectorAll('button')).find(b => /filter/i.test(b.textContent)); if (fb) fb.click(); });
await p.waitForTimeout(1200);
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
await p.evaluate(() => { const r = document.querySelector('.ap-jr-svg').getBoundingClientRect(); window.scrollTo(0, r.top + window.scrollY - 80); });
await p.waitForTimeout(500);

// scene A: countries base (Sudan + world layer + group borders)
await p.evaluate(() => document.querySelector('.ap-jr-view[data-view="countries"]').click());
await p.waitForTimeout(700);
await p.evaluate(() => document.querySelector('.ap-jr-svg').dispatchEvent(new MouseEvent('mouseleave', { bubbles: true })));
await p.waitForTimeout(400);
await p.screenshot({ path: SP + 'v23-countries.png', animations: 'disabled' });

// scene B: hover Bhutan
await p.evaluate(() => {
  const svg = document.querySelector('.ap-jr-svg');
  const bt = svg.querySelector('[data-tag="Bhutan"], [data-place="Bhutan"]');
  if (bt) bt.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
});
await p.waitForTimeout(500);
await p.screenshot({ path: SP + 'v23-bhutan-hover.png', animations: 'disabled' });

// scene C: zones view, ganchor emulated (anchor = every lit shape except Moulvibazar)
await p.evaluate(() => {
  document.querySelector('.ap-jr-svg').dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
  document.querySelector('.ap-jr-view[data-view="subzones"]').click();
});
await p.waitForTimeout(700);
await p.evaluate(() => {
  const svg = document.querySelector('.ap-jr-svg');
  svg.querySelectorAll('.s.on').forEach(el => el.classList.add('ganchor'));
  const mv = svg.querySelector('[data-tag="Moulvibazar"], [data-place="Moulvibazar"]');
  if (mv) mv.classList.remove('ganchor');
});
await p.waitForTimeout(300);
await p.screenshot({ path: SP + 'v23-zones.png', animations: 'disabled' });
console.log('saved');
await b.close();
