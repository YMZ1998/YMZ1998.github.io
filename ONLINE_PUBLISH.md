# 在线发布指南

如果你想直接在 GitHub 网页上发文，这是最简单的方法。

## 方法一：在线新建文章

1. 打开你的仓库：
   [https://github.com/YMZ1998/YMZ1998.github.io](https://github.com/YMZ1998/YMZ1998.github.io)
2. 进入 `_posts` 目录。
3. 点击右上角 `Add file` -> `Create new file`。
4. 文件名填写：

   ```text
   2026-03-24-my-new-post.md
   ```

5. 打开根目录里的 `POST_TEMPLATE.md`，复制模板内容。
6. 粘贴到新文件中，修改标题、摘要、正文。
7. 点击 `Commit changes`。
8. 如果直接提交到 `main`，GitHub Pages 会自动发布。

## 方法二：在线修改已有文章

1. 在 `_posts` 目录打开已有文章。
2. 点击铅笔图标 `Edit this file`。
3. 修改 Markdown 内容。
4. 点击 `Commit changes`。

## 建议做法

- 想先保存但不立刻上线：先在 `_drafts` 目录创建草稿
- 想正式发布：再把草稿内容复制到 `_posts/日期-slug.md`
- 想重新部署但不改内容：去 GitHub 的 `Actions` 页面手动运行部署工作流

## 最重要的规则

- 发布文章必须放在 `_posts`
- 文件名必须是 `YYYY-MM-DD-title.md`
- 文件开头必须保留 front matter：

```md
---
layout: post
title: "文章标题"
date: 2026-03-23 20:00:00 +0800
topic: 开发
read_time: 5 分钟
summary: 摘要
description: 描述
---
```

## 发布后多久生效

- 一般几分钟内会更新
- 如果没看到新文章，可以去仓库的 `Actions` 页面检查部署状态
