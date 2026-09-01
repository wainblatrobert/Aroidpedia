/* End-to-end proof for climate.json 1.6.0.

   The feeds are byte-verified live, but the claim that matters to a
   reader is what the CARD says. Amorphophallus hirsutus is the post
   whose climate row moved: tagged Nicobar + Sumatra + Indonesia, and
   Nicobar's coldest-month low rose 21.5 -> 22.6 C when the Andaman
   cells left. So the card must (a) be reading 1.6.0 and (b) still
   render a Climate range at all.

   Alocasia decipiens carries BOTH Nicobar and Andaman Islands and is
   the check that splitting the tag did not cost that post anything. */
import { chromium } from 'playwright';

const PAGES = [
  ['https://www.aroidpedia.com/journal/amorphophallus-hirsutus', 'Amorphophallus hirsutus'],
  ['https://www.aroidpedia.com/journal/alocasia-decipiens', 'Alocasia decipiens'],
];

const b = await chromium.launch({ channel: 'chrome', headless: true });
for (const [url, name] of PAGES) {
  const p = await b.newPage();
  await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await p.waitForTimeout(4000);
  const out = await p.evaluate(() => {
    const q = s => document.querySelector(s);
    const clim = q('[data-apclim-data]');
    const txt = el => (el ? el.innerText.replace(/\s+/g, ' ').trim() : null);
    /* the geography chips the climate block composes against */
    const chips = [...document.querySelectorAll('[class*="chip"], [class*="geo"]')]
      .map(e => e.innerText.trim()).filter(t => t && t.length < 40);
    return {
      version: clim ? clim.getAttribute('data-apclim-data') : null,
      label: txt(document.evaluate(
        "//*[contains(text(),'Climate range')]", document, null, 9, null).singleNodeValue),
      block: clim ? txt(clim).slice(0, 420) : null,
      hasNicobar: document.body.innerText.includes('Nicobar'),
      hasAndaman: document.body.innerText.includes('Andaman'),
      chipSample: [...new Set(chips)].slice(0, 12),
    };
  });
  console.log(`\n=== ${name}\n  ${url}`);
  console.log(`  data-apclim-data : ${out.version}`);
  console.log(`  label            : ${out.label}`);
  console.log(`  Nicobar on page  : ${out.hasNicobar}   Andaman on page: ${out.hasAndaman}`);
  console.log(`  block            : ${out.block}`);
  await p.close();
}
await b.close();
