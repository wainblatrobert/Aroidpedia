# Rebuilding Aroidpedia on a new machine

Written 9.7.26. Everything below assumes the laptop is gone and you have your
Google account and your GitHub account. Target: working again in about an hour,
most of which is downloads.

## Where each thing actually lives

| What | Primary home | Backup |
|---|---|---|
| Site code and content (`aroidpedia-site`) | GitHub `wainblatrobert/aroidpedia-site` | Drive bare mirror |
| Data repo (`Aroidpedia`) | GitHub `wainblatrobert/Aroidpedia` | Drive bare mirror |
| Local commits not yet on GitHub | this laptop only | Drive bare mirror |
| Uncommitted edits in either repo | this laptop only | Drive `working-files\` |
| Climate scratch folder (`aroidpedia-climate`) | this laptop only | Drive `working-files\` |
| Claude memory notes | this laptop only | Drive `working-files\claude-memory` |
| Species photos, literature, sheets, builders | Google Drive `PlantsV2\Aroidpedia\` | Drive is the primary |
| The live site itself | Cloudflare Pages | rebuilt from the repo |
| Secrets (`.env`, R2 keys) | this laptop + Cloudflare | **not backed up on purpose** |

The Drive backups are at `G:\My Drive\PlantsV2\Aroidpedia\BACKUPS\`:
`git-mirrors\` holds a bare clone of each repo, `working-files\` the folders git
cannot carry, `STATUS.txt` the last run's summary, `backup.log` the history.

## Steps

**1. Install the toolchain.** Git, Node 24 (the version in use was v24.18.0),
Python 3.11, and Google Drive for desktop. Sign into Drive first and let
`PlantsV2\Aroidpedia` finish syncing before anything else, because the builders
read straight off `G:`.

**2. Clone both repos from GitHub** into `C:\Users\<you>\Claude\`:

```bash
git clone https://github.com/wainblatrobert/aroidpedia-site.git
git clone https://github.com/wainblatrobert/Aroidpedia.git
```

**3. Recover anything GitHub did not have.** `STATUS.txt` on Drive lists, per
repo, the commits that never reached GitHub. If it says anything other than
"nothing", pull those from the Drive mirror instead of GitHub:

```bash
git remote add backup "G:/My Drive/PlantsV2/Aroidpedia/BACKUPS/git-mirrors/Aroidpedia.git"
git fetch backup
```

Then check out or merge whichever branch the status file named. The mirror holds
every branch, so `git branch -a` after the fetch shows the full picture.

**4. Copy the working files back** from `BACKUPS\working-files\`:
`aroidpedia-climate` to `C:\Users\<you>\Claude\aroidpedia-climate`, and
`claude-memory` to `C:\Users\<you>\.claude\projects\C--Users-<you>-Claude\memory`.
The `*-worktree` folders are the uncommitted state of each repo. Compare them
against the fresh clone and copy across only what git did not have; do not
overwrite a clean clone wholesale.

**5. Install dependencies.** `npm install` in `aroidpedia-site` and in
`aroidpedia-climate`. Python packages used by the builders: `openpyxl`,
`pillow`, `pymupdf` (imported as `fitz`), `gspread` and its Google auth
libraries, `requests`.

**6. Re-create the secrets.** `Aroidpedia\.env` is deliberately absent from the
backups. Re-issue the Cloudflare R2 token and refill these keys:
`R2_ACCOUNT_ID`, `R2_BUCKET`, `R2_PUBLIC_BASE`, `R2_ACCESS_KEY_ID`,
`R2_SECRET_ACCESS_KEY`. The GitHub Actions secrets live in GitHub, not here, and
survive a laptop loss: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`,
`RESEND_API_KEY`. Google Sheets access is whatever account the sheets are shared
with.

**7. Re-arm the backup.** Copy `tools\backup-nightly.ps1` into place and
register the task again:

```bash
schtasks /create /tn AroidpediaNightlyBackup /tr "powershell -ExecutionPolicy Bypass -WindowStyle Hidden -File \"C:\Users\<you>\Claude\Aroidpedia\tools\backup-nightly.ps1\"" /sc daily /st 02:30
```

## Two things that are not backed up, on purpose

**Regenerable bulk.** `node_modules`, `dist` and the `dist-agent-*` folders, the
site's 3.3 GB `capture\` folder, and the Natural Earth / WorldClim / POWO
caches. All of it comes back from an install, a build, or a re-download, and
including it would turn a few-megabyte nightly delta into gigabytes.

**Secrets.** See step 6.

## Publishing, so a restore does not surprise you

A push to `origin/main` of the **site** repo deploys the live site through
GitHub Actions. A push to `origin/main` of the **data** repo ships
`docs/climate.json`, `docs/shapes.json` and the journal photos to the live site
through its own lane. Feature branches trigger nothing, which is why unpublished
work is pushed to a branch or to the Drive mirror and never to `main`.
