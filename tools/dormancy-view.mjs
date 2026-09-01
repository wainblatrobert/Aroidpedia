/* THE REST-SEASON CURVE — pure SVG generation.
   Split out of the prototype renderer on 8.17.26 so the static page
   and the interactive tuner draw from ONE implementation. A tuner that
   renders its own copy of the chart is a tuner that lets you tune the
   wrong thing.

   No DOM, no I/O — string in, string out — so it inlines into a page
   as easily as it imports into Node.                                 */

import { monthName, shiftMonth } from './dormancy-core.mjs';

/* ── THE LOOK, AS TUNED BY THE USER 8.17.26 ────────────────────────
   Set in the live tuner against real cards, not chosen here. Worth
   recording that the size did NOT land where either of us first put
   it: I shipped 7.5 (too big), then 2.25 (too small), and the answer
   was 6.5 carried at a HIGHER opacity — smaller than the first cut but
   bolder, which is not a combination either of us reached by argument.
   Do not "tidy" these back towards round numbers. */
export const LOOK = {
  hatchSize:    6.5,    /* viewBox units — ~5.4 px on the card, ~3.4 px on a phone */
  hatchDensity: 1.1,    /* >1 packs tighter                          */
  hatchAngle:  -45,     /* degrees                                   */
  hatchAlpha:   0.65,
  bandTint:     0.11,
  curveWidth:   3.25,
  height:       112
};

const W = 560, PADY = 16;
const SLOT = W / 12;
/* ── THE YEAR IS A CIRCLE ──────────────────────────────────────────
   Each month owns a slot and is plotted at its slot CENTRE, so Jan
   sits half a slot in from the left and Dec half a slot in from the
   right. The curve is drawn through months -2..13 (the same values,
   wrapped) and clipped, so it runs off both edges mid-flight.
   x=0 and x=W therefore interpolate the SAME Dec-Jan pair and the two
   edge heights are EQUAL BY CONSTRUCTION. Roll it into a cylinder and
   it joins. */
const cx = m => (m + 0.5) * SLOT;

function curvePath(vals, H) {
  const yOf = v => PADY + (H - 2 * PADY) * (1 - v);
  const at = i => [cx(i), yOf(vals[(i % 12 + 12) % 12])];
  let d = `M${at(-2)[0].toFixed(1)} ${at(-2)[1].toFixed(1)}`;
  for (let i = -2; i < 13; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)},` +
         `${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)},` +
         `${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

let UID = 0;
export function chart(cal, southern, look) {
  const L = Object.assign({}, LOOK, look || {});
  const H = L.height, uid = ++UID;
  /* rest[] is an ABSOLUTE stress, so no amplitude rescaling: a flat
     species draws flat because its numbers are flat. */
  const y = cal.rest.map(r => 0.06 + 0.88 * Math.min(1, r));
  const words = !cal.cued ? ['', '']
              : cal.driver === 'cold' ? ['cool', 'cool']
              : cal.driver === 'dry'  ? ['dry', 'dry'] : ['dry', 'cool'];

  const grid = [0, 3, 6, 9].map(m =>
    `<line x1="${(m * SLOT).toFixed(1)}" y1="${PADY}" x2="${(m * SLOT).toFixed(1)}" ` +
    `y2="${H - PADY}" stroke="rgba(243,241,234,.08)"/>`).join('');

  /* ⚠ NOTHING is drawn when there is no lean season. An earlier cut
     hatched the WHOLE year to avoid an empty-looking chart, and that
     was worse than empty: a full-width fill is the SAME MARK as the
     lean band, so it read as "the whole year is the lean season" —
     the exact opposite of the finding. The callout carries that case. */
  let band = '';
  if (cal.win) {
    const st = southern ? shiftMonth(cal.win.start, 6) : cal.win.start;
    for (let k = 0; k < cal.win.len; k++) {
      const m = (st + k) % 12, x = (m * SLOT).toFixed(1);
      band += `<rect x="${x}" y="${PADY}" width="${SLOT.toFixed(1)}" height="${H - 2 * PADY}" ` +
              `fill="rgba(175,192,144,${L.bandTint})"/>` +
              `<rect x="${x}" y="${PADY}" width="${SLOT.toFixed(1)}" height="${H - 2 * PADY}" ` +
              `fill="url(#p${uid})"/>`;
    }
  }

  /* the hatch is the band's own word, repeated — label and texture in
     one mark, so the chart needs no key. Deliberately below reading
     size: it should read as "marked" at a glance and resolve into a
     word only on a close look. */
  /* ⚠ THE TILE MUST FOLLOW THE WORD LENGTH. This was a flat 3.5x the
     font size — a constant silently calibrated for a THREE-letter word.
     "dry" fitted; "cool" is four letters, ran past the half-tile offset
     of its neighbour and overlapped. It went unseen because every
     screenshot used to tune the look happened to be a dry-driven
     species, and only cold-driven ones (Amorphophallus dunnii) draw
     "cool".
     3.5 / 3 letters = 1.167 per letter, so per-letter spacing keeps the
     tuned "dry" tile IDENTICAL and gives a longer word proportionally
     more room. The vertical rhythm is untouched for the same reason —
     it is what was approved. */
  const chars = Math.max(words[0].length, words[1].length) || 3;
  const tw = (1.1667 * chars * L.hatchSize) / L.hatchDensity;
  const th = (1.25 * L.hatchSize) / L.hatchDensity;
  const txt = (x, yy, w) =>
    `<text x="${x.toFixed(2)}" y="${yy.toFixed(2)}" font-size="${L.hatchSize}" ` +
    `font-family="Helvetica Neue, Helvetica, Arial" ` +
    `fill="rgba(175,192,144,${L.hatchAlpha})">${w}</text>`;

  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${
      cal.win ? 'lean season marked' : 'no lean season'}">
    <defs>
      <clipPath id="c${uid}"><rect x="0" y="0" width="${W}" height="${H}"/></clipPath>
      <pattern id="p${uid}" width="${tw.toFixed(2)}" height="${th.toFixed(2)}"
               patternUnits="userSpaceOnUse" patternTransform="rotate(${L.hatchAngle})">
        ${txt(0, th * 0.46, words[0])}${txt(tw / 2, th * 0.96, words[1])}
      </pattern>
    </defs>
    ${grid}${band}
    <path d="${curvePath(y, H)}" fill="none" stroke="rgba(175,192,144,.85)"
          stroke-width="${L.curveWidth}" stroke-linecap="round" clip-path="url(#c${uid})"/>
    ${Array.from({ length: 12 }, (_, m) =>
      `<text x="${cx(m).toFixed(1)}" y="${H - 3}" text-anchor="middle" font-size="9"
         fill="rgba(243,241,234,.45)" font-family="Helvetica Neue, Helvetica, Arial">${
         monthName(m)[0]}</text>`).join('')}
  </svg>`;
}
