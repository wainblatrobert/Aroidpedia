import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
for (const g of ['arum','alocasia','amorphophallus']) {
  const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
  await p.goto('https://www.aroidpedia.com/'+g, { waitUntil:'networkidle', timeout:120000 });
  await p.waitForTimeout(13000);
  const stat = () => p.evaluate(() => {
    const svg = document.querySelector('.apgm svg');
    const cov = svg.querySelectorAll('.apgm-zone.apgm-cov').length;
    // zones painting at fo>0 that ALSO sit inside a lit country ghost
    let painted = 0; svg.querySelectorAll('.apgm-zone:not(.apgm-cg)').forEach(el=>{
      if (parseFloat(getComputedStyle(el).fillOpacity) > 0.05) painted++; });
    return 'cov=' + cov + ' paintedZones=' + painted;
  });
  const atLoad = await stat();
  await p.evaluate(() => { [...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view==='range').click(); });
  await p.waitForTimeout(700);
  await p.evaluate(() => { [...document.querySelectorAll('.apgm [data-view]')].find(x=>x.dataset.view==='countries').click(); });
  await p.waitForTimeout(900);
  console.log(g.padEnd(15), 'atLoad:', atLoad, '| after round-trip:', await stat());
  await p.close();
}
await b.close();
