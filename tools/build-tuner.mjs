/* Builds proto-dormancy-tuner.html — the interactive prototype.

   ⚠ IT INLINES dormancy-core.mjs AND dormancy-view.mjs VERBATIM,
   read off disk at build time and stripped only of their `export`
   keywords. It does not reimplement them. A tuner that renders its own
   copy of the chart lets you tune the wrong thing and then reports
   settings that do not reproduce — the same class of mistake as the
   builder keeping its own copy of build-shapes' tables.

   Everything else on the page is controls and layout.               */
import fs from 'fs';
import { calendar, phrase, TUNING } from './dormancy-core.mjs';

const D = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/JS JAVASCRIPT CODE/';
const C = JSON.parse(fs.readFileSync('./climate.json', 'utf8'));
const SI = JSON.parse(fs.readFileSync(D + 'search-index.json', 'utf8')).entries;
const PL = JSON.parse(fs.readFileSync(D + 'places.json', 'utf8')).places;
const LAT = {}; PL.forEach(p => { LAT[p.tag] = p.lat; });

/* ── the data the page needs, and nothing else ──
   Only the two series the calendar reads, for the places actually
   tagged by a species post. Whole-file embedding would be 1.7 MB. */
const species = SI.filter(x => x.c === 'species')
  .map(e => ({ t: e.t, g: e.g, u: e.u, tags: (e.tg || []).filter(t => C.places[t]) }))
  .filter(e => e.tags.length);
const used = new Set(); species.forEach(e => e.tags.forEach(t => used.add(t)));
const places = {};
for (const t of used) {
  const e = C.places[t], v = e.warmMoist || e.warm || e.ff || e.all;
  places[t] = { n: e.n, prMed: v.prMed, tnMed: v.tnMed, lat: LAT[t] ?? null };
}
/* the page rebuilds a climate.json-shaped map from this, so the
   inlined core runs against exactly the shape it expects */
const payload = { version: C.version, places, species };

const strip = f => fs.readFileSync(f, 'utf8')
  .replace(/^import[^;]+;$/gm, '')      /* the two files only import each other */
  .replace(/^export /gm, '');

const CORE = strip('./dormancy-core.mjs');
const VIEW = strip('./dormancy-view.mjs');

