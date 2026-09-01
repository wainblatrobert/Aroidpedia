import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
for (const ep of ['aphyllus','dracontioides']) {
  const p = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  await p.goto('https://www.aroidpedia.com/journal/amorphophallus-' + ep, { waitUntil: 'networkidle', timeout: 120000 });
  await p.waitForTimeout(9000);
  const r = await p.evaluate(() => {
    const all = [...document.images].map(i => i.currentSrc || i.src);
    const counts = {};
    all.forEach(u => { const k = u.split('/').pop().split('?')[0]; counts[k] = (counts[k]||0)+1; });
    return {
      total: all.length,
      github: all.filter(u => /github\.io/i.test(u)).length,
      squarespace: all.filter(u => /squarespace-cdn/i.test(u)).length,
      plate: all.filter(u => /pflanzenreich/i.test(u)),
      repeated: Object.entries(counts).filter(([,n]) => n > 1).map(([k,n]) => k + ' x' + n),
    };
  });
  console.log('=== ' + ep);
  console.log('  imgs total ' + r.total + ' | github.io ' + r.github + ' | squarespace ' + r.squarespace);
  console.log('  1911 plate rendered: ' + r.plate.length + (r.plate[0] ? '  ' + r.plate[0].split('/').slice(-2).join('/') : ''));
  console.log('  filenames appearing more than once: ' + (r.repeated.length ? r.repeated.join(', ') : 'none'));
  await p.close();
}
await b.close();
