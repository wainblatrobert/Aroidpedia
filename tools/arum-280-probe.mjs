// Which element is forcing .ap-genus to 320.9px inside a 280px column?
import fs from 'node:fs';
import http from 'node:http';
import { chromium } from 'playwright';

const DIR = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/GENERA PAGES/Arum/';
const INTRO = fs.readFileSync(DIR + 'GENUS ARUM INTRO 8.30.26 v1.txt', 'utf8');
const MORPH = fs.readFileSync(DIR + 'GENUS ARUM MORPHOLOGY & CULTIVATION 8.30.26 v1.txt', 'utf8');
const SKELETON = `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>*{box-sizing:border-box}html{font-size:13px}body{margin:0;background:#0B120D}
.page-section{width:100%}.fluid-engine{overflow-x:clip;display:grid;max-width:1200px;margin:0 auto}
.fe-block{grid-area:1/1/2/2;width:100%}</style></head><body>
<div class="page-section"><div class="fluid-engine"><div class="fe-block">${INTRO}</div></div></div>
<div class="page-section"><div class="fluid-engine"><div class="fe-block">${MORPH}</div></div></div>
</body></html>`;

const server = http.createServer((_, res) => { res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'}); res.end(SKELETON); });
await new Promise(r => server.listen(4601, r));
const browser = await chromium.launch({ channel: 'chrome', args: ['--disable-gpu'] });

for (const w of [280, 320, 375]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 800 } });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4601/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);
  const out = await page.evaluate((vw) => {
    const root = document.querySelector('.ap-genus');
    const wide = [];
    root.querySelectorAll('*').forEach(n => {
      const r = n.getBoundingClientRect();
      if (r.right > vw + 0.5 || r.width > vw + 0.5) {
        wide.push({
          tag: n.tagName.toLowerCase(),
          cls: (n.className && n.className.baseVal !== undefined ? n.className.baseVal : n.className) || '',
          w: Math.round(r.width * 10) / 10,
          right: Math.round(r.right * 10) / 10,
          sw: n.scrollWidth,
          text: (n.textContent || '').trim().slice(0, 40)
        });
      }
    });
    // keep only the deepest offenders (drop ancestors of another offender)
    return {
      apGenusW: Math.round(root.getBoundingClientRect().width * 10) / 10,
      apGenusSW: root.scrollWidth,
      offenders: wide.slice(0, 14)
    };
  }, w);
  console.log(`\n===== ${w}px =====`);
  console.log(JSON.stringify(out, null, 1));
  await ctx.close();
}
await browser.close();
server.close();
