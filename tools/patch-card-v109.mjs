/* Card v109 (FILE v127) — Ghana joins the SUBUNIT system.
   Master: Footer injection 8.19.26 v33.txt -> v34.txt

   Ten WGSRPD level-4 regions, all parenting straight to Ghana (a
   single level-3 unit). Continent Africa. Built by
   "ghana-l4-spec 8.20.26 v1.mjs".

   ⚠⚠ FOUR KEYS CARRY -GH. "Central", "Eastern", "Northern" and
   "Western" name 7-9 admin_1 units worldwide - the single most
   contested set of names in a namespace this file already warns
   about. A bare "Central" tag still matches NOTHING, which is what
   the v61 strip comment already demands ("letting a key shed its
   qualifier would let a post tagged Central light a PNG province").
   The other six are unique worldwide and stay bare, so the one-way
   strip still finds "Volta" from "Volta Region".

   ⚠⚠ SEVEN OF GHANA'S SIXTEEN MODERN REGIONS ARE NOT HERE. Natural
   Earth carries the pre-2018 ten; the 2018 reorganisation (Bono,
   Bono East, Ahafo, Savannah, North East, Oti, Western North) has no
   polygon in this vintage. They are NOT aliased to their
   predecessors - that would light up to three times the ground a
   record covers. Same ruling as Tbong Khmum.                       */
import fs from 'fs';

const DIR = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/';
const SRC = DIR + 'Footer injection 8.19.26 v33.txt';
const OUT = DIR + 'Footer injection 8.19.26 v34.txt';
let s = fs.readFileSync(SRC, 'utf8');
const CR = String.fromCharCode(13), LF = String.fromCharCode(10);
const toCRLF = t => t.split(CR + LF).join(LF).split(LF).join(CR + LF);
const edits = [];
function cut(name, find, repl) {
  const f = toCRLF(find), r = toCRLF(repl);
  const n = s.split(f).length - 1;
  if (n !== 1) { console.error('ABORT: "' + name + '" matched ' + n + ', expected 1'); process.exit(1); }
  s = s.replace(f, () => r);
  edits.push(name);
}

/* inserted before the Nigeria/Benin block so West Africa reads together */
cut('ghana-subparent',
`     /* NIGERIA + BENIN, 8.16.26. Each is a single level-3 unit.`,
`     /* GHANA, 8.20.26. A single level-3 unit, so all ten regions
        parent straight to it.
        ⚠ FOUR KEYS CARRY -GH: "Central", "Eastern", "Northern" and
        "Western" each name 7-9 admin_1 units worldwide. A bare
        "Central" tag matches nothing on purpose. The other six are
        unique worldwide and stay bare.
        ⚠ NE carries the PRE-2018 ten regions. Bono, Bono East,
        Ahafo, Savannah, North East, Oti and Western North (2018) have
        no polygon and are deliberately NOT aliased to their
        predecessors - that would light up to 3x the real ground. */
     ["Ghana", [
       "Ashanti","Brong-Ahafo","Central-GH",
       "Eastern-GH","Greater Accra","Northern-GH",
       "Upper East","Upper West","Volta",
       "Western-GH"
     ]],
     /* NIGERIA + BENIN, 8.16.26. Each is a single level-3 unit.`);

cut('stamp', '"card-v108-file-v126"', '"card-v109-file-v127"');
cut('banner', 'FILE VERSION: v126', 'FILE VERSION: v127');

fs.writeFileSync(OUT, s, 'utf8');
console.log('edits: ' + edits.join(', '));
console.log('wrote ' + OUT.split('/').pop());
