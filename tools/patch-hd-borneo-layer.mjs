/* Add the BORNEO layer to build-shapes-hd.

   ⚠⚠ APPENDED LAST. The builder is explicit: "ORDER IS LOAD-BEARING.
   find() returns the first match, so a layer added anywhere but the
   end can change which feature an EXISTING tag resolves to, silently
   and for every tag at once." A dry run over all 1,546 names existing
   tags search for found only FOUR that this layer also answers to —
   Sarawak, Sabah and Labuan (twice) — and Labuan is already pinned to
   admin1. Sarawak and Sabah are unpinned, and they are precisely the
   two shapes this batch re-sources, so they get an explicit pin to
   this layer in the same change. Nothing outside Borneo can move.

   ⚠ NOT A DOWNLOAD. Every other layer is fetched from Natural Earth;
   this one is BUILT by gb/build-borneo-layer.mjs from geoBoundaries.
   ensure() therefore must not try to fetch it — it fails with a
   message naming the script instead, so a deleted cache says what to
   run rather than 404ing against a made-up URL.                     */
import fs from 'fs';
const P = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/JS JAVASCRIPT CODE/build-shapes-hd 8.19.26 v4.js';
let s = fs.readFileSync(P, 'utf8');
const CR = String.fromCharCode(13), LF = String.fromCharCode(10);
const toCRLF = t => t.split(CR + LF).join(LF).split(LF).join(CR + LF);
const edits = [];
function cut(name, find, repl) {
  const f = toCRLF(find), r = toCRLF(repl);
  const n = s.split(f).length - 1;
  if (n !== 1) { console.error('ABORT: "' + name + '" matched ' + n); process.exit(1); }
  s = s.replace(f, () => r);
  edits.push(name);
}

cut('src-entry',
`  countries10m: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson'
};`,
`  countries10m: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson',
  /* 8.20.26: BORNEO. Not a Natural Earth layer and NOT fetched - built
     locally by gb/build-borneo-layer.mjs from geoBoundaries, because NE
     publishes no admin-2 anywhere and Sarawak's divisions cannot come
     from it. null means "must already exist"; see ensure(). */
  borneo: null
};`);

cut('ensure-local',
`  fs.mkdirSync(CACHE, { recursive: true });
  const f = CACHE + k + '.geojson';
  if (fs.existsSync(f)) return;
  const r = await fetch(SRC[k]);`,
`  fs.mkdirSync(CACHE, { recursive: true });
  const f = CACHE + k + '.geojson';
  if (fs.existsSync(f)) return;
  /* a layer with no URL is BUILT, not downloaded - say so rather than
     fetching "null" and reporting a meaningless 404 */
  if (!SRC[k]) throw new Error(k + ': cache file missing and this layer is not fetchable. ' +
    'Run gb/build-borneo-layer.mjs to regenerate ' + f);
  const r = await fetch(SRC[k]);`);

cut('layer-last',
`  const layers = {
    countries:    grab('countries').features,
    regions:      grab('regions').features,
    admin1:       grab('admin1').features,
    countries10m: grab('countries10m').features
  };`,
`  const layers = {
    countries:    grab('countries').features,
    regions:      grab('regions').features,
    admin1:       grab('admin1').features,
    countries10m: grab('countries10m').features,
    /* ⚠ LAST, and it must stay last. Dry-run before adding it: of the
       1,546 names existing tags search for, this layer answers to only
       Sarawak, Sabah and Labuan. Labuan is already pinned to admin1;
       Sarawak and Sabah are pinned to 'borneo' by the same batch that
       re-sources them. Everything else on the island reaches it through
       an explicit pin, so no unpinned tag anywhere can change layer. */
    borneo:       grab('borneo').features
  };`);

fs.writeFileSync(P, s, 'utf8');
console.log('edits: ' + edits.join(', '));
