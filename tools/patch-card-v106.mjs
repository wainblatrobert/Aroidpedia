/* Card v106 (FILE v124) — three fixes.
   Master: Footer injection 8.19.26 v30.txt -> v31.txt

   1. THE POP HID BEHIND THE MAP. Diagnosed rather than guessed: every
      ancestor of the pop is z-index:auto, including the sticky
      .apsc-facts panels, so the panels paint in DOM order and the map's
      SVG lands on top of a pop that reaches up out of its own panel.
      elementFromPoint at the pop's top edge returned an SVG, not the
      pop. Raising the pop's own z-index cannot fix that — it has no
      stacking context to win inside. So the PANEL is lifted while a pop
      is open, and dropped again on close.

   2. IT OPENED LEFT WHEN THE RIGHT WAS FREE. Left was checked first and
      the article column almost always has room, so the pop covered the
      article even on a wide screen with empty margin to the right.
      Right is now preferred: it is dead margin, where a pop costs the
      reader nothing. Left is the fallback, then vertical.

   3. HEMISPHERE FROM THE READER'S TIMEZONE. IANA zone names carry a
      region/city, so a table of southern zones settles the one bit
      needed with no network call, no third-party, no IP, no latency.
      ⚠ INDONESIA IS SOUTHERN — Jakarta is 6°S. Missing that would put
      the whole Indonesian audience on the wrong calendar, and they are
      not a small part of an aroid audience.
      ⚠ EQUATORIAL ZONES RETURN NULL rather than guessing. Bogotá and
      Nairobi sit within a degree or two of the equator; there is no
      right answer, and their seasonal swing is small enough that being
      wrong costs little — but claiming to know is still worse than
      falling back to the species' native hemisphere.
      Precedence: the reader's saved choice > their timezone > the
      species' native hemisphere.                                     */
import fs from 'fs';

const DIR = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/';
const SRC = DIR + 'Footer injection 8.19.26 v30.txt';
const OUT = DIR + 'Footer injection 8.19.26 v31.txt';
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

/* ── 1 + 2: stacking lift, and right-before-left ── */
cut('open-close-lift',
  `    function open(){ dot.classList.add("is-open"); clamp(); }`,
  `    /* ⚠ LIFT THE PANEL, NOT THE POP. Every ancestor is z-index:auto,
       so the sticky panels paint in DOM order and the map's SVG covers
       a pop that reaches out of its own panel. A bigger z-index on the
       pop cannot win a fight it is not in — the PANEL has to be raised.
       Dropped again on close so nothing else is affected. */
    function lift(on){
      var panel = dot.closest ? dot.closest(".apsc-facts") : null;
      if (!panel) return;
      if (on){ panel.style.position = "sticky"; panel.style.zIndex = "60"; }
      else { panel.style.zIndex = ""; }
    }
    function open(){ dot.classList.add("is-open"); lift(true); clamp(); }`);

cut('close-drops-lift',
  `    document.addEventListener("click", function(){
      if (dot.isConnected) dot.classList.remove("is-open");
    });
    return { dot: dot, pop: pop };`,
  `    document.addEventListener("click", function(){
      if (dot.isConnected && dot.classList.contains("is-open")){
        dot.classList.remove("is-open");
        lift(false);
      }
    });
    dot.addEventListener("mouseleave", function(){
      if (!dot.classList.contains("is-open")) lift(false);
    });
    return { dot: dot, pop: pop };`);

cut('hover-lifts',
  `    dot.addEventListener("mouseenter", clamp);   /* hover opens it via CSS */`,
  `    dot.addEventListener("mouseenter", function(){ lift(true); clamp(); });`);

cut('right-first',
  `      var d = dot.getBoundingClientRect();
      var popW = pop.offsetWidth || 280;
      if (d.left - pad >= popW + 14){
        pop.style.left = (-(popW + 14)) + "px";
        pop.style.top = "auto";`,
  `      var d = dot.getBoundingClientRect();
      var popW = pop.offsetWidth || 280;
      /* ⚠ RIGHT BEFORE LEFT. Left was tested first and the article
         column nearly always has room, so on a wide screen the pop
         covered the article while empty margin sat unused to the right.
         The right margin costs the reader nothing. */
      var sideways = null;
      if (vw - d.right - pad >= popW + 14) sideways = d.width + 14;
      else if (d.left - pad >= popW + 14) sideways = -(popW + 14);
      if (sideways !== null){
        pop.style.left = sideways + "px";
        pop.style.top = "auto";`);

