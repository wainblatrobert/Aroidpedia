import { chromium } from 'playwright';
import fs from 'fs';
const MODE = process.argv[2] || 'local';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const JS = MODE==='local' ? fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js','utf8') : null;
const b = await chromium.launch({ channel: 'chrome', headless: true });
for (const g of ['arum','alocasia','amorphophallus']) {
  const p = await b.newPage({ viewport: { width: 1500, height: 1100 }, deviceScaleFactor: 2 });
  if (JS) await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType:'application/javascript', headers:{'access-control-allow-origin':'*'} }));
  await p.goto('https://www.aroidpedia.com/'+g, { waitUntil:'networkidle', timeout:120000 });
  await p.waitForTimeout(13000);
  const svgH = await p.$('.apgm svg'); await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
  console.log(MODE, g.padEnd(15), await p.evaluate(() => {
    const svg = document.querySelector('.apgm svg');
    const lin = c => { c/=255; return c<=0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055,2.4); };
    const L = ([r,gg,bb]) => 0.2126*lin(r)+0.7152*lin(gg)+0.0722*lin(bb);
    const cr = (a,b) => { const la=L(a),lb=L(b); const hi=Math.max(la,lb),lo=Math.min(la,lb); return ((hi+0.05)/(lo+0.05)).toFixed(2); };
    const px = s => s.match(/\d+/g).slice(0,3).map(Number);
    let dimmest = null, dv = 1e9;
    svg.querySelectorAll('.apgm-zone').forEach(el => {
      const cs = getComputedStyle(el);
      if (parseFloat(cs.fillOpacity) < 0.05) return;
      const c = px(cs.fill), v = L(c);
      if (v < dv) { dv = v; dimmest = { z: el.getAttribute('data-zone'), c }; }
    });
    return 'dimmest painted = ' + dimmest.z + ' rgb(' + dimmest.c.join(',') + ')  vs-ground ' +
           cr(dimmest.c, [19,26,21]) + ':1';
  }));
  await svgH.screenshot({ path: SP + 'ramp-' + MODE + '-' + g + '.png', animations:'disabled' });
  await p.close();
}
await b.close();
