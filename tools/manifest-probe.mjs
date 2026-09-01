// manifest-probe.mjs — does a live species page fetch its photo manifest?
//
// The generator says bodies carry no images and the card fetches a manifest
// instead. If that is true at runtime, a photo added to 6. OTHER and pushed
// appears on the live post with no Squarespace edit. This watches the network
// on a real page and reports every github.io / manifest request it makes,
// plus what the card actually rendered.

import { chromium } from 'playwright';

const targets = [
  'https://www.aroidpedia.com/journal/amorphophallus-dracontioides',
  'https://www.aroidpedia.com/journal/amorphophallus-aphyllus',
];

const b = await chromium.launch({ channel: 'chrome', headless: true });

for (const url of targets) {
  const p = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  const net = [];
  p.on('request', r => {
    const u = r.url();
    if (/github\.io|manifest\.json/i.test(u)) net.push(u);
  });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await p.waitForTimeout(9000);

  const imgs = await p.evaluate(() => {
    const all = [...document.images].map(i => i.currentSrc || i.src);
    return {
      total: all.length,
      github: all.filter(u => /github\.io/i.test(u)).length,
      squarespace: all.filter(u => /squarespace-cdn/i.test(u)).length,
      sampleGithub: all.filter(u => /github\.io/i.test(u)).slice(0, 3),
    };
  });

  console.log('=== ' + url.split('/').pop());
  console.log('  manifest/github requests: ' + net.length);
  net.slice(0, 6).forEach(u => console.log('     ' + u));
  console.log('  <img> on page: ' + imgs.total +
              '   github.io: ' + imgs.github +
              '   squarespace-cdn: ' + imgs.squarespace);
  imgs.sampleGithub.forEach(u => console.log('     img ' + u));
  await p.close();
}

await b.close();
