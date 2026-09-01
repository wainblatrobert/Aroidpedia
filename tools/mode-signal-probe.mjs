import { chromium } from 'playwright';
const br = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
for (const url of ['https://www.aroidpedia.com/alocasia','https://www.aroidpedia.com/arum']) {
  const p = await (await br.newContext({viewport:{width:1440,height:900}})).newPage();
  // capture the signal AT DOMContentLoaded, before anything else settles
  await p.addInitScript(() => {
    window.__snap = {};
    const grab = (when) => { window.__snap[when] = {
      idx: document.querySelectorAll('.ax-index').length,
      species: document.querySelectorAll('.ax-index[data-mode="species"]').length,
      hybrids: document.querySelectorAll('.ax-index[data-mode="hybrids"]').length,
    }; };
    document.addEventListener('DOMContentLoaded', () => grab('dcl'));
    window.addEventListener('load', () => grab('load'));
  });
  await p.goto(url, { waitUntil:'networkidle', timeout:60000 });
  await p.waitForTimeout(3000);
  const r = await p.evaluate(() => ({
    ...window.__snap,
    settled: {
      idx: document.querySelectorAll('.ax-index').length,
      species: document.querySelectorAll('.ax-index[data-mode="species"]').length,
      hybrids: document.querySelectorAll('.ax-index[data-mode="hybrids"]').length,
    }
  }));
  console.log(url.split('/').pop().padEnd(16), JSON.stringify(r));
  await p.context().close();
}
await br.close();
