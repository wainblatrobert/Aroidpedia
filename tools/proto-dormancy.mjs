/* PROTOTYPE — the native rest-season calendar.
   8.17.26. Not shipped, not wired to the card.

   THE QUESTION: when, in the wild, does this species' ground go into
   its lean season — and where does that fall on the reader's calendar?

   ── why dew point and not RH ──────────────────────────────────────
   climate.json has no precipitation (the cache holds tmin/tmax/vapr
   only), so the dry season has to be inferred. Afternoon RH is the
   obvious candidate and it is the WRONG one, for the reason the user
   established from the Kanchanaburi dew-point chart: the afternoon RH
   dip is largely temperature peaking, not dry air. A hot month reads
   "dry" even when the air is muggy.

   Dew point separates them. It is a property of the air mass alone,
   so a low-dew month is genuinely dry air — the monsoon's absence.

   Vapour pressure is reconstructed from the shipped fields:
       vapr[m] ~= rhHi50[m]/100 * es(tnMed[m])
   (rhHi50 is median RH at the daily minimum, so es is evaluated at
   the median tmin.) ⚠ APPROXIMATION: a median of ratios is not the
   ratio of medians. It is close for a climatically homogeneous place
   and fine for a prototype, but the clean fix is to SHIP vapr — the
   builder already holds it in memory and adding vaprMed costs nothing.

   ── the two stresses ──────────────────────────────────────────────
   Rest is favoured by dry air OR by cold, and which dominates depends
   where you are: a Karnataka plant rests because the monsoon left, a
   plant at the range's cool margin rests because growth stops. Both
   are measured RELATIVE TO THE PLACE'S OWN YEAR, deliberately — an
   absolute cutoff is a biological claim, and the user has already
   ruled that this data is a display statistic and not a threshold
   (the 50 F line ruling, 8.9.26). Relative keeps it descriptive:
   "this is the lean end of this place's own year".                  */

import fs from 'fs';
const D = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/JS JAVASCRIPT CODE/';
const C = JSON.parse(fs.readFileSync('./climate.json', 'utf8')).places;
const SI = JSON.parse(fs.readFileSync(D + 'search-index.json', 'utf8')).entries;
const PL = JSON.parse(fs.readFileSync(D + 'places.json', 'utf8')).places;
const LAT = {}; PL.forEach(p => { LAT[p.tag] = p.lat; });
const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const es = t => 0.6108 * Math.exp(17.27 * t / (t + 237.3));
const dewOf = v => { const L = Math.log(Math.max(0.01, v) / 0.6108);
                     return 237.3 * L / (17.27 - L); };
const span = a => Math.max(...a) - Math.min(...a);
/* 1 at the LOWEST month, 0 at the highest — "how lean is this month" */
const lean01 = a => { const lo = Math.min(...a), hi = Math.max(...a);
  return hi - lo < 1e-9 ? a.map(() => 0) : a.map(x => (hi - x) / (hi - lo)); };

/* the card's variant ladder, per place */
const variant = t => { const e = C[t]; return e.warmMoist || e.warm || e.ff || e.all; };

function placeSeason(tag) {
  const v = variant(tag);
  const dew  = v.tnMed.map((tn, m) => dewOf(v.rhHi50[m] / 100 * es(tn)));
  const warm = v.tnMed.slice();
  const dryPress = lean01(dew), coldPress = lean01(warm);
  /* a month that is both dry and cold is not twice as restful — it is
     just the lean month. Whichever stress bites, bites. */
  const rest = dryPress.map((d, m) => Math.max(d, coldPress[m]));
  return { rest, dewAmp: span(dew), tAmp: span(warm), dew, warm,
           driest: M[dew.indexOf(Math.min(...dew))],
           coldest: M[warm.indexOf(Math.min(...warm))] };
}

