/* Wires the rest-season calendar into the species card.
   Master: Footer injection 8.16.26 v14.txt  ->  8.17.26 v16.txt
   card-v79-file-v97 -> card-v80-file-v98

   ⚠ ANOTHER SESSION IS EDITING v14 CONCURRENTLY. It moved from
   file-v96 to file-v97 and deployed, mid-way through writing this
   patch. Re-targeted onto their snapshot and taking v98 so the two
   cannot collide. NOTHING SHARED IS WRITTEN BY THIS SCRIPT: it emits
   a new master only, never docs/footer.js.

   ⚠ v15.txt IS STALE — it carries card-v71-file-v88 while v14 carries
   the deployed card-v79-file-v96. The HIGHER-NUMBERED master is the
   abandoned branch. Editing it would have silently reverted eight card
   versions. v14 is the live source; this builds v16 from it.

   Every edit asserts its anchor and aborts on a miss, because a
   silent no-op on a 700 KB master is indistinguishable from success
   until it is live.                                                  */
import fs from 'fs';

const DIR = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/';
const SRC = DIR + 'Footer injection 8.16.26 v14.txt';
const OUT = DIR + 'Footer injection 8.17.26 v16.txt';
let s = fs.readFileSync(SRC, 'utf8');
const edits = [];
/* ⚠ THE MASTER IS CRLF. An anchor written with a bare newline
   matches only the LF half of each CRLF pair — the first anchor here
   "succeeded" that way and would have spliced the insert after a
   stray CR, leaving mixed line endings through a 700 KB file. Both
   sides are normalised to CRLF so the file stays consistent.

   CR and LF are built with fromCharCode rather than written as
   escapes on purpose: this script was generated through a shell
   heredoc, which eats backslashes, and doing exactly that is what
   produced the broken regex this block replaces.

   The replacement also goes through a function so a literal $ in the
   inserted text is never read as $& or $1. */
const CR = String.fromCharCode(13), LF = String.fromCharCode(10);
const toCRLF = t => t.split(CR + LF).join(LF).split(LF).join(CR + LF);
function cut(name, find, repl) {
  const f = toCRLF(find), r = toCRLF(repl);
  const n = s.split(f).length - 1;
  if (n !== 1) { console.error(`ABORT: anchor "${name}" matched ${n} times, expected 1`); process.exit(1); }
  s = s.replace(f, () => r);
  edits.push(name);
}

/* ── 1. the calendar engine, ported from dormancy-core/-view ────────
   ES5 to match the rest of the bundle. The TUNING numbers are the
   ones set in the live tuner on 8.17.26; the LOOK numbers likewise.  */
