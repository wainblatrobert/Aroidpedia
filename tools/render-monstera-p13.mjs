/* Prove the new Part XIII renders in the LIVE page's own CSS, by injecting it
   into /monstera-pollination after the Part XII block. Nothing is published;
   this only paints it in the browser. */
import { chromium } from 'playwright';
import fs from 'fs';

const F = 'G:\\My Drive\\PlantsV2\\Aroidpedia\\WEBSITE\\AROID REPRODUCTION\\MONSTERA REPRODUCTION\\MONSTERA POLLINATION — 12C PART XIII THE CALENDAR 8.16.26 v1.txt';
let block = fs.readFileSync(F, 'utf8');
block = block.split('-->').slice(1).join('-->');   // strip the header comment

const b = await chromium.launch({ channel: 'chrome' });
for (const [tag, vp] of [['desk', { width: 1280, height: 1000 }], ['phone', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp });
  await p.goto('https://aroidpedia.com/monstera-pollination', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForTimeout(5000);

  const ok = await p.evaluate(html => {
    const heads = [...document.querySelectorAll('h2')];
    const xii = heads.find(h => /Herbivores/i.test(h.textContent));
    if (!xii) return 'no Part XII heading found';
    const host = xii.closest('.apol') || xii.parentElement;
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    host.parentElement.insertBefore(wrap, host.nextSibling);
    return 'injected after: ' + xii.textContent.trim().slice(0, 50);
  }, block);
  console.log(`[${tag}] ${ok}`);

  await p.waitForTimeout(600);
  const el = await p.$('#apmo-p13');
  if (!el) { console.log(`[${tag}] BLOCK DID NOT RENDER`); await p.close(); continue; }
  await el.scrollIntoViewIfNeeded();
  await p.waitForTimeout(400);

  const m = await p.evaluate(() => {
    const h = document.querySelector('#apmo-p13');
    const root = h.closest('.apol');
    const r = root.getBoundingClientRect();
    const cs = getComputedStyle(h);
    return {
      width: Math.round(r.width), height: Math.round(r.height),
      h2font: cs.fontSize, h2color: cs.color,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      calls: root.querySelectorAll('.apol-call').length,
      nums: root.querySelectorAll('.apol-num').length,
      track: !!root.querySelector('.apol-track')
    };
  });
  console.log(`[${tag}]`, JSON.stringify(m));

  const root = await p.$('#apmo-p13 >> xpath=ancestor::div[contains(@class,"apol")][1]');
  await (root || el).screenshot({ path: `monstera-p13-${tag}.png` });
  await p.close();
}
await b.close();
