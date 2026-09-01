import { chromium } from 'playwright';

const URL = 'https://www.aroidpedia.com/philodendron-morphology';
const WIDTHS = [280, 320, 360, 390, 412, 767];

const b = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
const p = await b.newPage();
await p.goto(URL, { waitUntil:'networkidle', timeout:60000 });
await p.waitForTimeout(1500);

const sel = '.ap-phmor-hero .amph-title';
const found = await p.$(sel);
console.log('title element found:', !!found);
if (!found) {
  const cls = await p.evaluate(() =>
    [...document.querySelectorAll('h1')].map(h => h.className + ' || ' + h.parentElement.className));
  console.log('h1s on page:', cls);
  await b.close(); process.exit(1);
}

console.log('\n  vw    box(px)   longest word   fill%   font-size  wraps');
console.log('  ----  --------  -------------  ------  ---------  -----');

for (const w of WIDTHS) {
  await p.setViewportSize({ width:w, height:900 });
  await p.waitForTimeout(400);
  const r = await p.evaluate((sel) => {
    const el = document.querySelector(sel);
    const cs  = getComputedStyle(el);
    const box = el.clientWidth
      - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    // measure each word with a canvas using the element's own font
    const c = document.createElement('canvas').getContext('2d');
    c.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const ls = parseFloat(cs.letterSpacing) || 0;
    const words = el.textContent.trim().split(/\s+/);
    let best = { w:0, t:'' };
    for (const t of words) {
      const ww = c.measureText(t).width + ls * t.length;
      if (ww > best.w) best = { w:ww, t };
    }
    return {
      box, word:best.t, wordW:best.w,
      fs: cs.fontSize,
      lines: Math.round(el.getBoundingClientRect().height / parseFloat(cs.lineHeight)),
      overflow: el.scrollWidth > el.clientWidth + 1
    };
  }, sel);
  const pct = (r.wordW / r.box * 100);
  const flag = r.overflow ? ' << OVERFLOW' : (pct > 95 ? ' << TIGHT' : '');
  console.log(`  ${String(w).padEnd(4)}  ${r.box.toFixed(1).padStart(8)}  ${r.word.padEnd(13)}  ${pct.toFixed(1).padStart(5)}%  ${r.fs.padStart(9)}  ${r.lines}${flag}`);
}
await b.close();
