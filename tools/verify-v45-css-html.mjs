/* The script matched. Now prove the CSS and the markup did too - a v44 could
   have touched a style rule and the script diff would never have seen it. */
import fs from 'fs';
const v45  = fs.readFileSync('G:\\My Drive\\PlantsV2\\Aroidpedia\\WEBSITE\\ARACEAE PHYLOGENETIC TREE\\ARACEAE TREE 8.16.26 v45.txt', 'utf8');
const page = fs.readFileSync('live-phylogeny-page.html', 'utf8');

const norm = t => t.replace(/\r\n/g, '\n').split('\n').map(l => l.trim()).filter(Boolean);

function styleOf(s) {
  const i = s.indexOf('<style');
  const j = s.indexOf('>', i) + 1;
  const k = s.indexOf('</style>', j);
  return s.slice(j, k);
}
// the live page's tree <style> is the one that mentions .ap-at-
const liveStyles = [...page.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)]
  .map(m => m[1]).filter(t => t.includes('.ap-at-'));
console.log('live <style> blocks mentioning .ap-at-:', liveStyles.length);

const A = norm(liveStyles.join('\n'));
const B = norm(styleOf(v45));
const setA = new Set(A), setB = new Set(B);
console.log('live css lines:', A.length, '| v45 css lines:', B.length);
const onlyB = B.filter(l => !setA.has(l)), onlyA = A.filter(l => !setB.has(l));
console.log('css only in v45 :', onlyB.length); onlyB.slice(0, 15).forEach(l => console.log('  + ' + l.slice(0, 110)));
console.log('css only in live:', onlyA.length); onlyA.slice(0, 15).forEach(l => console.log('  - ' + l.slice(0, 110)));

// markup: compare the set of ap-at- class names and data-act/data-orient values
const ids = s => [...new Set([...s.matchAll(/(?:class|data-act|data-orient|id)="([^"]{1,60})"/g)].map(m => m[1]))].sort();
const mA = ids(page.slice(page.indexOf('ARACEAE TREE'), page.indexOf('</script>', page.indexOf('ARACEAE TREE'))));
const mB = ids(v45.slice(0, v45.indexOf('<script')));
const missing = mB.filter(x => x.includes('ap-at') && !mA.includes(x));
console.log('\nmarkup tokens in v45 absent from live:', missing.length);
missing.slice(0, 20).forEach(x => console.log('  ! ' + x));
