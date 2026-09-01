/* How far is the LIVE v44 from the local v43? */
import fs from 'fs';

const local = fs.readFileSync('G:\\My Drive\\PlantsV2\\Aroidpedia\\WEBSITE\\ARACEAE PHYLOGENETIC TREE\\Backup\\ARACEAE TREE 8.14.26 v43.txt', 'utf8');
const liveScript = fs.readFileSync('live-tree-script.js', 'utf8');

function scriptOf(s) {
  const i = s.indexOf('<script');
  const j = s.indexOf('>', i) + 1;
  const k = s.lastIndexOf('</script>');
  return s.slice(j, k);
}
const localScript = scriptOf(local);

const norm = t => t.replace(/\r\n/g, '\n').split('\n').map(l => l.replace(/\s+$/, ''));
const A = norm(localScript), B = norm(liveScript);
console.log('local v43 script lines:', A.length, 'chars', localScript.length);
console.log('live  v44 script lines:', B.length, 'chars', liveScript.length);

// crude line-level diff
const setA = new Map(); A.forEach((l, i) => { if (!setA.has(l)) setA.set(l, []); setA.get(l).push(i); });
const onlyB = B.filter(l => l.trim() && !setA.has(l));
const setB = new Set(B);
const onlyA = A.filter(l => l.trim() && !setB.has(l));
console.log('\nlines only in LIVE v44:', onlyB.length);
onlyB.slice(0, 60).forEach(l => console.log('  + ' + l.trim().slice(0, 120)));
console.log('\nlines only in LOCAL v43:', onlyA.length);
onlyA.slice(0, 40).forEach(l => console.log('  - ' + l.trim().slice(0, 120)));
