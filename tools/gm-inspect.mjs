import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
console.log(await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const out = [];
  const probe = ['Borneo','New Guinea','Sumatera','Jawa','Andaman Is.','Nicobar Is.','Brunei',
                 'Papua New Guinea','Bismarck Archipelago','Malaya','Philippines','Sulawesi',
                 'Queensland','Lesser Sunda Is.','Maluku','India','China South-Central','Assam'];
  probe.forEach(t => {
    const n = svg.querySelector('[data-zone="' + t + '"], [data-tag="' + t + '"], [data-place="' + t + '"]');
    if (!n) { out.push(t + ': NO NODE'); return; }
    const cs = getComputedStyle(n);
    out.push(t + ': [' + (n.getAttribute('class')||'') + '] fo=' + cs.fillOpacity + ' fill=' + cs.fill);
  });
  const covs = [...svg.querySelectorAll('.apgm-cov')].map(n => n.getAttribute('data-zone') || n.getAttribute('data-tag'));
  out.push('ALL apgm-cov (' + covs.length + '): ' + covs.join(', '));
  return out.join('\n');
}));
await b.close();