/* ── 3: the timezone table ── */
cut('tz-table',
  `  var HEMI_KEY = "ap-clim-hemi";`,
  `  var HEMI_KEY = "ap-clim-hemi";

  /* ── THE READER'S HEMISPHERE, FROM THEIR TIMEZONE ─────────────────
     One bit, no network, no third party, no IP, no latency. IANA zone
     names carry a region/city, so a table of the southern ones settles
     it; anything unlisted is treated as northern, which is where the
     overwhelming majority of readers are.

     ⚠ INDONESIA IS SOUTHERN. Jakarta is 6°S, Makassar 5°S, Jayapura
     2°S — leaving Asia/* out of this table would put the entire
     Indonesian audience on the wrong calendar, and for an aroid site
     that is not a rounding error.

     ⚠ EQUATORIAL ZONES RETURN NULL rather than guess. Bogotá, Nairobi,
     Kampala, Pontianak, Quito and Singapore sit within a couple of
     degrees of the line: there is no correct answer, and pretending to
     one is worse than deferring to the species' own hemisphere. Their
     seasonal swing is slight, so the cost of not knowing is slight. */
  var TZ_SOUTH = [
    "Australia/", "Antarctica/",
    "Pacific/Auckland", "Pacific/Chatham", "Pacific/Fiji", "Pacific/Norfolk",
    "Pacific/Noumea", "Pacific/Port_Moresby", "Pacific/Bougainville",
    "Pacific/Guadalcanal", "Pacific/Efate", "Pacific/Tongatapu", "Pacific/Apia",
    "Pacific/Pago_Pago", "Pacific/Tahiti", "Pacific/Rarotonga", "Pacific/Easter",
    "Pacific/Niue", "Pacific/Fakaofo",
    "America/Sao_Paulo", "America/Argentina/", "America/Santiago",
    "America/Montevideo", "America/Asuncion", "America/La_Paz", "America/Lima",
    "America/Punta_Arenas", "America/Recife", "America/Fortaleza", "America/Bahia",
    "America/Belem", "America/Manaus", "America/Cuiaba", "America/Campo_Grande",
    "America/Porto_Velho", "America/Rio_Branco", "America/Noronha", "America/Araguaina",
    "Atlantic/Stanley", "Atlantic/St_Helena",
    "Africa/Johannesburg", "Africa/Maputo", "Africa/Harare", "Africa/Lusaka",
    "Africa/Gaborone", "Africa/Windhoek", "Africa/Luanda", "Africa/Lubumbashi",
    "Africa/Blantyre", "Africa/Dar_es_Salaam", "Africa/Antananarivo",
    "Africa/Mbabane", "Africa/Maseru", "Africa/Bujumbura", "Africa/Kigali",
    "Indian/Antananarivo", "Indian/Mauritius", "Indian/Reunion", "Indian/Mayotte",
    "Indian/Comoro",
    "Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura", "Asia/Dili"
  ];
  var TZ_EQUATOR = [
    "America/Bogota", "America/Guayaquil", "America/Quito", "Africa/Nairobi",
    "Africa/Kampala", "Africa/Mogadishu", "Africa/Libreville", "Africa/Kinshasa",
    "Asia/Pontianak", "Asia/Singapore", "Asia/Kuala_Lumpur", "Asia/Kuching",
    "Pacific/Galapagos", "Pacific/Nauru", "Indian/Maldives"
  ];
  function readerSouth(){
    var tz = "";
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) { return null; }
    if (!tz) return null;
    for (var i = 0; i < TZ_EQUATOR.length; i++) if (tz === TZ_EQUATOR[i]) return null;
    for (var j = 0; j < TZ_SOUTH.length; j++){
      var k = TZ_SOUTH[j];
      if (k.charAt(k.length - 1) === "/" ? tz.indexOf(k) === 0 : tz === k) return true;
    }
    return false;
  }`);

cut('use-tz',
  `    var south = !!cal.nativeSouth;
    try {
      var pref = localStorage.getItem(HEMI_KEY);
      if (pref === "S") south = true; else if (pref === "N") south = false;
    } catch (e) {}`,
  `    /* PRECEDENCE: the reader's own choice, then their timezone, then
       the species' native hemisphere. Timezone beats native because the
       toggle answers "which calendar am I reading", and that is the
       reader's, not the plant's. */
    var south = !!cal.nativeSouth;
    var tzSouth = readerSouth();
    if (tzSouth !== null) south = tzSouth;
    try {
      var pref = localStorage.getItem(HEMI_KEY);
      if (pref === "S") south = true; else if (pref === "N") south = false;
    } catch (e) {}`);

cut('stamp', '"card-v105-file-v123"', '"card-v106-file-v124"');
cut('banner', 'FILE VERSION: v123', 'FILE VERSION: v124');

fs.writeFileSync(OUT, s, 'utf8');
console.log('edits: ' + edits.join(', '));
console.log('wrote ' + OUT.split('/').pop());
