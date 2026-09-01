/* Full-site CLIMATE prose analysis: every SPECIES post, all genera.
   Two levels of clustering:
   1. exact (normalized text) — literal paste reuse
   2. skeleton (numbers masked) + greedy word-3-gram Jaccard >= 0.55 —
      the same template filled with different values/places */
const idx = await (await fetch('https://wainblatrobert.github.io/Aroidpedia/search-index.json')).json();
const targets = idx.entries.filter(e => e.c === 'species');
console.log('species posts:', targets.length);

const LABELS = ['ORIGINAL DESCRIPTION','PROTOLOGUE','FIRST DESCRIPTION','SYNONYMS','SYNONYMY',
  'DISTRIBUTION','NATIVE DISTRIBUTION','CLIMATE','ECOLOGY','HABITAT','SOIL',
  'SPECIES DESCRIPTION','DESCRIPTION','PLANT DESCRIPTION','MORPHOLOGY','INFLORESCENCE',
  'FLOWERS','FLOWER','VARIEGATED FORMS','VARIEGATION','ETYMOLOGY','NAME','NOTES','NOTE',
  'REMARKS','BACKGROUND','HISTORY','REFERENCES','REFERENCE','SOURCES','LITERATURE',
  'CULTIVARS','CULTIVAR','HYBRIDS','HYBRID'];

const strip = h => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  .replace(/&#39;|&rsquo;/g, "'").replace(/&quot;|&ldquo;|&rdquo;/g, '"').replace(/\s+/g, ' ').trim();

const texts = [];       // {name, raw, norm, skel}
const noClimate = [];
let fetched = 0, failed = 0;

for (const e of targets) {
  try {
    const j = await (await fetch('https://www.aroidpedia.com' + e.u + '?format=json')).json();
    const body = (j.item && j.item.body) || '';
    if (!body) { failed++; continue; }
    fetched++;
    const text = strip(body);
    const cm = text.indexOf('CLIMATE');
    const name = e.t.replace(/^([A-Z])[A-Z]*\s/, '$1. ');
    if (cm < 0) { noClimate.push(name); continue; }
    let seg = text.slice(cm + 7).replace(/^:?\s*/, '');
    let cut = seg.length;
    for (const L of LABELS) {
      if (L === 'CLIMATE') continue;
      const p = seg.indexOf(L + ':');
      if (p >= 0 && p < cut) cut = p;
    }
    seg = seg.slice(0, cut).trim();
    const norm = seg.toLowerCase().replace(/[^a-z0-9%]+/g, ' ').trim();
    const skel = norm.replace(/\d+([.,]\d+)?/g, '#');
    texts.push({ name, raw: seg, norm, skel });
  } catch (err) { failed++; }
  await new Promise(r => setTimeout(r, 100));
}
console.log('fetched', fetched, 'failed', failed, 'with CLIMATE:', texts.length, 'without:', noClimate.length);

/* exact clusters */
const exact = new Map();
texts.forEach(t => {
  if (!exact.has(t.norm)) exact.set(t.norm, []);
  exact.get(t.norm).push(t.name);
});

/* skeleton clusters via greedy Jaccard on word 3-grams of the skeleton */
const grams = s => {
  const w = s.split(' ');
  const g = new Set();
  for (let i = 0; i + 2 < w.length; i++) g.add(w[i] + ' ' + w[i + 1] + ' ' + w[i + 2]);
  return g;
};
const jac = (a, b) => {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter || 1);
};
const uniq = [...new Set(texts.map(t => t.skel))].map(s => ({ s, g: grams(s) }));
const clusters = [];
for (const u of uniq) {
  let home = null;
  for (const c of clusters) if (jac(u.g, c.rep.g) >= 0.55) { home = c; break; }
  if (home) home.members.push(u); else clusters.push({ rep: u, members: [u] });
}
const byCluster = clusters.map(c => {
  const skels = new Set(c.members.map(m => m.s));
  const posts = texts.filter(t => skels.has(t.skel));
  return { n: posts.length, variants: skels.size, sample: posts[0].raw, posts: posts.map(p => p.name) };
}).sort((a, b) => b.n - a.n);

console.log('\n=== SKELETON FAMILIES:', byCluster.length, '(from', exact.size, 'exact variants) ===');
byCluster.forEach((c, i) => {
  console.log('\n--- family ' + (i + 1) + ': ' + c.n + ' posts, ' + c.variants + ' filled-in variants ---');
  console.log(c.sample.slice(0, 300));
  console.log('posts:', c.posts.slice(0, 40).join(', ') + (c.posts.length > 40 ? ' … +' + (c.posts.length - 40) : ''));
});
console.log('\n=== no CLIMATE label (' + noClimate.length + '):', noClimate.join(', '));
