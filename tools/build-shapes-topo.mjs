/* ==================================================================
   F6 — SHARED-ARC TOPOLOGY BUILD  v1  (8.28.26, grower-approved)

   WHY. Every polygon in shapes-hd is simplified INDEPENDENTLY, so two
   copies of one shared border diverge by up to the tolerance — the
   overlaps/gaps the grower kept seeing, and the reason whole families
   had to be hand-promoted into FINE. A topology stores every shared
   border ONCE as an arc: a shared edge cannot diverge from itself, at
   any tolerance, and interior borders stop being stored twice.

   IN : topo-src.ndjson — every place's clipped, ring-filtered,
        UNSIMPLIFIED outer rings, streamed by build-shapes-hd with
        TOPO_DUMP set (upstream of its per-polygon simplification,
        which is the whole point).
        docs/shapes-hd.json — the metadata carrier: order, area,
        continent, dots, viewBoxes, borders ride over VERBATIM.
   OUT: docs/shapes-topo.json — standard TopoJSON quantized-delta arcs
        plus the carried metadata; consumers hold a ~40-line decoder
        that reconstructs exactly the {shapes:{tag: 'M…Z'}} contract
        they already speak. shapes-hd.json STAYS PUBLISHED as the
        fallback — a consumer that fails to decode falls back and the
        site looks exactly as it did.

   Quantization 1e5 over the world ≈ 0.004° ≈ 400 m — the FINE
   tolerance, now everywhere. Simplification keeps a quantile of the
   presimplify weights, tuned by output size.
   ================================================================== */
import fs from 'fs';
import * as srv from 'topojson-server';
import * as smp from 'topojson-simplify';
import * as cli from 'topojson-client';

const SRC = 'C:/Users/nli0490/Claude/aroidpedia-climate/topo-src.ndjson';
const META = 'C:/Users/nli0490/Claude/Aroidpedia/docs/shapes-hd.json';
const OUT = 'C:/Users/nli0490/Claude/Aroidpedia/docs/shapes-topo.json';


const meta = JSON.parse(fs.readFileSync(META, 'utf8'));

const features = [];
for (const line of fs.readFileSync(SRC, 'utf8').split('\n')) {
  if (!line.trim()) continue;
  const { tag, rings } = JSON.parse(line);
  features.push({
    type: 'Feature', id: tag, properties: {},
    geometry: { type: 'MultiPolygon', coordinates: rings.map(r => [r]) },
  });
}
console.log('places in:', features.length);

/* the DOCUMENTED pipeline: build UNQUANTIZED, weight+simplify in native
   degrees, then quantize+delta-encode at the end - client.quantize is
   what carries the transform the decoder needs. (First cut quantized
   first and re-encoded by hand; presimplify strips the transform and
   the hand re-encode rounded DEGREES to integers - a 1-degree grid.
   Caught by the verify script before any consumer saw it.) */
let topo = srv.topology({ p: { type: 'FeatureCollection', features } });
console.log('arcs:', topo.arcs.length);

topo = smp.presimplify(topo);
/* ⚠ quantile thresholds do not bite here - dense coastline vertices give
   a weight distribution glued to zero, so 32% and 12% produced the same
   file. The threshold is an ABSOLUTE triangle area in deg² (Visvalingam):
   ~(spacing²/2). TOPO_W env overrides for tuning. */
const minWeight = +(process.env.TOPO_W || 1.5e-5);
topo = smp.simplify(topo, minWeight);
console.log('simplified at minWeight', minWeight.toExponential(2));
topo = cli.quantize(topo, 1e5);
const arcs = topo.arcs;

