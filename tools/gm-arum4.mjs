import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/arum', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
console.log(await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const q = t => {
    const el = svg.querySelector('[data-zone="'+t+'"]');
    if (!el) return t+'=NO NODE';
    const cs = getComputedStyle(el);
    return t+' fo='+(+parseFloat(cs.fillOpacity).toFixed(2))+' fill='+cs.fill.replace(/\s/g,'')+
      ' cls='+[...el.classList].filter(c=>c!=='apgm-zone').join(',');
  };
  return ['Italy','Sicilia','Sardegna','Corse','France','Greece','Spain','Kriti','Baleares','Azores','China','Xinjiang','Tibet']
    .map(q).join('\n');
}));
await b.close();
