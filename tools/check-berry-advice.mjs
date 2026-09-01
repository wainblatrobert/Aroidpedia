import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('https://aroidpedia.com/alocasia-pollination', { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForTimeout(4500);
const t = await p.evaluate(() => document.body.innerText);
console.log('page chars:', t.length, '\n');
for (const rx of [/[^.\n]{0,260}(clean|wash|squeeze|pulp|harvest)[^.\n]{0,260}\./gi,
                  /[^.\n]{0,260}(toxic|poison|irritan|oxalate|raphide|glove|skin|child|pet)[^.\n]{0,260}\./gi,
                  /[^.\n]{0,220}\bcucullata\b[^.\n]{0,220}\./gi]) {
  console.log('='.repeat(92));
  console.log('PATTERN: ' + rx.source.slice(0, 58));
  const seen = new Set();
  for (const m of t.matchAll(rx)) {
    const s = m[0].replace(/\s+/g, ' ').trim();
    if (seen.has(s.slice(0, 42))) continue; seen.add(s.slice(0, 42));
    console.log('  > ' + s.slice(0, 300));
  }
  console.log();
}
await b.close();
