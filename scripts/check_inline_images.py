#!/usr/bin/env python3
"""
check_inline_images.py - the gate before docs/journal can ever be deleted.

The species card only synthesizes photos from the manifest when the post body
carries NO inline <img> (card v33: "a body that still has them is from the
img-emitting generator and remains the single source until it is re-imported").

So a legacy post with baked-in <img> tags does NOT follow PHOTO_BASE. It keeps
pointing at whatever URL is in its body - which survives the cutover, because
docs/journal is still there, but breaks the day those files are deleted.

This walks every published species page and reports any that still carry one.
Read-only; hits the Squarespace site, not Pages.
"""
from __future__ import annotations

import concurrent.futures as cf
import re
import sys
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
STAGING = REPO / "staging" / "journal"
UA = "aroidpedia-sync/1.0"

# <img> whose src points at the photo archive, in either host's shape.
INLINE = re.compile(
    rb"""<img[^>]+src=["'][^"']*(?:github\.io/Aroidpedia/journal|img\.aroidpedia\.com/journal)""",
    re.I)


def slugs() -> list[str]:
    if not STAGING.exists():
        sys.exit(f"No staged species at {STAGING}; run derive_media.py first.")
    return sorted(f"{m.parent.parent.name}-{m.parent.name}"
                  for m in STAGING.glob("*/*/manifest.json"))


def check(slug: str) -> tuple[str, int, int]:
    url = f"https://www.aroidpedia.com/journal/{slug}"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            body = r.read()
            return slug, r.status, len(INLINE.findall(body))
    except Exception as e:
        code = getattr(e, "code", 0)
        return slug, code or -1, -1


def main() -> None:
    todo = slugs()
    print(f"checking {len(todo)} published species pages ...\n")
    hits, errors, ok = [], [], 0
    with cf.ThreadPoolExecutor(max_workers=6) as ex:
        for i, (slug, status, n) in enumerate(ex.map(check, todo), 1):
            if n > 0:
                hits.append((slug, n))
                print(f"  INLINE  {slug}  ({n} baked-in <img>)")
            elif n < 0 or status != 200:
                errors.append((slug, status))
                print(f"  ERROR   {slug}  HTTP {status}")
            else:
                ok += 1
            if i % 40 == 0:
                print(f"  ... {i}/{len(todo)}")

    print("\n" + "-" * 58)
    print(f"clean (manifest-driven)   {ok}")
    print(f"carry inline <img>        {len(hits)}")
    print(f"unreachable               {len(errors)}")
    if hits:
        print("\nThese must be re-imported before docs/journal is deleted:")
        for slug, n in hits:
            print(f"  {slug}  ({n})")
    else:
        print("\nNo post depends on docs/journal. Deletion is safe whenever you like.")


if __name__ == "__main__":
    main()
