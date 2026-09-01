/* What is actually live on the genus pages + the phylogeny page, 8.16.26. */
import { chromium } from 'playwright';

const PAGES = [
  'https://aroidpedia.com/alocasia',
  'https://aroidpedia.com/amorphophallus',
  'https://aroidpedia.com/aroid-phylogeny'
];

const b = await chromium.launch({ channel: 'chrome' });
for (const url of PAGES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  const info = [];
  p.on('console', m => { if (/Aroidpedia|card-v|file-v/.test(m.text())) info.push(m.text()); });
  try {
    await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(6000);
    const html = await p.content();
    const stamps = [...html.matchAll(/(GENUS [A-Z ]*?(?:INTRO|HERO|MORPHOLOGY & CULTIVATION)|ARACEAE TREE) [—-]? ?(\d+\.\d+\.\d+) (v\d+)/g)]
      .map(m => `${m[1].trim()} ${m[2]} ${m[3]}`);
    const treeVer = await p.evaluate(() => {
      const r = document.getElementById('ap-at');
      return r ? r.dataset.treeVersion : null;
    });
    const markers = {
      apGenus:   html.includes('ap-genus'),
      apClimate: /ap-clim|apgc-/.test(html),
      apMgroup:  html.includes('ap-mgroup'),
      regToggle: /ap-reg__more|ap-regtoggle|aria-expanded/.test(html)
    };
    console.log('\n=== ' + url);
    console.log('  stamps   :', [...new Set(stamps)].join(' | ') || '(none found in HTML)');
    console.log('  treeVer  :', treeVer);
    console.log('  markers  :', JSON.stringify(markers));
    console.log('  console  :', info.slice(0, 4).join(' // ') || '(none)');
  } catch (e) {
    console.log('\n=== ' + url + '\n  FAILED: ' + e.message.split('\n')[0]);
  }
  await p.close();
}
await b.close();
