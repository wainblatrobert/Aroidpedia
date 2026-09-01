/* PROOF that v45 = live v44 + exactly one changed line. */
import fs from 'fs';
const v45 = fs.readFileSync('G:\\My Drive\\PlantsV2\\Aroidpedia\\WEBSITE\\ARACEAE PHYLOGENETIC TREE\\ARACEAE TREE 8.16.26 v45.txt', 'utf8');
const live = fs.readFileSync('live-tree-script.js', 'utf8');

function scriptOf(s) {
  const i = s.indexOf('<script'), j = s.indexOf('>', i) + 1, k = s.lastIndexOf('</script>');
  return s.slice(j, k);
}
const norm = t => t.replace(/\r\n/g, '\n').split('\n').map(l => l.replace(/\s+$/, ''));
const A = norm(live);            // live v44
const B = norm(scriptOf(v45));   // my v45

console.log('live v44 script lines:', A.length);
console.log('v45      script lines:', B.length);

const setA = new Set(A), setB = new Set(B);
const onlyB = B.filter(l => l.trim() && !setA.has(l));
const onlyA = A.filter(l => l.trim() && !setB.has(l));
console.log('\nlines in v45 but NOT in live v44:', onlyB.length);
onlyB.forEach(l => console.log('  + ' + l.trim()));
console.log('\nlines in live v44 but NOT in v45:', onlyA.length);
onlyA.forEach(l => console.log('  - ' + l.trim()));

const verdict = onlyB.length === 1 && onlyA.length === 1 &&
  onlyB[0].includes('"dates"') && onlyA[0].includes('"uncertainty", "counts"');
console.log('\nVERDICT:', verdict
  ? 'CLEAN - v45 is live v44 with exactly the one intended line changed'
  : 'NOT CLEAN - investigate above');
