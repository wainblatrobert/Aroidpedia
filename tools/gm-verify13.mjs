import { chromium } from 'playwright';
import fs from 'fs';
const JS = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js', 'utf8');
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' } }));
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
await p.evaluate(() => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === 'range').click(); });
await p.waitForTimeout(800);
/* hover India; BORNEO is a bystander that dims. On hover-off its stroke
   must GLIDE (mid value strictly between dim and base), in step with fill. */
const r = await p.evaluate(async () => {
  const svg = document.querySelector('.apgm svg');
  const india = svg.querySelector('.apgm-zone[data-zone="India"]');
  const by = svg.querySelector('.apgm-zone[data-zone="Borneo"]') ||
             svg.querySelector('.apgm-zone[data-zone="Sumatera"]');
  const fire = (el, t) => el.dispatchEvent(new MouseEvent(t, { bubbles: true }));
  const grab = () => { const cs = getComputedStyle(by); return { s: cs.stroke, f: cs.fill }; };
  const base0 = grab();
  fire(india, 'mouseover');
  await new Promise(r => setTimeout(r, 400));
  const dim = grab();
  fire(india, 'mouseout'); fire(svg, 'mouseleave');
  await new Promise(r => setTimeout(r, 70));
  const mid = grab();
  await new Promise(r => setTimeout(r, 500));
  const end = grab();
  return { zone: by.getAttribute('data-zone'), base0, dim, mid, end };
});
console.log('bystander:', r.zone);
console.log('  stroke base:', r.base0.s, ' dim:', r.dim.s, ' mid:', r.mid.s, ' end:', r.end.s);
console.log('  fill   base:', r.base0.f, ' dim:', r.dim.f, ' mid:', r.mid.f, ' end:', r.end.f);
console.log('  strokeGlides=', r.mid.s !== r.dim.s && r.mid.s !== r.end.s,
            ' fillGlides=', r.mid.f !== r.dim.f && r.mid.f !== r.end.f);
await b.close();
