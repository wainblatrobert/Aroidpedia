/* A shapes-hd DOT with no places.json row aborted the whole build.

   Found while rebuilding for the Koppen fix: the map lane added a
   "Gilbert Is." dot to shapes-hd.json on 8.19.26 and places.json (764
   rows, edited the same evening) has no row for it. The guard then
   refused, which meant climate.json could not be rebuilt BY ANYONE.

   The guard's instinct was right and its verdict too strong. A dot is
   a point: it has no polygon, so there is nothing to measure climate
   over, and climate.json has never carried one — the live 1.12.0 feed
   already has no "Gilbert Is." entry. Alabat and Himalaya are dots too
   and they survive only because they ALSO have places.json rows, which
   is what actually gives them geometry.

   So the honest behaviour is to SKIP such a dot loudly and carry on,
   which produces exactly the file that ships today. It invents no
   geometry, which is the thing the guard existed to prevent.

   ⚠ THIS DOES NOT MAKE THE UNDERLYING INCONSISTENCY GO AWAY. A dot
   the map draws and the climate feed cannot describe is still worth
   the map lane's attention; it is now a warning instead of a wall. */
import fs from 'fs';
const P = './build-climate-v9-work.mjs';
let s = fs.readFileSync(P, 'utf8');
const CR = String.fromCharCode(13), LF = String.fromCharCode(10);
const toCRLF = t => t.split(CR + LF).join(LF).split(LF).join(CR + LF);
function cut(name, find, repl) {
  const f = toCRLF(find), r = toCRLF(repl);
  const n = s.split(f).length - 1;
  if (n !== 1) { console.error('ABORT: "' + name + '" matched ' + n); process.exit(1); }
  s = s.replace(f, () => r);
  console.log('  ok: ' + name);
}

cut('dot-without-row-is-a-warning',
`    if (hdDotOnly.length) {
      /* a dot has no polygon to measure; nothing here handles that case,
         so refuse loudly rather than invent one */
      console.error('ABORT: shapes-hd has DOTS with no places.json row: ' +
                    hdDotOnly.join(', '));
      process.exit(1);
    }`,
`    if (hdDotOnly.length) {
      /* 1.13.0: WARN, DO NOT ABORT. A dot is a point — there is no
         polygon to measure and climate.json has never carried one, so
         skipping is exactly what the shipped feed already reflects.
         Aborting instead blocked EVERY rebuild the moment the map lane
         added a dot ahead of its places.json row (Gilbert Is., 8.19.26).
         Nothing is invented here; the place is simply absent, as it is
         in the live file today. */
      console.warn('WARNING: shapes-hd DOTS with no places.json row, ' +
                   'skipped (no polygon = no climate): ' + hdDotOnly.join(', '));
    }`);

fs.writeFileSync(P, s, 'utf8');
console.log('written');
