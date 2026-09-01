#!/usr/bin/env python3
"""
backup_tools.py - refresh tools/ from the working harness folder.

The builders, patchers and verification harnesses run from
C:\\Users\\nli0490\\Claude\\aroidpedia-climate\\, which is NOT a git repo. This
copies the source files into tools/ so losing that folder does not lose them.

Dry run by default, like every other script here.

    python scripts/backup_tools.py            # what would change
    python scripts/backup_tools.py --push     # copy, then commit
"""
from __future__ import annotations

import argparse
import filecmp
import shutil
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SRC = Path("C:/Users/nli0490/Claude/aroidpedia-climate")
DST = REPO / "tools"

# Source only. Everything else in that folder is a cache, a page snapshot, or
# build output - see tools/README.md for the full list and why.
KEEP_SUFFIX = {".mjs", ".py", ".ps1"}

# Build OUTPUT and downloaded copies of the deployed bundle share the .js
# extension with nothing else worth keeping, so .js is excluded wholesale.
# These are named anyway, so the reason is visible at the point of exclusion.
NEVER = {"footer-v16-scratch.js", "live-footer.js", "footer-v102-broken.js",
         "_v47.js", "live-tree-script.js"}


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--push", action="store_true",
                    help="copy and commit (default: report only)")
    args = ap.parse_args()

    if not SRC.is_dir():
        sys.exit(f"Working folder not found: {SRC}")
    DST.mkdir(parents=True, exist_ok=True)

    live = {p.name: p for p in SRC.iterdir()
            if p.is_file() and p.suffix.lower() in KEEP_SUFFIX and p.name not in NEVER}
    backed = {p.name for p in DST.iterdir() if p.is_file() and p.name != "README.md"}

    new = sorted(n for n in live if n not in backed)
    gone = sorted(n for n in backed if n not in live)
    changed = sorted(n for n in live
                     if n in backed and not filecmp.cmp(live[n], DST / n, shallow=False))

    for label, names in (("NEW", new), ("CHANGED", changed), ("GONE FROM SOURCE", gone)):
        if names:
            print(f"{label} ({len(names)})")
            for n in names[:20]:
                print(f"  {n}")
            if len(names) > 20:
                print(f"  ... and {len(names) - 20} more")

    if not (new or changed or gone):
        print(f"tools/ already matches the working folder ({len(live)} files).")
        return

    if not args.push:
        print("\nDRY RUN. Re-run with --push to copy and commit.")
        return

    for n in new + changed:
        shutil.copy2(live[n], DST / n)
    # A file deleted from the working folder is left in place: this is a
    # backup, and the working folder is not the authority on what is worth
    # keeping. Removals are deliberate, by hand.
    if gone:
        print(f"\n{len(gone)} file(s) no longer in the working folder were LEFT in "
              "tools/ - remove by hand if that is what you want.")

    subprocess.run(["git", "add", "tools"], cwd=REPO, check=True)
    staged = subprocess.run(["git", "diff", "--cached", "--name-only", "--", "tools"],
                            cwd=REPO, capture_output=True,
                            encoding="utf-8", errors="replace").stdout or ""
    if not staged.strip():
        print("Nothing to commit.")
        return
    subprocess.run(["git", "commit", "-m",
                    f"back up harness scripts ({len(new)} new, {len(changed)} changed)"],
                   cwd=REPO, check=True)
    print(f"\nCommitted. {len(new)} new, {len(changed)} changed. Push when ready.")


if __name__ == "__main__":
    main()