const places = {};
let dissolved = 0;
const arcCacheAbs = new Map();
function arcsAbs(i, rev) {
  let pts = arcCacheAbs.get(i);
  if (!pts) {
    pts = [];
    let x = 0, y = 0;
    for (const [dx, dy] of arcs[i]) { x += dx; y += dy; pts.push([x, y]); }
    arcCacheAbs.set(i, pts);
  }
  return rev ? pts.slice().reverse() : pts;
}
for (const g of topo.objects.p.geometries) {
  /* v2 (8.29.26) — SELF-DISSOLVE. Places assembled as unions of
     constituent polygons (Kalimantan from its provinces, Malaysian
     Borneo from Sarawak+Sabah, the Bangladesh divisions, Brazil North,
     Sudan-South Sudan’s two rings) kept every INTERNAL seam, and any
     stroke on such a shape drew its private admin mesh — the genus
     map’s zones view showed "the borders of subzones in borneo"
     (grower). mergeArcs removes arcs shared WITHIN the place, leaving
     the outer boundary; places without internal sharing pass through
     unchanged, and arc-sharing with NEIGHBOURS is untouched. */
  let use = g;
  try {
    const before = (g.arcs || []).reduce((n, p) => n + p.reduce((m, r) => m + r.length, 0), 0);
    const m = cli.mergeArcs(topo, [g]);
    const after = (m.arcs || []).reduce((n, p) => n + p.reduce((mm, r) => mm + r.length, 0), 0);
    /* v2.1 (8.29.26) - THE CHORD GUARD. mergeArcs on a place whose arc
       sharing is not a clean union (Vietnam-class) can emit rings that
       are topologically closed yet traverse interior arcs - the stroke
       then draws long straight chords across the shape (grower
       screenshot, Divisions view). Decode both versions and compare
       the longest single segment: a merge that introduces a jump the
       original never had is rejected. */
    const maxSeg = geom => {
      let worst = 0;
      for (const poly of (geom.arcs || [])) {
        const ring = poly[0] || [];
        let px = null, py = null;
        for (const ai of ring) {
          const rev = ai < 0;
          const a = arcsAbs(rev ? ~ai : ai, rev);
          for (const [qx, qy] of a) {
            if (px !== null) {
              const dx = (qx - px) * topo.transform.scale[0];
              const dy = (qy - py) * topo.transform.scale[1];
              const d2 = dx * dx + dy * dy;
              if (d2 > worst) worst = d2;
            }
            px = qx; py = qy;
          }
        }
      }
      return Math.sqrt(worst);
    };
    if (after && after < before) {
      const mo = maxSeg(g), mm2 = maxSeg(m);
      if (mm2 <= Math.max(mo * 1.5, 0.5)) { use = m; dissolved++; }
    }
  } catch (e) {}
  /* MultiPolygon arcs: [ [ [ring-arc-idxs] , hole… ] , … ] — outer only */
  const rings = (use.arcs || []).map(poly => poly[0]).filter(Boolean);
  if (rings.length) places[g.id] = rings;
}
console.log('self-dissolved places:', dissolved);

/* v3 (8.30.26) — REGION BORDERS (grower: "add borders in regions, to
   better differentiate the regions visually"). The regions view paints
   stacked member shapes, so no single path carries a region outline —
   but the topology knows exactly which arcs separate two DIFFERENT
   regions: walk every level-3 zone's rings, tag each arc with the
   zone's EFFECTIVE region (the footer's editorial merges applied), and
   an arc carrying 2+ regions is an inter-region land border. Shipped
   as {region: [absolute arc indexes]} riding the same arc table; the
   footer decodes them into stroke-only polylines (never closed — a Z
   would draw a chord). Coastlines are excluded by construction (an
   exterior arc carries one region), and subzones/countries never
   participate (level 3 only). */
const hier = JSON.parse(fs.readFileSync(
  'C:/Users/nli0490/Claude/Aroidpedia/docs/geo-hierarchy.json', 'utf8'));
/* ⚠ MIRROR of RMERGE in the footer's groupsFor() — the displayed region
   vocabulary. If the footer's merges change, rebuild this file. */
const RMERGE = { 'China': 'East Asia', 'Eastern Asia': 'East Asia',
                 'Mongolia': 'East Asia', 'Australia': 'Australasia',
                 'New Zealand': 'Australasia' };
