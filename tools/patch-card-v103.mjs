/* Card v103 (FILE v121) — the panel gets shorter.
   Master: Footer injection 8.19.26 v27.txt -> v28.txt

   Two blocks move into an (i), on the grower's instruction:

   1. CLIMATE ZONES (the Köppen mix) -> the REST SEASON (i), with a
      real explanation of what the percentage counts. It is a share of
      GROUND, not of the year — the feed's own method says each place
      contributes its pixel-level Köppen distribution — and "savanna
      63%" being read as "savanna weather for 63% of the year" is
      exactly the misreading the number invites.

      ⚠ A NON-AMORPHOPHALLUS PAGE HAS NO REST BLOCK. Alocasia carries
      climate zones and no rest season, so the zones fall back to the
      CLIMATE RANGE provenance (i) rather than staying inline on the
      one genus that cannot collapse them.

   2. "Where it grows wild this is the driest stretch…" -> the same
      (i). The callout directly above already names the months, and
      with ECOLOGY present the panel could not fit the map, both
      charts and the rest season in the ~800px the grower measured.

   The elevation line ("AT 500–1200 M") STAYS INLINE. It was not part
   of the instruction and it is a different fact — altitude, not
   classification.                                                    */
import fs from 'fs';

const DIR = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/';
const SRC = DIR + 'Footer injection 8.19.26 v27.txt';
const OUT = DIR + 'Footer injection 8.19.26 v28.txt';
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

/* ── 1. buildRest hands back its pop, and swallows the body line ── */
cut('rest-returns-pop',
  `    if (flowLine) wrap.appendChild(flowLine);
    /* the note is no longer appended here — it lives in the (i) pop */
    draw();
    return wrap;`,
  `    if (flowLine) wrap.appendChild(flowLine);
    draw();
    /* v103: the explanatory sentence joins the note in the (i). The
       callout right above it already gives the months, and with an
       ECOLOGY row present the panel could not fit the map, both charts
       and the rest season inside the ~800px the grower measured. */
    restInfo.pop.insertBefore(body, restInfo.pop.firstChild);
    return { wrap: wrap, pop: restInfo.pop };`);

cut('rest-body-not-inline',
  `    wrap.appendChild(head);
    wrap.appendChild(body);`,
  `    wrap.appendChild(head);
    /* body is NOT appended here — draw() fills it and it lives in the
       (i) pop, inserted after the block is built */`);

/* ── 2. buildRow routes the zones somewhere sensible ── */
cut('row-returns-target',
  `      box.appendChild(buildRest(restCal));
    }
    return { row: row, mini: mini };`,
  `      var restBlock = buildRest(restCal);
      box.appendChild(restBlock.wrap);
      zonesTarget = restBlock.pop;
    }
    /* v103: where the CLIMATE ZONES line should land. The rest (i) when
       there is one; otherwise the provenance (i), so a genus without a
       rest season is not the only page still showing it inline. */
    return { row: row, mini: mini, zonesTarget: zonesTarget || infoPop };`);

cut('declare-target',
  `    if (restCal){
      box.setAttribute("data-apclim-collapse", "1");`,
  `    var zonesTarget = null;
    if (restCal){
      box.setAttribute("data-apclim-collapse", "1");`);

/* ── 3. the kz block sends CLIMATE ZONES to that target ── */
cut('kz-target',
  `            function line(label, text){
              var d = document.createElement("div");
              d.className = "apclim-kz";
              var l = document.createElement("span");
              l.className = "apclim-kz__label";
              l.textContent = label;
              var t = document.createElement("span");
              t.className = "apclim-kz__val";
              t.textContent = text;
              d.appendChild(l); d.appendChild(t);
              box.appendChild(d);
            }`,
  `            /* v103: CLIMATE ZONES goes into an (i); the elevation line
               stays inline, being a different fact (altitude, not
               classification) and not part of the instruction. */
            function line(label, text, target){
              var d = document.createElement("div");
              d.className = "apclim-kz";
              var l = document.createElement("span");
              l.className = "apclim-kz__label";
              l.textContent = label;
              var t = document.createElement("span");
              t.className = "apclim-kz__val";
              t.textContent = text;
              d.appendChild(l); d.appendChild(t);
              (target || box).appendChild(d);
            }`);

cut('kz-zones-into-pop',
  `              if (mix){ line("CLIMATE ZONES", mix); drew = true; }`,
  `              if (mix){
                line("CLIMATE ZONES", mix, built.zonesTarget);
                /* WHAT THE PERCENTAGE COUNTS. The feed's own method:
                   each place contributes its PIXEL-LEVEL Köppen
                   distribution — so it is a share of ground, never of
                   time, and "savanna 63%" invites exactly the wrong
                   reading without this. */
                var why = document.createElement("div");
                why.className = "apclim-kz__fine";
                why.textContent =
                  "Köppen–Geiger classes over the same ground the charts " +
                  "above measure. The percentage is the share of that GROUND, " +
                  "not of the year: savanna 63% means 63% of the mapped cells " +
                  "classify as savanna — not that it is savanna-like for 63% " +
                  "of the months. Whole tagged units are read, so a species " +
                  "tagged by country mixes in ground it may not occupy.";
                (built.zonesTarget || box).appendChild(why);
                zonesCollapsed = true;
                drew = true;
              }`);

cut('kz-declare-flag',
  `            var drew = false;`,
  `            var drew = false, zonesCollapsed = false;`);

/* the old provenance line now only makes sense if something stayed inline */
cut('kz-fine-only-if-inline',
  `            if (drew){
              var fine = document.createElement("div");
              fine.className = "apclim-kz__fine";`,
  `            /* v103: only when a line is still INLINE — the zones took
               their own explanation into the pop with them, and a
               provenance line under an empty slot is noise. */
            if (drew && !(zonesCollapsed && !e.elev)){
              var fine = document.createElement("div");
              fine.className = "apclim-kz__fine";`);

/* the pop needs the kz block to sit sensibly inside it */
cut('kz-pop-css',
  `.apsc .apclim-kz+.apclim-kz{margin-top:7px;padding-top:0;border-top:0;}`,
  `.apsc .apclim-kz+.apclim-kz{margin-top:7px;padding-top:0;border-top:0;}
/* v103: inside an (i) pop the block has no panel to rule off from */
.apsc .apsc-clim__infopop .apclim-kz{margin:10px 0 0;padding:0;border-top:0;}
.apsc .apsc-clim__infopop .apclim-kz:first-child{margin-top:0;}
.apsc .apsc-clim__infopop .apclim-kz__val{display:block;margin-top:2px;}`);

cut('stamp', '"card-v102-file-v120"', '"card-v103-file-v121"');
cut('banner', 'FILE VERSION: v120', 'FILE VERSION: v121');

fs.writeFileSync(OUT, s, 'utf8');
console.log('edits: ' + edits.join(', '));
console.log('wrote ' + OUT.split('/').pop());
