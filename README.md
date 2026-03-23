# YMZ Blog

一个适合直接部署到 GitHub Pages 的个人博客，现已改成 **Jekyll + Markdown 发文**，并支持 **草稿 -> 手动发布**。

## 日常发文流程

### 方式 1：先写草稿，再手动发布

先创建草稿：

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\new-post.ps1 -Title "我的新文章" -Topic "开发" -Summary "这里写摘要" -Description "这里写描述"
```

这会在 `D:\code\YMZ1998.github.io\_drafts\` 下生成一个 Markdown 草稿。

写完后手动发布：

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\publish-post.ps1 -Draft "我的新文章.md"
```

如果草稿文件名已经变成 slug，也可以这样：

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\publish-post.ps1 -Draft "wo-de-xin-wen-zhang.md"
```

发布后脚本会：

- 自动把草稿移动到 `D:\code\YMZ1998.github.io\_posts\`
- 自动补成 `YYYY-MM-DD-title.md`
- 自动更新时间
- 首页自动读取这篇文章

### 方式 2：直接创建已发布文章

如果你不需要草稿阶段，可以直接创建到 `_posts`：

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\new-post.ps1 -Title "我的新文章" -Publish
```

## 手动新建 Markdown 文件

你也可以直接在 `D:\code\YMZ1998.github.io\_posts\` 目录新建一个 Markdown 文件，文件名必须符合：

```text
YYYY-MM-DD-title.md
```

例如：

```text
_posts/2026-03-23-my-new-post.md
```

## 文章模板

```md
---
layout: post
title: "你的文章标题"
date: 2026-03-23 20:00:00 +0800
topic: 开发
read_time: 5 分钟
summary: 这是一段会展示在首页卡片上的摘要。
description: 这是一段用于页面描述的文本。
---

## 第一节标题

这里开始写正文。

- 支持列表
- 支持代码块
- 支持引用

```text
示例代码
```

> 这是一段引用
```

## 发布步骤

本地准备好文章后，提交并推送：

```powershell
git add .
git commit -m "add new post"
git push origin main
```

GitHub Pages 会自动构建并发布，首页会自动显示新文章。

## 手动部署

仓库里新增了 GitHub Actions 工作流：`D:\code\YMZ1998.github.io\.github\workflows\pages.yml:1`

它支持两种方式：

- 推送到 `main` 后自动部署
- 在 GitHub 仓库的 **Actions** 页面手动点击 **Run workflow** 部署

这样即使你只是想手动重新发布一次站点，也不需要改代码。

## 当前结构

- `_config.yml`：Jekyll 配置
- `_layouts/default.html`：全站布局
- `_layouts/post.html`：文章页布局
- `_drafts/`：草稿目录
- `_posts/`：Markdown 文章目录
- `index.html`：首页，会自动读取文章列表
- `tools/new-post.ps1`：新建草稿或直接发布文章
- `tools/publish-post.ps1`：把草稿手动发布到 `_posts`
- `.github/workflows/pages.yml`：GitHub Pages 自动/手动部署
- `styles.css`：样式
- `script.js`：主题切换、筛选、滚动进度条

## 本地预览

如果你本机安装了 Ruby 和 Bundler，可以用 Jekyll 本地预览；如果没有，也可以直接推送到 GitHub Pages 查看结果。
