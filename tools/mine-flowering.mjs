/* Mines flowering months out of the cached Amorphophallus post bodies.

   ⚠ THIS PRODUCES CANDIDATES, NOT DATA. Anything shown on a species
   page is a claim the site makes, and the prose is full of things that
   look like phenology and are not:

     "flowered 20 October 1995"          — one plant, one day
     "cultivated in the Buitenzorg
      Gardens, which flowered in
      November 1919"                     — a glasshouse in Java
     "flowered first in the middle of
      April of this year"                — a European glasshouse
     "Inflorescence: 22 Jun."            — a herbarium collection date

   So each candidate is classified and the REJECTS are printed too —
   a miner that only shows its accepts cannot be audited.

   Written as a file rather than a shell one-liner on purpose: the last
   attempt lost its month-range regex to shell escaping and silently
   reported "no-range" for cases that plainly had one. */
import fs from 'fs';

const S = JSON.parse(fs.readFileSync('./flowering-raw.json', 'utf8'));

const NAMES = ['January','February','March','April','May','June','July',
               'August','September','October','November','December'];
const ABBR = { jan:0, feb:1, mar:2, apr:3, may:4, jun:5, jul:6, aug:7,
               sep:8, sept:8, oct:9, nov:10, dec:11 };
const monthIdx = w => {
  const k = String(w).toLowerCase().replace(/\.$/, '');
  const full = NAMES.findIndex(n => n.toLowerCase() === k);
  if (full >= 0) return full;
  return ABBR[k] !== undefined ? ABBR[k] : -1;
};
const M = '(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sept|Sep|Oct|Nov|Dec)\\.?';

/* connectors seen in the actual corpus, including "through the end of" */
const CONNECT = '\\s*(?:-|\\u2013|\\u2014|to|through|until|and)\\s*(?:the\\s+(?:end|beginning|middle)\\s+of\\s+)?';
const RANGE_RE = new RegExp(M + CONNECT + M, 'i');
const FLOWER_RE = /(flower|flowering|flowers|bloom|blooming|anthesis|inflorescences?\s+(?:appear|emerge))/i;

/* the reject signals, each one earned from a real sentence above */
const REJECT = [
  [/cultivat|garden|glasshouse|greenhouse|hortic/i,        'cultivation'],
  [/herbarium|\bcoll\.|collected|specimen|\borig\./i,      'herbarium/collection'],
  [/\b(18|19|20)\d\d\b/,                                    'dated single event'],
  [/\bfruit/i,                                              'mentions fruiting too — check which range is which']
];

const out = [];
for (const [u, d] of Object.entries(S)) {
  const text = d.body + ' ' + d.excerpt;
  for (const raw of text.split(/(?<=[.;!?])\s+/)) {
    const s = raw.trim();
    if (!FLOWER_RE.test(s)) continue;
    const rm = s.match(RANGE_RE);
    let months = null, kind = null;
    if (rm) {
      const a = monthIdx(rm[1]), b = monthIdx(rm[2]);
      if (a >= 0 && b >= 0) { months = [a, b]; kind = 'range'; }
    }
    if (!months) {
      /* a single month is still a real statement: "Flowering: June;" */
      const sm = s.match(new RegExp('flowering[:\\s]+(?:in\\s+)?' + M, 'i'));
      if (sm) { const a = monthIdx(sm[1]); if (a >= 0) { months = [a, a]; kind = 'single'; } }
    }
    if (!months) continue;
    const flags = REJECT.filter(([re]) => re.test(s)).map(([, why]) => why);
    out.push({ u, t: d.t, months, kind, flags, s: s.slice(0, 200) });
  }
}

/* group per species, keep the cleanest candidate(s) */
const by = {};
out.forEach(r => { (by[r.t] = by[r.t] || []).push(r); });

const span = ([a, b]) => (a === b ? NAMES[a].slice(0, 3)
                                  : NAMES[a].slice(0, 3) + '–' + NAMES[b].slice(0, 3));
const len = ([a, b]) => ((b - a + 12) % 12) + 1;

console.log('CANDIDATES, by species (✓ = no reject flags)\n');
let clean = 0, flagged = 0, conflict = 0;
Object.keys(by).sort().forEach(t => {
  const rows = by[t];
  const ok = rows.filter(r => !r.flags.length);
  const distinct = new Set(ok.map(r => r.months.join('-')));
  if (distinct.size > 1) conflict++;
  console.log((ok.length ? '✓ ' : '  ') + t.replace('AMORPHOPHALLUS ', 'A. ').padEnd(24) +
    (ok.length ? [...distinct].map(k => span(k.split('-').map(Number))).join('  ⚠CONFLICT ') : '(all flagged)'));
  rows.forEach(r => {
    console.log('      [' + span(r.months) + ' ' + len(r.months) + 'mo, ' + r.kind + ']' +
      (r.flags.length ? '  REJECT: ' + r.flags.join(' + ') : '  clean'));
    console.log('       "' + r.s + '"');
  });
  ok.length ? clean++ : flagged++;
});
console.log(`\nspecies with a clean candidate: ${clean}   all-flagged: ${flagged}   internal conflicts: ${conflict}`);
fs.writeFileSync('./flowering-candidates.json', JSON.stringify(by, null, 1));
