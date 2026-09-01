import { chromium } from 'playwright';
const br = await chromium.launch({ channel:'chrome', args:['--disable-gpu'] });
const p = await (await br.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('https://www.aroidpedia.com/arum',{waitUntil:'networkidle',timeout:90000});
await p.waitForTimeout(9000);
console.log(JSON.stringify(await p.evaluate(() => {
  // 1. is the timeline actually Arum's data?
  const texts = [...document.querySelectorAll('#timeline svg text')].map(t=>t.textContent);
  const years = texts.filter(t=>/^(1[6-9]\d\d|20\d\d)$/.test(t));
  // 2. where is the stray "Alocasia"?
  const hits = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n; while ((n = w.nextNode())) {
    if (n.nodeValue && n.nodeValue.includes('Alocasia')) {
      let el = n.parentElement, path = [];
      while (el && path.length < 4) { path.push(el.tagName.toLowerCase() + (el.className && typeof el.className==='string' ? '.'+el.className.trim().split(/\s+/)[0] : '')); el = el.parentElement; }
      hits.push({ text: n.nodeValue.trim().slice(0,120), where: path.join(' < ') });
    }
  }
  return {
    timelineFirstYear: years[0], timelineLastYear: years[years.length-1],
    timelineYearCount: years.length,
    sampleLabels: texts.filter(t=>/^Arum /.test(t)).slice(0,3),
    anyAlocasiaLabel: texts.some(t=>/Alocasia/.test(t)),
    alocasiaHits: hits,
  };
}),null,1));
await br.close();
