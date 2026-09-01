/* Which of the built-but-unpasted files are actually still unpasted?
   Probe each page for a marker unique to the version I built. */
import { chromium } from 'playwright';

const CHECKS = [
  { url: 'https://aroidpedia.com/alocasia',
    markers: { 'intro card (ap-genus)': /ap-genus/, 'climate charts': /apgc-|ap-clim/,
               'region columns': /South Asia|SE Asia/i, 'MORPH & CULT block': /ap-mgroup/,
               'species auto-link': /journal\/[a-z-]+/ } },
  { url: 'https://aroidpedia.com/amorphophallus',
    markers: { 'intro card (ap-genus)': /ap-genus/, 'climate charts': /apgc-|ap-clim/,
               'collapsible regions': /aria-expanded|ap-reg__more|details/i,
               'MORPH & CULT block': /ap-mgroup/ } },
  { url: 'https://aroidpedia.com/amorphophallus-pollination',
    markers: { 'Wong 2022 in sources': /Wong[^<]{0,40}2022/i,
               'fruit-set softened': /25\s*[··]\s*6\s*[··]\s*0/,
               'Rambey growth series': /Rambey/i } },
  { url: 'https://aroidpedia.com/monstera-pollination',
    markers: { 'Part XIII calendar': /apmo-p13|The Calendar/i,
               'Croat 2024 in sources': /Phytotaxa 656/i } },
];

const b = await chromium.launch({ channel: 'chrome' });
for (const c of CHECKS) {
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  try {
    await p.goto(c.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(4000);
    const html = await p.content();
    console.log('\n=== ' + c.url.split('/').pop());
    for (const [name, rx] of Object.entries(c.markers)) {
      console.log(`   ${rx.test(html) ? 'PRESENT' : 'absent '}  ${name}`);
    }
  } catch (e) {
    console.log('\n=== ' + c.url.split('/').pop() + '  FAILED ' + e.message.split('\n')[0]);
  }
  await p.close();
}
await b.close();
