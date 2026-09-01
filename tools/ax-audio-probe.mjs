import { chromium } from 'playwright';
const br = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
const p = await (await br.newContext({viewport:{width:1440,height:900}})).newPage();
for (const url of ['https://www.aroidpedia.com/alocasia','https://www.aroidpedia.com/amorphophallus']) {
  await p.goto(url, { waitUntil:'networkidle', timeout:60000 });
  await p.waitForTimeout(2000);
  console.log(url, JSON.stringify(await p.evaluate(() => {
    const n = document.querySelector('.ap-gh-audio-name');
    const o = document.querySelector('.ap-gh-audio-note');
    const a = document.querySelector('.ap-gh-audio audio');
    return { name: n && n.textContent, note: o && o.textContent, src: a && (a.currentSrc||a.src||'').slice(-70) };
  })));
}
await br.close();
