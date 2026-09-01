/* Card v102 (FILE v120) — two prose blocks collapse into (i) dots.
   Master: Footer injection 8.19.26 v26.txt -> v27.txt

   1. the "Outdoor growing…" note -> an (i) beside REST SEASON
   2. a new (i) beside the climate-zone chips, explaining the mix

   Both reuse the EXISTING .apsc-clim__info / __infopop component — same
   look, same hover, same tap-to-open, same outside-click-to-close. The
   wiring is factored into makeInfoDot() rather than copied twice; a
   third hand-rolled copy of a control is how two of them end up
   behaving differently.

   ⚠ THE ZONE CHIPS ARE NOT KÖPPEN. They are World Terrestrial
   Ecosystems temperature x moisture domains — "Tropical Moist", "Warm
   Temperate Dry" — not Köppen codes (Af/Am/Cfa). The genus pages DO
   use Köppen, from genus-climate.json, which is probably where the
   name came from. The pop says what they actually are.               */
import fs from 'fs';

const DIR = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/';
const SRC = DIR + 'Footer injection 8.19.26 v26.txt';
const OUT = DIR + 'Footer injection 8.19.26 v27.txt';
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

/* ── the shared factory ── */
cut('factory',
  `  /* the whole block, hemisphere toggle included */
  function buildRest(cal){`,
  `  /* ── (i) DOT FACTORY ─────────────────────────────────────────────
     The provenance dot beside CLIMATE RANGE was built inline in
     buildRow. Two more are wanted, so the behaviour lives here once:
     hover opens it, click opens it (hover has no touch analogue), any
     outside click closes it, and it is reachable by keyboard. A third
     hand-rolled copy is how two dots end up behaving differently. */
  function makeInfoDot(ariaLabel){
    var dot = el("span", "apsc-clim__info", "i");
    var pop = el("div", "apsc-clim__infopop");
    dot.appendChild(pop);
    dot.setAttribute("tabindex", "0");
    dot.setAttribute("role", "button");
    dot.setAttribute("aria-label", ariaLabel);
    dot.addEventListener("click", function(ev){
      ev.stopPropagation();
      dot.classList.toggle("is-open");
    });
    document.addEventListener("click", function(){
      if (dot.isConnected) dot.classList.remove("is-open");
    });
    return { dot: dot, pop: pop };
  }

  /* the whole block, hemisphere toggle included */
  function buildRest(cal){`);

/* ── 1. REST SEASON: the note moves into a dot ── */
cut('rest-note-into-dot',
  `    var top = el("div", "apclim-rest__top");
    top.appendChild(el("span", "apsc-clim__sub", "rest season"));`,
  `    var top = el("div", "apclim-rest__top");
    var topLabel = el("span", "apsc-clim__sub", "rest season");
    /* v102: the outdoor-growing caveat and the y-axis method collapse
       in here. The caveat has to stay one click away rather than
       disappear — it is the line that stops the chart being read as a
       promise about an indoor plant. */
    var restInfo = makeInfoDot("What the rest season means");
    restInfo.pop.appendChild(note);
    restInfo.pop.appendChild(el("div", "apclim-rest__note",
      "The curve is REST PRESSURE: how hard each month pushes the plant to " +
      "stop, read from monthly rainfall and night temperature across the " +
      "tagged places, each measured against that place's own year-round " +
      "floor. It reports whether the climate offers a cue — not whether the " +
      "plant rests. Many species go down on their own schedule regardless."));
    topLabel.appendChild(restInfo.dot);
    top.appendChild(topLabel);`);

cut('drop-visible-note',
  `    if (flowLine) wrap.appendChild(flowLine);
    wrap.appendChild(note);`,
  `    if (flowLine) wrap.appendChild(flowLine);
    /* the note is no longer appended here — it lives in the (i) pop */`);

/* ── 2. the zone chips get their own dot ── */
cut('zone-dot',
  `      box.appendChild(zwrap);
    }`,
  `      /* v102: what the zone mix IS. ⚠ These are World Terrestrial
         Ecosystems temperature x moisture domains, NOT Köppen codes —
         the genus pages use Köppen, these do not, and the two get
         confused precisely because the chips look like a climate
         classification. */
      var zInfo = makeInfoDot("What the climate zones mean");
      zInfo.pop.appendChild(el("div", "apsc-clim__note",
        "Temperature and moisture domains from the World Terrestrial " +
        "Ecosystems layer, read over the same grid cells the charts above " +
        "are measured on. Each percentage is that zone's share of those " +
        "cells, so the mix describes the range being shown — after the " +
        "warm/moist clip — rather than the species' whole distribution. " +
        "These are the coarse pairings (Tropical Moist, Warm Temperate Dry, " +
        "Sub Tropical Desert…), not Köppen codes."));
      zwrap.appendChild(zInfo.dot);
      box.appendChild(zwrap);
    }`);

/* the dot inside a chip row needs a baseline that matches the chips */
cut('zone-dot-css',
  `.apsc .apsc-clim__zones{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 8px;}`,
  `.apsc .apsc-clim__zones{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 8px;align-items:center;}
/* v102: the dot rides in the chip row, so it loses the 8px lead it
   needs when it trails a text label */
.apsc .apsc-clim__zones .apsc-clim__info{margin-left:0;}`);

cut('stamp', '"card-v101-file-v119"', '"card-v102-file-v120"');
cut('banner', 'FILE VERSION: v119', 'FILE VERSION: v120');

fs.writeFileSync(OUT, s, 'utf8');
console.log('edits: ' + edits.join(', '));
console.log('wrote ' + OUT.split('/').pop());
