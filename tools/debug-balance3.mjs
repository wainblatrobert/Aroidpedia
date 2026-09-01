import { EDITS as V7 } from './edits-balance.mjs';

const html = await (await fetch('https://www.aroidpedia.com/journal/alocasia-baginda')).text();
const NEEDLE = `    card.appendChild(body);

    if (na.length){`;
let i = html.indexOf(NEEDLE);
let count = 0;
while (i >= 0) { count++; console.log('occurrence at', i); i = html.indexOf(NEEDLE, i + 1); }
console.log('total occurrences in served HTML:', count);

/* context of the first occurrence */
const at = html.indexOf(NEEDLE);
console.log('--- context before ---');
console.log(html.slice(at - 300, at).replace(/\n/g, '\\n').slice(-280));
/* which script block is it in? find the nearest preceding <script and check for a marker */
const scriptStart = html.lastIndexOf('<script', at);
const seg = html.slice(scriptStart, scriptStart + 200);
console.log('--- enclosing script open tag ---');
console.log(seg.slice(0, 120).replace(/\n/g, '\\n'));
/* does the enclosing script also contain buildCard's mount code? */
const scriptEnd = html.indexOf('</script>', at);
const script = html.slice(scriptStart, scriptEnd);
console.log('script length:', script.length,
  '| contains data-apsc-mount:', script.includes('data-apsc-mount'),
  '| contains balance needle:', script.includes(NEEDLE));