const ENGINE = `
  /* ================================================================
     THE REST-SEASON CALENDAR  (card v80, 8.17.26)

     Answers "when does this rest, and when is it growing" from
     climate.json 1.7.0's prMed (median monthly rainfall, mm).

     ⚠ WHY RAINFALL AND NOT THE HUMIDITY ALREADY ON THIS CARD: dew
     point derived from vapour pressure tracks the daily MINIMUM
     temperature almost exactly — overnight cooling drives air to
     near saturation — so a dry season inferred from it is a
     temperature season wearing another name. Ogun, Nigeria showed
     2.7 C of dew amplitude against 2.1 C of tmin: no signal. Its
     rainfall runs 13 mm in January against 233 mm in June. 55% of
     the 712 places had dawn RH pinned at 100% for 9+ months.

     ⚠ AMORPHOPHALLUS ONLY, and it is NOT a dormancy prediction. The
     grower's ruling, 8.17.26: everwet Sumatran and Bornean species
     (gigas, beccarii, asper, hottae…) go dormant ANYWAY. So this
     reports whether the ENVIRONMENT supplies a cue, never whether
     the plant rests — which is why the no-season branch says the
     plant keeps its own schedule instead of inventing a window.
     ================================================================ */
  var REST_TUNING = { DRY_MM: 60, COLD_HI: 18, COLD_LO: 8, CUT: 0.35, STRONG: 0.62 };
  var REST_LOOK = { hatchSize: 6.5, hatchDensity: 1.1, hatchAngle: -45,
                    hatchAlpha: 0.65, bandTint: 0.11, curveWidth: 3.25, height: 112 };
  var MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var HEMI_KEY = "ap-clim-hemi";

  function clamp01(x){ return x < 0 ? 0 : x > 1 ? 1 : x; }

  /* deepest circular run at or above a cut — NOT the longest. West
     Africa's real lean season is the Harmattan; a longer, shallower
     shoulder also clears the cut, and a longest-run rule reported
     Amorphophallus gracilior SIX MONTHS OUT. Depth is the signal. */
  function restRun(series, cut){
    var on = series.map(function(r){ return r >= cut; });
    var all = true, any = false, i;
    for (i = 0; i < 12; i++){ if (on[i]) any = true; else all = false; }
    if (all || !any) return null;
    var best = null;
    for (var s2 = 0; s2 < 12; s2++){
      if (!on[s2] || on[(s2 + 11) % 12]) continue;
      var len = 0, sum = 0;
      while (on[(s2 + len) % 12] && len < 12){ sum += series[(s2 + len) % 12]; len++; }
      var depth = sum / len;
      if (!best || depth > best.depth) best = { start: s2, len: len, depth: depth };
    }
    return best;
  }

  /* parts = [{tag, n, v}] — the SAME variant aggregate() picked for
     the charts, so the season and the curves describe one ground. */
  function restSeason(parts){
    var usable = parts.filter(function(p){ return p.v && p.v.prMed && p.v.prMed.length === 12; });
    if (!usable.length) return null;                     /* pre-1.7.0 data */
    var per = usable.map(function(p){
      var dry = p.v.prMed.map(function(mm){
        return clamp01((REST_TUNING.DRY_MM - mm) / REST_TUNING.DRY_MM); });
      var cold = p.v.tnMed.map(function(t){
        return clamp01((REST_TUNING.COLD_HI - t) /
               Math.max(1, REST_TUNING.COLD_HI - REST_TUNING.COLD_LO)); });
      /* ⚠ SEASONAL EXCESS, not absolute level. A rest season is a
         CONTRAST: Amhara's nights sit at 12-16 C every month, so an
         absolute cold stress never fell below 0.22 there and dragged
         Aug-Oct into a season that is really Nov-Mar. The floor is
         SUBTRACTED and the range is NOT rescaled, so magnitude
         survives and an everwet place still scores zero. */
      function floor(a){
        var lo = Math.min.apply(null, a);
        return a.map(function(x){ return x - lo; });
      }
      var dryEx = floor(dry), coldEx = floor(cold);
      return { tag: p.tag, pr: p.v.prMed, tn: p.v.tnMed, dry: dryEx, cold: coldEx,
               rest: dryEx.map(function(d, m){ return Math.max(d, coldEx[m]); }) };
    });
    function avg(key){
      var out = [];
      for (var m = 0; m < 12; m++){
        var t = 0;
        for (var i = 0; i < per.length; i++) t += per[i][key][m];
        out.push(t / per.length);
      }
      return out;
    }
    var rest = avg("rest"), dry = avg("dry"), cold = avg("cold"), tn = avg("tn");
    var peak = Math.max.apply(null, rest);
    /* ⚠ ONE number gates both the classification and the window. They
       were 0.30 and 0.35 and six species fell in the gap: called
       seasonal, then no month cleared the cut, and the callout
       dereferenced a null window. */
    var CUT = REST_TUNING.CUT;
    var cls = peak >= Math.max(CUT, REST_TUNING.STRONG) ? "STRONG"
            : peak >= CUT ? "WEAK" : "ASEASONAL";
    var cued = cls !== "ASEASONAL";
    var win = cued ? restRun(rest, CUT) : null;
    if (!win) { cued = false; cls = "ASEASONAL"; }
    var dSum = 0, cSum = 0;
    if (win) for (var k2 = 0; k2 < win.len; k2++){
      var mm2 = (win.start + k2) % 12; dSum += dry[mm2]; cSum += cold[mm2];
    }
    var driver = !win ? null : dSum > cSum * 1.4 ? "dry" : cSum > dSum * 1.4 ? "cold" : "both";
    /* mean of the PER-PLACE minima, matching how the stress is built —
       min-of-the-mean-series contradicted its own chart on species
       spanning one wet place and one dry one. */
    function meanOf(fn){
      var t = 0;
      for (var i = 0; i < per.length; i++) t += fn(per[i]);
      return Math.round(t / per.length);
    }
    return {
      rest: rest, cls: cls, cued: cued, win: win, driver: driver, peak: peak,
      grow: cued ? restRun(rest.map(function(r){ return 1 - r; }), 1 - CUT) : null,
      driestMm: meanOf(function(p){ return Math.min.apply(null, p.pr); }),
      wettestMm: meanOf(function(p){ return Math.max.apply(null, p.pr); }),
      coldestC: Math.round(Math.min.apply(null, tn)),
      places: per.length
    };
  }

  function shiftM(i, by){ return (i + by + 12) % 12; }
  function restRange(w, south){
    var st = south ? shiftM(w.start, 6) : w.start;
    return MON[st] + "–" + MON[shiftM(st, w.len - 1)];
  }
  function restPhrase(cal, south){
    if (!cal.cued){
      return { lean: "No lean season", grow: "Growing weather all year",
        body: "Its wild range never dries out — the driest month still averages " +
              cal.driestMm + " mm of rain — so the weather never signals a rest. " +
              "Plants still go down, on their own schedule." };
    }
    var what = cal.driver === "cold" ? "coolest"
             : cal.driver === "dry" ? "driest" : "coolest and driest";
    var detail = cal.driver === "cold"
      ? "nights fall to about " + cal.coldestC + " °C"
      : "rain drops to about " + cal.driestMm + " mm a month, from " + cal.wettestMm +
        " mm at the peak" + (cal.driver === "both"
          ? ", and nights to about " + cal.coldestC + " °C" : "");
    return {
      lean: "Lean season " + restRange(cal.win, south),
      grow: cal.grow ? "Most likely to be actively growing " + restRange(cal.grow, south)
                     : "Growing the rest of the year",
      body: "Where it grows wild this is the " + what + " stretch of the year — " + detail + "."
    };
  }

  /* ── the curve ──────────────────────────────────────────────────
     THE YEAR IS A CIRCLE. Each month owns a slot of width W/12 and is
     drawn at its slot CENTRE, and the path runs through months -2..13
     (the same values, wrapped) clipped to the frame. x=0 and x=W then
     interpolate the SAME Dec-Jan pair, so the two edge heights are
     equal BY CONSTRUCTION — a Nov-Mar season reads as one winter
     instead of two humps. */
  function restChart(cal, south){
    var W2 = 560, PADY2 = 16, H2 = REST_LOOK.height, SLOT = W2 / 12;
    var uid = "r" + (restChart.n = (restChart.n || 0) + 1);
    function cxm(m){ return (m + 0.5) * SLOT; }
    /* rest[] is an ABSOLUTE stress (mm of rain, °C of night), so there
       is no amplitude rescaling: a flat species draws flat because its
       numbers are flat. */
    var y = cal.rest.map(function(r){ return 0.06 + 0.88 * Math.min(1, r); });
    function yOf(v){ return PADY2 + (H2 - 2 * PADY2) * (1 - v); }
    function at(i){ return [cxm(i), yOf(y[((i % 12) + 12) % 12])]; }
    var d = "M" + at(-2)[0].toFixed(1) + " " + at(-2)[1].toFixed(1);
    for (var i = -2; i < 13; i++){
      var p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      d += "C" + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + " " +
                 (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + "," +
                 (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + " " +
                 (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + "," +
                 p2[0].toFixed(1) + " " + p2[1].toFixed(1);
    }
    var words = !cal.cued ? ["", ""]
              : cal.driver === "cold" ? ["cool", "cool"]
              : cal.driver === "dry" ? ["dry", "dry"] : ["dry", "cool"];
    /* ⚠ the tile follows the WORD LENGTH. A flat 3.5x multiplier was
       silently calibrated for a three-letter word: "dry" fitted,
       "cool" overlapped its neighbour. 3.5/3 = 1.1667 per letter keeps
       the tuned "dry" tile identical. */
    var chars = Math.max(words[0].length, words[1].length) || 3;
    var tw = (1.1667 * chars * REST_LOOK.hatchSize) / REST_LOOK.hatchDensity;
    var th = (1.25 * REST_LOOK.hatchSize) / REST_LOOK.hatchDensity;
    function hatchText(x, yy, w){
      return '<text x="' + x.toFixed(2) + '" y="' + yy.toFixed(2) + '" font-size="' +
        REST_LOOK.hatchSize + '" font-family="Helvetica Neue, Helvetica, Arial" ' +
        'fill="rgba(175,192,144,' + REST_LOOK.hatchAlpha + ')">' + w + '</text>';
    }
    var grid = "";
    [0, 3, 6, 9].forEach(function(m){
      grid += '<line x1="' + (m * SLOT).toFixed(1) + '" y1="' + PADY2 + '" x2="' +
        (m * SLOT).toFixed(1) + '" y2="' + (H2 - PADY2) + '" stroke="rgba(243,241,234,.08)"/>';
    });
    /* ⚠ NOTHING is drawn when there is no lean season. Hatching the
       WHOLE year to avoid an empty-looking chart was worse than empty:
       a full-width fill is the SAME MARK as the lean band, so it read
       as "the whole year is the lean season" — the opposite of the
       finding. The callout carries that case. */
    var band = "";
    if (cal.win){
      var st = south ? shiftM(cal.win.start, 6) : cal.win.start;
      for (var k3 = 0; k3 < cal.win.len; k3++){
        var m3 = (st + k3) % 12, x3 = (m3 * SLOT).toFixed(1);
        band += '<rect x="' + x3 + '" y="' + PADY2 + '" width="' + SLOT.toFixed(1) +
          '" height="' + (H2 - 2 * PADY2) + '" fill="rgba(175,192,144,' + REST_LOOK.bandTint + ')"/>' +
          '<rect x="' + x3 + '" y="' + PADY2 + '" width="' + SLOT.toFixed(1) +
          '" height="' + (H2 - 2 * PADY2) + '" fill="url(#p' + uid + ')"/>';
      }
    }
    var months = "";
    for (var mm = 0; mm < 12; mm++){
      months += '<text x="' + cxm(mm).toFixed(1) + '" y="' + (H2 - 3) +
        '" text-anchor="middle" font-size="9" fill="rgba(243,241,234,.45)" ' +
        'font-family="Helvetica Neue, Helvetica, Arial">' + MON[mm].charAt(0) + '</text>';
    }
    return '<svg viewBox="0 0 ' + W2 + ' ' + H2 + '" role="img" aria-label="' +
      (cal.win ? "Lean season marked on a twelve-month curve" : "No lean season") + '">' +
      '<defs><clipPath id="c' + uid + '"><rect x="0" y="0" width="' + W2 + '" height="' + H2 + '"/></clipPath>' +
      '<pattern id="p' + uid + '" width="' + tw.toFixed(2) + '" height="' + th.toFixed(2) +
      '" patternUnits="userSpaceOnUse" patternTransform="rotate(' + REST_LOOK.hatchAngle + ')">' +
      hatchText(0, th * 0.46, words[0]) + hatchText(tw / 2, th * 0.96, words[1]) +
      '</pattern></defs>' + grid + band +
      '<path d="' + d + '" fill="none" stroke="rgba(175,192,144,.85)" stroke-width="' +
      REST_LOOK.curveWidth + '" stroke-linecap="round" clip-path="url(#c' + uid + ')"/>' +
      months + '</svg>';
  }

  /* the whole block, hemisphere toggle included */
  function buildRest(cal){
    var wrap = el("div", "apclim-rest");
    var south = false;
    try { south = localStorage.getItem(HEMI_KEY) === "S"; } catch (e) {}
    var chart = el("div", "apclim-rest__chart");
    var head = el("div", "apclim-rest__head");
    var body = el("div", "apclim-rest__body");
    var note = el("div", "apclim-rest__note",
      "Outdoor growing. This is the lean season where the species grows wild — " +
      "the months when rainfall there is lowest, or nights coldest. Indoors, " +
      "watering and warmth decide when a plant rests, not this calendar.");
    var hemi = el("div", "apclim-rest__hemi");
    var bN = el("button", "apsc-clim__unit", "N");
    var bS = el("button", "apsc-clim__unit", "S");
    bN.type = bS.type = "button";
    bN.title = "Northern hemisphere"; bS.title = "Southern hemisphere";
    hemi.appendChild(bN); hemi.appendChild(bS);
    function draw(){
      var p = restPhrase(cal, south);
      chart.innerHTML = restChart(cal, south);
      head.innerHTML = "";
      var b = el("b", "", p.lean);
      head.appendChild(b);
      head.appendChild(el("span", "apclim-rest__bar", "|"));
      head.appendChild(el("span", "apclim-rest__grow", p.grow));
      body.textContent = p.body;
      bN.setAttribute("aria-pressed", south ? "false" : "true");
      bS.setAttribute("aria-pressed", south ? "true" : "false");
    }
    function setHemi(v){
      south = v;
      try { localStorage.setItem(HEMI_KEY, v ? "S" : "N"); } catch (e) {}
      draw();
    }
    bN.addEventListener("click", function(){ setHemi(false); });
    bS.addEventListener("click", function(){ setHemi(true); });
    var top = el("div", "apclim-rest__top");
    top.appendChild(el("span", "apsc-clim__sub", "rest season"));
    top.appendChild(hemi);
    wrap.appendChild(top);
    wrap.appendChild(chart);
    wrap.appendChild(head);
    wrap.appendChild(body);
    wrap.appendChild(note);
    draw();
    return wrap;
  }
`;

