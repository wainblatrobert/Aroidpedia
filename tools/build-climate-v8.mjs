/* Build climate.json for the Aroidpedia species cards.

   Sources:
     - WorldClim 2.1 monthly climatologies (1970-2000), 10 arc-min:
       tmin, tmax (°C) and vapr (water vapour pressure, kPa).
       Downloaded 8.8.26 into climate-cache/ next to ne-cache/.
     - Natural Earth polygons from ne-cache/ — THE SAME four layers and
       THE SAME matching tables as build-shapes, so a place's climate is
       measured over the same ground the map draws.

   ⚠ 8.17.26 — THE TABLES ARE NO LONGER COPIED HERE. Up to v1.4.0 this
   file kept its own transcription of build-shapes' ALIAS/LAYER/DOTS,
   maintained by hand under a "sync contract". That contract drifted
   twice: by 8.17.26 this file held 33 aliases against build-shapes'
   125, and none of the three 8.16.26 matching fixes. So the tables are
   now READ OUT OF build-shapes ITSELF at build time (see loadTables
   below) and the matching function is a port of its findPass(). There
   is one owner of this knowledge again.

   Output: climate.json keyed by the site's Geography tag. For every
   place, per calendar month, low/high temperature and low/high
   relative humidity — each as percentiles across the place's pixels —
   in TWO variants:
     all : every land pixel in the place
     ff  : frost-free pixels only (coldest-month mean tmin >= 0 °C)
   The card shows `ff` when the place has a meaningful frost-free area
   (share >= 0.10) and falls back to `all` for genuinely temperate
   places. That rule lives client-side ON PURPOSE — both variants ship,
   so tuning the rule never needs a data rebuild.

   RH is DERIVED (WorldClim has vapour pressure, not RH):
     es(T) = 0.6108 * exp(17.27 T / (T + 237.3))   [FAO-56, kPa]
     RH_high = 100 * vapr / es(tmin)   (dawn, at the daily minimum)
     RH_low  = 100 * vapr / es(tmax)   (afternoon, at the daily max)
   clamped to [0,100].

   Stats per month: p05 / p50 of tmin, p50 / p95 of tmax, p05 of
   RH_low, p95 of RH_high. Percentile trim is the cutoff methodology:
   it removes the mountaintop/outlier tail that a political unit drags
   in. Annual absolute extremes (annTnMin / annTxMax) are also kept per
   variant so "true range of survivability" can be shown if wanted.

   Pixels are POINT SAMPLES at cell centres, unweighted (no cos-lat
   area weighting; at 10' and country scale the bias is < the data's
   own error). Places whose polygon covers no valid land pixel (small
   islands: the ocean-masked grid can miss them) fall back to the
   nearest valid pixel spiralling out from the places.json centroid,
   and say so in `method`.

   RUN FROM LOCAL DISK (needs `npm i geotiff`; npm cannot write
   node_modules onto Google Drive — hundreds of tar write errors):
     node build-climate.mjs
   Reads Drive for places.json + ne-cache + climate-cache, writes
   climate.json both locally and next to shapes.json on Drive.

   SELF-CHECK: the set of places resolved here must EXACTLY equal
   shapes.json's shapes+dots. That check survives the table change —
   it now catches a STALE shapes.json (built before the last
   places.json edit) rather than stale tables.

   AUDIT SIDECAR: climate-audit.json, written beside the output, carries
   per place the pixel count, a hash of the pixel set and the pixel
   set's centroid. It is what the centroid gate and the duplicate-
   geometry check read; nothing ships it. */

import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { fromFile } = require('geotiff');

