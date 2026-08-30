#!/usr/bin/env python3
"""
publish_media.py - ship what derive_media.py staged.

The staged tree splits in two, by change-frequency:

    staging/journal/<genus>/<sp>/<role>/<hash>-<slug>.jpg  ->  Cloudflare R2
    staging/journal/<genus>/<sp>/manifest.json             ->  docs/ (Pages)

Manifests are small and change on every sync, so they stay on Pages where
the card already fetches them CORS-clean. Images are large and, because the
key carries the hash of their own bytes, immutable - so they go to R2 with a
one-year cache header and nothing ever needs purging.

DRY RUN BY DEFAULT. Nothing is written anywhere without --push, matching the
house convention in sync-journal-photos.py and write_sheet.py.

    python scripts/publish_media.py                       # what would happen
    python scripts/publish_media.py --species margaritifer --push
    python scripts/publish_media.py --push                # the whole staging tree
    python scripts/publish_media.py --prune               # list R2 orphans
    python scripts/publish_media.py --prune --push        # and delete them
"""
from __future__ import annotations

import argparse
import json
import mimetypes
import sys
from pathlib import Path

# The Zscaler proxy's root CA lives in the Windows store, not certifi, and
# botocore validates against certifi. Must precede any TLS connection.
try:
    import truststore
    truststore.inject_into_ssl()
except ImportError:
    sys.exit("pip install truststore  (needed for TLS behind the proxy)")

REPO = Path(__file__).resolve().parent.parent
STAGING = REPO / "staging"
DOCS = REPO / "docs"

# Content-hashed keys can never change meaning, so cache them hard.
IMMUTABLE = "public, max-age=31536000, immutable"

CTYPE = {
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
    ".webp": "image/webp", ".gif": "image/gif",
    ".mp4": "video/mp4", ".webm": "video/webm", ".m4v": "video/x-m4v",
}


def load_env() -> dict:
    env = REPO / ".env"
    if not env.exists():
        sys.exit(f"No .env at {env}")
    cfg = {}
    for line in env.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, _, v = line.partition("=")
            cfg[k.strip()] = v.strip()
    missing = [k for k in ("R2_ACCOUNT_ID", "R2_BUCKET",
                           "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY")
               if not cfg.get(k)]
    if missing:
        sys.exit("Missing in .env: " + ", ".join(missing))
    return cfg


def client(cfg: dict):
    import boto3
    return boto3.client(
        "s3",
        endpoint_url=f"https://{cfg['R2_ACCOUNT_ID']}.r2.cloudflarestorage.com",
        aws_access_key_id=cfg["R2_ACCESS_KEY_ID"],
        aws_secret_access_key=cfg["R2_SECRET_ACCESS_KEY"],
        region_name="auto",
    )


def existing_keys(s3, bucket: str) -> set[str]:
    """One listing beats a HEAD per file: 1 class-A op per 1000 keys."""
    keys, token = set(), None
    while True:
        kw = {"Bucket": bucket, "MaxKeys": 1000}
        if token:
            kw["ContinuationToken"] = token
        r = s3.list_objects_v2(**kw)
        for o in r.get("Contents", []):
            keys.add(o["Key"])
        if not r.get("IsTruncated"):
            return keys
        token = r["NextContinuationToken"]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--push", action="store_true", help="actually write (default: dry run)")
    ap.add_argument("--species", help="limit to one species slug, e.g. margaritifer")
    ap.add_argument("--genus", help="limit to one genus slug, e.g. amorphophallus")
    ap.add_argument("--prune", action="store_true",
                    help="also report (or with --push, DELETE) R2 keys no manifest references")
    ap.add_argument("--manifests", action="store_true",
                    help="ALSO write the new manifests into docs/. Off by default: a new "
                         "manifest names content-hashed keys that exist only in R2, so if it "
                         "reaches Pages before footer.js carries PHOTO_BASE, every image on "
                         "that post 404s. Ship both in one commit.")
    args = ap.parse_args()

    if not STAGING.exists():
        sys.exit(f"Nothing staged. Run derive_media.py first ({STAGING} missing).")

    cfg = load_env()
    s3 = client(cfg)
    bucket = cfg["R2_BUCKET"]

    manifests = sorted(STAGING.glob("journal/*/*/manifest.json"))
    if args.genus:
        manifests = [m for m in manifests if m.parent.parent.name == args.genus.lower()]
    if args.species:
        manifests = [m for m in manifests if m.parent.name == args.species.lower()]
    if not manifests:
        sys.exit("No staged species matched.")

    print(f"listing {bucket} ...")
    present = existing_keys(s3, bucket)
    print(f"  {len(present)} object(s) already in the bucket\n")

    up = skip = 0
    up_bytes = 0
    referenced: set[str] = set()
    manifest_writes: list[tuple[Path, bytes]] = []

    for man in manifests:
        sp_dir = man.parent
        slug = f"{sp_dir.parent.name}/{sp_dir.name}"

        # The MANIFEST is the authority on what is in use - never the files
        # present in staging. derive_media skips work it has already done, so a
        # staged file can legitimately be absent; deriving "referenced" from the
        # directory would then class live objects as orphans and --prune would
        # delete them.
        for entries in json.loads(man.read_text(encoding="utf-8"))["roles"].values():
            for e in entries:
                referenced.add("journal/" + slug + "/" + e["f"])

        for f in sorted(sp_dir.rglob("*")):
            if not f.is_file() or f.name == "manifest.json":
                continue
            key = "journal/" + slug + "/" + f.relative_to(sp_dir).as_posix()
            referenced.add(key)
            if key in present:
                skip += 1
                continue
            up += 1
            up_bytes += f.stat().st_size
            if args.push:
                s3.put_object(
                    Bucket=bucket, Key=key, Body=f.read_bytes(),
                    ContentType=CTYPE.get(f.suffix.lower(),
                                          mimetypes.guess_type(f.name)[0]
                                          or "application/octet-stream"),
                    CacheControl=IMMUTABLE,
                )
            else:
                print(f"  WOULD UPLOAD  {key}")

        if args.manifests:
            dest = DOCS / "journal" / slug / "manifest.json"
            new = man.read_bytes()
            if not dest.exists() or dest.read_bytes() != new:
                manifest_writes.append((dest, new))

    if args.push and up:
        print(f"  uploaded {up} object(s)")

    for dest, new in manifest_writes:
        if args.push:
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(new)
        else:
            print(f"  WOULD WRITE   {dest.relative_to(REPO)}")

    print()
    print(f"images   {up} to upload ({up_bytes / 1048576:.1f} MB), {skip} already present")
    print(f"manifests {len(manifest_writes)} to write into docs/")

    if args.prune:
        orphans = sorted(k for k in present
                         if k.startswith("journal/") and k not in referenced)
        print()
        if not orphans:
            print("prune: no orphans")
        else:
            for k in orphans[:40]:
                print(f"  {'DELETED ' if args.push else 'ORPHAN  '}{k}")
            if len(orphans) > 40:
                print(f"  ... and {len(orphans) - 40} more")
            if args.push:
                for i in range(0, len(orphans), 1000):
                    s3.delete_objects(
                        Bucket=bucket,
                        Delete={"Objects": [{"Key": k} for k in orphans[i:i + 1000]]})
            print(f"prune: {len(orphans)} orphan(s)"
                  + ("" if args.push else " - re-run with --push to delete"))

    if not args.push:
        print("\nDRY RUN. Nothing was written. Add --push.")


if __name__ == "__main__":
    main()