cut('engine', '\n  function buildRow(res, version, placeCount, forCultivar, fellBackTo){',
    ENGINE + '\n  function buildRow(res, version, placeCount, forCultivar, fellBackTo, restCal){');

/* ── 2. aggregate() must hand back the variant it picked per place ── */
cut('aggregate-parts',
  '    return { mode: mode, agg: agg, zones: zones, trimmed: k > 0 };',
  `    /* v80: the per-place variant, so the rest-season calendar reads
       THE SAME GROUND the charts do. Without this it would apply its
       own ladder and a card could show a warmMoist chart beside an
       all-derived season. */
    var parts = entries.map(function(e){
      return { tag: e.tag, n: e.p.n, v: pick(e.p).v };
    });
    return { mode: mode, agg: agg, zones: zones, trimmed: k > 0, parts: parts };`);

/* ── 3. mount the block + the permanent collapse ── */
cut('mount-rest',
  '    render();\n    return { row: row, mini: mini };',
  `    render();
    /* v80: AMORPHOPHALLUS ONLY — the genus is tuberous and seasonal,
       and the grower asked for the two monthly charts to collapse to
       the existing Temp/Humidity switch here so the calendar has the
       room. data-apclim-collapse un-gates that switch from its
       short-viewport media query; everything else is untouched. */
    if (restCal){
      box.setAttribute("data-apclim-collapse", "1");
      box.appendChild(buildRest(restCal));
    }
    return { row: row, mini: mini };`);

