import { chromium } from 'playwright';
import fs from 'fs';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const JS = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js', 'utf8');
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' } }));
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
console.log('stamp:', await p.evaluate(() => document.querySelector('.apgm').getAttribute('data-apgm-version')));
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
const view = async v => { await p.evaluate(vv => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === vv).click(); }, v); await p.waitForTimeout(800); };

/* ---- FIX 1: stroke rides the transition ---- */
await view('range');
console.log('transition:', await p.evaluate(() => {
  const z = document.querySelector('.apgm svg .apgm-zone[data-zone="India"]') ||
            document.querySelector('.apgm svg .apgm-zone');
  const cs = getComputedStyle(z);
  return cs.transitionProperty + ' / ' + cs.transitionDuration;
}));
/* hover a zone, then un-hover; 60ms later BOTH stroke and fill must be
   mid-flight (the bug: stroke already at its endpoint while fill lags) */
const mid = await p.evaluate(async () => {
  const svg = document.querySelector('.apgm svg');
  const z = svg.querySelector('.apgm-zone[data-zone="India"]') || svg.querySelector('.apgm-zone[data-zone="Borneo"]');
  const fire = (el, t) => el.dispatchEvent(new MouseEvent(t, { bubbles: true }));
  fire(z, 'mouseover');
  await new Promise(r => setTimeout(r, 400));           /* settle into hover */
  const dimS = getComputedStyle(z).stroke, dimF = getComputedStyle(z).fill;
  fire(z, 'mouseout'); fire(svg, 'mouseleave');
  await new Promise(r => setTimeout(r, 60));            /* mid-transition */
  const midS = getComputedStyle(z).stroke, midF = getComputedStyle(z).fill;
  await new Promise(r => setTimeout(r, 500));           /* settled */
  const endS = getComputedStyle(z).stroke, endF = getComputedStyle(z).fill;
  return { zone: z.getAttribute('data-zone'), dimS, dimF, midS, midF, endS, endF };
});
console.log('mid-flight zone=' + mid.zone);
console.log('  stroke dim->mid->end:', mid.dimS, '->', mid.midS, '->', mid.endS,
  '  strokeAnimates=', (mid.midS !== mid.endS && mid.midS !== mid.dimS));
console.log('  fill   dim->mid->end:', mid.dimF, '->', mid.midF, '->', mid.endF,
  '  fillAnimates=', (mid.midF !== mid.endF && mid.midF !== mid.dimF));

/* ---- FIX 2: one uniform Countries border ---- */
await view('countries');
console.log('countries borders:', await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const probe = (el, tag) => {
    if (!el) return tag + '=?';
    const cs = getComputedStyle(el);
    return tag + '[' + cs.stroke + ' o=' + (+parseFloat(cs.strokeOpacity).toFixed(2)) +
           ' w=' + cs.strokeWidth + ' merged=' + el.classList.contains('apgm-zone--merged') + ']';
  };
  const out = [];
  ['Laos', 'Thailand', 'India', 'Vietnam'].forEach(t => {
    out.push(probe(svg.querySelector('.apgm-zone[data-zone="' + t + '"]'), t));
  });
  const cg = Array.from(svg.querySelectorAll('.apgm-cg.apgm-famrow')).slice(0, 3);
  cg.forEach(el => out.push(probe(el, 'ghost:' + el.getAttribute('data-zone'))));
  return out.join('\n  ');
}));

/* ---- FIX 3: Divisions strokes recede to the grid ---- */
await view('divisions');
console.log('vdiv stroke-opacities (non-ghost, non-merged, visible fills):',
  await p.evaluate(() => {
    const svg = document.querySelector('.apgm svg');
    const tally = {};
    svg.querySelectorAll('.apgm-zone:not(.apgm-ghost):not(.apgm-zone--merged)').forEach(el => {
      const cs = getComputedStyle(el);
      if (cs.display === 'none') return;
      const so = (+parseFloat(cs.strokeOpacity)).toFixed(2);
      tally[so] = (tally[so] || 0) + 1;
    });
    return JSON.stringify(tally);
  }));
console.log('vdiv ghost grid sample:', await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const g = svg.querySelector('.apgm-ghost.apgm-sub[data-zone="Sabah"]') ||
            svg.querySelector('.apgm-ghost.apgm-sub');
  if (!g) return '?';
  const cs = getComputedStyle(g);
  return g.getAttribute('data-zone') + ' o=' + (+parseFloat(cs.strokeOpacity)).toFixed(2);
}));

/* hover check still answers in divisions */
console.log('KT hover:', await p.evaluate(() => {
  const el = document.querySelector('.apgm svg [data-zone="Kutai Timur"]');
  if (!el) return 'no node';
  el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
  const h = document.querySelector('.apgm [data-on]');
  return h ? h.textContent.trim().slice(0, 60) : '-';
}));

/* ---- screenshots: countries (Laos zoom) + divisions (Borneo) ---- */
await view('countries'); await p.waitForTimeout(600);
await svgH.screenshot({ path: SP + 'v30-countries.png', animations: 'disabled' });
await view('divisions'); await p.waitForTimeout(600);
await svgH.screenshot({ path: SP + 'v30-divisions.png', animations: 'disabled' });
console.log('done');
await b.close();