const DRIVE = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/JS JAVASCRIPT CODE/';
const CACHE = DRIVE + 'ne-cache/';
const CLIM  = DRIVE + 'climate-cache/';
const OUT_LOCAL = new URL('./climate.json', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const OUT_DRIVE = DRIVE + 'climate.json';
/* the audit sidecar stays local — it is a build artefact, not a feed */
const AUDIT_LOCAL = OUT_LOCAL.replace(/climate\.json$/, 'climate-audit.json');

/* 1.9.0 (8.18.26): THE HD-ONLY PLACES. shapes-hd.json carries 207
   places that places.json deliberately does not (build-shapes-hd's
   EXTRA_PLACES fence protects the journal builder's continent guard) —
   Brazil North, Mexico Southwest, West Himalaya, Türkiye, Florida … —
   and they carried 26% of the family's species-records with no climate
   row. They are appended after places.json loads, with GEOMETRY TAKEN
   FROM shapes-hd.json ITSELF (parsed [lon,-lat] M/L paths), because for
   an HD-only place the ground the map draws IS that polygon — the same
   one-owner rule that moved the matching tables into build-shapes.
   The 712 places.json places still resolve through Natural Earth
   exactly as before; their values must not move. The self-check widens
   to shapes.json ∪ shapes-hd.json. */
/* 1.10.0 (8.18.26): PER-PIXEL KOPPEN (S2 of the family-wide plan).
   Every variant gains `koppen: [[code, share], ...]` — the distribution
   of full Koppen-Geiger classes (Peel et al. 2007; B first, 0 degC C/D
   boundary, hemisphere from the pixel's row) across the variant's own
   pixels. This is what lets a big split unit tell the truth: one class
   from aggregate medians said ONE thing about Brazil North; the pixel
   distribution says Af/Am/Aw and by how much. Additive — nothing that
   existed in 1.9.0 changes. Tmean = (tmin+tmax)/2, the approximation
   every consumer already lives with. */
/* 1.11.0 (8.18.26): no code change — the 59 Brazilian and Mexican
   states landed in shapes-hd.json (S3) and the HD supplement picks
   them up by construction. 919 -> 978 places; the 919 must be
   value-identical. */
/* 1.12.0 (8.18.26): ELEVATION SLABS (S5). Per place, the 'all' pixel
   set is cut into 250 m elevation slabs (WorldClim 2.1 10' elev, same
   grid); each slab ships n, its Koppen mix (shares >= 0.02, 2 dp) and
   the coldest-month median tmin / hottest-month median tmax. This is
   what lets a species with a stated altitude band ('altitude: 650-1175
   m' in ECOLOGY) be read at ITS elevation instead of its province's —
   a cloud-forest Anthurium and a valley Anthurium share a polygon but
   not a slab. Sub-sea-level pixels clamp to slab 0; slabs above 6000 m
   clamp to the top. Additive; nothing that existed in 1.11.0 moves. */
const VERSION = '1.12.0';
/* 1.1.0: adds the "warm" (>=10°C/50°F) variant — user ruling 8.8.26.
   1.2.0: adds "warmMoist" (warm AND WTE Moist domain) — same ruling
   extended to the hot/dry side: a moist-forest species tagged "India"
   must not inherit the Thar's 42°C / RH 15%. The moisture clip is the
   WTE grid itself, not a second temperature threshold.
   1.3.0: adds rhLo50/rhHi50 (median-pixel afternoon low / dawn high) —
   user ruling 8.9.26: p05 afternoon RH is a triple extreme (driest
   pixels x driest hour x driest month; Thailand read "33%") and the
   card should show the TYPICAL daily swing. p05/p95 stay in the file
   for anything that wants the envelope.
   1.4.0 (8.10.26): the 19 far-range places from shapes v7 (the
   Amorphophallus sheet audit) — Mozambique through Society Islands.
   Existing places' numbers are untouched; ALIAS/LAYER below updated to
   the build-shapes 8.10.26 v7 copies per the sync contract.
   1.5.0 (8.17.26): THE LEVEL-4 PLACES. 146 -> 712, matching
   shapes.json place for place. No change to the science: the same
   rasterizer over the same WorldClim rasters, the same percentile
   trim, the same FAO-56 RH, the same four variants and WTE zones.
   What changed is WHICH GROUND each name resolves to — the tables are
   now read from build-shapes (above) and find() gained its three
   8.16.26 fixes: the admin pin, the admin pin implying admin_1, and
   two-pass matching. Any pre-existing place whose numbers move does so
   because it was mis-resolved before; see CLIMATE REBUILD 8.17.26 for
   the diff, place by place.
   1.6.0 (8.17.26): TWO PLACE DEFINITIONS CORRECTED, both found
   by 1.5.0's own centroid gate and both fixed UPSTREAM in
   build-shapes v8, so the map moved with the data:
     Nicobar  — its ALIAS unioned the whole Andaman & Nicobar
       union territory, so 20 of the tag's 47 cells sat on the
       ANDAMANS, which are already a tag of their own. Now the
       Nicobars alone: 30 cells at 7.9 N.
     Seychelles — the archipelago catches exactly ONE 10-arcmin
       cell centre and it was ALDABRA, 1131 km from the granitic
       islands the tag means and the only aroid POWO cites for it
       (Protarum sechellarum, 122 of 122 GBIF records on the
       granitics). build-shapes v8's new CLIP table drops the
       Aldabra Group; the row now falls to the centroid path and
       is measured at Mahé.
   Nothing else moves: 710 of the 712 places are byte-identical
   to 1.5.0. No change to the science.
   1.7.0 (8.17.26): PRECIPITATION. Adds prMed - median monthly
   rainfall in mm across the variant's pixels, from WorldClim 2.1
   10-arcmin `prec` (12 rasters, downloaded into climate-cache/
   beside the other three).
     WHY: the file could not answer "when is the dry season". The
     obvious proxy, dew point derived from vapr, turns out to be
     unusable for it - dew point tracks the daily MINIMUM temperature
     almost exactly (overnight cooling drives air to near saturation),
     so a dew-based "dry season" is a temperature season wearing
     another name. Measured: Ogun, Nigeria has 2.7 C of dew amplitude
     against 2.1 C of tmin amplitude - no dry-season signal at all -
     while its RAINFALL runs 13 mm in January against 233 mm in June.
     The Harmattan is only visible in prec. 55% of the 712 places had
     dawn RH pinned at 100% for 9+ months of the year, which is where
     that proxy fails hardest.
     Existing fields are UNTOUCHED - this is purely additive, so every
     1.6.0 number survives byte-for-byte inside its variant.
   1.8.0 (8.17.26): lat/lon per place, straight from places.json.
     WHY: the card needs the NATIVE HEMISPHERE. It shifts the rest
     season by six months for a southern-hemisphere reader, which is
     correct only if the species is northern-native - and 22 of the 110
     Amorphophallus are not. The Madagascar species already compute a
     May-Oct lean season (southern winter), so shifting THAT for a
     southern reader moved it backwards into their summer.
     Latitude is the only reliable signal: derived from the warmest
     month instead, it disagrees with the true sign on 15 species,
     because near the equator the temperature peak is noise.
     Purely additive again. */

/* ── grid ── 10 arc-min global: 2160 x 1080, centre-of-cell samples */
const W = 2160, H = 1080, STEP = 1 / 6;
const colOf = lon => Math.min(W - 1, Math.max(0, Math.floor((lon + 180) / STEP)));
const rowOf = lat => Math.min(H - 1, Math.max(0, Math.floor((90 - lat) / STEP)));
const latOfRow = r => 90 - (r + 0.5) * STEP;

/* ── THE MATCHING TABLES, READ OUT OF build-shapes ─────────────────
   Not copied. The newest `build-shapes <date> vN.js` on the Drive is
   located, its ALIAS / LAYER / DOTS literals are cut out of the source
   and evaluated. build-shapes cannot simply be imported: it is a CJS
   script whose body is a top-level IIFE that downloads Natural Earth
   and writes shapes.json, so requiring it would run a whole build.

   The cut is deliberately brittle in the LOUD direction. Each literal
   must be found, must parse, and must clear a floor on its size and a
   set of spot checks; anything else aborts before a raster is touched.
   A silent half-table is the one failure mode that would reproduce the
   drift this replaces.

   ⚠ Not read: DETAIL (simplification tolerances) and CONTINENT_OF.
   Neither has any meaning for a measurement — climate rasterizes the
   FULL-RESOLUTION geometry, never the simplified path. This is why
   Fiji keeps its antimeridian fragments here (real Fijian land; only
   the DRAWN shape trims them) even though DETAIL drops them on the
   map. */
function loadTables() {
  const files = fs.readdirSync(DRIVE)
    .map(f => ({ f, m: f.match(/^build-shapes (\d+)\.(\d+)\.(\d+) v(\d+)\.js$/) }))
    .filter(x => x.m)
    .sort((a, b) => (+a.m[4]) - (+b.m[4]));
  if (!files.length) throw new Error('no build-shapes <date> vN.js in ' + DRIVE);
  const file = files[files.length - 1].f;
  const src = fs.readFileSync(DRIVE + file, 'utf8');
  const cut = (name, re) => {
    const m = src.match(re);
    if (!m) throw new Error(`${file}: could not find the ${name} table`);
    try { return new Function('return ' + m[1])(); }
    catch (e) { throw new Error(`${file}: ${name} did not parse — ${e.message}`); }
  };
  const ALIAS = cut('ALIAS', /const ALIAS = (\{[\s\S]*?\n\});/);
  const LAYER = cut('LAYER', /const LAYER = (\{[\s\S]*?\n\});/);
  const DOTS  = cut('DOTS',  /const DOTS = (\[[\s\S]*?\])/);
  /* 8.17.26, build-shapes v8: a tag may exclude PARTS of the
     feature it names. Seychelles is the whole reason — see the
     CLIP note in build-shapes. This must be read here or the
     climate row would be measured over ground the map does not
     draw, which is exactly the drift the table-cut replaced. */
  const CLIP  = cut('CLIP',  /const CLIP = (\{[\s\S]*?\n\});/);
  /* floors + spot checks: a cut that silently caught half a table
     would still look like a table. These are the three bugs the
     8.16.26 fixes exist for, plus the oldest pin in the file. */
  const bad = [];
  if (Object.keys(ALIAS).length < 100) bad.push(`ALIAS has only ${Object.keys(ALIAS).length} entries`);
  if (Object.keys(LAYER).length < 5)   bad.push(`LAYER has only ${Object.keys(LAYER).length} entries`);
  if (!Array.isArray(DOTS) || !DOTS.includes('Himalaya')) bad.push('DOTS lost Himalaya');
  if (String(ALIAS['Niger State']) !== 'Niger')           bad.push('ALIAS lost Niger State');
  if (LAYER['Saint Lucia'] !== 'countries10m')            bad.push('LAYER lost the Saint Lucia pin');
  if (!Array.isArray(CLIP['Seychelles']) || CLIP['Seychelles'].length !== 4)
    bad.push('CLIP lost the Seychelles box');
  if (bad.length) throw new Error(`${file}: table extraction looks wrong — ` + bad.join('; '));
  console.log(`tables from ${file}: ALIAS ${Object.keys(ALIAS).length}, ` +
              `LAYER ${Object.keys(LAYER).length}, DOTS ${DOTS.length}, `
              + `CLIP ${Object.keys(CLIP).length}`);
  return { ALIAS, LAYER, DOTS, CLIP, tableSource: file };
}
const { ALIAS, LAYER, DOTS, CLIP, tableSource } = loadTables();

/* tag -> the country its admin_1 feature must sit in. Filled from
   places.json exactly as build-shapes fills it, from the same `admin`
   field. See the note on findPass for what it prevents. */
const ADMIN_PIN = {};


/* build-shapes' norm(), memoised. 712 places x two passes x ~4600
   admin_1 features is ~30 M calls otherwise; the cache makes it ~5 k
   distinct strings. Same function, same answers. */
const _normRaw = s => String(s || '').toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, ' ').trim();
const _normMemo = new Map();
const norm = s => {
  const k = String(s || '');
  let v = _normMemo.get(k);
  if (v === undefined) { v = _normRaw(k); _normMemo.set(k, v); }
  return v;
};

