/* The hover readout truncated to an ellipsis at the 301 px desktop
   panel — the same narrow-case that caught the callout. Shortened so it
   fits, and sized in cqw against the panel like the callout is.
   ⚠ CRLF-aware. */
import fs from 'fs';
const P = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/Footer injection 8.17.26 v18.txt';
const CR = String.fromCharCode(13), LF = String.fromCharCode(10);
const toCRLF = t => t.split(CR + LF).join(LF).split(LF).join(CR + LF);
let s = fs.readFileSync(P, 'utf8');
function cut(name, find, repl) {
  const f = toCRLF(find), r = toCRLF(repl);
  const n = s.split(f).length - 1;
  if (n !== 1) { console.error(`ABORT: "${name}" matched ${n}`); process.exit(1); }
  s = s.replace(f, () => r);
  console.log('  ok: ' + name);
}

/* the escapes are written as real characters here — the master already
   holds \u00b7 style escapes from the patch that created it, and mixing
   the two forms in one string is how they end up printed literally */
cut('says',
  `  function restSays(st){
    if (st === "lean") return "lean season \\u2014 outdoors, the likeliest months to be dormant";
    if (st === "grow") return "growing season \\u2014 the likeliest months to be in leaf";
    if (st === "between") return "between the two \\u2014 neither clearly";
    return "no seasonal cue \\u2014 wet and warm all year where it grows wild";
  }`,
  `  /* SHORT ENOUGH FOR THE 301px PANEL. The long form truncated to an
     ellipsis on desktop — the same narrow case that caught the callout,
     and for the same reason: the card is two-column at 1280 while a
     phone gets more room. Measured, not guessed. */
  function restSays(st){
    if (st === "lean") return "lean season \\u2014 likely dormant outdoors";
    if (st === "grow") return "growing season \\u2014 likely in leaf";
    if (st === "between") return "between seasons";
    return "no seasonal cue \\u2014 wet all year";
  }`);

cut('hint-size',
  `.apsc .apclim-rest__hint{
  font-size:11.5px;color:rgba(243,241,234,.55);margin:3px 0 0;min-height:1.5em;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}`,
  `.apsc .apclim-rest__hint{
  color:rgba(243,241,234,.55);margin:3px 0 0;min-height:1.5em;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  font-size:clamp(8px, 2.6cqw, 11.5px);
}
@supports not (font-size: 1cqw){ .apsc .apclim-rest__hint{font-size:9px;} }`);

fs.writeFileSync(P, s, 'utf8');
console.log('written');
