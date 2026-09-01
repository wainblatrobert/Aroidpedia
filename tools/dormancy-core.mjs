/* THE REST-SEASON CALENDAR — shared core.
   8.17.26. Pure functions over a climate.json `places` map, no I/O, so
   this is the piece that moves client-side into the footer bundle
   unchanged (the card's other display rules live client-side on
   purpose — tuning must never need a data rebuild).

   ── WHY THIS WAS REWRITTEN ────────────────────────────────────────
   The first cut inferred the dry season from DEW POINT, reconstructed
   from the shipped RH. That was wrong, and how it was wrong is worth
   keeping written down:

     Dew point tracks the daily MINIMUM temperature almost exactly.
     Overnight cooling drives air towards saturation, so tmin IS
     approximately the dew point — a standard meteorological
     approximation. A "dry season" derived from dew point is therefore
     a TEMPERATURE season wearing another name.

   Measured, before the rewrite: Ogun, Nigeria showed 2.7 °C of dew
   amplitude against 2.1 °C of tmin amplitude — no dry-season signal at
   all — while its rainfall runs 13 mm in January against 233 mm in
   June. The Harmattan simply was not in the data. 55% of the 712
   places had dawn RH pinned at 100% for 9+ months, which is where the
   proxy failed hardest, and 20 species were asserting a lean season
   built on a 2–3 °C temperature wiggle.

   climate.json 1.7.0 ships prMed (median monthly rainfall, mm) and the
   question is now answered from a measurement instead of a proxy.

   ── THE TWO STRESSES, BOTH ABSOLUTE ───────────────────────────────
   The old code normalised each stress to 0..1 WITHIN a place, which is
   magnitude-blind: a 2 °C wiggle became a full-scale "cold season",
   and Borneo's everwet 205→417 mm swing would have become a full-scale
   "drought". Both stresses are absolute now, so a place with no dry
   months and no cold months scores zero and correctly reports nothing.

     dry  : Köppen's tropical dry-month line, 60 mm. Ramps 60 -> 0 mm.
     cold : nights below 18 °C slow growth, 8 °C stops it.

   ⚠ These are DISPLAY CONSTANTS, not biology, and they live here
   client-side so they can be tuned without a data rebuild — the same
   reason the variant ladder does. They are deliberately never drawn on
   the chart as lines: the user has ruled that this data is a display
   statistic and not a survivability threshold (the 50 °F ruling,
   8.9.26).

   ── THE USER'S RULING, 8.17.26 (they grow these) ──────────────────
   Everwet Sumatran/Bornean Amorphophallus — gigas, beccarii, asper,
   gracilis, hottae, hewittii, borneensis — GO DORMANT ANYWAY. So
   seasonality does NOT predict dormancy; it predicts whether the
   ENVIRONMENT supplies a cue. A species with no seasonal signal must
   never be drawn with an invented rest window, and must say the useful
   thing instead: the plant rests on its own schedule, so do not wait
   for weather to tell you.                                          */

const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const clamp01 = x => x < 0 ? 0 : x > 1 ? 1 : x;

/* ── TUNING ── one mutable object, not five consts, so the tuner page
   can drive the real code instead of a copy of it. Everything here is
   a DISPLAY constant: it decides what the card says, never what the
   data is, so it stays client-side and needs no rebuild to change. */
export const TUNING = {
  DRY_MM:  60,    /* Köppen tropical dry month, mm            */
  COLD_HI: 18,    /* nights below this slow growth, °C        */
  COLD_LO: 8,     /* …and below this it has stopped, °C       */
  CUT:     0.35,  /* a month counts as lean at this stress    */
  STRONG:  0.62   /* …and the species is STRONG at this peak  */
};

export function placeSeason(C, tag) {
  const e = C[tag];
  const v = e.warmMoist || e.warm || e.ff || e.all;   /* the card's ladder */
  const pr = v.prMed, tn = v.tnMed;
  if (!Array.isArray(pr)) return null;                /* pre-1.7.0 data */
  const { DRY_MM, COLD_HI, COLD_LO } = TUNING;
  const dry  = pr.map(p => clamp01((DRY_MM - p) / DRY_MM));
  const cold = tn.map(t => clamp01((COLD_HI - t) / Math.max(1, COLD_HI - COLD_LO)));
  /* a month both dry AND cold is not twice as restful — it is just the
     lean month. Whichever stress bites, bites. */
  /* ── SEASONAL EXCESS, not absolute level ──────────────────────────
     A rest season is a CONTRAST. Amhara's nights sit at 12-16 C every
     month of the year, so absolute cold stress never falls below 0.22
     there — a constant floor that dragged Aug-Oct into a lean season
     which is really Nov-Mar. A permanent condition is not a cue: a
     highland species does not "rest" in August because August is as
     cool as every other month.

     So each stress is measured above its OWN year-round floor. ⚠ This
     is NOT the magnitude-blind normalise that the first version got
     wrong: the floor is SUBTRACTED, the range is NOT rescaled to 1, so
     a 0.05 wiggle stays 0.05 and only a real swing scores. Borneo,
     with no dry months and no cold months, still scores zero. */
  const floor = a => { const lo = Math.min(...a); return a.map(x => x - lo); };
  const dryEx = floor(dry), coldEx = floor(cold);
  return { tag, n: e.n, thin: e.n <= 2, pr, tn, dry: dryEx, cold: coldEx,
           dryAbs: dry, coldAbs: cold,
           rest: dryEx.map((d, m) => Math.max(d, coldEx[m])) };
}

