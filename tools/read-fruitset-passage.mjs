import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('https://aroidpedia.com/aroid-pollination', { waitUntil: 'domcontentloaded', timeout: 45000 });
await p.waitForTimeout(3000);
const t = await p.evaluate(() => document.body.innerText);
const i = t.indexOf('26%');
console.log('--- 1200 chars around the figure ---\n');
console.log(t.slice(Math.max(0, i - 800), i + 400).replace(/\n{3,}/g, '\n\n'));
console.log('\n--- every Colocasia sentence on the page ---');
for (const m of t.matchAll(/[^.\n]{0,200}Colocasia[^.\n]{0,200}\./g)) {
  console.log('  > ' + m[0].replace(/\s+/g, ' ').trim().slice(0, 300));
}
await b.close();
