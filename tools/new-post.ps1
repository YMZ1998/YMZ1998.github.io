param(
    [Parameter(Mandatory = $true)]
    [string]$Title,

    [string]$Topic = "dev",

    [string]$Summary = "Add a short summary here.",

    [string]$Description = "Add a page description here.",

    [switch]$Publish,

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
        $slug = "post-" + $Date.ToString("yyyyMMdd-HHmmss")
    }

    return $slug
}

function Convert-ToYamlSingleQuoted {
    param([string]$Text)
    return $Text -replace "'", "''"
}

$root = Split-Path -Parent $PSScriptRoot
$slug = Convert-ToSlug -Text $Title
$targetDir = if ($Publish) { Join-Path $root "_posts" } else { Join-Path $root "_drafts" }
$fileName = if ($Publish) {
    "{0}-{1}.md" -f $Date.ToString("yyyy-MM-dd"), $slug
} else {
    "{0}.md" -f $slug
}
$targetPath = Join-Path $targetDir $fileName

if (Test-Path $targetPath) {
    throw "File already exists: $targetPath"
}

if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir | Out-Null
}

$safeTitle = Convert-ToYamlSingleQuoted $Title
$safeTopic = Convert-ToYamlSingleQuoted $Topic
$safeSummary = Convert-ToYamlSingleQuoted $Summary
$safeDescription = Convert-ToYamlSingleQuoted $Description
$dateString = $Date.ToString("yyyy-MM-dd HH:mm:ss zzz")

$content = @"
---
layout: post
title: '$safeTitle'
date: $dateString
topic: '$safeTopic'
read_time: '5 min'
summary: '$safeSummary'
description: '$safeDescription'
---

## Section Title

Start writing here.

- Key point one
- Key point two

> Add an important quote here.
"@

[System.IO.File]::WriteAllText($targetPath, $content, [System.Text.UTF8Encoding]::new($false))
Write-Host "Created post file: $targetPath"
if ($Publish) {
    Write-Host "Status: published directly to _posts"
} else {
    Write-Host "Status: draft created in _drafts"
}