const effR = tag => {
  const h = hier.places && hier.places[tag];
  if (!h || h.level !== 3 || !h.region) return null;
  return RMERGE[h.region] || h.region;
};
const arcRegions = new Map();
const arcZones = new Map();
for (const [tag, rings] of Object.entries(places)) {
  const R = effR(tag);
  if (!R) continue;
  for (const ring of rings) for (const ai of ring) {
    const i = ai < 0 ? ~ai : ai;
    let s = arcRegions.get(i);
    if (!s) arcRegions.set(i, s = new Set());
    s.add(R);
    let zs = arcZones.get(i);
    if (!zs) arcZones.set(i, zs = new Set());
    zs.add(tag);
  }
}
/* v3.1 (8.30.26): each entry is [arcIdx, ...adjacent zone tags] so the
   footer can draw an arc only where a side is actually PAINTED for the
   genus — region-level gating drew the Indian Subcontinent's full
   political rim (grower: "pakistan got a border along with mongolia")
   even where the genus never reaches. */
const rborders = {};
let rbArcs = 0;
for (const [i, s] of arcRegions) {
  if (s.size < 2) continue;
  rbArcs++;
  const entry = [i, ...arcZones.get(i)];
  for (const R of s) (rborders[R] = rborders[R] || []).push(entry);
}

/* v3.2 (8.31.26) — CONTINENT BORDERS, the same trick one level up.
   Continents had no boundary layer at all: the seam stroke there is
   compFill(), the shape's OWN fill colour, which is a crack-filler for
   antialiasing and vanishes whenever two groups land on similar values
   (grower: "it's a color from our heatmap so it will blend"). */
const contOf = tag => {
  const h = hier.places && hier.places[tag];
  return h && h.level === 3 && h.continent ? h.continent : null;
};
const arcConts = new Map();
for (const [tag, rings] of Object.entries(places)) {
  const C = contOf(tag);
  if (!C) continue;
  for (const ring of rings) for (const ai of ring) {
    const i = ai < 0 ? ~ai : ai;
    let s2 = arcConts.get(i);
    if (!s2) arcConts.set(i, s2 = new Set());
    s2.add(C);
  }
}
const cborders = {};
let cbArcs = 0;
for (const [i, s] of arcConts) {
  if (s.size < 2) continue;
  cbArcs++;
  const entry = [i, ...arcZones.get(i)];
  for (const C of s) (cborders[C] = cborders[C] || []).push(entry);
}
console.log('continent-border arcs:', cbArcs, 'across',
  Object.keys(cborders).length, 'continents:', Object.keys(cborders).sort().join(', '));
console.log('region-border arcs:', rbArcs, 'across',
  Object.keys(rborders).length, 'regions:',
  Object.keys(rborders).sort().join(', '));

const out = {
  v: 1,
  generated: new Date().toISOString().slice(0, 10),
  source: 'F6 shared-arc topology over build-shapes-hd\u2019s unsimplified ' +
          'rings (TOPO_DUMP). One arc per shared border: seams cannot ' +
          'diverge. Decode client-side to the same {shapes:{tag:path}} ' +
          'contract as shapes-hd.json, which remains the fallback.',
  transform: topo.transform,
  arcs,
  places,
  rborders,
  cborders,
  /* metadata rides over verbatim — the decoder hands consumers the
     exact object shape they already read */
  order: meta.order, area: meta.area, continent: meta.continent,
  dots: meta.dots, viewBox: meta.viewBox, viewBoxAll: meta.viewBoxAll,
  borders: meta.borders,
};
fs.writeFileSync(OUT, JSON.stringify(out));
const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
console.log('wrote', OUT, kb + ' KB', '(' + Object.keys(places).length, 'places)');
const missing = Object.keys(meta.shapes).filter(t => !places[t]);
console.log('shapes-hd places missing from topo:', missing.length, missing.slice(0, 8));
