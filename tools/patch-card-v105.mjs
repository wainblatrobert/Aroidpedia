/* Card v105 (FILE v123) — three changes, all aimed at height.
   Master: Footer injection 8.19.26 v29.txt -> v30.txt

   1. THE ZONE CHIP MOVES INTO THE HEADER, top right, beside CLIMATE
      RANGE — reclaiming a whole row. Only the TOP zone rides up there:
      abyssinicus has three chips and three would wrap the header onto
      a second line, saving nothing. The full mix is already cloned
      into the provenance (i), so nothing is lost.

   2. "Where it grows wild…" GOES BACK INLINE, per the grower — the row
      the chip vacated pays for it.

   3. THE (i) POP OPENS TO THE LEFT, over the article column. Opening
      upward (v104) stopped it leaving the screen but put it straight
      over the temperature chart — the thing the reader is holding the
      panel open to look at. Measured: 699-1034px of empty article
      column sits to the left of the dot at 1024-1600px wide, against
      only 199px at 820px. So left when it fits, and the v104
      above/below logic when it does not.                             */
import fs from 'fs';

const DIR = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/';
const SRC = DIR + 'Footer injection 8.19.26 v29.txt';
const OUT = DIR + 'Footer injection 8.19.26 v30.txt';
let s = fs.readFileSync(SRC, 'utf8');
const CR = String.fromCharCode(13), LF = String.fromCharCode(10);
const toCRLF = t => t.split(CR + LF).join(LF).split(LF).join(CR + LF);
const edits = [];
function cut(name, find, repl) {
  const f = toCRLF(find), r = toCRLF(repl);
  const n = s.split(f).length - 1;
  if (n !== 1) { console.error(`ABORT: "${name}" matched ${n}, expected 1`); process.exit(1); }
  s = s.replace(f, () => r);
  edits.push(name);
}

/* ── 1. body back inline ── */
cut('body-inline',
  `    wrap.appendChild(head);
    /* body is NOT appended here — draw() fills it and it lives in the
       (i) pop, inserted after the block is built */`,
  `    wrap.appendChild(head);
    /* v105: back inline — the header row freed by the zone chip pays
       for it, and the grower asked for it back if there was room. */
    wrap.appendChild(body);`);

cut('body-not-in-pop',
  `    /* v103: the explanatory sentence joins the note in the (i). The
       callout right above it already gives the months, and with an
       ECOLOGY row present the panel could not fit the map, both charts
       and the rest season inside the ~800px the grower measured. */
    restInfo.pop.insertBefore(body, restInfo.pop.firstChild);
    return { wrap: wrap, pop: restInfo.pop };`,
  `    return { wrap: wrap, pop: restInfo.pop };`);

/* ── 2. the top zone chip rides up into the header ── */
cut('chip-to-header',
  `      infoPop.appendChild(zc);`,
  `      infoPop.appendChild(zc);
      /* v105: THE VISIBLE ROW BECOMES ONE CHIP IN THE HEADER. The full
         mix stays in the clone above, so this loses nothing — and only
         the top zone goes up, because abyssinicus carries three and
         three would wrap the header to a second line, saving nothing.
         The clone is taken FIRST, so trimming here cannot reach it. */
      var keep = zwrap.querySelector(".apsc-clim__zone");
      var zdot = zwrap.querySelector(".apsc-clim__info");
      [].slice.call(zwrap.querySelectorAll(".apsc-clim__zone")).forEach(function(c){
        if (c !== keep && c.parentNode) c.parentNode.removeChild(c);
      });
      if (zwrap.parentNode) zwrap.parentNode.removeChild(zwrap);
      zwrap.className = "apsc-clim__zones apsc-clim__zones--head";
      climLabel.appendChild(zwrap);`);

cut('header-css',
  `.apsc .apsc-clim__zones{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 8px;align-items:center;}`,
  `.apsc .apsc-clim__zones{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 8px;align-items:center;}
/* v105: the chip rides in the fact label, pushed right. The label is
   uppercase + letterspaced by default and the chip must not inherit
   either, or "Tropical Moist" arrives as "T R O P I C A L  M O I S T". */
.apsc .apsc-fact--clim .apsc-fact__label{display:flex;align-items:center;gap:8px;}
.apsc .apsc-clim__zones--head{
  margin:0 0 0 auto;flex-wrap:nowrap;
  text-transform:none;letter-spacing:normal;
}`);

/* ── 3. the pop prefers the article column ── */
cut('pop-left',
  `      /* vertical: open UPWARD when there is more room up there, and cap
         the height to the space actually available so a long pop
         scrolls inside itself instead of running off the screen. */
      var d = dot.getBoundingClientRect();
      var above = d.top - pad;
      var below = vh - d.bottom - pad;
      r = pop.getBoundingClientRect();
      if (r.height > below && above > below){
        pop.style.top = "auto";
        pop.style.bottom = (d.height + 2) + "px";
        pop.style.maxHeight = Math.max(120, above) + "px";
      } else {
        pop.style.maxHeight = Math.max(120, below) + "px";
      }`,
  `      /* ── SIDEWAYS FIRST ──────────────────────────────────────────
         v104 stopped the pop leaving the screen by opening it upward,
         and upward puts it straight over the temperature chart — the
         thing the reader is holding the panel open to read. To the LEFT
         is the article column: 699-1034px of it at 1024-1600px wide,
         against 199px at 820. So go left when it genuinely fits and
         keep the vertical logic for when it does not. */
      var d = dot.getBoundingClientRect();
      var popW = pop.offsetWidth || 280;
      if (d.left - pad >= popW + 14){
        pop.style.left = (-(popW + 14)) + "px";
        pop.style.top = "auto";
        /* centred on the dot, then pulled inside the viewport */
        var want = d.top + d.height / 2 - Math.min(pop.scrollHeight, vh - 2 * pad) / 2;
        want = Math.max(pad, Math.min(want, vh - pad - Math.min(pop.scrollHeight, vh - 2 * pad)));
        pop.style.bottom = (d.bottom - want - Math.min(pop.scrollHeight, vh - 2 * pad)) + "px";
        pop.style.maxHeight = (vh - 2 * pad) + "px";
        return;
      }

      /* vertical: open UPWARD when there is more room up there, and cap
         the height to the space actually available so a long pop
         scrolls inside itself instead of running off the screen. */
      var above = d.top - pad;
      var below = vh - d.bottom - pad;
      r = pop.getBoundingClientRect();
      if (r.height > below && above > below){
        pop.style.top = "auto";
        pop.style.bottom = (d.height + 2) + "px";
        pop.style.maxHeight = Math.max(120, above) + "px";
      } else {
        pop.style.maxHeight = Math.max(120, below) + "px";
      }`);

cut('stamp', '"card-v104-file-v122"', '"card-v105-file-v123"');
cut('banner', 'FILE VERSION: v122', 'FILE VERSION: v123');

fs.writeFileSync(OUT, s, 'utf8');
console.log('edits: ' + edits.join(', '));
console.log('wrote ' + OUT.split('/').pop());
