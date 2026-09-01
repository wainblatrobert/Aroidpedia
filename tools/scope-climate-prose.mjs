/* Scope: CLIMATE prose on Alocasia SPECIES posts, epithets A–H.
   Pulls each post's ?format=json body, extracts the CLIMATE-labelled
   text, clusters repeats. Also inventories DISTRIBUTION-section images
   (for the v15 filter review). */
const idx = await (await fetch('https://wainblatrobert.github.io/Aroidpedia/search-index.json')).json();
const targets = idx.entries.filter(e => {
  if (e.g !== 'Alocasia' || e.c !== 'species') return false;
  const ep = (e.t.split(/\s+/)[1] || '').toUpperCase();
  return ep && ep[0] >= 'A' && ep[0] <= 'H';
});
console.log('Alocasia species A–H:', targets.length);

const LABELS = ['ORIGINAL DESCRIPTION','PROTOLOGUE','FIRST DESCRIPTION','SYNONYMS','SYNONYMY',
  'DISTRIBUTION','NATIVE DISTRIBUTION','RANGE','NATIVE RANGE','CLIMATE','ECOLOGY','HABITAT',
  'SPECIES DESCRIPTION','DESCRIPTION','PLANT DESCRIPTION','MORPHOLOGY','INFLORESCENCE',
  'FLOWERS','FLOWER','VARIEGATED FORMS','VARIEGATION','ETYMOLOGY','NAME','NOTES','NOTE',
  'REMARKS','BACKGROUND','HISTORY','REFERENCES','REFERENCE','SOURCES','LITERATURE',
  'CULTIVARS','CULTIVAR','HYBRIDS','HYBRID'];

const strip = h => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  .replace(/&#39;|&rsquo;/g, "'").replace(/&quot;|&ldquo;|&rdquo;/g, '"').replace(/\s+/g, ' ').trim();

const clusters = new Map();   // normalized text -> [titles]
const noClimate = [];
const distImgs = [];
let fetched = 0, failed = 0;

for (const e of targets) {
  const slug = e.u.replace('/journal/', '');
  try {
    const j = await (await fetch('https://www.aroidpedia.com' + e.u + '?format=json')).json();
    const body = (j.item && j.item.body) || '';
    if (!body) { failed++; continue; }
    fetched++;
    const text = strip(body);
    const cm = text.indexOf('CLIMATE');
    if (cm < 0) { noClimate.push(e.t); }
    else {
      let seg = text.slice(cm + 'CLIMATE'.length).replace(/^:?\s*/, '');
      let cut = seg.length;
      for (const L of LABELS) {
        if (L === 'CLIMATE') continue;
        const p = seg.indexOf(L + ':');
        if (p >= 0 && p < cut) cut = p;
        const p2 = seg.search(new RegExp('\\b' + L + '\\b(?=[A-Z\\s]*:?)'));
      }
      seg = seg.slice(0, cut).trim();
      const norm = seg.toLowerCase().replace(/[^a-z0-9%]+/g, ' ').trim();
      if (!clusters.has(norm)) clusters.set(norm, { sample: seg, posts: [] });
      clusters.get(norm).posts.push(e.t.replace('ALOCASIA ', 'A. '));
    }
    /* DISTRIBUTION image inventory: images between DISTRIBUTION and the next label */
    const dm = body.indexOf('DISTRIBUTION');
    if (dm >= 0) {
      let end = body.length;
      for (const L of ['CLIMATE', 'ECOLOGY', 'SPECIES DESCRIPTION', 'DESCRIPTION']) {
        const p = body.indexOf(L, dm + 12);
        if (p >= 0 && p < end) end = p;
      }
      const seg = body.slice(dm, end);
      const re = /data-src="([^"]+)"/g; let m;
      while ((m = re.exec(seg)) !== null) distImgs.push(e.t.replace('ALOCASIA ', 'A. ') + ' :: ' + decodeURIComponent(m[1].split('/').pop()));
    }
    await new Promise(r => setTimeout(r, 120));
  } catch (err) { failed++; }
}

console.log('fetched', fetched, 'failed', failed, '\n');
const sorted = [...clusters.values()].sort((a, b) => b.posts.length - a.posts.length);
console.log('=== CLIMATE prose variants:', sorted.length);
sorted.forEach((c, i) => {
  console.log('\n--- variant ' + (i + 1) + '  (' + c.posts.length + ' posts) ---');
  console.log(c.sample.slice(0, 420));
  console.log('posts:', c.posts.join(', '));
});
console.log('\n=== posts with NO CLIMATE label (' + noClimate.length + '):', noClimate.join(', '));
console.log('\n=== DISTRIBUTION-section images (' + distImgs.length + '):');
distImgs.forEach(x => console.log('  ', x));
