import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
for (const g of ['alocasia','amorphophallus','anthurium','philodendron','monstera','arisaema','spathiphyllum']) {
  const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
  try {
    await p.goto('https://www.aroidpedia.com/'+g, { waitUntil: 'networkidle', timeout: 120000 });
    await p.waitForTimeout(12000);
    const r = await p.evaluate(() => {
      const svg = document.querySelector('.apgm svg');
      if (!svg) return 'no map';
      const vb = svg.viewBox.baseVal;
      const L=vb.x, R=vb.x+vb.width, T=vb.y, B=vb.y+vb.height;
      const over=[];
      svg.querySelectorAll('.apgm-zone').forEach(el=>{
        if (parseFloat(getComputedStyle(el).fillOpacity)<0.05) return;
        const bb=el.getBBox();
        const dx=Math.max(0,(bb.x+bb.width)-R, L-bb.x), dy=Math.max(0,(bb.y+bb.height)-B, T-bb.y);
        if (dx>0.5||dy>0.5) over.push((el.getAttribute('data-zone')||'?')+(el.classList.contains('apgm-cg')?'[gh]':'')+' dx='+dx.toFixed(1)+' dy='+dy.toFixed(1));
      });
      return 'vbW='+vb.width.toFixed(1)+' overflow='+over.length+(over.length?' :: '+over.slice(0,4).join(' | '):'');
    });
    console.log(g.padEnd(16), r);
  } catch(e){ console.log(g, 'ERR', e.message.slice(0,60)); }
  await p.close();
}
await b.close();
