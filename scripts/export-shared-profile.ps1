$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$source = Join-Path $env:APPDATA "com.jannik.kontrollzentrum\profile.json"
$target = Join-Path $projectRoot "src-tauri\profile.shared.json"

if (-not (Test-Path $source)) {
  throw "Profile file not found at '$source'. Start the app and save data first."
}

Copy-Item -Path $source -Destination $target -Force
Write-Output "Exported profile to '$target'."