const html = `<!doctype html><meta charset="utf-8">
<title>Rest-season tuner</title>
<style>
 :root{--ink:#f3f1ea;--ground:#14170f;--sage:175,192,144;}
 *{box-sizing:border-box;}
 body{background:var(--ground);color:var(--ink);margin:0;
      font:14px/1.5 "Helvetica Neue",Helvetica,Arial;}
 .wrap{display:grid;grid-template-columns:300px 1fr;min-height:100vh;}
 .panel{position:sticky;top:0;align-self:start;height:100vh;overflow:auto;
        padding:20px 18px;border-right:1px solid rgba(243,241,234,.12);}
 .main{padding:20px 24px;min-width:0;}
 h1{font-size:12px;letter-spacing:.22em;text-transform:uppercase;margin:0 0 4px;}
 h2{font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;
    color:rgba(243,241,234,.45);margin:20px 0 8px;font-weight:600;}
 .row{margin:0 0 11px;}
 .row label{display:flex;justify-content:space-between;font-size:12px;
            color:rgba(243,241,234,.72);margin-bottom:3px;}
 .row label b{color:rgb(197,212,166);font-weight:600;font-variant-numeric:tabular-nums;}
 input[type=range]{width:100%;accent-color:rgb(175,192,144);}
 .hint{font-size:10.5px;color:rgba(243,241,234,.38);line-height:1.35;margin:-4px 0 10px;}
 .tally{font-size:12px;color:rgba(243,241,234,.66);border:1px solid rgba(243,241,234,.14);
        border-radius:8px;padding:9px 11px;margin:14px 0;}
 .tally b{color:rgb(197,212,166);}
 button{background:rgba(243,241,234,.08);color:var(--ink);border:1px solid rgba(243,241,234,.18);
        border-radius:6px;padding:6px 10px;font:inherit;font-size:12px;cursor:pointer;}
 button:hover{background:rgba(243,241,234,.14);}
 textarea{width:100%;height:92px;background:rgba(0,0,0,.35);color:rgba(243,241,234,.8);
          border:1px solid rgba(243,241,234,.16);border-radius:6px;font:11px/1.5 monospace;
          padding:8px;resize:vertical;}
 .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(430px,100%),1fr));gap:22px;}
 .c{border:1px solid rgba(243,241,234,.12);border-radius:10px;padding:14px 14px 10px;}
 .c h3{font-size:14px;margin:0 0 2px;font-weight:600;}
 .meta{font-size:11px;color:rgba(243,241,234,.42);margin-bottom:7px;letter-spacing:.03em;}
 svg{width:100%;height:auto;display:block;}
 .head{margin-top:8px;color:rgb(197,212,166);font-size:14.5px;line-height:1.35;}
 .head b{font-weight:600;}
 .bar{color:rgba(243,241,234,.28);margin:0 .5em;}
 .grow{color:rgba(243,241,234,.78);}
 .body{font-size:12.5px;color:rgba(243,241,234,.72);margin-top:2px;}
 .alt{font-size:12px;color:rgba(243,241,234,.5);margin-top:6px;}
 .tags{font-size:11px;color:rgba(243,241,234,.34);margin-top:7px;}
 .disc{margin:26px 0 0;border-top:1px solid rgba(243,241,234,.12);padding-top:12px;
       font-size:12.5px;color:rgba(243,241,234,.66);max-width:74ch;}
 .top{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:16px;}
 select,input[type=search]{background:rgba(0,0,0,.3);color:var(--ink);
        border:1px solid rgba(243,241,234,.18);border-radius:6px;padding:5px 8px;font:inherit;font-size:12.5px;}
 .sw{display:flex;gap:6px;}
 .sw button[aria-pressed=true]{background:rgba(175,192,144,.22);border-color:rgba(175,192,144,.5);}
</style>
<div class="wrap">
<div class="panel">
  <h1>Rest-season tuner</h1>
  <div class="hint">climate.json ${payload.version} · ${species.length} species · live</div>

  <h2>What counts as lean</h2>
  <div class="row"><label>Dry-month line <b><span id="vDRY_MM"></span> mm</b></label>
    <input type="range" id="DRY_MM" min="20" max="140" step="5"></div>
  <div class="hint">Köppen uses 60 mm. A month at 0 mm scores full dry stress; at this line, none.</div>
  <div class="row"><label>Nights slow growth below <b><span id="vCOLD_HI"></span> °C</b></label>
    <input type="range" id="COLD_HI" min="10" max="28" step="1"></div>
  <div class="row"><label>…and stop it by <b><span id="vCOLD_LO"></span> °C</b></label>
    <input type="range" id="COLD_LO" min="-2" max="18" step="1"></div>
  <div class="row"><label>Lean threshold <b><span id="vCUT"></span></b></label>
    <input type="range" id="CUT" min="0.10" max="0.80" step="0.01"></div>
  <div class="hint">A month joins the lean season above this. Lower = longer seasons.
    <b>Amorphophallus carnosus</b> is the one to watch — its shoulders clip at 0.35.</div>
  <div class="row"><label>Strong-seasonality bar <b><span id="vSTRONG"></span></b></label>
    <input type="range" id="STRONG" min="0.35" max="0.95" step="0.01"></div>

  <h2>The hatch</h2>
  <div class="row"><label>Size <b><span id="vhatchSize"></span></b></label>
    <input type="range" id="hatchSize" min="1" max="14" step="0.25"></div>
  <div class="row"><label>Density <b><span id="vhatchDensity"></span>×</b></label>
    <input type="range" id="hatchDensity" min="0.4" max="3" step="0.1"></div>
  <div class="row"><label>Angle <b><span id="vhatchAngle"></span>°</b></label>
    <input type="range" id="hatchAngle" min="-90" max="0" step="5"></div>
  <div class="row"><label>Opacity <b><span id="vhatchAlpha"></span></b></label>
    <input type="range" id="hatchAlpha" min="0.05" max="0.9" step="0.01"></div>
  <div class="hint">On the card the chart renders ~461 px wide, on a phone ~292 px.
    Size <span id="pxNote"></span></div>

  <h2>The rest of it</h2>
  <div class="row"><label>Band tint <b><span id="vbandTint"></span></b></label>
    <input type="range" id="bandTint" min="0" max="0.4" step="0.01"></div>
  <div class="row"><label>Curve width <b><span id="vcurveWidth"></span></b></label>
    <input type="range" id="curveWidth" min="0.5" max="5" step="0.25"></div>
  <div class="row"><label>Chart height <b><span id="vheight"></span></b></label>
    <input type="range" id="height" min="80" max="220" step="4"></div>

  <div class="tally" id="tally"></div>
  <div class="sw" style="margin-bottom:10px">
    <button id="reset">Reset</button><button id="copy">Copy settings</button>
  </div>
  <textarea id="out" readonly></textarea>
</div>

<div class="main">
  <div class="top">
    <select id="genus"><option value="">both genera</option>
      <option>Amorphophallus</option><option>Alocasia</option></select>
    <select id="cls"><option value="">any seasonality</option>
      <option>STRONG SEASONALITY</option><option>WEAK SEASONALITY</option><option>ASEASONAL</option></select>
    <input type="search" id="q" placeholder="filter by name…" size="16">
    <span class="sw">
      <button id="hN" aria-pressed="true">Northern</button>
      <button id="hS" aria-pressed="false">Southern</button>
    </span>
    <select id="limit"><option value="8">8 cards</option><option value="24">24</option>
      <option value="60">60</option><option value="999">all</option></select>
  </div>
  <div class="grid" id="grid"></div>
  <p class="disc"><b>Outdoor growing.</b> This is the lean season where the species
   grows wild — the months when rainfall there is lowest, or nights coldest.
   Indoors, watering and warmth decide when a plant rests, not this calendar.</p>
</div>
</div>

<script type="module">
const DATA = ${JSON.stringify(payload)};

/* ── inlined verbatim from dormancy-core.mjs ── */
${CORE}
/* ── inlined verbatim from dormancy-view.mjs ── */
${VIEW}

/* climate.json shape, rebuilt from the trimmed payload */
const C = {};
for (const [t, p] of Object.entries(DATA.places)) C[t] = { n: p.n, all: { prMed: p.prMed, tnMed: p.tnMed } };
const latOf = t => DATA.places[t] ? DATA.places[t].lat : null;

const DEFAULTS = Object.assign({}, TUNING, LOOK);
const S = Object.assign({}, DEFAULTS);
let southern = false;

const el = id => document.getElementById(id);
const KEYS = Object.keys(DEFAULTS);

function apply() {
  for (const k of Object.keys(TUNING)) TUNING[k] = S[k];
  for (const k of Object.keys(LOOK))   LOOK[k]   = S[k];
}

function render() {
  apply();
  const g = el('genus').value, cf = el('cls').value,
        q = el('q').value.trim().toLowerCase(), lim = +el('limit').value;
  const rows = [];
  const tally = { 'STRONG SEASONALITY': 0, 'WEAK SEASONALITY': 0, 'ASEASONAL': 0 };
  for (const sp of DATA.species) {
    const cal = calendar(C, sp.tags, latOf);
    if (!cal) continue;
    tally[cal.cls] = (tally[cal.cls] || 0) + 1;
    if (g && sp.g !== g) continue;
    if (cf && cal.cls !== cf) continue;
    if (q && !sp.t.toLowerCase().includes(q)) continue;
    rows.push({ sp, cal });
  }
  el('tally').innerHTML = 'Across all ' + DATA.species.length + ' species: ' +
    '<b>' + tally['STRONG SEASONALITY'] + '</b> strong · <b>' + tally['WEAK SEASONALITY'] +
    '</b> weak · <b>' + tally['ASEASONAL'] + '</b> aseasonal';

  el('grid').innerHTML = rows.slice(0, lim).map(({ sp, cal }) => {
    const p = phrase(cal, southern), alt = phrase(cal, !southern);
    const name = sp.t.toLowerCase().replace(/^(amorphophallus|alocasia)/,
      m => '<i>' + m.charAt(0).toUpperCase() + m.slice(1) + '</i>');
    return '<div class="c"><h3>' + name + '</h3>' +
      '<div class="meta">' + cal.cls + ' · driest ' + cal.driestMm + ' mm, wettest ' +
        cal.wettestMm + ' mm · peak ' + cal.peak.toFixed(2) +
        (cal.thin.length ? ' · thin: ' + cal.thin.join(', ') : '') + '</div>' +
      chart(cal, southern, {}) +
      '<div class="head"><b>' + p.lean + '</b><span class="bar">|</span>' +
        '<span class="grow">' + p.grow + '</span></div>' +
      '<div class="body">' + p.body + '</div>' +
      (cal.cued ? '<div class="alt">' + (southern ? 'northern' : 'southern') +
        ' hemisphere → <b>' + alt.lean + '</b><span class="bar">|</span>' + alt.grow + '</div>' : '') +
      '<div class="tags">' + cal.tags.join(' · ') + '</div></div>';
  }).join('') || '<p style="color:rgba(243,241,234,.5)">nothing matches those filters</p>';

  el('pxNote').textContent = 'renders ' + (S.hatchSize * 461 / 560).toFixed(2) +
    ' px / ' + (S.hatchSize * 292 / 560).toFixed(2) + ' px.';
  el('out').value = JSON.stringify(S, null, 1);
}

for (const k of KEYS) {
  const inp = el(k); if (!inp) continue;
  inp.value = S[k];
  el('v' + k).textContent = S[k];
  inp.addEventListener('input', () => {
    S[k] = +inp.value; el('v' + k).textContent = inp.value; render();
  });
}
['genus','cls','q','limit'].forEach(id => el(id).addEventListener('input', render));
el('hN').addEventListener('click', () => { southern = false;
  el('hN').setAttribute('aria-pressed','true'); el('hS').setAttribute('aria-pressed','false'); render(); });
el('hS').addEventListener('click', () => { southern = true;
  el('hN').setAttribute('aria-pressed','false'); el('hS').setAttribute('aria-pressed','true'); render(); });
el('reset').addEventListener('click', () => {
  Object.assign(S, DEFAULTS);
  for (const k of KEYS) { const i = el(k); if (i) { i.value = S[k]; el('v'+k).textContent = S[k]; } }
  render();
});
el('copy').addEventListener('click', () => {
  el('out').select(); document.execCommand('copy');
  el('copy').textContent = 'Copied'; setTimeout(() => el('copy').textContent = 'Copy settings', 1200);
});
render();
</script>`;

fs.writeFileSync('./proto-dormancy-tuner.html', html, 'utf8');
console.log('wrote proto-dormancy-tuner.html  ' + (html.length / 1024).toFixed(0) + ' KB' +
            '  (' + species.length + ' species, ' + Object.keys(places).length + ' places)');
