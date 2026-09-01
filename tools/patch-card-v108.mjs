/* Card v108 (FILE v126) — the top pad is the site header, not zero.
   Master: Footer injection 8.19.26 v32.txt -> v33.txt

   At 820px there is no sideways room either side of the panel, so the
   pop falls back to opening upward — and upward it ran to y=1, tucking
   its first line under Squarespace's sticky site header. Diagnosed,
   not guessed: elementFromPoint at the pop's top edge returned
   .header-title-nav-wrapper, and only that one sample of five was
   covered. The rest of the pop was clean.

   So the vertical clamp's top pad has to be the bottom of whatever
   fixed/sticky chrome is pinned up there, measured at open time rather
   than hardcoded — the header's height changes with the announcement
   bar and between breakpoints.

   ⚠ NOT FIXED, AND NOT PRETENDING TO BE: at 820px the pop still
   overlaps the temperature chart. The panel is full-width at that
   breakpoint, so there is no sideways room by definition and every
   vertical placement lands on panel content. That is the v104
   trade-off, unchanged here.                                        */
import fs from 'fs';

const DIR = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/';
const SRC = DIR + 'Footer injection 8.19.26 v32.txt';
const OUT = DIR + 'Footer injection 8.19.26 v33.txt';
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

/* measure the chrome once per open, right after pad is set */
cut('measure-header',
  `      var pad = 8;
      var vw = window.innerWidth, vh = window.innerHeight;`,
  `      var pad = 8;
      var vw = window.innerWidth, vh = window.innerHeight;
      /* ⚠ THE TOP OF THE VIEWPORT IS NOT THE TOP OF THE PAGE. Squarespace
         pins a sticky header up there, so a pop clamped to pad=8 puts its
         first line underneath it. Measured at open time, not hardcoded:
         the header's height moves with the announcement bar and the
         breakpoint. */
      var topPad = pad;
      var hdr = document.querySelector("#header, .header-announcement-bar-wrapper");
      if (hdr){
        var hpos = getComputedStyle(hdr).position;
        if (hpos === "fixed" || hpos === "sticky"){
          var hr = hdr.getBoundingClientRect();
          if (hr.top <= pad && hr.bottom > topPad) topPad = hr.bottom + 4;
        }
      }`);

/* sideways centring: clamp against the header, and size to what is left */
cut('sideways-uses-topPad',
  `        var want = d.top + d.height / 2 - Math.min(pop.scrollHeight, vh - 2 * pad) / 2;
        want = Math.max(pad, Math.min(want, vh - pad - Math.min(pop.scrollHeight, vh - 2 * pad)));
        pop.style.bottom = (d.bottom - want - Math.min(pop.scrollHeight, vh - 2 * pad)) + "px";
        pop.style.maxHeight = (vh - 2 * pad) + "px";`,
  `        var room = vh - topPad - pad;
        var h = Math.min(pop.scrollHeight, room);
        var want = d.top + d.height / 2 - h / 2;
        want = Math.max(topPad, Math.min(want, vh - pad - h));
        pop.style.bottom = (d.bottom - want - h) + "px";
        pop.style.maxHeight = room + "px";`);

/* upward fallback: the room above ends at the header, not at 8px */
cut('above-uses-topPad',
  `      var above = d.top - pad;`,
  `      var above = d.top - topPad;`);

cut('stamp', '"card-v107-file-v125"', '"card-v108-file-v126"');
cut('banner', 'FILE VERSION: v125', 'FILE VERSION: v126');

fs.writeFileSync(OUT, s, 'utf8');
console.log('edits: ' + edits.join(', '));
console.log('wrote ' + OUT.split('/').pop());
