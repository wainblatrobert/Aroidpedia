import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' });

const JOBS = [
  { url: 'https://aroidpedia.com/alocasia-pollination',
    rx: /[^.]{0,300}(Colocasiomyia)[^.]{0,300}\./g, label: 'ALOCASIA — pollinator records' },
  { url: 'https://aroidpedia.com/amorphophallus-pollination',
    rx: /[^.]{0,320}(fruit set|fruit-set|documented)[^.]{0,320}\./gi, label: 'AMORPHOPHALLUS — fruit set' },
];
for (const j of JOBS) {
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto(j.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForTimeout(4500);
  const t = await p.evaluate(() => document.body.innerText);
  console.log('\n' + '='.repeat(96));
  console.log(j.label + '   ' + j.url);
  console.log('='.repeat(96));
  const seen = new Set();
  for (const m of t.matchAll(j.rx)) {
    const s = m[0].replace(/\s+/g, ' ').trim();
    if (seen.has(s.slice(0, 50))) continue;
    seen.add(s.slice(0, 50));
    console.log('\n  > ' + s.slice(0, 430));
  }
  await p.close();
}
await b.close();
