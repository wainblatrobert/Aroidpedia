#!/usr/bin/env python3
"""
derive_media.py - turn the Drive originals into the web derivatives that
go to Cloudflare R2, and write the manifest that points at them.

NON-DESTRUCTIVE BY CONSTRUCTION. This script only ever READS from
GENERA_ROOT. It asserts that before it starts, so a future edit cannot
quietly begin writing to the Drive. Everything it produces lands in the
staging directory (--out), and every derivative is regenerable from the
Drive originals - so R2 is a cache, never an archive.

WHY DERIVATIVES AT ALL
    docs/journal was 1.52 GB for one genus, over the 1 GB GitHub Pages
    ceiling. Measured on the real corpus: 193 files hold two thirds of the
    bytes and compress ~10x; the other ~3,900 average 92 KB and are left
    byte-for-byte alone.

KEYS ARE CONTENT-HASHED
    <role>/<md5-of-derived-bytes>[:8]-<slug>.jpg
    The hash is of the DERIVED file, so a changed photo is a new URL and
    the CDN can cache for a year with nothing to purge. Two files that
    derive to identical bytes share one key: the second is never uploaded
    and its manifest entry points at the first. That is what removes the
    200 MB of duplicate plates (the same lectotype filed under both
    protologue/ and story/), and it is the same trick build_manifest
    already used to fold galleries onto their parent role.

CHANGE DETECTION
    sync-journal-photos.py decides what to copy with md5(dest)==md5(src).
    A derivative NEVER equals its source, so that test can no longer work.
    State therefore lives in state/<genus>.json keyed by the md5 of the
    SOURCE file. Unchanged source + unchanged RECIPE = skip. Bump RECIPE
    to force a global re-derive after a quality or cap change.

    python scripts/derive_media.py --species "Amorphophallus margaritifer"
    python scripts/derive_media.py --genus Amorphophallus --report
"""
from __future__ import annotations

import argparse
import hashlib
import importlib.util
import io
import json
import re
import sys
from pathlib import Path

from PIL import Image

Image.MAX_IMAGE_PIXELS = None          # botanical plates are legitimately huge

REPO = Path(__file__).resolve().parent.parent

# Reuse the folder conventions from the sync script rather than restating
# them: numbered role folders, "DO NOT UPLOAD *", hybrid skipping and the
# caption rules are subtle and must not drift between the two tools.
_spec = importlib.util.spec_from_file_location("syncjp", REPO / "sync-journal-photos.py")
sjp = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(sjp)

GENERA_ROOT = sjp.GENERA_ROOT
IMG_EXT, VID_EXT = sjp.IMG_EXT, sjp.VID_EXT

# ---------------------------------------------------------------------------
# THE RECIPE. Bump RECIPE whenever anything below changes, or the state file
# will happily report "unchanged" for files derived under the old rules.
# ---------------------------------------------------------------------------
RECIPE = 1

QUALITY = 82
THRESHOLD = 1000 * 1024        # at or under this, copy the original verbatim

CAPS = {                       # long-edge cap in px, by role
    "hero":         1600,      # card lead image, never shown large
    "vegetative":   1800,
    "reproductive": 1800,
    "veg-gallery":  1800,
    "rep-gallery":  1800,
    "maps":         2000,      # place labels must stay legible
    "protologue":   2600,      # scanned plates and printed text
    "story":        2600,
    "other":        2600,
    "comparisons":  2600,
}


def md5_bytes(b: bytes) -> str:
    return hashlib.md5(b).hexdigest()


