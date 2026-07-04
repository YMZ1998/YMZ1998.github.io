---
title: CBCT-to-CT
summary: 当前投入最多的研究主线，围绕 CBCT 到 pseudo CT 的数据处理、模型训练、结果验证和工程复盘展开。
status: 在做
stack:
  - Python
  - PyTorch
  - Medical Imaging
order: 1
repo_url: https://github.com/YMZ1998/CBCT-to-CT
cover: /assets/photography/nature-light.svg
featured: true
period: 2024 - 至今
---

`CBCT-to-CT` 是我目前投入最多的一条研究主线。它不只是一个模型实验，更像一套需要长期维护的流程：数据如何进入训练、结果如何验证、问题如何复现，都会直接影响后续迭代。

## 我把它当成长期项目的原因

CBCT 到 pseudo CT 的任务一半是方法问题，一半是工程问题。模型结构固然重要，但数据整理、训练配置、结果检查和实验记录同样决定了项目能不能持续推进。

## 当前更关注的部分

- 数据如何稳定接入训练流程；
- 结果如何评估，而不是只凭图像“像不像”；
- 实验配置、日志和中间结果如何留下可追溯记录；
- 项目结构如何支持后续继续迭代。

## 后续会继续记录什么

后续会继续补充方法路线、实验取舍、结果展示和工程整理。这个页面的目标不是替代仓库 README，而是为整个项目留下一份更接近研究笔记的上下文。
