import { chromium } from 'playwright';
import fs from 'fs';
const JS = fs.readFileSync('C:/Users/nli0490/Claude/Aroidpedia/docs/footer.js', 'utf8');
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
await p.route('**/footer.js*', r => r.fulfill({ body: JS, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' } }));
await p.goto('https://www.aroidpedia.com/alocasia', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(13000);
console.log(await p.evaluate(() => {
  const svg = document.querySelector('.apgm svg');
  const ghosts = [...svg.querySelectorAll('.apgm-ghost')];
  const names = ghosts.map(n => n.getAttribute('data-zone') || n.getAttribute('data-ghost') || '(' + (n.getAttribute('class')||'') + ')');
  return 'ghost count: ' + ghosts.length + '\n' + names.join(', ');
}));
await b.close();
