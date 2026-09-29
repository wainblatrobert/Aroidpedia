#!/usr/bin/env python3
"""Index a genus's iNaturalist observations and photos as CSV, without taking a copy.

    python scripts/index-inat-photos.py Spathiphyllum            # every accepted species
    python scripts/index-inat-photos.py Spathiphyllum --cap 500  # photos per species (default 500)

Writes, in the column layout of the Cyrtosperma pack (research/cyrtosperma/data/):
  research/<genus>/data/<genus>-inat-observations.csv   one row per observation
  research/<genus>/data/<genus>-inat-photos.csv         one row per photo; `downloaded` = no

`scripts/pull-inat-photos.py <photos.csv> <folder>` fetches the reusable-licence files on a
machine with the Drive, which is where the photos belong; the index is what travels in the repo.

Scope: the species list is data/species-base/<Genus>-names.json (accepted names). For each, the
iNaturalist taxon whose name matches exactly at species rank; WILD observations only
(captive=false: a genus sold as a houseplant would otherwise drown in windowsill plants), research
grade and needs-ID (casual observations are mostly cultivated or unplaced). Newest first, up to
--cap photos per species. One request a second, as iNaturalist asks.
"""
from __future__ import annotations

import argparse
import csv
import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
API = "https://api.inaturalist.org/v1"
UA = {"User-Agent": "Aroidpedia species index (aroidpedia.com)"}
OBS_COLS = ["species", "taxon_id", "observation_id", "observation_url", "quality_grade", "observed_on",
            "place_guess", "obscured", "latitude", "longitude", "observer_login", "observer_name",
            "licence", "photos"]
PHOTO_COLS = ["species", "observation_id", "observation_url", "photo_id", "photo_url_original", "licence",
              "attribution", "observer_login", "observer_name", "observed_on", "place_guess",
              "quality_grade", "obscured", "latitude", "longitude", "width", "height", "downloaded",
              "file", "size_obtained"]


def get(path: str, params: dict) -> dict:
    url = f"{API}/{path}?{urllib.parse.urlencode(params)}"
    for attempt in range(5):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
                data = json.loads(r.read().decode("utf-8"))
            time.sleep(1.0)
            return data
        except Exception as e:  # network hiccup or 429: back off and retry
            if attempt == 4:
                raise
            time.sleep(5 * (attempt + 1))
    return {}


def taxon_id(name: str) -> int | None:
    res = get("taxa", {"q": name, "rank": "species", "per_page": 30}).get("results", [])
    hits = [t for t in res if t.get("name") == name]
    return hits[0]["id"] if hits else None


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("genus")
    ap.add_argument("--cap", type=int, default=500, help="photos per species")
    a = ap.parse_args()
    g = a.genus.lower()
    names = json.loads((ROOT / "data" / "species-base" / f"{a.genus}-names.json").read_text(encoding="utf-8"))
    species = sorted(x["name"] for x in names["accepted"])
    out = ROOT / "research" / g / "data"
    out.mkdir(parents=True, exist_ok=True)
    obs_rows, photo_rows, missing = [], [], []
    for name in species:
        tid = taxon_id(name)
        if not tid:
            missing.append(name)
            print(f"  {name}: no iNaturalist taxon")
            continue
        n_photos, page = 0, 1
        while n_photos < a.cap:
            d = get("observations", {"taxon_id": tid, "captive": "false", "quality_grade": "research,needs_id",
                                     "photos": "true", "per_page": 200, "page": page, "order_by": "created_at"})
            results = d.get("results", [])
            if not results:
                break
            for o in results:
                user = o.get("user") or {}
                loc = (o.get("location") or ",").split(",")
                obscured = bool(o.get("obscured") or o.get("geoprivacy") in ("obscured", "private")
                                or o.get("taxon_geoprivacy") in ("obscured", "private"))
                base = {"species": name, "observation_id": o["id"],
                        "observation_url": f"https://www.inaturalist.org/observations/{o['id']}",
                        "quality_grade": o.get("quality_grade", ""), "observed_on": o.get("observed_on") or "",
                        "place_guess": o.get("place_guess") or "", "obscured": obscured,
                        "latitude": loc[0], "longitude": loc[1] if len(loc) > 1 else "",
                        "observer_login": user.get("login", ""), "observer_name": user.get("name") or ""}
                photos = o.get("photos") or []
                obs_rows.append({**base, "taxon_id": tid, "licence": o.get("license_code") or "",
                                 "photos": len(photos)})
                for p in photos:
                    if n_photos >= a.cap:
                        break
                    url = p.get("url") or ""
                    dims = p.get("original_dimensions") or {}
                    ext = url.rsplit(".", 1)[-1] if "." in url.rsplit("/", 1)[-1] else "jpg"
                    photo_rows.append({**base, "photo_id": p["id"],
                                       "photo_url_original": url.replace("/square.", "/original."),
                                       "licence": p.get("license_code") or "all-rights-reserved",
                                       "attribution": p.get("attribution") or "",
                                       "width": dims.get("width", ""), "height": dims.get("height", ""),
                                       "downloaded": "no",
                                       "file": f"{name.split()[1]}/inat-{o['id']}-{p['id']}-{base['observer_login']}.{ext}",
                                       "size_obtained": ""})
                    n_photos += 1
            if len(results) < 200:
                break
            page += 1
        print(f"  {name}: taxon {tid}, {sum(1 for r in obs_rows if r['species'] == name)} observations, {n_photos} photos")
    for fn, cols, rows in ((f"{g}-inat-observations.csv", OBS_COLS, obs_rows), (f"{g}-inat-photos.csv", PHOTO_COLS, photo_rows)):
        with (out / fn).open("w", newline="", encoding="utf-8") as fh:
            w = csv.DictWriter(fh, fieldnames=cols)
            w.writeheader()
            w.writerows(rows)
    print(f"{len(obs_rows)} observations, {len(photo_rows)} photos -> {out}")
    if missing:
        print("no iNaturalist taxon:", ", ".join(missing))


if __name__ == "__main__":
    main()
