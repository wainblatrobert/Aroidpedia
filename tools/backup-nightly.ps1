<#
  backup-nightly.ps1  —  Aroidpedia off-machine backup, v1 (9.7.26)

  WHY. The two working repos and the climate scratch folder live only on this
  laptop. Git protects what is COMMITTED and PUSHED; this script covers the two
  gaps: (a) commits that exist locally but must not go to origin yet, because a
  push to either origin/main publishes (the site deploys, the data repo's
  journal-photos lane ships docs/climate.json + docs/shapes.json), and
  (b) files git never sees — uncommitted edits, the climate scratch folder,
  and the Claude memory notes.

  WHAT IT DOES, in order, every night:
    1. git push --mirror  ->  a BARE repo on Google Drive, one per repo.
       Incremental: only new objects move, so a quiet day is a few MB. A bare
       mirror on Drive triggers no GitHub workflow and needs no login.
    2. robocopy /MIR      ->  the working files git cannot carry, minus the
       heavy regenerable folders (node_modules, dist*, capture, caches).
    3. writes STATUS.txt beside the backups: what ran, when, and every repo's
       unpushed-commit and dirty-file count, so a glance says whether the
       laptop is holding work nothing else has.

  Drive for desktop uploads in the background afterwards; nothing here waits
  on the network, which is why this is a nightly copy and not a live sync.

  RESTORE: see RESTORE.md beside the mirrors on Drive.

  Run by hand:      powershell -ExecutionPolicy Bypass -File <this file>
  Scheduled task:   AroidpediaNightlyBackup   (schtasks /query /tn AroidpediaNightlyBackup)
#>

$ErrorActionPreference = 'Continue'
$Root    = 'G:\My Drive\PlantsV2\Aroidpedia\BACKUPS'
$Mirrors = Join-Path $Root 'git-mirrors'
$Work    = Join-Path $Root 'working-files'
$Log     = Join-Path $Root 'backup.log'
$Status  = Join-Path $Root 'STATUS.txt'
$Started = Get-Date

function Say($msg) {
  $line = "{0}  {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $msg
  Write-Output $line
  Add-Content -Path $Log -Value $line -Encoding utf8
}

Say "=== backup run started ==="

# Drive must actually be mounted. A missing G: would otherwise make robocopy
# /MIR "helpfully" create an empty tree, and a mirror of nothing is worse than
# no backup at all because STATUS.txt would look healthy.
if (-not (Test-Path $Mirrors)) {
  Say "ABORT: $Mirrors is not reachable — is Google Drive running?"
  exit 1
}

# ---- 1. git mirrors ------------------------------------------------------
$repos = @('Aroidpedia', 'aroidpedia-site')
foreach ($r in $repos) {
  $src = "C:\Users\nli0490\Claude\$r"
  if (-not (Test-Path $src)) { Say "SKIP $r (no such folder)"; continue }
  Push-Location $src
  $out = & git push --mirror backup 2>&1 | Out-String
  if ($LASTEXITCODE -eq 0) {
    Say ("git mirror OK   {0}" -f $r)
  } else {
    Say ("git mirror FAIL {0} — {1}" -f $r, ($out.Trim() -replace '\s+', ' '))
  }
  Pop-Location
}

# ---- 2. working files ----------------------------------------------------
# Each entry: source, destination leaf, extra excluded directory names.
# The exclusions are all REGENERABLE (installed, built, or re-downloaded) and
# together they are ~5 GB of the ~9 GB on disk.
$copies = @(
  @{ From = 'C:\Users\nli0490\Claude\aroidpedia-climate'
     To   = 'aroidpedia-climate'
     Skip = @('node_modules', '.git', 'ne-cache', 'ne-cache-hd', 'climate-cache', 'powo-cache') },

  @{ From = 'C:\Users\nli0490\.claude\projects\C--Users-nli0490-Claude\memory'
     To   = 'claude-memory'
     Skip = @() },

  # The two repos' UNCOMMITTED state. Git mirrors carry commits only, and the
  # site's main checkout habitually holds edited shared files (nav.json,
  # genus-media.json…) that are not committed anywhere.
  @{ From = 'C:\Users\nli0490\Claude\aroidpedia-site'
     To   = 'aroidpedia-site-worktree'
     Skip = @('node_modules', '.git', 'dist', 'dist-agent-repro1', 'dist-agent-repro2',
              'dist-agent-morph', 'dist-agent-ident', 'capture', '.astro', '.wrangler') },

  @{ From = 'C:\Users\nli0490\Claude\aroidpedia-site-scindapsus'
     To   = 'aroidpedia-site-scindapsus-worktree'
     Skip = @('node_modules', '.git', 'dist', '.astro', '.wrangler') },

  @{ From = 'C:\Users\nli0490\Claude\Aroidpedia'
     To   = 'Aroidpedia-worktree'
     Skip = @('node_modules', '.git', 'staging') }
)