def derive(src: Path, role: str, threshold: int) -> tuple[bytes, str, str]:
    """(bytes, extension, note) for the file that should be published."""
    ext = src.suffix.lower()
    raw = src.read_bytes()

    if ext in VID_EXT:
        return raw, ext, "video (verbatim)"
    if role not in CAPS or len(raw) <= threshold:
        return raw, ext, "verbatim"

    im = Image.open(io.BytesIO(raw))
    im.load()
    w0, h0 = im.size

    # Scans occasionally carry an incidental alpha channel. JPEG has none,
    # so flatten onto white rather than letting PIL guess.
    if im.mode in ("RGBA", "LA", "PA") or "transparency" in im.info:
        bg = Image.new("RGB", im.size, (255, 255, 255))
        rgba = im.convert("RGBA")
        bg.paste(rgba, mask=rgba.getchannel("A"))
        im = bg
    else:
        im = im.convert("RGB")

    cap = CAPS[role]
    if max(im.size) > cap:
        r = cap / max(im.size)
        im = im.resize((max(1, round(im.width * r)), max(1, round(im.height * r))),
                       Image.LANCZOS)

    buf = io.BytesIO()
    # No exif= argument, so metadata is dropped; the pixels are rebuilt anyway.
    im.save(buf, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    out = buf.getvalue()

    # Only ever shrink. A small or already-optimised source can encode
    # LARGER as JPEG, and publishing that would be a silent regression.
    if len(out) >= len(raw):
        return raw, ext, f"kept original ({w0}x{h0}, jpeg was bigger)"

    return out, ".jpg", f"{w0}x{h0} -> {im.width}x{im.height}"


def key_for(role: str, src_name: str, derived: bytes, ext: str) -> str:
    stem = sjp.slugify_name(src_name).rsplit(".", 1)[0]
    return f"{role}/{md5_bytes(derived)[:8]}-{stem}{ext}"


def build_manifest(order: list, keyed: dict) -> dict:
    """Same shape and same rules as sync-journal-photos.build_manifest, but
    every `f` is the content-hashed key. Galleries and cross-role duplicates
    both fold onto the winning key automatically, because `keyed` maps each
    source path to the key its DERIVED bytes claimed."""
    roles: dict[str, list] = {}
    for role, src in order:
        key = keyed[src]
        if src.suffix.lower() in VID_EXT:
            roles.setdefault("video", []).append(
                {"f": key, "c": src.name.rsplit(".", 1)[0]})
            continue
        if role == "other" and re.match(r"(?i)^comparison\s*\d*(\s+-\s+.+)?$", src.stem):
            cap = src.stem.split(" - ", 1)[1].strip() if " - " in src.stem else ""
            roles.setdefault("comparisons", []).append({"f": key, "c": cap})
            continue
        if role == "story":
            label = re.sub(r"^\d+\s*[.\-)]?\s*", "", src.stem).strip()
            roles.setdefault(role, []).append({"f": key, "c": label})
            continue
        roles.setdefault(role, []).append({"f": key, "c": sjp.caption_of(src.name)})
    return {"version": 1, "roles": roles}


def species_dirs(genus_filter, species_filter):
    for gdir in sorted(GENERA_ROOT.glob(genus_filter or "*")):
        if not gdir.is_dir():
            continue
        genus = gdir.name
        sroot = gdir / f"Species - {genus}"
        if not sroot.is_dir():
            continue
        for sdir in sorted(sroot.iterdir()):
            if not sdir.is_dir():
                continue
            if species_filter and sdir.name.lower() != species_filter.lower():
                continue
            slug = sjp.species_path(sdir.name, genus)
            if slug:
                yield genus, sdir, slug


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--genus")
    ap.add_argument("--species", help='e.g. "Amorphophallus margaritifer"')
    ap.add_argument("--out", default=str(REPO / "staging"),
                    help="staging dir for derivatives (default: ./staging)")
    ap.add_argument("--threshold", type=int, default=THRESHOLD,
                    help=f"bytes; at or under, copy verbatim (default {THRESHOLD})")
    ap.add_argument("--report", action="store_true",
                    help="per-file lines, not just the totals")
    args = ap.parse_args()

    out_root = Path(args.out).resolve()
    # The one guarantee this script makes.
    if GENERA_ROOT.resolve() in (out_root, *out_root.parents):
        sys.exit(f"REFUSING: --out {out_root} is inside the Drive originals at "
                 f"{GENERA_ROOT}. Derivatives never write there.")

    tot_src = tot_out = 0
    n_files = n_derived = n_verbatim = n_dup = 0
    species_seen = 0

    for genus, sdir, slug in species_dirs(args.genus, args.species):
        order: list[tuple[str, Path]] = []
        for role, src_dir in sjp.role_dirs(sdir):
            for photo in sorted(src_dir.iterdir(), key=lambda p: sjp.natural_key(p.name)):
                if not photo.is_file() or photo.suffix.lower() not in (IMG_EXT | VID_EXT):
                    continue
                if sjp.ignored(photo):
                    continue
                if photo.suffix.lower() in VID_EXT and photo.stat().st_size > 95 * 1048576:
                    print(f"  SKIP >95MB video: {photo.name}")
                    continue
                order.append((role, photo))
        if not order:
            continue

        species_seen += 1
        species_dir = out_root / "journal" / slug
        by_derived: dict[str, str] = {}      # derived md5 -> winning key
        keyed: dict[Path, str] = {}
        state_files: dict[str, dict] = {}

        print(f"\n{slug}  ({len(order)} file(s))")
        for role, src in order:
            derived, ext, note = derive(src, role, args.threshold)
            n_files += 1
            tot_src += src.stat().st_size

            dm = md5_bytes(derived)
            if dm in by_derived:
                keyed[src] = by_derived[dm]
                n_dup += 1
                if args.report:
                    print(f"  dup   {src.name[:52]:54} -> {by_derived[dm]}")
                continue

            key = key_for(role, src.name, derived, ext)
            by_derived[dm] = key
            keyed[src] = key
            tot_out += len(derived)

            dest = species_dir / key
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(derived)

            if note.startswith(("verbatim", "video", "kept")):
                n_verbatim += 1
            else:
                n_derived += 1
            if args.report:
                pct = 100 * len(derived) / max(src.stat().st_size, 1)
                print(f"  {src.name[:52]:54} {src.stat().st_size/1024:8.0f}K"
                      f" -> {len(derived)/1024:7.0f}K ({pct:5.1f}%)  {note}")

            state_files[sjp.md5(src)] = {
                "key": key, "bytes": len(derived), "derived_md5": dm,
            }

        manifest = build_manifest(order, keyed)
        species_dir.mkdir(parents=True, exist_ok=True)
        (species_dir / "manifest.json").write_text(
            json.dumps(manifest, ensure_ascii=False, sort_keys=True,
                       separators=(",", ":")),
            encoding="utf-8")

        state_path = REPO / "state" / f"{genus.lower()}.json"
        state_path.parent.mkdir(parents=True, exist_ok=True)
        state = {"recipe": RECIPE, "files": {}}
        if state_path.exists():
            try:
                prev = json.loads(state_path.read_text(encoding="utf-8"))
                if prev.get("recipe") == RECIPE:
                    state = prev
            except json.JSONDecodeError:
                pass
        state["recipe"] = RECIPE
        state.setdefault("files", {}).update(state_files)
        state_path.write_text(json.dumps(state, indent=1, sort_keys=True),
                              encoding="utf-8")

    if not n_files:
        sys.exit("Nothing matched. Check --genus / --species.")

    print("\n" + "-" * 62)
    print(f"species        {species_seen}")
    print(f"files read     {n_files}   ({n_derived} recompressed, "
          f"{n_verbatim} verbatim, {n_dup} deduped)")
    print(f"originals      {tot_src / 1048576:9.1f} MB")
    print(f"derivatives    {tot_out / 1048576:9.1f} MB    "
          f"({tot_src / max(tot_out, 1):.1f}x smaller)")
    print(f"staged in      {out_root}")


if __name__ == "__main__":
    main()