/* longest circular run of months at or above a cut */
function window(rest, cut) {
  const on = rest.map(r => r >= cut);
  if (on.every(Boolean) || !on.some(Boolean)) return null;
  let best = null;
  for (let s = 0; s < 12; s++) {
    if (!on[s] || on[(s + 11) % 12]) continue;        /* must be a run START */
    let len = 0, sum = 0;
    while (on[(s + len) % 12] && len < 12) { sum += rest[(s + len) % 12]; len++; }
    /* DEEPEST run, not longest. Amorphophallus gracilior (Benin,
       Nigeria) exposed this: West Africa's real lean season is the
       Harmattan, Dec-Feb, but a longer shallow shoulder Jun-Oct also
       cleared the cut and a longest-run rule picked the shoulder and
       reported the season SIX MONTHS OUT. Depth is the signal. */
    const depth = sum / len;
    if (!best || depth > best.depth) best = { start: s, len, depth };
  }
  return best;
}
const shift = (i, by) => (i + by + 12) % 12;

function speciesCalendar(entry) {
  const tags = (entry.tg || []).filter(t => C[t]);
  if (!tags.length) return null;
  const per = tags.map(t => ({ tag: t, n: C[t].n, thin: C[t].n <= 2, ...placeSeason(t) }));
  /* A 1-pixel place is a POINT SAMPLE, not a range. "Himalaya" is a
     single cell at 30.5N 80.6E on a 4000 m ridge and swings 26 C of
     dew; letting it vote equally with Borneo would hand a lowland
     species an alpine calendar. Thin places are reported, not
     silently averaged in. */
  /* equal weight per tagged place: each tag is an equal CLAIM about
     where the plant grows. Weighting by pixel count would let one big
     province speak over three small ones. */
  const rest = Array.from({ length: 12 }, (_, m) =>
    per.reduce((s, p) => s + p.rest[m], 0) / per.length);
  const dewAmp = per.reduce((s, p) => s + p.dewAmp, 0) / per.length;
  const tAmp   = per.reduce((s, p) => s + p.tAmp,   0) / per.length;
  const lats   = tags.map(t => LAT[t]).filter(x => x != null);
  const meanLat = lats.reduce((a, b) => a + b, 0) / (lats.length || 1);
  /* DISAGREEMENT between a species' places is a finding, not noise:
     usually one tag is everwet and another monsoon */
  const spread = Math.max(...per.map(p => p.dewAmp)) - Math.min(...per.map(p => p.dewAmp));
  /* dew amplitude is the discriminator: Borneo/Sumatra sit near 1-2 C,
     monsoon Asia at 6-10 C */
  const cls = dewAmp >= 5 ? 'STRONG' : dewAmp >= 2.5 ? 'WEAK' : 'ASEASONAL';
  return { tags, per, rest, dewAmp, tAmp, meanLat, spread, cls,
           win: cls === 'ASEASONAL' ? null : window(rest, 0.55) };
}

/* ── report ── */
const rows = [];
for (const s of SI.filter(x => x.c === 'species')) {
  const c = speciesCalendar(s);
  if (c) rows.push({ t: s.t, g: s.g, u: s.u, ...c });
}
const fmt = c => {
  if (!c.win) return 'no marked rest season';
  return `${M[c.win.start]}–${M[shift(c.win.start, c.win.len - 1)]} (${c.win.len} mo)`;
};
/* ⚠ THE BAR IS SCALED BY AMPLITUDE, NOT NORMALISED PER SPECIES.
   A within-species normalise makes a 2 C dew swing draw exactly like
   an 18 C one - the same "never paint two resolutions on one ramp"
   error that made Riau(0) read brighter than Jambi(1) on the journal
   map. Full height is reserved for a 15 C swing; an everwet species
   must LOOK flat, because it is. */
const FULL = 15;
const bar = (rest, amp) => rest.map(r =>
  ' ▁▂▃▄▅▆▇█'[Math.max(0, Math.min(8, Math.round(r * 8 * Math.min(1, amp / FULL))))]).join('');

console.log('REST-SEASON PROTOTYPE — ' + rows.length + ' species');
const byClass = {}; rows.forEach(r => { byClass[r.cls] = (byClass[r.cls] || 0) + 1; });
const byGenus = {};
rows.forEach(r => { byGenus[r.g] = byGenus[r.g] || {};
  byGenus[r.g][r.cls] = (byGenus[r.g][r.cls] || 0) + 1; });
