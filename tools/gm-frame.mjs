/* usage: node gm-frame.mjs local|live */
import { chromium } from 'playwright';
import fs from 'fs';
const MODE = process.argv[2] || 'local';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const JS = MODE === 'local' ? fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js','utf8') : null;
const b = await chromium.launch({ channel: 'chrome', headless: true });
for (const g of ['arum','alocasia','amorphophallus']) {
  const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
  if (JS) await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType: 'application/javascript', headers: {'access-control-allow-origin':'*'} }));
  await p.goto('https://www.aroidpedia.com/'+g, { waitUntil: 'networkidle', timeout: 120000 });
  await p.waitForTimeout(13000);
  console.log(g.padEnd(15), await p.evaluate(() => {
    const svg = document.querySelector('.apgm svg');
    const vb = svg.viewBox.baseVal;
    const L=vb.x,R=vb.x+vb.width,T=vb.y,B=vb.y+vb.height;
    let n=0, worst=0, who='';
    svg.querySelectorAll('.apgm-zone').forEach(el=>{
      if (parseFloat(getComputedStyle(el).fillOpacity)<0.05) return;
      const bb=el.getBBox();
      const d=Math.max(0,(bb.x+bb.width)-R, L-bb.x, (bb.y+bb.height)-B, T-bb.y);
      if (d>0.5){ n++; if(d>worst){worst=d; who=el.getAttribute('data-zone');} }
    });
    const t = svg.querySelector('.apgm-maplabel');
    return document.querySelector('.apgm').getAttribute('data-apgm-version') +
      ' vbW=' + vb.width.toFixed(1) + ' vbH=' + vb.height.toFixed(1) +
      ' overflow=' + n + (n?(' worst='+who+' '+worst.toFixed(1)+'deg'):'') +
      ' labelFont=' + (t?t.getAttribute('font-size'):'-');
  }));
  const svgH = await p.$('.apgm svg');
  await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
  await svgH.screenshot({ path: SP + 'frame-' + MODE + '-' + g + '.png', animations: 'disabled' });
  await p.close();
}
await b.close();
