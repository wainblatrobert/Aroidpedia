import { chromium } from 'playwright';
const SP = 'C:/Users/nli0490/AppData/Local/Temp/claude/C--Users-nli0490-Claude/ffd95950-679d-45b8-a877-704ff4ac7e9a/scratchpad/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/arum', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
console.log(await p.evaluate(() => {
  const wrap = document.querySelector('.apgm');
  const svg = document.querySelector('.apgm svg');
  const box = document.querySelector('.apgm__box');
  const br = svg.getBoundingClientRect(), xr = box.getBoundingClientRect();
  const vb = svg.viewBox.baseVal;
  /* union bbox of every PAINTED zone */
  let u = [1e9,1e9,-1e9,-1e9];
  svg.querySelectorAll('.apgm-zone').forEach(el => {
    const cs = getComputedStyle(el);
    if (parseFloat(cs.fillOpacity) < 0.05) return;
    const bb = el.getBBox();
    u = [Math.min(u[0],bb.x), Math.min(u[1],bb.y), Math.max(u[2],bb.x+bb.width), Math.max(u[3],bb.y+bb.height)];
  });
  return {
    stamp: wrap.getAttribute('data-apgm-version'),
    viewBox: [vb.x, vb.y, vb.width, vb.height].map(v=>+v.toFixed(2)),
    vbAspect: +(vb.width/vb.height).toFixed(2),
    svgBox: [Math.round(br.width), Math.round(br.height)],
    svgAspect: +(br.width/br.height).toFixed(2),
    boxBox: [Math.round(xr.width), Math.round(xr.height)],
    par: svg.getAttribute('preserveAspectRatio'),
    paintedUnion: u.map(v=>+v.toFixed(2)),
    paintedW: +(u[2]-u[0]).toFixed(2), paintedH: +(u[3]-u[1]).toFixed(2),
    zonesPainted: [...svg.querySelectorAll('.apgm-zone')].filter(e=>parseFloat(getComputedStyle(e).fillOpacity)>=0.05).length,
  };
}));
const svgH = await p.$('.apgm svg');
await svgH.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
await svgH.screenshot({ path: SP + 'arum-load.png', animations: 'disabled' });
/* now click FIT and compare */
await p.evaluate(() => { const b=[...document.querySelectorAll('.apgm button, .apgm [role=button]')].find(x=>/fit/i.test(x.textContent||'')); if(b) b.click(); });
await p.waitForTimeout(1200);
console.log('after FIT:', await p.evaluate(() => {
  const vb = document.querySelector('.apgm svg').viewBox.baseVal;
  return [vb.x, vb.y, vb.width, vb.height].map(v=>+v.toFixed(2)).join(' ');
}));
await svgH.screenshot({ path: SP + 'arum-fit.png', animations: 'disabled' });
await b.close();
