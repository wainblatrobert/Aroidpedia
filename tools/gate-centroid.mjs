/* Size-aware centroid gate.

   A flat distance threshold is the wrong instrument: China's pixel
   centre sits 507 km from its label point and that is simply what a
   4000-km country looks like, while a 3-pixel province 200 km off its
   own centroid is a matching error. So the gate scales: a place is
   suspect when the offset exceeds its OWN extent.

   radius = RMS great-circle distance of the pixels from their centre.
   Flag when offset > max(120 km, 1.0 x radius). For a single pixel the
   radius is 0 and the floor does the work.  */
import fs from 'fs';
const A = JSON.parse(fs.readFileSync('./climate-audit.json', 'utf8')).places;
const OLD = new Set(Object.keys(JSON.parse(fs.readFileSync('./climate.json.1.4.0', 'utf8')).places));

const W = 2160, STEP = 1 / 6, R = 6371, d2r = d => d * Math.PI / 180;
const dist = (la1, lo1, la2, lo2) => {
  const h = Math.sin(d2r(la2 - la1) / 2) ** 2 +
            Math.cos(d2r(la1)) * Math.cos(d2r(la2)) * Math.sin(d2r(lo2 - lo1) / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
};

/* the audit stores no pixel list, so recover extent from climate.json's
   n plus a re-walk is impossible — instead use the declared bbox proxy:
   radius is estimated from the pixel COUNT and the place's latitude.
   A compact place of n pixels covers n * (18.5 km)^2 * cos(lat); its
   equivalent-disc radius is sqrt(area/pi). For an elongated or
   multi-lobed place this UNDERSTATES the radius, which makes the gate
   conservative — it over-flags rather than under-flags. */
const rows = [];
for (const [tag, a] of Object.entries(A)) {
  if (a.declLat == null) continue;
  const km = dist(a.lat, a.lon, a.declLat, a.declLon);
  const cell = 18.52 * Math.sqrt(Math.max(0.05, Math.cos(d2r(a.lat))));  /* km per 10' cell side */
  const radius = Math.sqrt(a.n * cell * cell / Math.PI);
  rows.push({ tag, km, radius, ratio: km / Math.max(1, radius), a, isNew: !OLD.has(tag) });
}
rows.sort((x, y) => y.ratio - x.ratio);

const flagged = rows.filter(r => r.km > Math.max(120, r.radius));
console.log(`gated ${rows.length} places (${rows.filter(r => r.isNew).length} new)`);
console.log(`flagged (offset > max(120 km, own radius)): ${flagged.length}\n`);
console.log('  offset  radius  ratio  n      place                    admin              new  resolved');
flagged.forEach(r => console.log(
  `  ${String(Math.round(r.km)).padStart(5)}  ${String(Math.round(r.radius)).padStart(6)}  ` +
  `${r.ratio.toFixed(1).padStart(5)}  ${String(r.a.n).padStart(5)}  ${r.tag.padEnd(24)}` +
  `${String(r.a.admin || '—').padEnd(18)} ${(r.isNew ? 'NEW' : '   ').padEnd(4)} ` +
  /* 8.17.26: `resolved` is an array of OBJECTS and this printed
     "[object Object]" for every flag — the one column that says WHY a
     place is where it is was unreadable. */
  (r.a.resolved.map(p => `${p.name}@${p.layer} n=${p.n}` +
    (p.lat == null ? '' : ` @${p.lat},${p.lon}`)).join(' + ') || 'centroid fallback')));