cut('call-site',
  `        var built = buildRow(res, cd.version, entries.length,
                             forCultivar, fellBackTo);`,
  `        /* v80: the rest-season calendar, Amorphophallus only. The
           genus comes off the post title — the card mount carries no
           genus of its own, and the h1 is what the runhead reads too.
           A cultivar gets it as well: its parent species is the thing
           the chart already describes. */
        var ttl = document.querySelector("h1, .apsc-runhead");
        var isAmorph = /^\\s*amorphophallus\\b/i.test(
          (ttl && ttl.textContent ? ttl.textContent : "").replace(/\\s+/g, " "));
        var restCal = null;
        if (isAmorph && res.parts && res.parts.length){
          try { restCal = restSeason(res.parts); } catch (e) { restCal = null; }
        }
        var built = buildRow(res, cd.version, entries.length,
                             forCultivar, fellBackTo, restCal);`);

/* ── 4. CSS ── */
cut('css',
  '.apsc .apsc-clim__swbtn:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}',
  `.apsc .apsc-clim__swbtn:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}

/* ---- v80: THE REST-SEASON CALENDAR (Amorphophallus only) ----------
   data-apclim-collapse repeats the short-viewport rules WITHOUT the
   media query, so on this genus the two monthly charts are always one
   at a time and the calendar has the room. The media block below is
   left exactly as it was: on a short viewport both paths agree. */
.apsc .apsc-clim[data-apclim-collapse="1"] .apsc-clim__switch{display:flex;}
.apsc .apsc-clim[data-apclim-collapse="1"][data-apclim-view="t"] .apsc-clim__h{display:none;}
.apsc .apsc-clim[data-apclim-collapse="1"][data-apclim-view="h"] .apsc-clim__t{display:none;}

.apsc .apclim-rest{margin:14px 0 0;padding:13px 0 0;border-top:1px solid rgba(243,241,234,.12);}
.apsc .apclim-rest__top{display:flex;align-items:center;justify-content:space-between;margin:0 0 6px;}
.apsc .apclim-rest__hemi{display:flex;gap:2px;}
.apsc .apclim-rest__chart svg{width:100%;height:auto;display:block;}
.apsc .apclim-rest__head{margin:7px 0 0;color:var(--accent);font-size:15px;line-height:1.35;}
.apsc .apclim-rest__head b{font-weight:600;}
.apsc .apclim-rest__bar{color:rgba(243,241,234,.28);margin:0 .5em;}
.apsc .apclim-rest__grow{color:rgba(243,241,234,.8);font-weight:400;}
.apsc .apclim-rest__body{font-size:13px;color:rgba(243,241,234,.72);margin:2px 0 0;}
.apsc .apclim-rest__note{font-size:11.5px;color:rgba(243,241,234,.45);margin:7px 0 0;line-height:1.45;}
@media (max-width:640px){
  .apsc .apclim-rest__head{font-size:14px;}
}`);

/* ── 5. versions ── */
cut('stamp', '"card-v79-file-v97"', '"card-v80-file-v98"');
cut('banner', 'FILE VERSION: v97  (last updated 2026-08-17)',
             'FILE VERSION: v98  (last updated 2026-08-17)');

fs.writeFileSync(OUT, s, 'utf8');
console.log('edits applied: ' + edits.join(', '));
console.log('wrote ' + OUT.split('/').pop() + '  ' + (s.length / 1024).toFixed(0) + ' KB');
