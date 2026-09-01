/* Card v119 (FILE v140) — THE FEED'S READER-SPELLING ALIASES, ACTIVATED.
   Master: Footer injection 8.20.26 v11.txt -> v12.txt

   geo-hierarchy.json has published a `aliases` map since 1.4.0 and the
   card has never read it. Verified before writing this: the string
   "aliases" appears in the shipped bundle only inside comments, and
   the feed is now carrying 111 entries that do nothing.

   Raised by the import lane, which reported "Gulf of Guinea Is." as
   the only GEOGRAPHY token in a 244-row sheet with no shape. It has a
   shape - keyed "Gulf of Guinea Islands". So do "Cook Is." and
   "Society Is.". The shapes were never missing; the card simply could
   not bridge the spelling, because it matches shape NAMES and its
   only fallback is a trailing administrative noun (STATE, REGION,
   PROVINCE...) which does not cover "Is." vs "Islands".

   ⚠ AND THIS WILL RECUR. The namespace already mixes both
   conventions: 10 shape keys end "Islands", 20 end "Is.". Every
   future WGSRPD-spelled island token is a coin flip. One alias step
   settles the whole class instead of chasing tokens one at a time.

   The card already consults a hand-kept ALIAS table (11 entries,
   "CAPRIVI STRIP", "BURMA", "ZAIRE"...) BEFORE it folds and matches,
   so the feed's aliases merge into exactly that table and every step
   downstream is untouched.

   ⚠ REGISTERED UNDER TWO KEYS. The lookup key is a plain
   `k.toUpperCase()` with NO diacritic folding - folding happens later,
   after the alias step. So an alias like "Kratié" would only answer to
   an accented tag. Each alias is therefore registered both plain-upper
   and diacritic-folded, so "KRATIE" hits it too.

   ⚠ THE HAND TABLE WINS. A feed alias never overwrites an existing
   entry: the 11 hand-kept ones encode decisions ("ZAIRE" -> DR Congo)
   that a generated table should not be able to silently flip.        */
import fs from 'fs';

const DIR = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/';
const SRC = DIR + 'Footer injection 8.20.26 v11.txt';
const OUT = DIR + 'Footer injection 8.20.26 v12.txt';
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

cut('alias-flag',
`    "SRI LANKA":"Sri Lanka"
  };`,
`    "SRI LANKA":"Sri Lanka"
  };
  /* v119: set once the feed's aliases have been folded in - see
     mergeFeedAliases below. A flag rather than a property ON the table,
     because every key of that table is a candidate tag. */
  var ALIAS_FEED_MERGED = false;
  /* ⚠ THE FEED CANNOT OVERWRITE THE HAND TABLE. The eleven entries
     above encode decisions ("ZAIRE" -> DR Congo, "CELEBES" ->
     Sulawesi); a generated map must not be able to flip one silently. */
  function mergeFeedAliases(hier){
    if (ALIAS_FEED_MERGED || !hier || !hier.aliases) return;
    ALIAS_FEED_MERGED = true;
    var foldKey = function(x){
      return String(x || "")
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\u0110/g, "D").replace(/\u0111/g, "d")
        .toUpperCase();
    };
    Object.keys(hier.aliases).forEach(function(spelling){
      var canon = hier.aliases[spelling];
      var plain = String(spelling).toUpperCase();
      /* ⚠ BOTH KEYS. The alias step runs BEFORE the diacritic fold, so
         an accented alias would otherwise only answer to an accented
         tag. */
      if (!ALIAS[plain]) ALIAS[plain] = canon;
      var folded = foldKey(spelling);
      if (folded !== plain && !ALIAS[folded]) ALIAS[folded] = canon;
    });
  }`);

cut('alias-merge-call',
`    var known = data ? data.shapes : {};
    var dots  = (data && data.dots) || {};
    var hits = [], continents = [], unmapped = [];`,
`    var known = data ? data.shapes : {};
    var dots  = (data && data.dots) || {};
    /* v119: the feed publishes reader spellings; fold them into ALIAS
       before any tag is resolved. Idempotent - only the first call
       does work. */
    mergeFeedAliases(data && data.hier);
    var hits = [], continents = [], unmapped = [];`);

cut('stamp', '"card-v118-file-v139"', '"card-v119-file-v140"');
cut('banner', 'FILE VERSION: v139', 'FILE VERSION: v140');

fs.writeFileSync(OUT, s, 'utf8');
console.log('edits: ' + edits.join(', '));
console.log('wrote ' + OUT.split('/').pop());
