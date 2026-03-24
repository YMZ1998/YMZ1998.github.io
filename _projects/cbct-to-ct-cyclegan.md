---
title: CBCT-to-CT-CycleGAN
summary: 用 CycleGAN 路线验证 CBCT 到 CT 图像翻译时的方法选择与训练稳定性。
status: 实验中
stack:
  - Python
  - CycleGAN
  - Image Translation
order: 2
repo_url: https://github.com/YMZ1998/CBCT-to-CT-CycleGAN
cover: /assets/photography/street-moment.svg
featured: true
period: 2024 - 2025
---

这个项目更像是一条明确的方法实验线。它的价值不只是“做了一个 CycleGAN 版本”，而是把为什么选择这种路线、它解决了什么、又留下了什么问题写清楚。

## 这条线的意义

在图像到图像翻译任务里，CycleGAN 代表一种非常直接的方法选择。它适合用来快速暴露任务边界，也能帮助我验证数据组织、训练稳定性和输出判断这些现实问题。

## 我更在意的不是模型名

真正需要记录的，是项目如何被组织、实验如何被判断，以及当一个方法进入工程实现之后，哪些问题才开始显现出来。
