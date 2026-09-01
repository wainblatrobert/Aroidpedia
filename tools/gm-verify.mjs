/* Serve the freshly built footer.js to the live genus pages; check the
   Range view paints Borneo/New Guinea/Andamans WITHOUT hover, the
   BORNEO label position, and no double-paint on Amorphophallus. */
import { chromium } from 'playwright';
import fs from 'fs';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const JS = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js', 'utf8');
const b = await chromium.launch({ channel: 'chrome', headless: true });

async function genusPage(url) {
  const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
  await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' } }));
  await p.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await p.waitForTimeout(13000);
  return p;
}

const p = await genusPage('https://www.aroidpedia.com/alocasia');
console.log('stamp:', await p.evaluate(() => {
  const m = document.querySelector('.apgm');
  return m ? m.getAttribute('data-apgm-version') : '(none)';
}));
await p.evaluate(() => {
  const z = Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => (x.dataset.view || '') === 'range');
  if (z) z.click();
});
await p.waitForTimeout(900);
console.log(await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const out = [];
  ['Borneo','New Guinea','Bismarck Archipelago','Andaman Islands','Nicobar','Lakshadweep','Nansei-shoto','Assam','Luzon','Mindanao','Sylhet'].forEach(t => {
    const n = svg.querySelector('[data-zone="' + t + '"]');
    if (!n) { out.push(t + ': NO NODE'); return; }
    out.push(t + ': fo=' + getComputedStyle(n).fillOpacity + (n.classList.contains('apgm-cov') ? ' COV' : ''));
  });
  const lbl = [...svg.querySelectorAll('.apgm-maplabel')].find(t => t.textContent === 'Borneo');
  out.push('BORNEO label at x=' + (lbl ? lbl.getAttribute('x') + ' y=' + lbl.getAttribute('y') : 'MISSING'));
  return out.join('\n');
}));
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded();
await p.waitForTimeout(500);
await svgH.screenshot({ path: SP + 'v21-alocasia-range.png', animations: 'disabled' });

const p2 = await genusPage('https://www.aroidpedia.com/amorphophallus');
await p2.evaluate(() => {
  const z = Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => (x.dataset.view || '') === 'range');
  if (z) z.click();
});
await p2.waitForTimeout(900);
console.log('AMORPHOPHALLUS:');
console.log(await p2.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const out = [];
  ['Borneo','Indonesia','Malaysia','New Guinea','Sumatera','Andaman Islands'].forEach(t => {
    const n = svg.querySelector('[data-zone="' + t + '"]');
    if (!n) { out.push(t + ': NO NODE'); return; }
    out.push(t + ': fo=' + getComputedStyle(n).fillOpacity + (n.classList.contains('apgm-cov') ? ' COV' : ''));
  });
  return out.join('\n');
}));
const svgH2 = await p2.$('.apgm svg');
await svgH2.scrollIntoViewIfNeeded();
await p2.waitForTimeout(500);
await svgH2.screenshot({ path: SP + 'v21-amorph-range.png', animations: 'disabled' });
console.log('done');
await b.close();
