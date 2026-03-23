param(
    [Parameter(Mandatory = $true)]
    [string]$Draft,

    [datetime]$Date = (Get-Date)
)

$ErrorActionPreference = "Stop"

function Convert-ToSlug {
    param([string]$Text)

    $slug = $Text.ToLowerInvariant()
    $slug = $slug -replace '[^\p{L}\p{Nd}]+', '-'
    $slug = $slug -replace '-{2,}', '-'
    $slug = $slug.Trim('-')

    if ([string]::IsNullOrWhiteSpace($slug)) {
        throw "Cannot build a slug for this draft."
    }

    return $slug
}

$root = Split-Path -Parent $PSScriptRoot
$draftsDir = Join-Path $root "_drafts"
$postsDir = Join-Path $root "_posts"

$draftPath = if (Test-Path $Draft) {
    (Resolve-Path $Draft).Path
} else {
    $candidate = Join-Path $draftsDir $Draft
    if (-not $candidate.EndsWith(".md")) {
        $candidate = "$candidate.md"
    }
    $candidate
}

if (-not (Test-Path $draftPath)) {
    throw "Draft file not found: $Draft"
}

$content = [System.IO.File]::ReadAllText($draftPath, [System.Text.Encoding]::UTF8)
if (-not $content.StartsWith("---")) {
    throw "Draft is missing front matter: $draftPath"
}

$titleMatch = [regex]::Match($content, "(?m)^title:\s*['""]?(.*?)['""]?\s*$")
$slugBase = if ($titleMatch.Success) {
    Convert-ToSlug $titleMatch.Groups[1].Value
} else {
    Convert-ToSlug ([System.IO.Path]::GetFileNameWithoutExtension($draftPath))
}

$dateLine = "date: {0}" -f $Date.ToString("yyyy-MM-dd HH:mm:ss zzz")
$updatedContent = if ($content -match "(?m)^date:\s+.*$") {
    [regex]::Replace($content, "(?m)^date:\s+.*$", $dateLine, 1)
} else {
    $content -replace "(?s)^---\r?\n", "---`r`n$dateLine`r`n"
}

if (-not (Test-Path $postsDir)) {
    New-Item -ItemType Directory -Path $postsDir | Out-Null
}

$targetPath = Join-Path $postsDir ("{0}-{1}.md" -f $Date.ToString("yyyy-MM-dd"), $slugBase)
if (Test-Path $targetPath) {
    throw "Published post already exists: $targetPath"
}

[System.IO.File]::WriteAllText($targetPath, $updatedContent, [System.Text.UTF8Encoding]::new($false))
Remove-Item $draftPath

Write-Host "Published post: $targetPath"
Write-Host "Removed draft: $draftPath"
