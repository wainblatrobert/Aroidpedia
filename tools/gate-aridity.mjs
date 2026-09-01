/* THE ARIDITY THRESHOLD IS CORRECT AS IT STANDS. DO NOT "FIX" IT.

   Köppen's B test needs the share of rain falling in the HIGH-SUN
   half-year, because that is when evaporative demand is highest. The
   builder uses a fixed calendar half (Apr-Sep north, Oct-Mar south).
   That looks crude, and on 8.20.26 I proposed replacing it with
   something "more physical" — the six warmest months. Measuring it
   showed the opposite of what I expected:

     Katsina (12.2N)      Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep
       rain mm              0    0    1    8   46   85  178  232  116
       T mean C          21.8 24.3 28.1 30.6 30.6 28.3 25.7 24.8 25.8

   THE MONSOON COOLS THE AIR. August is the wettest month AND one of
   the coolest; bone-dry April is the hottest. So "the six warmest
   months" lands on Mar-Jun + Sep-Oct — precisely the months either
   side of the rains — and reports 40% summer rain where the calendar
   half correctly reports 98%. Katsina and Zamfara are textbook BSh
   Sahel; the change would have flipped them to non-arid, along with
   Burkina Faso, Gambia and Tigray.

   The fixed calendar half is a proxy for SOLAR FORCING, and it is
   right for exactly the reason it looks wrong: it is immune to the
   rain's own cooling feedback. Temperature-derived definitions are
   not — they invert in every monsoon climate.

   Also rejected: "summer = the warmer of the two calendar halves"
   (Peel's literal wording). It disagrees with the latitude sign for
   93 places, all equatorial, on differences like 26.0 vs 26.8 C —
   noise deciding a threshold worth 140 mm.

   This gate pins the answer so a future well-meaning change fails
   loudly instead of silently de-aridifying the Sahel.               */
import fs from 'fs';
const PATH = process.env.CLIM || 'C:/Users/nli0490/Claude/Aroidpedia/docs/climate.json';
const j = JSON.parse(fs.readFileSync(PATH, 'utf8'));
const P = j.places;

/* Places whose Koppen B status is not in scientific doubt. */
const MUST_BE_ARID = [
  ['Katsina',      'Sahel, northern Nigeria — BSh'],
  ['Zamfara',      'Sahel, northern Nigeria — BSh'],
  ['Burkina Faso', 'Sahel — BSh over most of the country'],
  ['Gambia',       'Sahelian margin — BSh'],
  ['Tigray',       'northern Ethiopian lowlands — BSh'],
  ['Lima',         'Peruvian coastal desert — BWh'],
  ['Dodoma',       'central Tanzania — BSh'],
  ['Chile North',  'Atacama — BWk/BWh']
];
const MUST_NOT_BE_ARID = [
  ['Borneo',       'everwet equatorial — Af'],
  ['Kerala',       'wet monsoon coast'],
  ['Brazil North', 'Amazon — Af/Am/Aw'],
  ['Japan',        'Cfa throughout']
];

const aridShare = t => {
  const v = P[t] && P[t].all;
  if (!v || !v.koppen) return null;
  return v.koppen.filter(k => /^B/.test(k[0])).reduce((s, k) => s + k[1], 0);
};

let pass = 0, fail = 0;
console.log(`climate.json ${j.version}\n`);
for (const [t, why] of MUST_BE_ARID) {
  const s = aridShare(t);
  const ok = s !== null && s >= 0.30;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${t.padEnd(14)} B=${s === null ? 'ABSENT' : (100 * s).toFixed(0) + '%'}`.padEnd(38) + why);
  ok ? pass++ : fail++;
}
for (const [t, why] of MUST_NOT_BE_ARID) {
  const s = aridShare(t);
  const ok = s !== null && s <= 0.05;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${t.padEnd(14)} B=${s === null ? 'ABSENT' : (100 * s).toFixed(0) + '%'}`.padEnd(38) + why);
  ok ? pass++ : fail++;
}
/* and the Cs/Cw fix it sits beside */
const cs = t => {
  const v = P[t] && P[t].all;
  return v && v.koppen ? v.koppen.filter(k => /^Cs/.test(k[0])).reduce((s, k) => s + k[1], 0) : null;
};
console.log('');
for (const [t, want, why] of [['Malawi', 0, 'summer-rain tropics: no mediterranean'],
                              ['Njombe', 0, 'summer-rain highland: no mediterranean'],
                              ['Greece', 1, 'genuine mediterranean, must survive'],
                              ['California', 1, 'genuine mediterranean, must survive']]) {
  const s = cs(t);
  const ok = want ? (s >= 0.30) : (s <= 0.02);
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${t.padEnd(14)} Cs=${s === null ? 'ABSENT' : (100 * s).toFixed(0) + '%'}`.padEnd(38) + why);
  ok ? pass++ : fail++;
}
console.log(`\n${pass}/${pass + fail} held`);
process.exitCode = fail ? 1 : 0;