const grab = k => JSON.parse(fs.readFileSync(CACHE + k + '.geojson', 'utf8'));

/* ── scanline rasterizer: geometry -> Set of grid pixel indices ──
   Even-odd fill over ALL rings, so holes subtract themselves. Runs on
   the FULL-RESOLUTION Natural Earth geometry — no simplification, the
   map's Douglas-Peucker tolerance has no business in a measurement. */
function rasterize(geom, into) {
  const polys = geom.type === 'Polygon' ? [geom.coordinates]
              : geom.type === 'MultiPolygon' ? geom.coordinates : [];
  polys.forEach(rings => {
    let minLat = 90, maxLat = -90;
    rings.forEach(r => r.forEach(p => {
      if (p[1] < minLat) minLat = p[1];
      if (p[1] > maxLat) maxLat = p[1];
    }));
    const r0 = rowOf(maxLat), r1 = rowOf(minLat);
    for (let row = r0; row <= r1; row++) {
      const y = latOfRow(row);
      const xs = [];
      rings.forEach(r => {
        for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
          const [x1, y1] = r[j], [x2, y2] = r[i];
          if ((y1 > y) !== (y2 > y)) {
            xs.push(x1 + (y - y1) / (y2 - y1) * (x2 - x1));
          }
        }
      });
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const c0 = colOf(xs[k] + 1e-9), c1 = colOf(xs[k + 1] - 1e-9);
        for (let c = c0; c <= c1; c++) {
          const lon = -180 + (c + 0.5) * STEP;
          if (lon >= xs[k] && lon <= xs[k + 1]) into.add(row * W + c);
        }
      }
    }
  });
}

/* drop the polygon parts a tag's CLIP box excludes — the same
   function as build-shapes v8's, so the measurement and the map
   see the same parts. Identity when the tag has no box. */
function clipGeom(geom, box) {
  if (!box) return geom;
  const polys = geom.type === 'Polygon' ? [geom.coordinates]
              : geom.type === 'MultiPolygon' ? geom.coordinates : [];
  const keep = polys.filter(rings => {
    const r = rings[0];
    if (!r || !r.length) return false;
    let la = 0, lo = 0;
    r.forEach(p => { lo += p[0]; la += p[1]; });
    la /= r.length; lo /= r.length;
    return la >= box[0] && la <= box[2] && lo >= box[1] && lo <= box[3];
  });
  return { type: 'MultiPolygon', coordinates: keep };
}

/* nearest valid land pixel, spiralling out from a centroid */
function nearestValid(lat, lon, valid, maxR) {
  const r0 = rowOf(lat), c0 = colOf(lon);
  for (let rad = 0; rad <= maxR; rad++) {
    let best = -1, bestD = 1e9;
    for (let dr = -rad; dr <= rad; dr++) {
      for (let dc = -rad; dc <= rad; dc++) {
        if (Math.max(Math.abs(dr), Math.abs(dc)) !== rad) continue;
        const r = r0 + dr, c = c0 + dc;
        if (r < 0 || r >= H || c < 0 || c >= W) continue;
        const idx = r * W + c;
        if (!valid[idx]) continue;
        const d = dr * dr + dc * dc;
        if (d < bestD) { bestD = d; best = idx; }
      }
    }
    if (best >= 0) return best;
  }
  return -1;
}

function percentile(sorted, p) {
  if (!sorted.length) return null;
  const i = Math.min(sorted.length - 1, Math.max(0, Math.round(p * (sorted.length - 1))));
  return sorted[i];
}

/* FAO-56 saturation vapour pressure, kPa */
const es = t => 0.6108 * Math.exp(17.27 * t / (t + 237.3));
const r1 = v => Math.round(v * 10) / 10;

/* ── World Terrestrial Ecosystems (user's wte_012 shapefile) ──
   372 records, one merged multipart polygon per class. The 4-part
   CLASSNAME ("Warm Temperate Moist Forest on Plains") collapses to its
   temperature x moisture ZONE ("Warm Temperate Moist") — the same
   collapse the Esri story map uses. Rasterized onto the WorldClim grid
   with row-bucketed even-odd scanlines (a global class record would
   otherwise cost rows x all-edges). */
const WTE_DIR = 'G:/My Drive/PlantsV2/Tableau Aroid Dashboards/World Climate Map/WTE SHAPE FILES/';
const MOISTURE = ['Moist', 'Dry', 'Desert'];

function zoneOf(classname) {
  const words = classname.split(/\s+/);
  for (let i = 1; i < words.length; i++) {
    if (MOISTURE.includes(words[i])) return words.slice(0, i + 1).join(' ');
  }
  return null; /* e.g. pure water/ice classes with no moisture domain */
}

