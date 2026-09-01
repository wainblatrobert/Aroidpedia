import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('https://aroidpedia.com/amorphophallus-pollination', { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForTimeout(4500);
const t = await p.evaluate(() => document.body.innerText);
for (const rx of [/[^.]{0,360}(times ever|ever been|only .{0,20}(times|records|cases)|documented in)[^.]{0,360}\./gi,
                  /[^.]{0,300}(fruit set|fruit-set)[^.]{0,300}\./gi]) {
  console.log('\n' + '='.repeat(92));
  console.log('PATTERN: ' + rx.source.slice(0, 56));
  const seen = new Set();
  for (const m of t.matchAll(rx)) {
    const s = m[0].replace(/\s+/g, ' ').trim();
    if (seen.has(s.slice(0, 45))) continue; seen.add(s.slice(0, 45));
    console.log('\n  > ' + s.slice(0, 440));
  }
}
await b.close();
