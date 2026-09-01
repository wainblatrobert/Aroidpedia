# tools/ — backup of the build and verification harnesses

**This is a backup, not the working copy.**

These scripts run from `C:\Users\nli0490\Claude\aroidpedia-climate\`, which is
**not a git repository**. Losing that folder would lose every builder, patcher
and verification harness this project has accumulated — including the two
guards written after the 9.1.26 outage. So a copy lives here.

Nothing in this folder is served: GitHub Pages publishes `docs/` only.

## Refreshing the backup

```bash
python scripts/backup_tools.py            # report what changed
python scripts/backup_tools.py --push     # copy, then commit
```

⚠ **The two copies drift.** Edits are made in `aroidpedia-climate\`, and this
folder only catches up when the backup is re-run. If you are reading a script
here to understand current behaviour, check the working copy — it is the one
that runs.

## What is here, and what is not

Copied: every `.mjs` and `.py` at the top level of the working folder — 412
files, about 2.6 MB.

Deliberately excluded, because they are regenerable and large:

| Excluded | Why |
|---|---|
| `node_modules/` | 28 MB, reinstallable |
| `gb/` | 254 MB of Natural Earth / WorldClim source rasters |
| `ne-cache/`, `climate-cache/`, `powo-cache/` | download caches; the pipeline READMEs say never commit them |
| `_live_pages/`, `_paste_pages/`, `_repro_pages/`, `_plate_shots/` | page snapshots from past sessions |
| `footer-*.js`, `live-*.js`, `_v47.js` | build **output** and downloaded copies of the deployed bundle, not source |

## The ones that matter most

| Script | What it does |
|---|---|
| `build-bundle-scratch.mjs` | Footer master `.txt` → `docs/footer.js`. **Refuses** to build a FILE version already live, or a master whose CARD version is behind live. |
| `r2-preview.mjs` | Serves a scratch bundle + staged manifest into the live page by request interception — see a change with nothing deployed. |
| `r2-live-verify.mjs` | Sweeps real published species pages: images resolving from R2, none broken, none falling back to Pages. |
| `r2-diag.mjs` | Why one specific `<img>` on one page is broken. |
| `build-climate-*.mjs`, `build-shapes*` | The climate and geometry feeds under `docs/`. |
| `jr-*.mjs`, `verify-*.mjs`, `check-*.mjs` | Journal and card verification harnesses, mostly Playwright against the live site. |

Many of the rest are one-off patchers from a single session. They are kept
because they double as a record of how a change was actually made — but
⚠ **a patch script is a snapshot, not a plan**: one written days ago still
names the master that was current then, and running it later can revert
everything shipped since.
