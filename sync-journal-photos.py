#!/usr/bin/env python3
"""
sync-journal-photos.py - one command to publish species photos.

v9 (8.30.26): PHOTOS NO LONGER GO TO GITHUB. GitHub Pages caps a
published site at 1 GB and docs/journal had reached 1.52 GB carrying one
genus of about 150, so the images moved to Cloudflare R2 behind
img.aroidpedia.com. THIS SCRIPT NO LONGER COPIES A SINGLE IMAGE INTO
docs/. It is now an orchestrator over the two steps that do the work:

    scripts/derive_media.py   Drive originals -> resized, deduped,
                              content-hashed derivatives in staging/,
                              plus the manifest and the state file
    scripts/publish_media.py  staging/ -> R2 (images), docs/ (manifests)

What still lands in the repo is the manifest - about 1.6 KB per species -
and state/<genus>.json. Everything else is served from R2 with a one-year
immutable cache, because derive_media names each file after the md5 of
its own bytes.

The command shape is unchanged, so the old muscle memory still works;
what changed is where the bytes end up.

/!\ DO NOT reintroduce a copy into docs/journal. The workflow
no-photos-to-pages.yml fails any push that adds an image there, and the
1 GB ceiling is the reason it exists.

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
import argparse, hashlib, json, re, shutil, subprocess, sys

NL_MARK = "\n"   # a bare newline for report spacing
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
    # v8 (8.17.26): plates belonging to the STORY feature card - the
    # expedition maps for A. incurvatus were the first. Natural sort, so
    # the FIRST file is the one shown and the rest become selectable;
    # the filename (minus any number prefix) is the selector's label.
    "STORY": "story",
    # v7 (1.9.26): HYBRIDS ONLY. Photographs of the two PARENT taxa, shown as
    # inline panels beside the cross. They are pictures of a DIFFERENT PLANT -
    # Arum 'Sooi's ovule panel is a photograph of Arum cylindraceum - so they
    # must never be folded into this post's More photos grid, or the archive
    # silently misattributes them. Optional: a hybrid with no parent photos
    # simply gets no panels.
    "OVULE PARENT": "ovule-parent",
    "POLLEN PARENT": "pollen-parent",
}
# roles that are NOT this plant and must stay out of the More photos archive
FOREIGN_ROLES = {"ovule-parent", "pollen-parent"}
GALLERY_NAMES = {"VEG-GALLERY": "veg-gallery", "REP-GALLERY": "rep-gallery"}


def strip_order_prefix(name: str) -> str:
    """'4. VEGETATIVE' -> 'VEGETATIVE'; '10 MAPS' -> 'MAPS'."""
    return re.sub(r"^\d+\s*[.\-)]?\s*", "", name.strip()).upper()


# v8 (8.17.26, user rule): anything whose name starts with DO NOT UPLOAD
# is working material - alternates, sources, rejects - and never reaches
# the repo. Applies to FILES and FOLDERS alike, at any depth, so a whole
# scratch folder can be parked inside a role folder. Case- and
# punctuation-tolerant so "Do-not-upload NOTES" is caught too.
_NOUP = re.compile(r"^do[\s_-]*not[\s_-]*upload", re.I)


def ignored(p: Path) -> bool:
    return bool(_NOUP.match(p.name.strip()))


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
            elif role == "story":
                # v8: the whole filename IS the label ("EXPEDITION
                # RECONSTRUCTION", "ORIGINAL 1920 EXPEDITION MAP"), so it
                # can be read straight onto the selector button. A leading
                # sort number is stripped; caption_of's " - " rule would
                # throw the name away entirely here.
                label = re.sub(r"^\d+\s*[.\-)]?\s*", "", f.stem).strip()
                entries.append({"f": f"{role}/{slugify_name(f.name)}", "c": label})
            else:
                entries.append({"f": f"{role}/{slugify_name(f.name)}", "c": caption_of(f.name)})
        if entries:
            roles[role] = entries
    return {"version": 1, "roles": roles}


def species_path(folder_name: str, genus: str) -> str | None:
    """'Amorphophallus decus-silvae' -> 'amorphophallus/decus-silvae'.

    v7 (1.9.26): QUOTES ARE STRIPPED, not hyphenated. The card finds a post's
    photos by taking its slug and dropping the genus, and every published
    cultivar slug drops the quotes - Alocasia 'Amazonica' is
    `alocasia-amazonica`. Without this, the 8.31.26 Arum sync wrote
    `arum/'sooi'/` and `arum/italicum-'chui'/` while the posts would be
    `arum-sooi` and `arum-italicum-chui`, so the card would look for
    `arum/sooi/`, miss, and render a cultivar with no photos and no error.
    Straight and curly quotes both appear: the Drive folders are typed with a
    straight apostrophe, the live post titles use the curly one.
    """
    if " x " in folder_name.lower():
        return None
    parts = folder_name.split()
    if len(parts) < 2 or parts[0].lower() != genus.lower():
        return None
    g = genus.lower()
    clean = []
    for p in parts[1:]:
        p = p.lower().replace("'", "").replace("’", "").replace("‘", "")
        # v8 (1.9.26): A FORMAL HYBRID FORMULA. "Arum italicum × Arum
        # maculatum" is a real post; the lowercase " x " folders above are
        # breeders' working material (Amorphophallus has 8, Alocasia 10) and
        # stay skipped. The multiplication sign becomes "x" and the REPEATED
        # GENUS is dropped, so the folder resolves to `italicum-x-maculatum`
        # and matches the post slug `arum-italicum-x-maculatum`. Left alone it
        # produced `italicum-×-arum-maculatum`, which the card could never
        # find - the same silent miss the quotes caused.
        if p == "×":
            p = "x"
        if p == g:
            continue
        if p:
            clean.append(p)
    # nothing but the cross sign left is a stray folder ("Alocasia ×")
    if not clean or not any(c != "x" for c in clean):
        return None
    return parts[0].lower() + "/" + "-".join(clean)


def role_dirs(sdir: Path):
    """Yield (role, dir) pairs for one species folder, numbered or not."""
    for d in sorted(sdir.iterdir()):
        if not d.is_dir() or ignored(d):
            continue
        role = ROLE_NAMES.get(strip_order_prefix(d.name))
        if not role:
            continue
        yield role, d
        for g in sorted(d.iterdir()):
            if g.is_dir() and not ignored(g):
                grole = GALLERY_NAMES.get(strip_order_prefix(g.name))
                if grole:
                    yield grole, g


def run(step, args_list):
    """Run a pipeline step, streaming its output. UTF-8 is pinned because
    this box decodes subprocess output as cp1252 by default, and the step
    reports carry characters that would die inside a reader thread."""
    print(NL_MARK + '=== ' + step + ' ' + '=' * max(4, 56 - len(step)))
    r = subprocess.run([sys.executable, str(REPO / 'scripts' / step)] + args_list,
                       cwd=REPO, encoding='utf-8', errors='replace')
    if r.returncode != 0:
        sys.exit(step + ' failed (' + str(r.returncode) + '); nothing committed.')


def main():
    # Children write straight to the terminal; without this the parent's
    # own lines buffer and surface after theirs, which reads as the wrong
    # order of events.
    sys.stdout.reconfigure(line_buffering=True)

    ap = argparse.ArgumentParser()
    ap.add_argument("--push", action="store_true",
                    help="derive, upload to R2, write manifests, commit and push")
    ap.add_argument("--genus", help="limit to one genus")
    ap.add_argument("--species", help='one species folder, e.g. "Amorphophallus dumboi"')
    args = ap.parse_args()

    # The thing this version exists to prevent.
    strays = [p for p in DEST_ROOT.rglob("*")
              if p.is_file() and p.suffix.lower() in (IMG_EXT | VID_EXT)]
    if strays:
        print(str(len(strays)) + ' legacy image file(s) still sit under docs/journal.')
        print('They are the rollback net for the 8.30.26 R2 cutover and get')
        print('deleted in their own commit once it has held. Nothing here adds to them.')

    # v9 (1.9.26): PRUNE STAGING BEFORE DERIVING. staging/ is cumulative and
    # nothing ever removed from it, so a folder staged under an OLD naming rule
    # lives on and publish_media keeps re-emitting its manifest into docs/ -
    # which is how `arum/'sooi'/` and `arum/italicum-x-arum-maculatum/`
    # (multiplication sign) came BACK twice after being deleted, silently
    # recreating the exact mis-slugged directories the species_path fixes had
    # just removed. Anything in staging that no longer corresponds to a Drive
    # folder under the current rule is stale by definition.
    if args.genus and not args.species:
        stage_g = REPO / "staging" / "journal" / args.genus.lower()
        sdir = GENERA_ROOT / args.genus / f"Species - {args.genus}"
        if stage_g.is_dir() and sdir.is_dir():
            want = set()
            for d in sdir.iterdir():
                if d.is_dir() and not ignored(d):
                    sp = species_path(d.name, args.genus)
                    if sp:
                        want.add(sp.split("/", 1)[1])
            for d in sorted(stage_g.iterdir()):
                if d.is_dir() and d.name not in want:
                    shutil.rmtree(d)
                    print("pruned stale staging dir: " + d.name)

    sel = []
    if args.genus:
        sel += ["--genus", args.genus]
    if args.species:
        sel += ["--species", args.species]
    run("derive_media.py", sel)

    # publish_media selects on slugs, not Drive folder names.
    psel = []
    if args.genus:
        psel += ["--genus", args.genus.lower()]
    if args.species:
        psel += ["--species", args.species.split()[-1].lower()]
    run("publish_media.py", psel + (["--push", "--manifests"] if args.push else []))

    if not args.push:
        print(NL_MARK + 'DRY RUN. Nothing uploaded, written or committed. Add --push.')
        return

    # Only manifests and state are tracked; the images live in R2.
    subprocess.run(["git", "add", "-A", "docs/journal", "state"], cwd=REPO, check=True)
    staged = subprocess.run(["git", "diff", "--cached", "--name-only"], cwd=REPO,
                            capture_output=True, encoding='utf-8',
                            errors='replace').stdout or ''
    if not staged.strip():
        print(NL_MARK + 'Nothing changed. The repo already matches the Drive.')
        return

    n = len([l for l in staged.splitlines() if l.strip()])
    subprocess.run(["git", "commit", "-m",
                    'Sync journal photos (' + str(n) + ' manifest/state file(s)); images to R2'],
                   cwd=REPO, check=True)
    subprocess.run(["git", "push"], cwd=REPO, check=True)
    print(NL_MARK + 'Pushed. Manifests deploy in a minute or two. The images were',
          'already on R2 before the commit, so no page can 404 in between.')


if __name__ == "__main__":
    main()