# SECRETS ARE DELIBERATELY NOT BACKED UP. Aroidpedia\.env holds live Cloudflare
# R2 keys and says in its own first lines never to copy it around; a nightly
# push into a synced cloud folder is exactly that. Losing it costs one visit to
# the R2 token screen (RESTORE.md says which keys), whereas losing the WORK is
# unrecoverable — so the conservative default protects the work and regenerates
# the keys. To back them up anyway, delete the '/XF' line below.
$SecretFiles = @('.env', '*.env', '*credentials*.json', '*service-account*.json', '*.pem', '*.key')

foreach ($c in $copies) {
  if (-not (Test-Path $c.From)) { Say ("SKIP {0} (no such folder)" -f $c.From); continue }
  $dest = Join-Path $Work $c.To
  $args = @($c.From, $dest, '/MIR', '/NFL', '/NDL', '/NJH', '/NJS', '/NP', '/R:1', '/W:1', '/MT:8')
  $args += '/XF'; $args += $SecretFiles
  if ($c.Skip.Count) { $args += '/XD'; $args += $c.Skip }
  & robocopy @args | Out-Null
  # robocopy exit codes: 0-7 are success (8+ = real failure). 1 = files copied,
  # 2 = extras removed, 3 = both, and so on — treating those as errors is the
  # classic robocopy-in-a-script bug.
  if ($LASTEXITCODE -lt 8) {
    Say ("files OK        {0}  (robocopy {1})" -f $c.To, $LASTEXITCODE)
  } else {
    Say ("files FAIL      {0}  (robocopy {1})" -f $c.To, $LASTEXITCODE)
  }
}

# ---- 3. status readout ---------------------------------------------------
# The number that matters is "commits this laptop holds and GitHub does not".
$lines = @()
$lines += "AROIDPEDIA BACKUP STATUS"
$lines += ("last run   : {0}" -f $Started.ToString('yyyy-MM-dd HH:mm:ss'))
$lines += ("duration   : {0:n0}s" -f ((Get-Date) - $Started).TotalSeconds)
$lines += ""
foreach ($r in $repos) {
  $src = "C:\Users\nli0490\Claude\$r"
  if (-not (Test-Path $src)) { continue }
  Push-Location $src
  $branch  = (& git branch --show-current) 2>$null
  $dirty   = ((& git status --porcelain) 2>$null | Measure-Object).Count
  $unpush  = @()
  foreach ($b in (& git for-each-ref --format='%(refname:short)' refs/heads)) {
    $up = (& git rev-parse --abbrev-ref "$b@{upstream}" 2>$null)
    if ($LASTEXITCODE -ne 0 -or -not $up) { $unpush += "$b (no origin branch)"; continue }
    $n = (& git rev-list --count "$up..$b" 2>$null)
    if ($n -and [int]$n -gt 0) { $unpush += "$b (+$n)" }
  }
  Pop-Location
  $lines += ("{0}" -f $r)
  $lines += ("  branch          : {0}" -f $branch)
  $lines += ("  uncommitted     : {0} file(s)" -f $dirty)
  $lines += ("  not on GitHub   : {0}" -f $(if ($unpush.Count) { $unpush -join ', ' } else { 'nothing' }))
}
$lines += ""
$lines += "Everything above IS in the Drive mirror beside this file."
$lines += "'not on GitHub' is the work that would be lost if this laptop and Drive both went."
$lines += "To restore on a new machine: see RESTORE.md in this folder."
Set-Content -Path $Status -Value ($lines -join [Environment]::NewLine) -Encoding utf8

Say ("=== backup run finished in {0:n0}s ===" -f ((Get-Date) - $Started).TotalSeconds)
