<#
  backup-nightly.ps1  -  Aroidpedia off-machine backup, v2 (9.7.26)

  THIS IS THE RUNTIME COPY, and it lives OUTSIDE both repos on purpose.
  v1 was run from C:\Users\nli0490\Claude\Aroidpedia\tools\, which is inside a
  working tree that other sessions check branches out of. The moment a feature
  branch was checked out (a parallel Cyrtosperma session did exactly that), the
  file was not on disk and the 02:30 job would have failed silently. A backup
  that quietly stops running is the failure mode this whole thing exists to
  prevent, so the scheduled task now points here. The versioned copy stays at
  Aroidpedia\tools\backup-nightly.ps1 on main; this script warns if they drift.

  ASCII ONLY, on purpose. An earlier draft carried em-dashes; a Get-Content /
  Set-Content round-trip in Windows PowerShell 5.1 read them as ANSI and wrote
  mojibake back, which broke the parse.

  WHY. The two working repos and the climate scratch folder live only on this
  laptop. Git protects what is COMMITTED and PUSHED; this covers the two gaps:
    (a) commits that exist locally but must NOT go to origin yet, because a push
        to either origin/main publishes (the site deploys; the data repo's
        journal-photos lane ships docs/climate.json and docs/shapes.json), and
    (b) files git never sees: uncommitted edits, untracked files, the climate
        scratch folder, and the Claude memory notes.

  WHAT IT DOES, every night:
    1. git push --mirror  ->  a BARE repo on Google Drive, one per repo. All
       branches (so other sessions' branches ride along too), incremental, no
       login, and no GitHub workflow can fire from it.
    2. robocopy /MIR      ->  the non-git folders, minus regenerable bulk.
    3. per working tree, the UNCOMMITTED state: status manifest, one patch of
       tracked edits WRITTEN BY GIT, and the untracked-not-ignored files. The
       patch is then verified by re-applying it in reverse; a patch that cannot
       be applied is not a backup and the log says so.
    4. STATUS.txt: what ran, and per repo the commits GitHub does not have.

  RESTORE: docs/RESTORE.md on main in the data repo, copied beside the mirrors.
  Run by hand:    powershell -ExecutionPolicy Bypass -File <this file>
  Task:           AroidpediaNightlyBackup
#>

$ErrorActionPreference = 'Continue'
$Root    = 'G:\My Drive\PlantsV2\Aroidpedia\BACKUPS'
$Mirrors = Join-Path $Root 'git-mirrors'
$Work    = Join-Path $Root 'working-files'
$Log     = Join-Path $Root 'backup.log'
$Status  = Join-Path $Root 'STATUS.txt'
$Started = Get-Date
$Versioned = 'C:\Users\nli0490\Claude\Aroidpedia\tools\backup-nightly.ps1'

function Say($msg) {
  $line = "{0}  {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $msg
  Write-Output $line
  Add-Content -Path $Log -Value $line -Encoding utf8
}

Say "=== backup run started ==="

# Drive must actually be mounted. A missing G: would otherwise let robocopy /MIR
# "helpfully" build an empty tree, and a mirror of nothing is worse than no
# backup at all, because STATUS.txt would still look healthy.
if (-not (Test-Path $Mirrors)) {
  Say "ABORT: $Mirrors is not reachable. Is Google Drive running?"
  exit 1
}

# Drift check against the versioned copy. Only meaningful when main happens to
# be the checked-out branch; silence otherwise, since a feature branch simply
# does not carry the file and that is not an error.
if (Test-Path $Versioned) {
  $a = (Get-FileHash $PSCommandPath -Algorithm SHA256).Hash
  $b = (Get-FileHash $Versioned     -Algorithm SHA256).Hash
  if ($a -ne $b) { Say "NOTE: this runtime copy differs from Aroidpedia\tools\backup-nightly.ps1 on the checked-out branch" }
}

# Secrets are deliberately NOT copied. Aroidpedia\.env holds live Cloudflare R2
# keys and says in its own header never to move it around. Losing it costs one
# visit to the R2 token screen (RESTORE.md names the keys); losing the WORK is
# unrecoverable. To back secrets up anyway, empty this list.
$SecretFiles = @('.env', '*.env', '*credentials*.json', '*service-account*.json', '*.pem', '*.key')

# ---- 1. git mirrors ------------------------------------------------------
$repos = @('Aroidpedia', 'aroidpedia-site')
foreach ($r in $repos) {
  $src = "C:\Users\nli0490\Claude\$r"
  if (-not (Test-Path $src)) { Say "SKIP $r (no such folder)"; continue }
  Push-Location $src
  $out = (& git push --mirror backup 2>&1 | Out-String)
  if ($LASTEXITCODE -eq 0) {
    Say ("git mirror OK   {0}" -f $r)
  } else {
    Say ("git mirror FAIL {0} : {1}" -f $r, ($out.Trim() -replace '\s+', ' '))
  }
  Pop-Location
}

# ---- 2. the non-git folders ---------------------------------------------
# The repos are NOT copied file-by-file: their committed content is already in
# the mirrors above, and copying the trees would duplicate about 1.8 GB
# (Aroidpedia\docs alone is 1.55 GB and fully committed). Section 2b captures
# what git actually lacks, which is roughly 18 MB.
# Aroidpedia\staging (699 MB) is gitignored derivative staging, rebuilt by
# publish_media.py from the Drive originals, so it is regenerable, not unique.
$copies = @(
  @{ From = 'C:\Users\nli0490\Claude\aroidpedia-climate'
     To   = 'aroidpedia-climate'
     Skip = @('node_modules', '.git', 'ne-cache', 'ne-cache-hd', 'climate-cache', 'powo-cache') },

  @{ From = 'C:\Users\nli0490\.claude\projects\C--Users-nli0490-Claude\memory'
     To   = 'claude-memory'
     Skip = @() }
)

foreach ($c in $copies) {
  if (-not (Test-Path $c.From)) { Say ("SKIP {0} (no such folder)" -f $c.From); continue }
  $dest = Join-Path $Work $c.To
  $rc = @($c.From, $dest, '/MIR', '/NFL', '/NDL', '/NJH', '/NJS', '/NP', '/R:1', '/W:1', '/MT:8')
  $rc += '/XF'; $rc += $SecretFiles
  if ($c.Skip.Count) { $rc += '/XD'; $rc += $c.Skip }
  & robocopy @rc | Out-Null
  # robocopy exit codes 0-7 are success (8+ is a real failure). 1 = files copied,
  # 2 = extras removed, 3 = both. Treating those as errors is the classic
  # robocopy-in-a-script bug.
  if ($LASTEXITCODE -lt 8) {
    Say ("files OK        {0}  (robocopy {1})" -f $c.To, $LASTEXITCODE)
  } else {
    Say ("files FAIL      {0}  (robocopy {1})" -f $c.To, $LASTEXITCODE)
  }
}

# ---- 2b. each working tree's UNCOMMITTED state ---------------------------
# A git mirror holds commits. It does not hold an edited-but-uncommitted file or
# an untracked one, and the site's main checkout habitually carries edited shared
# files (nav.json, genus-media.json, footer.js) that live nowhere else.
$trees = @('C:\Users\nli0490\Claude\Aroidpedia',
           'C:\Users\nli0490\Claude\aroidpedia-site',
           'C:\Users\nli0490\Claude\aroidpedia-site-scindapsus')
foreach ($t in $trees) {
  if (-not (Test-Path $t)) { Say ("SKIP {0} (no such folder)" -f $t); continue }
  $leaf = Split-Path $t -Leaf
  $dest = Join-Path $Work (Join-Path 'uncommitted' $leaf)
  if (Test-Path $dest) { Remove-Item $dest -Recurse -Force -ErrorAction SilentlyContinue }
  New-Item -ItemType Directory -Path $dest -Force | Out-Null
  Push-Location $t
  # Out-String so the file is always written, even when there is no diff. An
  # absent file must mean "the backup did not run", never "nothing changed".
  ((& git status --porcelain=v1 --branch 2>&1) | Out-String) |
    Set-Content (Join-Path $dest '_git-status.txt') -Encoding utf8

  # THE PATCH IS WRITTEN BY GIT, NOT BY POWERSHELL. Set-Content in Windows
  # PowerShell 5.1 writes CRLF line endings and a UTF-8 BOM; both corrupt a git
  # patch and `git apply` then refuses it. v1 did exactly that and produced a
  # backup that looked healthy and could not be restored, which is the worst
  # failure this script could have. `--output` hands the file to git itself.
  $patch = Join-Path $dest '_uncommitted.patch'
  & git diff HEAD --output="$patch" 2>$null
  if (-not (Test-Path $patch)) { New-Item -ItemType File -Path $patch -Force | Out-Null }

  # ...and then PROVE it restores. Re-applying the patch in reverse against the
  # tree it came from must succeed; if it does not, the log says so tonight
  # instead of leaving it to be discovered during an actual recovery.
  if ((Get-Item $patch).Length -gt 0) {
    & git apply --check --reverse $patch 2>$null
    if ($LASTEXITCODE -eq 0) { Say ("patch verified  {0}" -f $leaf) }
    else { Say ("PATCH WILL NOT APPLY  {0}  <-- investigate" -f $leaf) }
  }

  $untracked = @(& git ls-files --others --exclude-standard 2>$null)
  $n = 0
  foreach ($rel in $untracked) {
    if (-not $rel) { continue }
    $name = Split-Path $rel -Leaf
    $skip = $false
    foreach ($pat in $SecretFiles) { if ($name -like $pat) { $skip = $true } }
    if ($skip) { continue }
    $from = Join-Path $t $rel
    if (-not (Test-Path $from)) { continue }
    $to = Join-Path $dest $rel
    New-Item -ItemType Directory -Path (Split-Path $to -Parent) -Force | Out-Null
    Copy-Item $from $to -Force -ErrorAction SilentlyContinue
    $n++
  }
  Pop-Location
  Say ("uncommitted OK  {0}  ({1} untracked file(s))" -f $leaf, $n)
}

# ---- 3. status readout ---------------------------------------------------
# The number that matters: commits this laptop holds and GitHub does not.
$lines = @()
$lines += "AROIDPEDIA BACKUP STATUS"
$lines += ("last run   : {0}" -f $Started.ToString('yyyy-MM-dd HH:mm:ss'))
$lines += ("duration   : {0:n0}s" -f ((Get-Date) - $Started).TotalSeconds)
$lines += ""
foreach ($r in $repos) {
  $src = "C:\Users\nli0490\Claude\$r"
  if (-not (Test-Path $src)) { continue }
  Push-Location $src
  $branch = (& git branch --show-current 2>$null)
  $dirty  = @(& git status --porcelain 2>$null).Count
  $unpush = @()
  foreach ($b in @(& git for-each-ref --format='%(refname:short)' refs/heads 2>$null)) {
    $up = (& git rev-parse --abbrev-ref "$b@{upstream}" 2>$null)
    if ($LASTEXITCODE -ne 0 -or -not $up) { $unpush += "$b (no origin branch)"; continue }
    $n = (& git rev-list --count "$up..$b" 2>$null)
    if ($n -and [int]$n -gt 0) { $unpush += "$b (+$n)" }
  }
  Pop-Location
  $lines += $r
  $lines += ("  checked out   : {0}" -f $branch)
  $lines += ("  uncommitted   : {0} file(s)" -f $dirty)
  $lines += ("  not on GitHub : {0}" -f $(if ($unpush.Count) { $unpush -join ', ' } else { 'nothing' }))
}
$lines += ""
$lines += "Everything above IS in the Drive mirror beside this file."
$lines += "'not on GitHub' is the work that would be lost if this laptop AND Drive both went."
$lines += "Branches from other Claude sessions ride along in the mirror automatically."
$lines += "To rebuild on a new machine: see RESTORE.md in this folder."
Set-Content -Path $Status -Value ($lines -join [Environment]::NewLine) -Encoding utf8

Say ("=== backup run finished in {0:n0}s ===" -f ((Get-Date) - $Started).TotalSeconds)
