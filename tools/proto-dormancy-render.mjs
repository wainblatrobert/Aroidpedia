/* Renders the rest-season curve from REAL climate.json data.

   ⚠ This is a DATA FIGURE, not a card mock. It deliberately does not
   reproduce the species card's chrome — faked site chrome has twice
   been read as a component's real output. Judge the curve here, then
   it goes into the card for real.

   Palette is lifted from the live .apsc-clim block so the curve sits
   correctly beside the existing charts: sage 175,192,144 on dark.   */
import fs from 'fs';
import { calendar, phrase } from './dormancy-core.mjs';
import { chart } from './dormancy-view.mjs';

const D = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/JS JAVASCRIPT CODE/';
const C = JSON.parse(fs.readFileSync('./climate.json', 'utf8'));
const SI = JSON.parse(fs.readFileSync(D + 'search-index.json', 'utf8')).entries;
const PL = JSON.parse(fs.readFileSync(D + 'places.json', 'utf8')).places;
const LAT = {}; PL.forEach(p => { LAT[p.tag] = p.lat; });
const latOf = t => LAT[t];

/* geometry + hatch live in dormancy-view.mjs — the SAME module the
   tuner inlines, so the static page and the interactive one cannot
   drift apart. */
/* ── pick a spread that makes the design decisions visible ── */
const PICK = ['DUNNII', 'GRACILIOR', 'GOMBOCZIANUS', 'BULBIFER',
              'GIGAS', 'HOTTAE', 'BECCARII', 'CARNOSUS'];
const cards = [];
for (const key of PICK) {
  const e = SI.find(x => x.g === 'Amorphophallus' && x.c === 'species' &&
                         x.t.endsWith(' ' + key));
  if (!e) { cards.push(`<div class="c"><h3>${key}</h3><p class="miss">not yet imported</p></div>`); continue; }
  const cal = calendar(C.places, e.tg || [], latOf);
  if (!cal) continue;
  const p = phrase(cal, false);
  const pS = phrase(cal, true);
  cards.push(`<div class="c">
    <h3>${e.t.replace('AMORPHOPHALLUS ', '<i>Amorphophallus</i> ').toLowerCase()
              .replace('<i>amorphophallus</i>', '<i>Amorphophallus</i>')}</h3>
    <div class="meta">${cal.cls} · driest month ${cal.driestMm} mm, wettest ${cal.wettestMm} mm · ${
      cal.tags.length} place${cal.tags.length > 1 ? 's' : ''}${
      cal.thin.length ? ' · thin: ' + cal.thin.join(', ') : ''}</div>
    ${chart(cal, false, {})}
    <div class="head"><b>${p.lean}</b><span class="bar">|</span><span class="grow">${p.grow}</span></div>
    <div class="body">${p.body}</div>
    ${cal.cued ? `<div class="alt">southern hemisphere → <b>${pS.lean}</b>` +
                 `<span class="bar">|</span>${pS.grow}</div>` : ''}
    <div class="tags">${cal.tags.join(' · ')}</div>
  </div>`);
}

const html = `<!doctype html><meta charset="utf-8">
<title>Rest-season curve — prototype</title>
<style>
 body{background:#14170f;color:#f3f1ea;font:14px/1.5 "Helvetica Neue",Helvetica,Arial;
      margin:0;padding:32px;}
 h1{font-size:15px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;margin:0 0 6px;}
 .note{color:rgba(243,241,234,.62);max-width:70ch;margin:0 0 26px;font-size:13px;}
 .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(430px,100%),1fr));gap:26px;}
 .c{border:1px solid rgba(243,241,234,.12);border-radius:10px;padding:16px 16px 12px;}
 h3{font-size:14px;margin:0 0 2px;font-weight:600;}
 .meta{font-size:11px;color:rgba(243,241,234,.42);margin-bottom:8px;letter-spacing:.04em;}
 .disc b{color:rgba(243,241,234,.85);}
 svg{width:100%;height:auto;display:block;}
 .head{margin-top:8px;color:rgb(197,212,166);font-size:14.5px;line-height:1.35;}
 .head b{font-weight:600;}
 .bar{color:rgba(243,241,234,.28);margin:0 .5em;}
 .grow{color:rgba(243,241,234,.78);font-weight:400;}
 .body{font-size:12.5px;color:rgba(243,241,234,.72);margin-top:2px;}
 .alt{font-size:12px;color:rgba(243,241,234,.5);margin-top:6px;}
 .tags{font-size:11px;color:rgba(243,241,234,.34);margin-top:8px;}
 .miss{color:rgba(243,241,234,.4);font-size:12px;}
 .disc{margin-top:30px;border-top:1px solid rgba(243,241,234,.12);padding-top:14px;
       font-size:12.5px;color:rgba(243,241,234,.66);max-width:70ch;}
</style>
<h1>Rest-season curve — prototype</h1>
<p class="note">Real data, climate.json ${C.version} — now carrying <b>prMed</b>,
 median monthly rainfall. Higher curve = leaner month. Height is an ABSOLUTE
 stress (rain below Köppen's 60 mm dry-month line, nights below 18 °C), measured
 above each place's own year-round floor, so an everwet species draws flat because
 it is flat — not because it was rescaled.
 <b>The year wraps</b> — the curve runs off one edge and returns at the other at
 exactly the same height, so a Nov–Mar season reads as one winter rather than two
 humps. This is a data figure — it deliberately does not mimic the card's chrome.</p>
<div class="grid">${cards.join('')}</div>
<p class="disc"><b>Outdoor growing.</b> This is the lean season where the species
 grows wild — the months when rainfall there is lowest, or nights coldest.
 Indoors, watering and warmth decide when a plant rests, not this calendar.</p>`;

fs.writeFileSync('./proto-dormancy.html', html, 'utf8');
console.log('wrote proto-dormancy.html  (climate.json ' + C.version + ')');
for (const key of PICK) {
  const e = SI.find(x => x.g === 'Amorphophallus' && x.c === 'species' && x.t.endsWith(' ' + key));
  if (!e) { console.log('  ' + key.padEnd(14) + 'not yet imported'); continue; }
  const cal = calendar(C.places, e.tg || [], latOf);
  console.log('  ' + key.padEnd(14) + cal.cls.padEnd(10) +
              String(cal.driestMm).padStart(4) + '-' + String(cal.wettestMm).padEnd(5) +
              ' mm  ' + phrase(cal, false).lean);
}
