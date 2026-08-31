// =====================================================================
// AROIDPEDIA — BUILD TIMELINES   (v1, 2026-08-31)
// Path in repo: scripts/build-timelines.mjs
//
// Writes Timelines/<genus> and Timelines/<genus>_mobile for every genus in
// data/species-years.json. Those two extensionless files are what the GENUS
// TIMELINE block fetches:
//
//   https://raw.githubusercontent.com/.../main/Timelines/<genus>[_mobile]
//
// raw.githubusercontent, not Pages — so a commit is enough. No deploy.
//
// ---------------------------------------------------------------------
// WHY THIS IS SAFE TO GENERATE
// ---------------------------------------------------------------------
// A timeline spec is ~18KB of Vega 5, and almost none of it is about the
// genus. Diffed the two live specs path by path; only FOUR things differ:
//
//   1. data[name="dataset"].values   the year -> species-list rows
//   2. signals[name="domain"].init   "[1839, …]" — the first year, which is
//                                    just data[0].domain
//   3. padding.top                   18 (alocasia) vs 20 (amorphophallus)
//   4. the label y-clamp floor       -9 vs -11, twice
//
// (1) and (2) are derived. (3) and (4) are cosmetic — how far a tall stack of
// labels may ride above the line — and live in data/timeline-overrides.json,
// which is the only hand-set file in the pipeline. A genus not listed there
// takes the Alocasia values, which is what a new genus should look like.
//
// The _mobile file is the desktop spec with 15 values changed. That list was
// derived by diffing alocasia against alocasia_mobile and then CONFIRMED to be
// the same 15 paths for amorphophallus — genus-independent, which is what
// makes generating it safe rather than a guess. It lives in
// data/timeline-mobile.json.
//
// ⚠ THE LIVE SPECS ARE STALE, and regenerating them is the point. Measured
// against the April POWO export, the hand-built Alocasia spec is missing a
// species described in 1886, still lists Alocasia rivularis (2017) and
// Alocasia lihengiae (2020) which POWO no longer accepts, spells Alocasia
// rosea as "roseus", and carries a milestone reading "Alocasia ×" in 1965 —
// a truncated hybrid row from the export. Expect the rebuild to change them.
// =====================================================================
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.argv[2] || '.');
const rd = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

const YEARS     = rd('data/species-years.json');
const TEMPLATE  = rd('data/timeline-template.json');
const MOBILE    = rd('data/timeline-mobile.json');
const OVERRIDES = rd('data/timeline-overrides.json');

const OUT_DIR = path.join(ROOT, 'Timelines');
const DEFAULTS = { paddingTop: 18, labelFloor: -9 };

const clone = o => JSON.parse(JSON.stringify(o));
const findData   = (s, n) => s.data.find(d => d.name === n);
const findSignal = (s, n) => s.signals.find(g => g.name === n);

/* The two label marks clamp their y with a hardcoded floor. It is the only
   place a genus number is buried inside an expression rather than a field. */
function setLabelFloor(spec, floor) {
  for (const name of ['milestone_label_backgrounds', 'milestone_labels']) {
    const m = spec.marks.find(x => x.name === name);
    if (!m) throw new Error('mark not found: ' + name);
    const sig = m.encode.update.y.signal;
    const next = sig.replace(/\), (-?\d+)\), height/, `), ${floor}), height`);
    if (next === sig && !sig.includes(`), ${floor}), height`))
      throw new Error('label floor not matched in ' + name);
    m.encode.update.y.signal = next;
  }
}

function toMobile(desktop) {
  const s = clone(desktop);
  s.width = MOBILE.width;
  Object.assign(s.padding, MOBILE.padding);
  for (const [name, value] of Object.entries(MOBILE.signals)) {
    const sig = findSignal(s, name);
    if (!sig) throw new Error('signal not found: ' + name);
    sig.value = value;
  }
  const labels = s.marks.find(m => m.name === 'milestone_labels');
  labels.encode.update.fontSize.value   = MOBILE.milestoneLabels.fontSize;
  labels.encode.update.lineHeight.value = MOBILE.milestoneLabels.lineHeight;

  // The remaining differences are inside expression strings; a whole-JSON
  // text pass is exact here because each search string is unique enough to
  // have been verified by count against the live pair (1, 5 and 2 hits).
  let txt = JSON.stringify(s, null, 1);
  for (const [from, to] of MOBILE.textSubstitutions) txt = txt.split(from).join(to);
  return JSON.parse(txt);
}

function build(slug, entry) {
  const years = Object.keys(entry.years).map(Number).sort((a, b) => a - b);
  if (!years.length) return null;

  const spec = clone(TEMPLATE);
  const knobs = { ...DEFAULTS, ...(OVERRIDES[slug] || {}) };

  findData(spec, 'dataset').values = years.map(y => ({
    domain: y,
    label: entry.years[String(y)].join(', '),
  }));
  findSignal(spec, 'domain').init = `[${years[0]}, year(now())]`;
  spec.padding.top = knobs.paddingTop;
  setLabelFloor(spec, knobs.labelFloor);

  return { desktop: spec, mobile: toMobile(spec), years: years.length };
}

// --------------------------------------------------------------- run
fs.mkdirSync(OUT_DIR, { recursive: true });
const slugs = Object.keys(YEARS.genera).sort();
let written = 0, skipped = 0;
const changed = [];

for (const slug of slugs) {
  const built = build(slug, YEARS.genera[slug]);
  if (!built) { skipped++; continue; }
  for (const [suffix, spec] of [['', built.desktop], ['_mobile', built.mobile]]) {
    const file = path.join(OUT_DIR, slug + suffix);
    const next = JSON.stringify(spec, null, 1) + '\n';
    const prev = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
    if (prev !== next) { fs.writeFileSync(file, next, 'utf8'); changed.push(slug + suffix); }
    written++;
  }
}

console.log(`genera in data     : ${slugs.length}`);
console.log(`spec files written : ${written} (${slugs.length} desktop + mobile)`);
console.log(`skipped (no years) : ${skipped}`);
console.log(`changed this run   : ${changed.length}`);
if (changed.length && changed.length <= 12) console.log('  ' + changed.join(', '));
console.log(`exports dated      : ${YEARS.exportsOldest} .. ${YEARS.exportsNewest}`);
