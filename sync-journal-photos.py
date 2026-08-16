#!/usr/bin/env python3
"""
sync-journal-photos.py - one command to publish species photos to GitHub Pages.

v7 (8.14.26): COMPARISON PLATES. Files in OTHER whose stem is
"comparison" / "Comparison 2" / "Comparison 1 - <caption>" (case-free,
space-separated - hyphenated figure names like "Comparison-of-..." do
NOT match) are filed under their own manifest role "comparisons"
instead of "other". The card (v47+) renders them INLINE after the
NOTES section as full-width plates; because they are not in "other"
they never repeat in More photos. Repo path stays other/<slug>.

v3 (8.10.26): NUMBERED SUBFOLDERS. The species folders carry role subfolders
with the user's ordering prefix ("1. HERO", "2. PROTOLOGUE", ...). The number
is the user's own photo-sorting order and is STRIPPED for matching and for
repo paths - renumbering the folders changes nothing here. Recognized roles
(after stripping "N." / "N"):

    HERO          one lead photo (card hero; also upload it as the Squarespace
                  post thumbnail)
    PROTOLOGUE    protologue plate(s) -> shown under Original description
    VEGETATIVE    leaflet / petiole / tuber photos
      veg-gallery   (inside VEGETATIVE) up to 3, named 1/2/3 for order ->
                    gallery after Species description
    REPRODUCTIVE  inflorescence / infructescence photos
      rep-gallery   (inside REPRODUCTIVE) up to 3, named 1/2/3 for order ->
                    gallery after Inflorescence
    MAPS          published detail maps -> DISTRIBUTION MAPS section
    OTHER         herbarium sheets, illustrations

Repo layout produced:  docs/journal/<genus>/<epithet>/<role>/<file>
  (nested per genus so docs/journal/ shows one folder per genus, not
   thousands of species folders in one flat directory)
  roles: hero, protologue, vegetative, veg-gallery, reproductive,
  rep-gallery, maps, other. Filenames are slugified for URLs.

Only new or changed files are copied (md5); files removed locally are removed
from the mirror. Species without subfolders are skipped. Hybrid folders
(" x " in the name) are skipped and listed.

Usage:
    python sync-journal-photos.py --species "Amorphophallus dracontioides"
    python sync-journal-photos.py --genus Amorphophallus
    ... add --push to copy, commit and push (default is a dry-run report)
"""
import argparse, hashlib, json, re, shutil, subprocess
from pathlib import Path

GENERA_ROOT = Path(r"G:\My Drive\PlantsV2\Aroidpedia\GENERA")
REPO = Path(__file__).resolve().parent
DEST_ROOT = REPO / "docs" / "journal"

IMG_EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
# v6 (8.12.26): in-situ videos ride the same mirror + manifest ("video"
# role; caption = the filename stem). Keep to web-safe containers.
VID_EXT = {".mp4", ".webm", ".m4v"}

ROLE_NAMES = {
    "HERO": "hero",
    "PROTOLOGUE": "protologue",
    "VEGETATIVE": "vegetative",
    "REPRODUCTIVE": "reproductive",
    "MAPS": "maps",
    "OTHER": "other",
}
GALLERY_NAMES = {"VEG-GALLERY": "veg-gallery", "REP-GALLERY": "rep-gallery"}


def strip_order_prefix(name: str) -> str:
    """'4. VEGETATIVE' -> 'VEGETATIVE'; '10 MAPS' -> 'MAPS'."""
    return re.sub(r"^\d+\s*[.\-)]?\s*", "", name.strip()).upper()


def md5(p: Path) -> str:
    h = hashlib.md5()
    with open(p, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 16), b""):
            h.update(chunk)
    return h.hexdigest()


def slugify_name(name: str) -> str:
    stem, dot, ext = name.rpartition(".")
    s = re.sub(r"[^a-z0-9]+", "-", stem.lower()).strip("-") or "photo"
    return f"{s}.{ext.lower()}"


def natural_key(name: str):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", name)]


def caption_of(fname: str) -> str:
    """'Fig 2D - Amorphophallus dumboi - Carpellate flowers.jpg' -> the
    LAST ' - ' segment. Two or more separators = deliberate caption."""
    parts = [p.strip() for p in fname.rsplit(".", 1)[0].split(" - ")]
    return parts[-1] if len(parts) >= 3 and parts[-1] else ""


def build_manifest(role_files: dict) -> dict:
    """v5 (8.12.26): the per-species photo manifest the species card
    fetches at render time — post bodies carry NO images anymore (the
    Squarespace editor deletes inline <img> on save, so bodies must stay
    pure text). Galleries reference their PARENT-role file (md5 match)
    so the card's grid dedupe works; every entry is {f: path relative to
    the species dir, c: caption}."""
    roles = {}
    md5_of = {}
    for role in ("vegetative", "reproductive"):
        for f in role_files.get(role, []):
            md5_of.setdefault(role, {})[md5(f)] = f
    for role, files in role_files.items():
        entries = []
        for f in files:
            if f.suffix.lower() in VID_EXT:
                # videos: their own manifest role, caption = the stem
                roles.setdefault("video", []).append(
                    {"f": f"{role}/{slugify_name(f.name)}", "c": f.name.rsplit(".", 1)[0]})
                continue
            if role == "other" and re.match(r"(?i)^comparison\s*\d*(\s+-\s+.+)?$", f.stem):
                # v7: comparison plates - own role, caption = the " - " tail
                cap = f.stem.split(" - ", 1)[1].strip() if " - " in f.stem else ""
                roles.setdefault("comparisons", []).append(
                    {"f": f"other/{slugify_name(f.name)}", "c": cap})
                continue
            if role in ("veg-gallery", "rep-gallery"):
                parent = "vegetative" if role == "veg-gallery" else "reproductive"
                match = md5_of.get(parent, {}).get(md5(f))
                path = f"{parent}/{slugify_name(match.name)}" if match else f"{role}/{slugify_name(f.name)}"
                entries.append({"f": path, "c": caption_of((match or f).name)})
            else:
                entries.append({"f": f"{role}/{slugify_name(f.name)}", "c": caption_of(f.name)})
        if entries:
            roles[role] = entries
    return {"version": 1, "roles": roles}


