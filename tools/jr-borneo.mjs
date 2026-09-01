import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.goto('https://www.aroidpedia.com/journal', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(14000);
await p.evaluate(() => { const fb = Array.from(document.querySelectorAll('button')).find(b => /filter/i.test(b.textContent)); if (fb) fb.click(); });
await p.waitForTimeout(1000);
await p.evaluate(() => document.querySelector('.ap-jr-view[data-view="subzones"]').click());
await p.waitForTimeout(800);
const r = await p.evaluate(() => {
  const svg = document.querySelector('.ap-jr-svg');
  const get = t => {
    const el = svg.querySelector('[data-tag="' + t + '"], [data-place="' + t + '"]');
    if (!el) return null;
    return { cls: el.getAttribute('class'), heat: el.style.getPropertyValue('--heat') };
  };
  return { Borneo: get('Borneo'), Kalimantan: get('Kalimantan'),
           MalaysianBorneo: get('Malaysian Borneo'), Sarawak: get('Sarawak'),
           Kotawaringin: get('Kotawaringin Barat'), Sylhet: get('Sylhet') };
});
console.log(JSON.stringify(r, null, 1));
await b.close();