function buildZoneGrid() {
  const dbf = fs.readFileSync(WTE_DIR + 'wte_012.dbf');
  const nRec = dbf.readUInt32LE(4), hdrSize = dbf.readUInt16LE(8), recSize = dbf.readUInt16LE(10);
  const fields = []; let fo = 32;
  while (dbf[fo] !== 0x0D) {
    fields.push({ name: dbf.toString('ascii', fo, fo + 11).replace(/\0.*$/, ''), len: dbf[fo + 16] });
    fo += 32;
  }
  const cnIdx = fields.findIndex(f => f.name === 'CLASSNAME');
  const cnOff = 1 + fields.slice(0, cnIdx).reduce((a, f) => a + f.len, 0);
  const cnLen = fields[cnIdx].len;
  const classnames = [];
  for (let i = 0; i < nRec; i++) {
    const o = hdrSize + i * recSize;
    classnames.push(dbf.toString('ascii', o + cnOff, o + cnOff + cnLen).trim());
  }

  /* zone ids */
  const zoneIds = new Map(); const zoneNames = [];
  const zoneOfRec = classnames.map(cn => {
    const z = zoneOf(cn);
    if (z == null) return -1;
    if (!zoneIds.has(z)) { zoneIds.set(z, zoneNames.length); zoneNames.push(z); }
    return zoneIds.get(z);
  });

  const shp = fs.readFileSync(WTE_DIR + 'wte_012.shp');
  const grid = new Int16Array(W * H).fill(-1);
  let off = 100, rec = 0;
  while (off + 8 <= shp.length) {
    const contentLen = shp.readUInt32BE(off + 4) * 2;
    const c = off + 8;
    off = c + contentLen;
    const shapeType = shp.readInt32LE(c);
    const zid = zoneOfRec[rec]; rec++;
    if (shapeType !== 5) continue;
    if (zid < 0) continue;
    const numParts = shp.readInt32LE(c + 36);
    const numPoints = shp.readInt32LE(c + 40);
    const partsAt = c + 44, pointsAt = partsAt + 4 * numParts;
    const parts = [];
    for (let p = 0; p < numParts; p++) parts.push(shp.readInt32LE(partsAt + 4 * p));
    parts.push(numPoints);

    /* bucket edges by grid row so each row only tests edges that cross it */
    const buckets = new Map();
    for (let p = 0; p < numParts; p++) {
      for (let i = parts[p], j = parts[p + 1] - 1; i < parts[p + 1]; j = i++) {
        const x1 = shp.readDoubleLE(pointsAt + 16 * j), y1 = shp.readDoubleLE(pointsAt + 16 * j + 8);
        const x2 = shp.readDoubleLE(pointsAt + 16 * i), y2 = shp.readDoubleLE(pointsAt + 16 * i + 8);
        if (y1 === y2) continue;
        const rTop = rowOf(Math.max(y1, y2)), rBot = rowOf(Math.min(y1, y2));
        for (let r = rTop; r <= rBot; r++) {
          let b = buckets.get(r); if (!b) { b = []; buckets.set(r, b); }
          b.push(x1, y1, x2, y2);
        }
      }
    }
    for (const [row, e] of buckets) {
      const y = latOfRow(row);
      const xs = [];
      for (let k = 0; k < e.length; k += 4) {
        const x1 = e[k], y1 = e[k + 1], x2 = e[k + 2], y2 = e[k + 3];
        if ((y1 > y) !== (y2 > y)) xs.push(x1 + (y - y1) / (y2 - y1) * (x2 - x1));
      }
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const c0 = colOf(xs[k] + 1e-9), c1 = colOf(xs[k + 1] - 1e-9);
        for (let col = c0; col <= c1; col++) {
          const lon = -180 + (col + 0.5) * STEP;
          if (lon >= xs[k] && lon <= xs[k + 1]) grid[row * W + col] = zid;
        }
      }
    }
  }
  return { grid, zoneNames };
}

/* top zones with shares for a pixel set: [[name, share], …] ≥5%, max 3 */
function topZones(set, grid, zoneNames) {
  const counts = new Map();
  let n = 0;
  for (const i of set) {
    const z = grid[i];
    if (z < 0) continue;
    n++;
    counts.set(z, (counts.get(z) || 0) + 1);
  }
  if (!n) return [];
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1]).slice(0, 3)
    .map(([z, c]) => [zoneNames[z], +(c / n).toFixed(2)])
    .filter(z => z[1] >= 0.05);
}

