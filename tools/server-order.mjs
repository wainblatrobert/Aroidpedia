const html = await (await fetch('https://www.aroidpedia.com/journal/alocasia-acuminata')).text();
const gi = html.indexOf('sqs-block-gallery');
const seg = html.slice(gi, gi + 400000);
const re = /data-src="([^"]+)"/g;
const out = [];
let m;
while ((m = re.exec(seg)) !== null) {
  out.push(decodeURIComponent(m[1].split('/').pop()));
  if (out.length > 30) break;
}
console.log('server-HTML gallery order (' + out.length + '):');
out.forEach((x, i) => console.log(String(i + 1).padStart(3), x));
const geoIdx = html.indexOf('acuminata+geo');
console.log('geo image present in HTML:', geoIdx >= 0, ' before gallery?', geoIdx >= 0 && geoIdx < gi);
