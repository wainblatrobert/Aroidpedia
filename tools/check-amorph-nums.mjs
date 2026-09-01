import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('https://aroidpedia.com/amorphophallus-pollination', { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForTimeout(4500);
const t = await p.evaluate(() => document.body.innerText);
for (const k of ['82.7','54.1','75.6','three inflorescences','3 of 10','out of ten','hewittii','julaihii','eburneus','two more added']) {
  const n = (t.match(new RegExp(k.replace(/[.]/g,'\.'),'gi'))||[]).length;
  console.log(`  ${k.padEnd(22)} ${n}`);
}
const i = t.indexOf('four cases in the older record');
console.log('\n--- context ---\n' + t.slice(Math.max(0,i-420), i+320).replace(/\n{2,}/g,'\n'));
await b.close();
