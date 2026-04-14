param(
    [Parameter(Mandatory = $true)]
    [string]$Title,

    [string]$Topic = "开发",

    [string]$Summary = "这里写一段简短摘要。",

    [string]$Description = "这里写页面描述。",

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
    throw "文件已存在：$targetPath"
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
read_time: '5 分钟'
summary: '$safeSummary'
description: '$safeDescription'
---

## 第一节

这里开始写正文。

- 要点一
- 要点二

> 这里可以补一句重点说明。
"@

[System.IO.File]::WriteAllText($targetPath, $content, [System.Text.UTF8Encoding]::new($false))
Write-Host "已创建文章文件：$targetPath"
if ($Publish) {
    Write-Host "状态：已直接发布到 _posts/"
} else {
    Write-Host "状态：已在 _drafts/ 中创建草稿"
}
