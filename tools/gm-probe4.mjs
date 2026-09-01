import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
const view = async v => { await p.evaluate(vv => { Array.from(document.querySelectorAll('.apgm [data-view]')).find(x => x.dataset.view === vv).click(); }, v); await p.waitForTimeout(700); };

/* 1: range - which fill-0 shapes light on hover (the "little islands") */
await view('range');
console.log('RANGE fill-0 native (SUB) shapes:', await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  return [...svg.querySelectorAll('.apgm-zone')].filter(n => {
    const c = n.getAttribute('class') || '';
    return !c.includes('ghost') && !c.includes('split') && parseFloat(getComputedStyle(n).fillOpacity) === 0;
  }).map(n => n.getAttribute('data-zone')).slice(0, 25).join(', ');
}));

/* 2+4: continents - group names + fills */
await view('continents');
console.log('CONTINENTS:', await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const probe = ['China','China South-Central','India','Queensland','New Guinea','Bismarck Archipelago','Papua New Guinea','Solomon Islands','Australia','Indonesia','Malaysia','Japan','Taiwan'];
  return probe.map(t => {
    const n = svg.querySelector('[data-zone="' + t + '"]');
    if (!n) return t + '=?';
    n.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    const hov = document.querySelector('.apgm [data-on]');
    const read = hov ? hov.textContent.trim().slice(0, 40) : '-';
    return t + ' fo=' + Math.round(parseFloat(getComputedStyle(n).fillOpacity)*100)/100 + ' reads"' + read + '"';
  }).join('\n');
}));

/* 5: regions - china's group name */
await view('regions');
console.log('REGIONS:', await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  return ['China','China South-Central','Japan','Taiwan','Queensland'].map(t => {
    const n = svg.querySelector('[data-zone="' + t + '"]');
    if (!n) return t + '=?';
    n.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    const hov = document.querySelector('.apgm [data-on]');
    return t + ' reads"' + (hov ? hov.textContent.trim().slice(0, 40) : '-') + '"';
  }).join('\n');
}));

/* 6: subzones2 + divisions fills for the Sarawak family */
for (const v of ['subzones2','divisions']) {
  await view(v);
  console.log(v.toUpperCase() + ':', await p.evaluate(() => {
    const svg = document.querySelector('.apgm svg');
    return ['Sarawak','Sabah','Kapit','Sibu','Kuching','Bintulu','Miri','Kalimantan','East Kalimantan'].map(t => {
      const n = svg.querySelector('[data-zone="' + t + '"]');
      if (!n) return t + '=?';
      n.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      const hov = document.querySelector('.apgm [data-on]');
      return t + ' fo=' + Math.round(parseFloat(getComputedStyle(n).fillOpacity)*100)/100 + ' "' + (hov ? hov.textContent.trim().slice(0, 34) : '-') + '"';
    }).join('\n');
  }));
}
await b.close();
