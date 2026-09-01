/* Measure the mobile hero clamp for AMORPHOPHALLUS.
 *
 * It is 14 characters - the longest accent word of any genus guide, and
 * probably WIDER than the hub's IDENTIFICATION despite the same count,
 * because IDENTIFICATION carries four narrow I's.
 *
 * Measured the way the 8.2vw value was originally established: in the
 * LIVE morphology hero, with its real font, weight and tracking, at a
 * 320px viewport - not in a mock.
 */
import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 320, height: 800 } });
await page.goto('https://www.aroidpedia.com/alocasia-morphology',
                { waitUntil: 'networkidle', timeout: 90000 });

const out = await page.evaluate(() => {
  const t = document.querySelector('.ap-almor-hero .amal-title');
  if (!t) return { error: 'hero title not found' };
  const box = t.getBoundingClientRect().width;
  const cs = getComputedStyle(t);

  // a hidden clone we can retype and re-size without touching the page
  const probe = document.createElement('span');
  probe.style.cssText = `position:absolute;left:-9999px;white-space:nowrap;
    font-family:${cs.fontFamily};font-weight:${cs.fontWeight};
    letter-spacing:${cs.letterSpacing};`;
  document.body.appendChild(probe);

  const vw = window.innerWidth / 100;
  const measure = (word, vwUnits) => {
    probe.style.fontSize = (vwUnits * vw) + 'px';
    probe.textContent = word;
    return +probe.getBoundingClientRect().width.toFixed(1);
  };

  const words = ['MORPHOLOGY', 'PHILODENDRON',
                 'IDENTIFICATION', 'AMORPHOPHALLUS'];
  const rows = {};
  for (const w of words) {
    rows[w] = {
      chars: w.length,
      at9_6: measure(w, 9.6),
      at8_2: measure(w, 8.2),
      at7_4: measure(w, 7.4), at7_2: measure(w, 7.2), at7_0: measure(w, 7.0), at6_8: measure(w, 6.8)
    };
  }
  probe.remove();
  return { viewport: window.innerWidth, titleBox: +box.toFixed(1),
           fontFamily: cs.fontFamily.split(',')[0],
           letterSpacing: cs.letterSpacing, rows };
});

console.log(JSON.stringify(out, null, 2));
await browser.close();