console.log('classification: ' + JSON.stringify(byClass));
Object.entries(byGenus).forEach(([g, v]) => console.log('   ' + g.padEnd(16) + JSON.stringify(v)));
console.log('\nmonth bars run Jan..Dec, taller = leaner (drier air or colder)\n');

for (const cls of ['STRONG', 'WEAK', 'ASEASONAL']) {
  const set = rows.filter(r => r.cls === cls).sort((a, b) => b.dewAmp - a.dewAmp);
  console.log(`── ${cls} (${set.length}) ──`);
  set.slice(0, 6).forEach(r => {
    console.log(`  ${r.t.slice(0, 30).padEnd(31)} ${bar(r.rest, r.dewAmp)}  dewAmp ${r.dewAmp.toFixed(1)}  ${fmt(r)}`);
    console.log(`  ${''.padEnd(31)} ${r.tags.join(', ')}`);
  });
  console.log('');
}

const demo = rows.filter(r => r.cls === 'STRONG' && r.meanLat > 5)
                 .sort((a, b) => b.dewAmp - a.dewAmp)[0];
if (demo) {
  console.log('── HEMISPHERE FLIP, worked example ──');
  console.log(`  ${demo.t}   (native mean latitude ${demo.meanLat.toFixed(1)} N)`);
  console.log(`  native rest       ${fmt(demo)}`);
  console.log(`  southern grower   ${fmt({ win: { start: shift(demo.win.start, 6), len: demo.win.len } })}` +
              '   <- outdoors, the plant follows LOCAL seasons');
}

console.log('\n── SPECIES WHOSE TAGGED PLACES DISAGREE MOST (dew-amplitude spread) ──');
console.log('   a monsoon place and an everwet place under one name: genuinely');
console.log('   widespread, mis-tagged, or two taxa. Worth a look either way.');
rows.filter(r => r.tags.length > 1).sort((a, b) => b.spread - a.spread).slice(0, 8)
  .forEach(r => console.log(`  ${r.spread.toFixed(1).padStart(4)} C  ${r.t.slice(0, 26).padEnd(27)} ` +
    r.per.map(p => `${p.tag}${p.thin ? '*' : ''} ${p.dewAmp.toFixed(1)}`).join(' | ')));
console.log('   * = 1-2 pixel place: a point sample, not a range.');

/* ── SPOT CHECK: species whose behaviour the user can judge directly ── */
console.log('\n── SPOT CHECK against species you actually grow ──');
const WANT = ['TITANUM','KONJAC','PAEONIIFOLIUS','BULBIFER','MACRORRHIZOS',
              'ODORA','ZEBRINA','SANDERIANA','LONGILOBA','REGINULA'];
WANT.forEach(w => {
  const r = rows.find(x => x.t.includes(' ' + w));
  if (!r) return console.log('  ' + w.padEnd(15) + ' — no post');
  console.log(`  ${r.t.slice(0,30).padEnd(31)} ${bar(r.rest, r.dewAmp)}  ` +
              `${r.cls.padEnd(9)} dewAmp ${r.dewAmp.toFixed(1).padStart(4)}  ${fmt(r)}`);
  console.log(`  ${''.padEnd(31)} ${r.tags.map(t => t + (C[t].n <= 2 ? '*' : '')).join(', ')}`);
});

/* ── THE RULING LIST ── Amorphophallus the CLIMATE says has no season.
   The literature's everwet Sumatran/Bornean species still cycle, so
   this is where a measured climate signal and an endogenous rhythm
   may part company. The grower is the primary source here. */
console.log('\n── AMORPHOPHALLUS WITH NO CLIMATIC REST SEASON ──');
console.log('   (does the plant still go down for you?)');
rows.filter(r => r.g === 'Amorphophallus' && r.cls === 'ASEASONAL')
  .sort((a, b) => a.dewAmp - b.dewAmp)
  .forEach(r => console.log(`  dewAmp ${r.dewAmp.toFixed(1).padStart(4)}  ` +
    `${r.t.replace('AMORPHOPHALLUS ','A. ').slice(0,26).padEnd(27)} ${r.tags.slice(0,4).join(', ')}`));
