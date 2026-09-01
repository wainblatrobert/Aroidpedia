import fs from 'node:fs';
const D='G:/My Drive/PlantsV2/Aroidpedia/WEBSITE/Squarespace CSS/';
for (const f of ['Header injection 8.13.26 v15.txt','Header injection 8.31.26 v16.txt']) {
  const t = fs.readFileSync(D+f,'utf8');
  const scripts=[...t.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
  const errs=[];
  scripts.forEach((s,i)=>{ try{ new Function(s); }catch(e){ errs.push(i+': '+e.message); } });
  console.log(f, '| blocks:', scripts.length, '| errors:', errs.length, errs.join(' ; '));
}
// what is block 1?
const t = fs.readFileSync(D+'Header injection 8.13.26 v15.txt','utf8');
const s = [...t.matchAll(/<script>([\s\S]*?)<\/script>/g)][1][1];
const i = s.indexOf('that');
console.log('\n--- around the offending text in v15 block 1 ---');
console.log(JSON.stringify(s.slice(Math.max(0,i-260), i+160)));