def species_path(folder_name: str, genus: str) -> str | None:
    """'Amorphophallus decus-silvae' -> 'amorphophallus/decus-silvae'."""
    if " x " in folder_name.lower():
        return None
    parts = folder_name.split()
    if len(parts) < 2 or parts[0].lower() != genus.lower():
        return None
    return parts[0].lower() + "/" + "-".join(p.lower() for p in parts[1:])


def role_dirs(sdir: Path):
    """Yield (role, dir) pairs for one species folder, numbered or not."""
    for d in sorted(sdir.iterdir()):
        if not d.is_dir():
            continue
        role = ROLE_NAMES.get(strip_order_prefix(d.name))
        if not role:
            continue
        yield role, d
        for g in sorted(d.iterdir()):
            if g.is_dir():
                grole = GALLERY_NAMES.get(strip_order_prefix(g.name))
                if grole:
                    yield grole, g


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--push", action="store_true", help="copy + commit + push (default: dry-run)")
    ap.add_argument("--genus", help="limit to one genus")
    ap.add_argument("--species", help='limit to one species folder, e.g. "Amorphophallus dracontioides"')
    args = ap.parse_args()

    copies, removals, skipped_hybrids, collisions, manifests = [], [], [], [], []

    for gdir in sorted(GENERA_ROOT.glob(args.genus or "*")):
        if not gdir.is_dir():
            continue
        genus = gdir.name
        species_root = gdir / f"Species - {genus}"
        if not species_root.is_dir():
            continue
        for sdir in sorted(species_root.iterdir()):
            if not sdir.is_dir():
                continue
            if args.species and sdir.name.lower() != args.species.lower():
                continue
            slug = species_path(sdir.name, genus)
            if slug is None:
                if " x " in sdir.name.lower():
                    skipped_hybrids.append(sdir.name)
                continue

            expected = {}          # repo path -> source path
            role_files = {}
            found_any_role = False
            for role, src_dir in role_dirs(sdir):
                found_any_role = True
                for photo in sorted(src_dir.iterdir(), key=lambda p: natural_key(p.name)):
                    if not photo.is_file() or photo.suffix.lower() not in (IMG_EXT | VID_EXT):
                        continue
                    if photo.suffix.lower() in VID_EXT and photo.stat().st_size > 95 * 1048576:
                        print(f"SKIP >95MB (GitHub limit): {photo.name}")
                        continue
                    role_files.setdefault(role, []).append(photo)
                    dest = DEST_ROOT / slug / role / slugify_name(photo.name)
                    if dest in expected:
                        collisions.append(str(dest.relative_to(REPO)))
                        continue
                    expected[dest] = photo
                    if not (dest.exists() and md5(dest) == md5(photo)):
                        copies.append((photo, dest))

            # v5: the photo manifest the card fetches (bodies carry no imgs).
            # Only when the species actually has photos - empty folders get none.
            if found_any_role and role_files:
                mpath = DEST_ROOT / slug / "manifest.json"
                mjson = json.dumps(build_manifest(role_files), ensure_ascii=False,
                                   sort_keys=True, separators=(",", ":"))
                expected[mpath] = None
                if not (mpath.exists() and mpath.read_text(encoding="utf-8") == mjson):
                    manifests.append((mpath, mjson))

            sdest = DEST_ROOT / slug
            if sdest.is_dir() and found_any_role:
                for f in sdest.rglob("*"):
                    if f.is_file() and f not in expected:
                        removals.append(f)

    for src, dest in copies:
        print(f"{'COPY ' if args.push else 'WOULD COPY '} {src.parent.name}\\{src.name}  ->  {dest.relative_to(REPO)}")
        if args.push:
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dest)
    for mpath, mjson in manifests:
        print(f"{'WRITE ' if args.push else 'WOULD WRITE '} {mpath.relative_to(REPO)}")
        if args.push:
            mpath.parent.mkdir(parents=True, exist_ok=True)
            mpath.write_text(mjson, encoding="utf-8")
    for f in removals:
        print(f"{'REMOVE' if args.push else 'WOULD REMOVE'}  {f.relative_to(REPO)}")
        if args.push:
            f.unlink()
    for c in collisions:
        print(f"NAME COLLISION (two files slugify identically, second skipped): {c}")
    if skipped_hybrids:
        print(f"Skipped {len(skipped_hybrids)} hybrid folder(s) (not yet supported)")
    if not copies and not removals and not manifests:
        print("Nothing to do - repo already mirrors the subfolders.")
        return

    if args.push and (copies or removals or manifests):
        subprocess.run(["git", "add", "-A", "docs/journal"], cwd=REPO, check=True)
        subprocess.run(["git", "commit", "-m", f"Sync journal photos ({len(copies)} copied, {len(removals)} removed, {len(manifests)} manifests)"],
                       cwd=REPO, check=True)
        subprocess.run(["git", "push"], cwd=REPO, check=True)
        print(f"\nPushed. Pages deploy takes a minute or two.")
    else:
        print(f"\n{len(copies)} copy / {len(removals)} removal(s) pending. Re-run with --push to do it.")


if __name__ == "__main__":
    main()
