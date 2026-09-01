import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/journal', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(14000);
await p.evaluate(() => { const fb=[...document.querySelectorAll('button')].find(x=>/filter/i.test(x.textContent)); if(fb) fb.click(); });
await p.waitForTimeout(1000);
await p.evaluate(() => document.querySelector('.ap-jr-view[data-view="regions"]').click());
await p.waitForTimeout(800);
console.log(await p.evaluate(() => {
  const svg = document.querySelector('.ap-jr-svg');
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
  const pt = { x: sr.x + (90.4 - vb.x)/vb.width*sr.width, y: sr.y + (-23.8 - vb.y)/vb.height*sr.height };
  const els = document.elementsFromPoint(pt.x, pt.y);
  const out = ['stack at BD center (top first):'];
  els.forEach(e => {
    if (!(e instanceof SVGElement)) return;
    const t = e.getAttribute && (e.getAttribute('data-tag')||e.getAttribute('data-place'));
    const cs = getComputedStyle(e);
    const bb = e.getBBox ? (()=>{try{const r=e.getBBox();return r.width.toFixed(1)+'x'+r.height.toFixed(1);}catch(err){return '?';}})() : '';
    out.push((t||e.tagName+'.'+(e.getAttribute('class')||'')) + ' | fill=' + cs.fill +
      ' fo=' + cs.fillOpacity + ' op=' + cs.opacity + ' bb=' + bb +
      ' dlen=' + ((e.getAttribute('d')||'').length));
  });
  // any duplicate Bangladesh nodes?
  const dups = svg.querySelectorAll('[data-tag="Bangladesh"], [data-place="Bangladesh"]');
  out.push('Bangladesh nodes: ' + dups.length);
  dups.forEach((n,i) => {
    const cs = getComputedStyle(n);
    out.push('  #'+i+' class=['+n.getAttribute('class')+'] fill='+cs.fill+' fo='+cs.fillOpacity+
      ' dlen='+(n.getAttribute('d')||'').length+' heat='+n.style.getPropertyValue('--heat'));
  });
  // siblings order: what index is Bangladesh vs its divisions
  const kids = [...svg.querySelectorAll('path[data-tag], path[data-place]')];
  const idx = t => kids.findIndex(n => (n.getAttribute('data-tag')||n.getAttribute('data-place')) === t);
  out.push('draw order idx: Bangladesh='+idx('Bangladesh')+' Dhaka='+idx('Dhaka')+' Sylhet='+idx('Sylhet')+
    ' Chittagong='+idx('Chittagong')+' Khulna='+idx('Khulna')+' of '+kids.length);
  ['Dhaka','Khulna','Chittagong','Rangpur','Rajshahi','Barisal','Mymensingh'].forEach(t => {
    const n = svg.querySelector('[data-tag="'+t+'"], [data-place="'+t+'"]');
    if (!n) { out.push(t+': ABSENT'); return; }
    const cs = getComputedStyle(n);
    out.push(t+': ['+n.getAttribute('class')+'] fill='+cs.fill+' fo='+cs.fillOpacity+' heat='+n.style.getPropertyValue('--heat'));
  });
  return out.join('\n');
}));
await b.close();
