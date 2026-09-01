/* Repairs patch-card-v80.mjs lines 20-32, which a shell heredoc
   mangled: the backslash escapes in the toCRLF regexes were consumed
   before Node ever saw them, so the file contained regex literals with
   real newlines inside. Line-indexed because the broken text contains
   the very characters that make an exact-match edit unreliable. */
import fs from 'fs';
const P = 'C:/Users/nli0490/Claude/aroidpedia-climate/patch-card-v80.mjs';
const lines = fs.readFileSync(P, 'utf8').split(/\r?\n/);

const from = 20, to = 32;                     /* 1-indexed, inclusive */
const before = lines.slice(from - 1, to).join('|');
if (!/THE MASTER IS CRLF/.test(before) || !/toCRLF/.test(before)) {
  console.error('ABORT: lines ' + from + '-' + to + ' are not the broken block');
  process.exit(1);
}

const fixed = [
  '/* \u26a0 THE MASTER IS CRLF. An anchor written with a bare newline',
  '   matches only the LF half of each CRLF pair — the first anchor here',
  '   "succeeded" that way and would have spliced the insert after a',
  '   stray CR, leaving mixed line endings through a 700 KB file. Both',
  '   sides are normalised to CRLF so the file stays consistent.',
  '',
  '   CR and LF are built with fromCharCode rather than written as',
  '   escapes on purpose: this script was generated through a shell',
  '   heredoc, which eats backslashes, and doing exactly that is what',
  '   produced the broken regex this block replaces.',
  '',
  '   The replacement also goes through a function so a literal $ in the',
  '   inserted text is never read as $& or $1. */',
  'const CR = String.fromCharCode(13), LF = String.fromCharCode(10);',
  'const toCRLF = t => t.split(CR + LF).join(LF).split(LF).join(CR + LF);'
];

lines.splice(from - 1, to - from + 1, ...fixed);
fs.writeFileSync(P, lines.join('\n'), 'utf8');
console.log('repaired lines ' + from + '-' + to);
