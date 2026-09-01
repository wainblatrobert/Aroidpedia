import fs from 'node:fs';
const F = 'G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/Header injection 8.31.26 v16.txt';
const t = fs.readFileSync(F, 'utf8');
const a = t.indexOf('  AP.GENERA = {');
const b = t.indexOf('\n  };', a) + '\n  };'.length;
const AP = {};
new Function('AP', t.slice(a, b))(AP);
const G = AP.GENERA;
console.log('rows in v16:', Object.keys(G).length);

const live = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
let bad = 0;
for (const [slug, r] of Object.entries(live)) {
  const n = G[slug];
  if (!n) { console.log('LOST', slug); bad++; continue; }
  const same = n.ascend.sub === r.ascend.sub && n.ascend.tribe === r.ascend.tribe
    && (n.hand||'') === (r.hand||'')
    && ['logo','i16','i32','i180','i192','i512'].every(k => (n[k]||'') === (r[k]||''));
  if (!same) { console.log('DIFFERS', slug); bad++; }
}
console.log('regressions vs the 14 live rows:', bad);
console.log('arum:', JSON.stringify(G.arum));
console.log('slugs failing detect():', Object.keys(G).filter(s => !/^[a-z][a-z-]*$/.test(s)).length);
console.log('rows missing a subfamily:', Object.values(G).filter(r => !r.ascend?.sub).length);

// every <script> block in the file must still parse
const scripts = [...t.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
let se = 0;
scripts.forEach((s, i) => { try { new Function(s); } catch (e) { console.log('SCRIPT', i, 'FAILS:', e.message); se++; } });
console.log(`script blocks: ${scripts.length}, syntax errors: ${se}`);