/* deepest circular run at or above a cut — NOT the longest.
   Amorphophallus gracilior (Benin, Nigeria) proved why: West Africa's
   real lean season is the Harmattan, and a longer shallow shoulder
   also cleared the cut, so a longest-run rule reported the season SIX
   MONTHS OUT. Depth is the signal. */
export function runOf(series, cut) {
  const on = series.map(r => r >= cut);
  if (on.every(Boolean) || !on.some(Boolean)) return null;
  let best = null;
  for (let s = 0; s < 12; s++) {
    if (!on[s] || on[(s + 11) % 12]) continue;
    let len = 0, sum = 0;
    while (on[(s + len) % 12] && len < 12) { sum += series[(s + len) % 12]; len++; }
    const depth = sum / len;
    if (!best || depth > best.depth) best = { start: s, len, depth };
  }
  return best;
}

export const shiftMonth = (i, by) => (i + by + 12) % 12;
export const monthName = i => M[i];

export function calendar(C, tags, latOf) {
  const per = tags.filter(t => C[t]).map(t => placeSeason(C, t)).filter(Boolean);
  if (!per.length) return null;
  /* equal weight per tagged place: each tag is an equal CLAIM about
     where the plant grows. Pixel-count weighting would let one large
     province outvote three small ones.
     ⚠ thin (1-2 cell) places are flagged, not silently trusted. */
  const avg = k => Array.from({ length: 12 }, (_, m) =>
    per.reduce((s, p) => s + p[k][m], 0) / per.length);
  const rest = avg('rest'), dry = avg('dry'), cold = avg('cold'),
        pr = avg('pr'), tn = avg('tn');
  const peak = Math.max(...rest);

  /* ⚠ THE CLASSIFICATION BAR AND THE WINDOW CUT MUST BE THE SAME
     NUMBER. They were 0.30 and 0.35, and six species landed in the gap:
     classified seasonal, then no month cleared the cut, so the window
     came back null and the callout dereferenced it. Two thresholds that
     disagree will always find the crack between them. */
  const { CUT, STRONG } = TUNING;
  const cls  = peak >= Math.max(CUT, STRONG) ? 'STRONG SEASONALITY'
             : peak >= CUT ? 'WEAK SEASONALITY' : 'ASEASONAL';
  const cued = cls !== 'ASEASONAL';
  const win  = cued ? runOf(rest, CUT) : null;
  /* WHICH STRESS BITES — judged over the lean months themselves, not
     the whole year. Amorphophallus dunnii's China Southeast winter is
     cold AND dry; Karnataka's is dry alone. */
  let dSum = 0, cSum = 0;
  if (win) for (let k = 0; k < win.len; k++) {
    const m = (win.start + k) % 12; dSum += dry[m]; cSum += cold[m];
  }
  const driver = !win ? null
               : dSum > cSum * 1.4 ? 'dry'
               : cSum > dSum * 1.4 ? 'cold' : 'both';
  const lats = per.map(p => latOf(p.tag)).filter(x => x != null);

  return {
    tags: per.map(p => p.tag), per, rest, dry, cold, pr, peak, cls, cued, win, driver,
    grow: cued ? runOf(rest.map(r => 1 - r), 1 - CUT) : null,
    /* ⚠ MEAN OF THE PER-PLACE MINIMA, not the minimum of the mean
       series. The stress is computed per place and then averaged, so
       the quoted number must be built the same way — otherwise a
       species spanning one wet place and one dry one gets a sentence
       that contradicts its own chart ("a dry season… rain drops to
       72 mm", which is above the 60 mm dry line). */
    driestMm:  Math.round(per.reduce((s, p) => s + Math.min(...p.pr), 0) / per.length),
    wettestMm: Math.round(per.reduce((s, p) => s + Math.max(...p.pr), 0) / per.length),
    coldestC:  Math.round(Math.min(...tn)),
    meanLat: lats.reduce((a, b) => a + b, 0) / (lats.length || 1),
    thin: per.filter(p => p.thin).map(p => p.tag)
  };
}

/* THE CALLOUT. Two halves, because one without the other is half an
   answer: knowing when it rests does not tell a grower when to feed.
   Both halves shift together for a southern-hemisphere reader — a
   partial shift would be worse than none. */
const range = (w, southern) => {
  const s = southern ? shiftMonth(w.start, 6) : w.start;
  return `${M[s]}–${M[shiftMonth(s, w.len - 1)]}`;
};

export function phrase(cal, southern) {
  if (!cal) return null;
  /* belt and braces: runOf also returns null when EVERY month clears
     the cut, which is a place under year-round stress rather than a
     seasonal one. The floor subtraction should make that impossible,
     but a callout must never be able to crash on a data shape. */
  if (!cal.cued || !cal.win) {
    return { lean: 'No lean season',
             grow: 'Growing weather all year',
             body: `Its wild range never dries out — the driest month still ` +
                   `averages ${cal.driestMm} mm of rain — so the weather never ` +
                   `signals a rest. Plants still go down, on their own schedule.` };
  }
  const what = cal.driver === 'cold' ? 'coolest'
             : cal.driver === 'dry' ? 'driest' : 'coolest and driest';
  const detail = cal.driver === 'cold'
    ? `nights fall to about ${cal.coldestC} °C`
    : `rain drops to about ${cal.driestMm} mm a month, from ${cal.wettestMm} mm at the peak` +
      (cal.driver === 'both' ? `, and nights to about ${cal.coldestC} °C` : '');
  return {
    lean: `Lean season ${range(cal.win, southern)}`,
    grow: cal.grow ? `Most likely to be actively growing ${range(cal.grow, southern)}`
                   : 'Growing the rest of the year',
    body: `Where it grows wild this is the ${what} stretch of the year — ${detail}.`
  };
}
