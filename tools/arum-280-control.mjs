// Control: does the LIVE Amorphophallus intro do the same thing at 280px?
import fs from 'node:fs';
import http from 'node:http';
import { chromium } from 'playwright';

const G = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/GENERA PAGES/';
const CASES = {
  arum:            G + 'Arum/GENUS ARUM INTRO 8.30.26 v1.txt',
  amorphophallus:  G + 'Amorphophallus/GENUS AMORPHOPHALLUS INTRO 8.16.26 v6.txt',
  alocasia:        G + 'Alocasia/GENUS ALOCASIA INTRO 8.16.26 v7.txt',
};
const which = process.argv[2] || 'arum';
const BLOCK = fs.readFileSync(CASES[which], 'utf8');
const SKELETON = `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>*{box-sizing:border-box}html{font-size:13px}body{margin:0;background:#0B120D}
.page-section{width:100%}.fluid-engine{overflow-x:clip;display:grid;max-width:1200px;margin:0 auto}
.fe-block{grid-area:1/1/2/2;width:100%}</style></head><body>
<div class="page-section"><div class="fluid-engine"><div class="fe-block">${BLOCK}</div></div></div>
</body></html>`;

const server = http.createServer((_, res) => { res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'}); res.end(SKELETON); });
await new Promise(r => server.listen(4602, r));
const browser = await chromium.launch({ channel: 'chrome', args: ['--disable-gpu'] });
for (const w of [280, 320, 375]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 800 } });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4602/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const out = await page.evaluate(vw => {
    const root = document.querySelector('.ap-genus');
    // the deepest elements wider than the viewport, with no wider child
    const deep = [];
    root.querySelectorAll('*').forEach(n => {
      const r = n.getBoundingClientRect();
      if (r.width <= vw + 0.5) return;
      const childWider = [...n.children].some(c => c.getBoundingClientRect().width > vw + 0.5);
      if (!childWider) deep.push({
        tag: n.tagName.toLowerCase(),
        cls: (n.className && n.className.baseVal !== undefined ? n.className.baseVal : n.className) || '',
        w: Math.round(n.getBoundingClientRect().width * 10) / 10,
        text: (n.textContent || '').trim().slice(0, 34)
      });
    });
    return {
      docScrollW: document.documentElement.scrollWidth,
      apGenusW: Math.round(root.getBoundingClientRect().width * 10) / 10,
      deepest: deep.slice(0, 8)
    };
  }, w);
  console.log(`\n=== ${which} @ ${w}px ===`);
  console.log(JSON.stringify(out, null, 1));
  await ctx.close();
}
await browser.close();
server.close();
