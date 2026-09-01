import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('https://aroidpedia.com/alocasia-pollination', { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForTimeout(4500);
const t = await p.evaluate(() => document.body.innerText);
for (const rx of [/[^.]{0,340}\bfive\b[^.]{0,340}\./gi,
                  /[^.]{0,340}(Atherigona|Neurochaeta|Cadrema)[^.]{0,340}\./gi,
                  /[^.]{0,300}pollinator (?:records|is known|are known)[^.]{0,300}\./gi]) {
  console.log('\n' + '='.repeat(90));
  console.log('PATTERN ' + rx.source.slice(0, 60));
  const seen = new Set();
  for (const m of t.matchAll(rx)) {
    const s = m[0].replace(/\s+/g, ' ').trim();
    if (seen.has(s.slice(0, 40))) continue; seen.add(s.slice(0, 40));
    console.log('  > ' + s.slice(0, 400));
  }
}
await b.close();