(async () => {
  /* ── load the 36 rasters ── */
  console.log('loading rasters…');
  const NOD = -1e30;
  async function loadVar(name) {
    const months = [];
    for (let m = 1; m <= 12; m++) {
      const f = `${CLIM}${name}/wc2.1_10m_${name}_${String(m).padStart(2, '0')}.tif`;
      const img = await (await fromFile(f)).getImage();
      if (img.getWidth() !== W || img.getHeight() !== H) {
        throw new Error(f + ': unexpected size ' + img.getWidth() + 'x' + img.getHeight());
      }
      months.push((await img.readRasters())[0]);
    }
    return months;
  }
  const TN = await loadVar('tmin');
  const TX = await loadVar('tmax');
  const VP = await loadVar('vapr');
  const PR = await loadVar('prec');   /* 1.7.0 — mm/month */

  /* validity + cold classes per pixel.
     ff   : frost-free — coldest-month mean tmin >= 0 °C
     warm : coldest-month mean tmin >= 10 °C (50 °F) — the user's ruling
            8.8.26: a species with tropical strongholds does not live in
            a tagged unit's cool margins, even frost-free ones. */
  const WARM_TMIN = 10;
  const valid = new Uint8Array(W * H);
  const ff = new Uint8Array(W * H);
  const warm = new Uint8Array(W * H);
  let nValid = 0, nFF = 0, nWarm = 0;
  for (let i = 0; i < W * H; i++) {
    let ok = true, coldest = 1e9;
    for (let m = 0; m < 12; m++) {
      const v = TN[m][i];
      if (v < NOD || !isFinite(v)) { ok = false; break; }
      if (v < coldest) coldest = v;
    }
    if (!ok) continue;
    valid[i] = 1; nValid++;
    if (coldest >= 0) { ff[i] = 1; nFF++; }
    if (coldest >= WARM_TMIN) { warm[i] = 1; nWarm++; }
  }
  console.log(`valid land pixels: ${nValid}  frost-free: ${nFF} (${(100 * nFF / nValid).toFixed(1)}%)  warm>=${WARM_TMIN}C: ${nWarm} (${(100 * nWarm / nValid).toFixed(1)}%)`);

  /* ── resolve places to pixel sets ── */
  const layers = {
    countries:    grab('countries').features,
    regions:      grab('regions').features,
    admin1:       grab('admin1').features,
    countries10m: grab('countries10m').features
  };
  /* ── PORTED VERBATIM FROM build-shapes findPass() ──────────────────
     A measurement over the wrong polygon is worse than no measurement:
     it looks like data. These three fixes landed in the shape builders
     on 8.16.26 and are the whole reason this rebuild is not a rerun. */
  const findPass = (name, pin, adminWant, pass) => {
    const want = norm(name);
    for (const [ln, feats] of Object.entries(layers)) {
      if (pin && ln !== pin) continue;          /* v6: LAYER pin */
      /* 8.16.26: an ADMIN PIN implies the admin_1 layer. Without this,
         "Niger" (a Nigerian state) matched the COUNTRY Niger in an
         earlier layer, where the admin filter below does not apply. */
      if (adminWant && ln !== 'admin1') continue;
      for (const f of feats) {
        const p = f.properties;
        /* 8.16.26 ADMIN PIN: province names repeat across the world -
           "La Union" is a province of the Philippines AND a department
           of El Salvador, and file order handed us El Salvador (caught
           208 deg off by the centroid gate). A place may now name the
           country its admin_1 feature must sit in. */
        if (adminWant && (ln === 'admin1') &&
            norm(p.admin || p.ADMIN || '') !== norm(adminWant)) continue;
        /* 8.16.26 TWO PASSES: primary names first, alias fields second.
           NE's Oromiya carries woe_name="Addis Ababa", and being earlier
           in the file it used to answer to that name - so the city
           resolved to the whole region. A feature's own name must beat
           another feature's alias, whatever the file order. */
        const primary = (ln === 'countries' || ln === 'countries10m')
          ? [p.NAME, p.NAME_LONG, p.ADMIN]
          : ln === 'regions' ? [p.NAME]
          : [p.name, p.name_en];
        const aliasNames = (ln === 'countries' || ln === 'countries10m')
          ? [p.NAME_EN, p.BRK_NAME, p.GEOUNIT]
          : ln === 'regions' ? [p.NAMEALT, p.NAME_EN]
          : [p.gn_name, p.woe_name, p.NAME_EN];
        const names = pass === 0 ? primary : aliasNames;
        if (names.some(n => n && norm(n) === want)) return { f, layer: ln };
      }
    }
    return null;
  };
  const find = (name, pin, adminWant) => findPass(name, pin, adminWant, 0) ||
                                         findPass(name, pin, adminWant, 1);

  console.log('rasterizing WTE zones…');
  const { grid: zoneGrid, zoneNames } = buildZoneGrid();
  let zCover = 0;
  for (let i = 0; i < W * H; i++) if (valid[i] && zoneGrid[i] >= 0) zCover++;
  console.log(`WTE zones: ${zoneNames.length} (${zoneNames.join(' | ')})`);
  console.log(`WTE covers ${(100 * zCover / nValid).toFixed(1)}% of valid land pixels (gap = Antarctica + high Arctic, which WTE does not map)`);
  const zoneValid = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) if (zoneGrid[i] >= 0) zoneValid[i] = 1;
  /* which zone ids are Moist-domain ("Tropical Moist", …) */
  const isMoistZone = zoneNames.map(z => / Moist$/.test(z));

  /* ── 1.10.0: per-pixel Koppen-Geiger (Peel et al. 2007) ──────────────
     One pass, one Int8 grid. -1 = unclassifiable (a NOD precipitation
     month; temperature-invalid pixels are already outside `valid`). */
  const KOP_CODES = [
    'Af','Am','Aw','BWh','BWk','BSh','BSk',
    'Csa','Csb','Csc','Cwa','Cwb','Cwc','Cfa','Cfb','Cfc',
    'Dsa','Dsb','Dsc','Dsd','Dwa','Dwb','Dwc','Dwd','Dfa','Dfb','Dfc','Dfd',
    'ET','EF'];
  const KOP_ID = {}; KOP_CODES.forEach((c, i) => { KOP_ID[c] = i; });
  console.log('classifying pixels (Koppen)…');
  const kop = new Int8Array(W * H).fill(-1);
  {
    let classified = 0;
    const t = new Float64Array(12), p = new Float64Array(12);
    for (let i = 0; i < W * H; i++) {
      if (!valid[i]) continue;
      let ok = true;
      for (let m = 0; m < 12; m++) {
        const q = PR[m][i];
        if (!(q > NOD) || !isFinite(q)) { ok = false; break; }
        p[m] = q;
        t[m] = (TN[m][i] + TX[m][i]) / 2;
      }
      if (!ok) continue;
      const north = latOfRow(Math.floor(i / W)) >= 0;
      /* summer half-year: Apr-Sep in the north, Oct-Mar in the south */
      let MAT = 0, MAP = 0, Thot = -1e9, Tcold = 1e9, Pdry = 1e9;
      let Ps = 0, Psdry = 1e9, Pswet = -1e9, Pwdry = 1e9, Pwwet = -1e9;
      let warm10 = 0;
      for (let m = 0; m < 12; m++) {
        MAT += t[m]; MAP += p[m];
        if (t[m] > Thot) Thot = t[m];
        if (t[m] < Tcold) Tcold = t[m];
        if (p[m] < Pdry) Pdry = p[m];
        if (t[m] >= 10) warm10++;
        const summer = north ? (m >= 3 && m <= 8) : (m <= 2 || m >= 9);
        if (summer) {
          Ps += p[m];
          if (p[m] < Psdry) Psdry = p[m];
          if (p[m] > Pswet) Pswet = p[m];
        } else {
          if (p[m] < Pwdry) Pwdry = p[m];
          if (p[m] > Pwwet) Pwwet = p[m];
        }
      }
      MAT /= 12;
      let code;
      /* B first (Peel precedence), threshold in mm */
      const frac = MAP > 0 ? Ps / MAP : 0;
      const pth = 10 * (frac >= 0.7 ? 2 * MAT + 28
                      : frac <= 0.3 ? 2 * MAT
                      : 2 * MAT + 14);
      if (MAP < pth) {
        code = (MAP < pth / 2 ? 'BW' : 'BS') + (MAT >= 18 ? 'h' : 'k');
      } else if (Tcold >= 18) {
        code = Pdry >= 60 ? 'Af' : (Pdry >= 100 - MAP / 25 ? 'Am' : 'Aw');
      } else if (Thot <= 10) {
        code = Thot > 0 ? 'ET' : 'EF';
      } else {
        const CD = Tcold > 0 ? 'C' : 'D';
        const season = (Psdry < 40 && Psdry < Pwwet / 3) ? 's'
                     : (Pwdry < Pswet / 10) ? 'w' : 'f';
        let third;
        if (Thot >= 22) third = 'a';
        else if (warm10 >= 4) third = 'b';
        else if (CD === 'D' && Tcold < -38) third = 'd';
        else third = 'c';
        code = CD + season + third;
      }
      kop[i] = KOP_ID[code];
      classified++;
    }
    console.log(`Koppen: ${classified} of ${nValid} valid pixels classified ` +
                `(${(100 * classified / nValid).toFixed(1)}%)`);
  }
  /* ── 1.12.0: the elevation grid, same W x H ─────────────────────── */
  console.log('loading elevation…');
  const ELEV = await (async () => {
    const f = CLIM + 'elev/wc2.1_10m_elev.tif';
    const img = await (await fromFile(f)).getImage();
    if (img.getWidth() !== W || img.getHeight() !== H) {
      throw new Error('elev grid mismatch: ' + img.getWidth() + 'x' + img.getHeight());
    }
    return (await img.readRasters())[0];
  })();
  const SLAB = 250, SLABS = 25;                     /* 0..6000+ m */
  const slabOf = i => {
    const e = ELEV[i];
    if (!(e > -1000) || !isFinite(e)) return -1;    /* nodata */
    return Math.max(0, Math.min(SLABS - 1, Math.floor(e / SLAB)));
  };

  /* per-place elevation slabs over the 'all' pixel set: n, koppen mix,
     coldest-month median tmin, hottest-month median tmax */
  function elevSlabs(px) {
    const bySlab = {};
    for (const i of px) {
      const si = slabOf(i);
      if (si < 0) continue;
      (bySlab[si] = bySlab[si] || []).push(i);
    }
    const out = {};
    for (const [si, set] of Object.entries(bySlab)) {
      const kc = {};
      let kn = 0;
      for (const i of set) {
        if (kop[i] < 0) continue;
        kc[kop[i]] = (kc[kop[i]] || 0) + 1; kn++;
      }
      const mix = !kn ? [] : Object.entries(kc)
        .map(([id, c]) => [KOP_CODES[+id], +(c / kn).toFixed(2)])
        .filter(e => e[1] >= 0.02)
        .sort((a, b) => b[1] - a[1]);
      /* coldest / hottest month by the slab's own medians */
      let tnCold = 1e9, txHot = -1e9;
      for (let m = 0; m < 12; m++) {
        const tn = [], tx = [];
        for (const i of set) { tn.push(TN[m][i]); tx.push(TX[m][i]); }
        tn.sort((a, b) => a - b); tx.sort((a, b) => a - b);
        const mn = percentile(tn, 0.5), mx = percentile(tx, 0.5);
        if (mn < tnCold) tnCold = mn;
        if (mx > txHot) txHot = mx;
      }
      out[String(si * SLAB)] = {
        n: set.length, k: mix, tn: r1(tnCold), tx: r1(txHot)
      };
    }
    return out;
  }

  /* per-variant distribution, shares of CLASSIFIED pixels, desc */
  function koppenShares(set) {
    const c = {};
    let n = 0;
    for (const i of set) {
      if (kop[i] < 0) continue;
      c[kop[i]] = (c[kop[i]] || 0) + 1; n++;
    }
    if (!n) return [];
    return Object.entries(c)
      .map(([id, k]) => [KOP_CODES[+id], +(k / n).toFixed(3)])
      .filter(e => e[1] > 0)
      .sort((a, b) => b[1] - a[1]);
  }

  const places = JSON.parse(fs.readFileSync(DRIVE + 'places.json', 'utf8')).places;
  /* build-shapes fills ADMIN_PIN from the same field, in the same
     places.forEach that consumes it. Here it is a pre-pass — same
     result, since a place only ever reads its own pin. */
  places.forEach(pl => { if (pl.admin) ADMIN_PIN[pl.tag] = pl.admin; });
  console.log(`places: ${places.length}  admin-pinned: ${Object.keys(ADMIN_PIN).length}`);

  /* ── 1.9.0: append the HD-only places, geometry from shapes-hd.json ── */
  const hd = JSON.parse(fs.readFileSync(DRIVE + 'shapes-hd.json', 'utf8'));
  {
    const have = new Set(places.map(p => p.tag));
    const hdDotOnly = Object.keys(hd.dots || {}).filter(t => !have.has(t));
    if (hdDotOnly.length) {
      /* a dot has no polygon to measure; nothing here handles that case,
         so refuse loudly rather than invent one */
      console.error('ABORT: shapes-hd has DOTS with no places.json row: ' +
                    hdDotOnly.join(', '));
      process.exit(1);
    }
    const parseHdPath = d => {
      const rings = [];
      d.split('M').forEach(seg => {
        seg = seg.trim();
        if (!seg) return;
        const nums = seg.match(/-?\d+(?:\.\d+)?/g) || [];
        const ring = [];
        for (let i = 0; i + 1 < nums.length; i += 2) {
          ring.push([+nums[i], -+nums[i + 1]]);   /* [lon, -lat] -> [lon, lat] */
        }
        if (ring.length >= 3) rings.push(ring);
      });
      /* one Polygon whose rings are ALL subpaths: rasterize() pools ring
         crossings per scanline (even-odd), so islands and holes both come
         out right without classifying which is which */
      return { type: 'Polygon', coordinates: rings };
    };
    let added = 0;
    for (const [tag, d] of Object.entries(hd.shapes)) {
      if (have.has(tag)) continue;
      const geom = parseHdPath(d);
      let sLa = 0, sX = 0, sY = 0, np = 0;
      geom.coordinates.forEach(r => r.forEach(([lo, la]) => {
        sLa += la;
        const t = lo * Math.PI / 180;
        sX += Math.cos(t); sY += Math.sin(t); np++;
      }));
      places.push({
        tag, hdGeom: geom,
        lat: np ? +(sLa / np).toFixed(2) : null,
        lon: np ? +(Math.atan2(sY, sX) * 180 / Math.PI).toFixed(2) : null
      });
      added++;
    }
    console.log(`hd-only places appended: ${added} (geometry from shapes-hd.json)`);
  }

  const out = {}, methods = { polygon: 0, centroid: 0 };
  const failed = [];
  const audit = {};   /* tag -> pixel-set hash + centroid, for the gates */

  for (const pl of places) {
    let pixels = new Set();
    let method = 'polygon';
    const resolved = [];
    if (pl.hdGeom) {
      /* 1.9.0: HD-only place — measured over the shipped map polygon */
      const partPx = new Set();
      rasterize(pl.hdGeom, partPx);
      const pv = [...partPx].filter(i => valid[i]);
      let pLat = null, pLon = null;
      if (pv.length) {
        let sy = 0, sx = 0, sj = 0;
        pv.forEach(i => {
          sy += latOfRow(Math.floor(i / W));
          const lo = (-180 + ((i % W) + 0.5) * STEP) * Math.PI / 180;
          sx += Math.cos(lo); sj += Math.sin(lo);
        });
        pLat = +(sy / pv.length).toFixed(2);
        pLon = +(Math.atan2(sj, sx) * 180 / Math.PI).toFixed(2);
      }
      partPx.forEach(i => pixels.add(i));
      resolved.push({ name: pl.tag, layer: 'shapes-hd', n: pv.length,
                      lat: pLat, lon: pLon });
    } else if (!DOTS.includes(pl.tag)) {
      const wanted = ALIAS[pl.tag] || [pl.tag];
      const pin = LAYER[pl.tag];
      const adminPin = ADMIN_PIN[pl.tag];
      const clip = CLIP[pl.tag];
      wanted.forEach(n => {
        const m = find(n, pin, adminPin);
        if (!m) return;
        /* rasterize each PART separately first, so the audit can say
           where each named part landed. A place made of four enclaves
           has a centroid in the sea between them, and only the parts
           show that this is the shape and not a mismatch. */
        const partPx = new Set();
        rasterize(clipGeom(m.f.geometry, clip), partPx);
        const pv = [...partPx].filter(i => valid[i]);
        let pLat = null, pLon = null;
        if (pv.length) {
          let sy = 0, sx = 0, sj = 0;
          pv.forEach(i => {
            sy += latOfRow(Math.floor(i / W));
            const lo = (-180 + ((i % W) + 0.5) * STEP) * Math.PI / 180;
            sx += Math.cos(lo); sj += Math.sin(lo);
          });
          pLat = +(sy / pv.length).toFixed(2);
          pLon = +(Math.atan2(sj, sx) * 180 / Math.PI).toFixed(2);
        }
        partPx.forEach(i => pixels.add(i));
        resolved.push({ name: n, layer: m.layer, n: pv.length, lat: pLat, lon: pLon });
      });
    }
    /* keep only valid land pixels */
    let px = [...pixels].filter(i => valid[i]);
    if (!px.length) {
      /* dot places, unresolved places, and islands the ocean mask ate */
      const idx = pl.lat != null ? nearestValid(pl.lat, pl.lon, valid, 6) : -1;
      if (idx < 0) { failed.push(pl.tag); continue; }
      px = [idx];
      method = 'centroid';
    }
    methods[method]++;

    /* ── audit record ── the pixel set itself, reduced to two things
       no name-matching bug can fake: WHERE it is, and WHETHER another
       place has exactly the same one. La Union was caught by the
       first; Addis Ababa only by the second. */
    {
      const sorted = [...px].sort((a, b) => a - b);
      let h = 0x811c9dc5;                       /* FNV-1a over the set */
      for (const i of sorted) {
        h ^= i & 0xff;        h = Math.imul(h, 0x01000193);
        h ^= (i >>> 8) & 0xff; h = Math.imul(h, 0x01000193);
        h ^= (i >>> 16) & 0xff; h = Math.imul(h, 0x01000193);
      }
      /* longitude is averaged CIRCULARLY (mean of unit vectors). A
         plain mean puts Fiji, whose NE geometry straddles the
         antimeridian, in the middle of Africa. */
      let sLat = 0, sX = 0, sY = 0;
      let laMin = 90, laMax = -90, loMin = 180, loMax = -180;
      for (const i of sorted) {
        const la = latOfRow(Math.floor(i / W));
        const lo = -180 + ((i % W) + 0.5) * STEP;
        sLat += la;
        if (la < laMin) laMin = la; if (la > laMax) laMax = la;
        if (lo < loMin) loMin = lo; if (lo > loMax) loMax = lo;
        const r = lo * Math.PI / 180;
        sX += Math.cos(r); sY += Math.sin(r);
      }
      audit[pl.tag] = {
        n: px.length, method,
        hash: (h >>> 0).toString(16),
        lat: +(sLat / px.length).toFixed(3),
        lon: +(Math.atan2(sY, sX) * 180 / Math.PI).toFixed(3),
        declLat: pl.lat, declLon: pl.lon,
        admin: pl.admin || null,
        bbox: [+laMin.toFixed(2), +loMin.toFixed(2), +laMax.toFixed(2), +loMax.toFixed(2)],
        resolved
      };
    }

    const ffPx = px.filter(i => ff[i]);
    const warmPx = px.filter(i => warm[i]);
    /* warm AND WTE Moist domain — the hot/dry clip. A pixel with no
       WTE class cannot vote itself Moist, so it is excluded here. */
    const warmMoistPx = warmPx.filter(i => zoneGrid[i] >= 0 && isMoistZone[zoneGrid[i]]);
    const sets = { all: px };
    if (ffPx.length) sets.ff = ffPx;
    if (warmPx.length) sets.warm = warmPx;
    if (warmMoistPx.length) sets.warmMoist = warmMoistPx;

    const entry = {
      n: px.length,
      ffShare: +(ffPx.length / px.length).toFixed(3),
      warmShare: +(warmPx.length / px.length).toFixed(3),
      wmShare: +(warmMoistPx.length / px.length).toFixed(3),
      method,
      /* 1.8.0 - the place's own centroid, so a client can tell which
         hemisphere it sits in without a second feed */
      lat: pl.lat != null ? +(+pl.lat).toFixed(3) : null,
      lon: pl.lon != null ? +(+pl.lon).toFixed(3) : null
    };
    for (const [key, set] of Object.entries(sets)) {
      const tnLo = [], tnMed = [], txMed = [], txHi = [], rhLo = [], rhHi = [],
            rhLo50 = [], rhHi50 = [], prMed = [];
      let annTnMin = 1e9, annTxMax = -1e9;
      for (let m = 0; m < 12; m++) {
        const tn = [], tx = [], rlo = [], rhi = [], pr = [];
        for (const i of set) {
          const a = TN[m][i], b = TX[m][i], v = VP[m][i], q = PR[m][i];
          tn.push(a); tx.push(b);
          if (q > NOD && isFinite(q)) pr.push(q);
          if (a < annTnMin) annTnMin = a;
          if (b > annTxMax) annTxMax = b;
          if (v > NOD && isFinite(v)) {
            rhi.push(Math.max(0, Math.min(100, 100 * v / es(a))));
            rlo.push(Math.max(0, Math.min(100, 100 * v / es(b))));
          }
        }
        tn.sort((x, y) => x - y); tx.sort((x, y) => x - y);
        rlo.sort((x, y) => x - y); rhi.sort((x, y) => x - y);
        pr.sort((x, y) => x - y);
        tnLo.push(r1(percentile(tn, 0.05)));
        tnMed.push(r1(percentile(tn, 0.50)));
        txMed.push(r1(percentile(tx, 0.50)));
        txHi.push(r1(percentile(tx, 0.95)));
        rhLo.push(Math.round(percentile(rlo, 0.05) ?? -1));
        rhHi.push(Math.round(percentile(rhi, 0.95) ?? -1));
        rhLo50.push(Math.round(percentile(rlo, 0.50) ?? -1));
        rhHi50.push(Math.round(percentile(rhi, 0.50) ?? -1));
        /* MEDIAN, not mean: rainfall across a political unit is heavily
           skewed (one wet massif drags a whole province's mean up), the
           same reason every other field here is a percentile. */
        prMed.push(Math.round(percentile(pr, 0.50) ?? -1));
      }
      let zones = topZones(set, zoneGrid, zoneNames);
      /* 1-2 pixel islands the resampled WTE raster missed entirely
         (Grenada, Lakshadweep, …): take the nearest classified pixel
         to the place centroid — for a speck island that is the nearest
         larger island, which shares its zone. */
      if (!zones.length && pl.lat != null) {
        /* radius 30 px ≈ 540 km: enough to reach the Indian coast from
           the Lakshadweep atolls, the farthest-offshore place we have */
        const zi = nearestValid(pl.lat, pl.lon, zoneValid, 30);
        if (zi >= 0) zones = [[zoneNames[zoneGrid[zi]], 1]];
      }
      entry[key] = {
        tnLo, tnMed, txMed, txHi, rhLo, rhHi, rhLo50, rhHi50, prMed,
        annTnMin: r1(annTnMin), annTxMax: r1(annTxMax),
        zones,
        /* 1.10.0 */
        koppen: koppenShares(set)
      };
    }
    /* 1.12.0: elevation slabs on the 'all' set (the band a species
       states already does the clipping the ff/warm variants approximate) */
    entry.elev = { slab: 250, bands: elevSlabs(px) };
    out[pl.tag] = entry;
  }

  if (failed.length) {
    console.error('\nABORT: no pixels for -> ' + failed.join(', '));
    process.exit(1);
  }

  /* ── SELF-CHECK against shapes.json: same world, same places ── */
  const shp = JSON.parse(fs.readFileSync(DRIVE + 'shapes.json', 'utf8'));
  /* 1.9.0: the world is shapes.json ∪ shapes-hd.json now */
  const mapPlaces = new Set([...Object.keys(shp.shapes), ...Object.keys(shp.dots),
                             ...Object.keys(hd.shapes), ...Object.keys(hd.dots || {})]);
  const climPlaces = new Set(Object.keys(out));
  const onlyMap = [...mapPlaces].filter(t => !climPlaces.has(t));
  const onlyClim = [...climPlaces].filter(t => !mapPlaces.has(t));
  if (onlyMap.length || onlyClim.length) {
    console.error('\nABORT: place sets diverge from shapes.json.');
    if (onlyMap.length) console.error('  map only -> ' + onlyMap.join(', '));
    if (onlyClim.length) console.error('  climate only -> ' + onlyClim.join(', '));
    console.error(`  Both sides now read the same tables (${tableSource}) and the same`);
    console.error('  places.json + shapes-hd.json, so a divergence means one of the shape');
    console.error('  feeds is STALE — rerun its builder first. Nothing was written.');
    process.exit(1);
  }

  const payload = {
    version: VERSION,
    generated: new Date().toISOString(),
    source: 'WorldClim 2.1 (Fick & Hijmans 2017), monthly 1970-2000 climatologies, 10 arc-min: tmin, tmax, vapr. Place polygons: Natural Earth, resolved identically to shapes.json; the 207 places that exist only in shapes-hd.json are measured over shapes-hd.json\'s own polygons.',
    method: 'Per place, per month, percentiles across the place\'s 10-arcmin land pixels. tnLo=p05 of monthly-mean daily minimum (°C), tnMed/txMed=medians, txHi=p95 of monthly-mean daily maximum. RH derived from vapour pressure via FAO-56 es(T): rhHi=p95 of RH at tmin (dawn), rhLo=p05 of RH at tmax (afternoon), rhLo50/rhHi50=medians of the same series (the TYPICAL daily swing — what the card displays; p05 is a triple extreme: driest pixels x driest hour x driest month), %. annTnMin/annTxMax are absolute pixel extremes across the year. Variants: "all"=every land pixel; "ff"=frost-free pixels (coldest-month mean tmin >= 0°C); "warm"=coldest-month mean tmin >= 10°C (50°F); "warmMoist"=warm AND World-Terrestrial-Ecosystems Moist domain (clips hot/dry extremes: Thar-class pixels out). ffShare/warmShare/wmShare=fractions. Client rule: find the species\' warm strongholds (tagged places with warmShare >= 0.5); if any exist and the majority of strongholds have a Moist top zone (of their warm variant), read every place through warmMoist (fall back warm, ff, all where absent); if strongholds exist but are majority-dry, use warm (fall back ff, all); otherwise ff when ffShare >= 0.10, else all. zones=[name,share] top WTE temperature x moisture domains over the variant\'s pixels (via the site\'s own resampled shapefile). method:"centroid" means the polygon covered no 10-arcmin land pixel and the nearest valid pixel to the place centroid was used. prMed=median monthly precipitation (mm) over the pixels of each variant, from WorldClim 2.1 10-arcmin prec; it is the ONLY field that carries a dry season, because derived dew point tracks the daily minimum temperature too closely to separate dry air from cool air. Months are calendar Jan-Dec; these are 30-year monthly MEANS of daily extremes, not record temperatures. 1.9.0: places absent from places.json (the shapes-hd-only 207) are measured over the shapes-hd.json polygon (the audit sidecar marks them layer "shapes-hd"); lat/lon for those is the polygon vertex centroid, longitude averaged circularly. 1.10.0: koppen=[code, share] per variant — the distribution of full Koppen-Geiger classes (Peel et al. 2007: B checked first with the 10x(2xMAT[+14|+28]) mm threshold, C/D boundary 0 degC, hemisphere from the pixel row, Tmean=(tmin+tmax)/2) across the variant\'s own pixels; shares of classified pixels (a pixel with any no-data precipitation month is unclassified). Coarsen client-side; never re-split. 1.12.0: elev={slab:250, bands:{<floor m>: {n, k, tn, tx}}} over the all-variant pixels — n pixels in the 250 m slab, k its Koppen mix (shares >= 0.02), tn/tx the slab\'s coldest-month median tmin and hottest-month median tmax (degC), elevation from WorldClim 2.1 10-arcmin elev on the same grid. Consumers intersect a species\' stated altitude band with these slabs; a single stated altitude widens by one slab each way.',
    places: out
  };
  const json = JSON.stringify(payload);
  fs.writeFileSync(OUT_LOCAL, json, 'utf8');
  fs.writeFileSync(OUT_DRIVE, json, 'utf8');
  fs.writeFileSync(AUDIT_LOCAL, JSON.stringify({
    version: VERSION, tableSource, places: audit
  }, null, 1), 'utf8');
  console.log(`\nplaces: ${Object.keys(out).length}  (polygon ${methods.polygon}, centroid ${methods.centroid})`);
  console.log('size: ' + (json.length / 1024).toFixed(1) + ' KB');
  console.log('wrote climate.json locally and to Drive, climate-audit.json locally.');

  /* spot prints for sanity */
  for (const t of ['Borneo', 'Ecuador', 'Japan', 'China South-Central', 'Barbados', 'Himalaya', 'Brazil North', 'West Himalaya', 'Türkiye', 'Florida', 'Mexico Southwest']) {
    const e = out[t];
    if (!e) continue;
    const v = e.ff || e.all;
    const yLo = Math.min(...v.tnLo), yHi = Math.max(...v.txHi);
    console.log(`  ${t.padEnd(20)} n=${String(e.n).padStart(5)} ff=${(e.ffShare * 100).toFixed(0).padStart(3)}% warm=${(e.warmShare * 100).toFixed(0).padStart(3)}%  ` +
      `year(${e.ff ? 'ff' : 'all'}) ${yLo.toFixed(1)}..${yHi.toFixed(1)} °C  ` +
      `RH ${Math.min(...v.rhLo)}..${Math.max(...v.rhHi)}%  ` +
      `zones ${v.zones.map(z => z[0] + ' ' + Math.round(z[1] * 100) + '%').join(', ')}  ` +
      `koppen ${(v.koppen || []).slice(0, 3).map(k => k[0] + ' ' + Math.round(k[1] * 100) + '%').join(', ')}  [${e.method}]`);
  }
})();
