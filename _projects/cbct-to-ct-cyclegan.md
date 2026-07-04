---
title: CBCT-to-CT-CycleGAN
summary: 围绕 CycleGAN 在 CBCT 到 CT 图像转换任务中的可行性、训练稳定性和工程边界做方法实验。
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

这个项目是一条独立的方法实验线。它关注的不只是 CycleGAN 能不能跑起来，还包括这条路线适合解决什么问题、在哪些条件下会变得不稳定，以及它和主线项目之间应该如何分工。

## 这条线的意义

在图像到图像翻译任务里，CycleGAN 是一条相对直接的路线。它适合用来快速摸清数据、损失设计、训练稳定性和结果解释上的问题，也能帮助判断后续是否值得继续沿这条方向深入。

## 我更在意的不是模型名

我更想保留下来的，是实验如何判断、代码如何组织、失败结果如何解释，以及一个方法从论文或示例代码进入真实工程后，问题通常会从哪里冒出来。
