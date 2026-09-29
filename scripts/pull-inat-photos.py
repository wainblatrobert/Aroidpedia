# -*- coding: utf-8 -*-
"""
AROIDPEDIA - PULL iNATURALIST PHOTOS   (v1, 2026-09-06)
Path in repo: scripts/pull-inat-photos.py

    python scripts/pull-inat-photos.py research/cyrtosperma/data/cyrtosperma-inat-photos.csv  G:\\...\\Cyrtosperma-inat

Re-downloads, from iNaturalist's open-data bucket, every photo listed in a
photo index CSV whose licence allows reuse, into <out>/<epithet>/<file>.
The CSV is the one the Cyrtosperma build produced (one row per photo:
species, observation_url, photo_url_original, licence, attribution,
observer_login, ...). Photos marked "all rights reserved" are never fetched -
the CSV keeps their URLs and observers so permission can be asked.

WHY THIS EXISTS: the chat can carry 30 MB per file, and a genus's licensed
photos run to hundreds of MB. The index travels in the repo; the bytes are
one command away on the Drive machine. Existing files are skipped, so the
command is safe to re-run.

Filenames are <species-slug>/inat-<observation id>-<photo id>-<observer>.jpg,
so the photographer's login rides in the name the way the house names its
photo files, and the observation id links back to the licence and metadata.
"""
import csv, os, sys, time, urllib.request

OK = {"cc0", "cc-by", "cc-by-sa", "cc-by-nc", "cc-by-nc-sa"}


def main():
    if len(sys.argv) < 3:
        sys.exit("usage: pull-inat-photos.py <photos.csv> <output folder>")
    src, out = sys.argv[1], sys.argv[2]
    rows = list(csv.DictReader(open(src, encoding="utf-8")))
    todo = [r for r in rows if r["licence"] in OK]
    print("%d photos in index, %d with a reusable licence" % (len(rows), len(todo)))
    got = skipped = failed = 0
    for r in todo:
        path = os.path.join(out, *r["file"].replace("\\", "/").split("/"))
        if os.path.exists(path) and os.path.getsize(path) > 0:
            skipped += 1
            continue
        os.makedirs(os.path.dirname(path), exist_ok=True)
        req = urllib.request.Request(r["photo_url_original"],
                                     headers={"User-Agent": "Aroidpedia photo pull"})
        for attempt in range(3):
            try:
                with urllib.request.urlopen(req, timeout=120) as resp, open(path, "wb") as fh:
                    fh.write(resp.read())
                got += 1
                break
            except Exception as e:
                if attempt == 2:
                    failed += 1
                    print("  FAILED", r["file"], str(e)[:60])
                time.sleep(2 * (attempt + 1))
        time.sleep(0.4)
    print("downloaded %d, already present %d, failed %d -> %s" % (got, skipped, failed, out))


if __name__ == "__main__":
    main()
