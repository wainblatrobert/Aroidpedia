import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('https://aroidpedia.com/monstera-pollination', { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForTimeout(5000);
const t = await p.evaluate(() => document.body.innerText);
const probe = ['sterile flower', 'secretion', 'stigmatic secretion', 'reward', 'lipid',
               'droplet', 'orange', 'resin', 'simultaneous', 'how many inflorescences',
               '1-3', 'flowering season'];
for (const k of probe) {
  const n = (t.match(new RegExp(k.replace(/[-]/g, '\\-'), 'gi')) || []).length;
  console.log(`  ${k.padEnd(22)} ${n}`);
}
console.log('\n--- sentences with "sterile" ---');
for (const m of t.matchAll(/[^.\n]{0,160}sterile[^.\n]{0,160}\./gi)) {
  console.log('  > ' + m[0].replace(/\s+/g, ' ').trim().slice(0, 250));
}
await b.close();
