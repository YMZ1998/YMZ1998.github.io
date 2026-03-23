# YMZ Blog

一个适合直接部署到 GitHub Pages 的个人博客模板，当前仓库不依赖构建工具，打开即用。

## 文件结构

- `index.html`：首页，包含介绍、文章、项目、联系方式。
- `styles.css`：全站样式，含响应式布局与深浅色主题。
- `script.js`：主题切换、文章筛选、滚动进度条、年份自动更新。
- `posts/`：示例文章页面。
- `favicon.svg`：站点图标。

## 本地预览

直接双击 `index.html` 即可浏览，或在仓库目录运行：

```powershell
python -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 自定义建议

1. 修改 `index.html` 中的个人介绍、项目、联系方式。
2. 在 `posts/` 下新增文章页面，并在首页“最近文章”区域补充卡片。
3. 如果要绑定到 GitHub Pages，保持仓库名为 `YMZ1998.github.io` 即可作为用户主页站点。
