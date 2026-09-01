/* Preview: WTE climate bands clipped to the genus range, on the LIVE page. */
import { chromium } from 'playwright';
import fs from 'fs';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const B64 = fs.readFileSync('C:/Users/nli0490/Claude/aroidpedia-climate/' + (process.env.PNG || 'wte-zones.png')).toString('base64');
const GEN = process.argv[2] || 'arum';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 }, deviceScaleFactor: 2 });
await p.goto('https://www.aroidpedia.com/' + GEN, { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
const svgH = await p.$('.apgm svg'); await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
await p.evaluate(() => { [...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view==='range').click(); });
await p.waitForTimeout(900);
await svgH.screenshot({ path: SP + 'clim-' + GEN + '-before.png', animations: 'disabled' });
console.log(await p.evaluate((b64) => {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.querySelector('.apgm svg');
  const painted = [...svg.querySelectorAll('.apgm-zone')].filter(el =>
    parseFloat(getComputedStyle(el).fillOpacity) > 0.05 && el.getAttribute('d'));
  const defs = document.createElementNS(NS, 'defs');
  const cp = document.createElementNS(NS, 'clipPath');
  cp.setAttribute('id', 'apgm-climclip');
  painted.forEach(el => { const q = document.createElementNS(NS, 'path');
    q.setAttribute('d', el.getAttribute('d')); cp.appendChild(q); });
  defs.appendChild(cp); svg.appendChild(defs);
  /* the range fills recede to a quiet ground so the bands carry the colour */
  painted.forEach(el => { el.style.setProperty('--zf', 'rgb(40,48,40)'); });
  const img = document.createElementNS(NS, 'image');
  img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'data:image/png;base64,' + b64);
  img.setAttribute('href', 'data:image/png;base64,' + b64);
  img.setAttribute('x', -180); img.setAttribute('y', -90);
  img.setAttribute('width', 360); img.setAttribute('height', 180);
  img.setAttribute('clip-path', 'url(#apgm-climclip)');
  img.setAttribute('preserveAspectRatio', 'none');
  img.style.imageRendering = 'pixelated';
  img.style.pointerEvents = 'none';
  const labels = svg.querySelector('.apgm-maplabel');
  svg.insertBefore(img, labels ? labels.parentNode : null);
  /* country borders ON TOP of the raster, clipped to the range, so a
     reader can place themselves without the fills competing */
  const bord = svg.querySelector('.apgm-borders');
  let nb = 0;
  if (bord) {
    const cl = bord.cloneNode(false);
    cl.setAttribute('class', 'apgm-clim-borders');
    cl.setAttribute('clip-path', 'url(#apgm-climclip)');
    cl.style.stroke = 'rgba(243,241,234,.20)';
    cl.style.strokeWidth = '.3px';
    cl.style.fill = 'none';
    cl.style.pointerEvents = 'none';
    svg.insertBefore(cl, img.nextSibling);
    nb = 1;
  }
  /* and the range's own outer edge, a touch firmer */
  painted.forEach(el => {
    const q = document.createElementNS(NS, 'path');
    q.setAttribute('d', el.getAttribute('d'));
    q.style.fill = 'none';
    q.style.stroke = 'rgba(243,241,234,.13)';
    q.style.strokeWidth = '.3px';
    q.style.vectorEffect = 'non-scaling-stroke';
    q.style.pointerEvents = 'none';
    svg.insertBefore(q, img.nextSibling);
  });
  return 'clipped to ' + painted.length + ' painted range shapes; borders overlay=' + nb;
}, B64));
await p.waitForTimeout(1200);
await svgH.screenshot({ path: SP + 'clim-' + GEN + (process.env.TAG || '') + '-after.png', animations: 'disabled' });
console.log('done', GEN);
await b.close();
