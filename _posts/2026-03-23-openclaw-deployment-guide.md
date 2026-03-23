---
layout: post
title: "OpenClaw 部署教程：在 Linux 服务器上完成安装、常驻与远程访问"
date: 2026-03-23 21:00:00 +0800
topic: 工程
read_time: 9 分钟
summary: 按官方推荐路径，把 OpenClaw 部署到 Linux/VPS：安装运行时、完成 onboarding、挂成 systemd 服务，并通过 SSH 隧道远程访问控制界面。
description: 基于官方文档整理一套 OpenClaw Linux 部署流程，覆盖安装、服务化、SSH 隧道、控制台访问、更新与排障。
---

> 本文基于 2026-03-23 查阅的 OpenClaw 官方文档整理，优先采用官方目前推荐的 Linux / VPS 路径。

## 为什么我更推荐 Linux / VPS 部署

如果只是本机临时体验，直接在桌面设备上跑当然也可以。  
但如果你想要的是一个更稳定、长期在线、可以远程连回来的 OpenClaw 实例，那么把 Gateway 放在 Linux 服务器上会更省心。

官方目前给 Linux 的推荐快速路径也很直接：

1. 安装 Node 24；
2. 全局安装 `openclaw`；
3. 运行 `openclaw onboard --install-daemon`；
4. 本地通过 SSH 隧道转发 `18789` 端口；
5. 在浏览器打开控制界面并完成认证。

这套流程的好处是：

- 部署路径简单，基本不需要自己拼 systemd 文件；
- Gateway 可以常驻运行，不依赖你一直挂着终端；
- 控制界面默认走本地回环 + SSH 隧道，安全边界更清晰；
- 后续更新、排障、备份都有官方命令可以接上。

## 部署前准备

先明确本文的目标环境：

- 一台 Linux 服务器或 VPS；
- 你有这个机器的 SSH 权限；
- 服务器可以正常访问外网；
- 本地电脑可以通过 SSH 连接这台机器。

官方文档当前建议：

- Node 24 为推荐版本；
- Node 22 LTS 也仍然兼容，但建议优先按 Node 24 来装；
- Bun 不作为 Gateway 的推荐运行时。

如果你是 Windows 用户，官方仍然更推荐在 WSL2 里运行 OpenClaw，而不是直接在原生 Windows 环境里部署 Gateway。

## 第一步：安装 Node.js 与 OpenClaw

最稳妥的方式，是直接按官方安装脚本来：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

如果你更想自己掌控安装过程，也可以先安装 Node，再通过 npm 全局安装：

```bash
npm i -g openclaw@latest
```

这里我更建议记住两点：

- 如果你只是想“尽快跑起来”，优先用官方安装脚本；
- 如果你在维护自己的服务器环境，已经有 Node 和 npm 规范，那就用 `npm i -g openclaw@latest`。

安装完成后，先确认 CLI 可用：

```bash
openclaw --help
```

## 第二步：运行 onboarding，并顺手安装常驻服务

Linux 上最关键的一步，不是“能跑起来”，而是“跑起来以后能一直活着”。  
所以这里直接使用官方推荐命令：

```bash
openclaw onboard --install-daemon
```

这个命令会把几件事尽量一次做完：

- 引导你完成 OpenClaw 的基础配置；
- 初始化 Gateway 相关设置；
- 安装 systemd user service；
- 尽可能帮你把 Gateway 挂成常驻服务。

如果你后面想单独处理服务安装，也可以用这些官方命令：

```bash
openclaw gateway install
```

或者：

```bash
openclaw configure
```

然后在交互里选择 Gateway service。

## 第三步：确认 Gateway 真的在后台运行

很多“部署完成但打不开”的问题，根本原因不是网络，而是服务根本没起来。  
所以在继续之前，先做基础检查：

```bash
openclaw gateway status
openclaw health
```

如果一切正常，你应该已经有一个运行中的 Gateway，并且它默认监听本机回环地址上的 `18789` 端口。

官方文档也提到，Linux 默认使用的是 `systemd user service`。  
这意味着如果你的系统没有启用 lingering，某些环境下用户退出后服务可能会被 systemd 停掉。

如果你发现服务在退出登录后消失，可以执行：

```bash
sudo loginctl enable-linger $USER
```

这一步特别适合 VPS 场景，不然你会遇到一种很烦的情况：  
看起来服务装好了，但人一断开 SSH，它也跟着没了。

## 第四步：从本地电脑建立 SSH 隧道

官方最推荐的远程访问方式，不是直接把控制界面暴露到公网，而是保留 Gateway 在回环地址上监听，然后从本地用 SSH 隧道接进去。

在你的本地电脑上执行：

```bash
ssh -N -L 18789:127.0.0.1:18789 <user>@<host>
```

如果你没有改默认端口，那么这条命令的意思就是：

- 把你本地的 `127.0.0.1:18789`
- 转发到远程服务器上的 `127.0.0.1:18789`

这样一来，虽然 OpenClaw 实际跑在服务器上，但你本地浏览器访问时会像在访问本机一样。

这也是我比较喜欢的一点：  
部署和访问是分开的。服务继续待在服务器上，控制入口只在你需要的时候通过 SSH 临时打通。

## 第五步：打开控制界面并完成认证

SSH 隧道建好以后，在本地浏览器打开：

```text
http://127.0.0.1:18789/
```

如果页面提示未授权，说明 Gateway 认证是开启的——这其实是正常且更安全的状态。  
官方文档当前的推荐方式是使用 `openclaw dashboard` 重新打开 Dashboard；如果界面仍然要求认证，就把 `gateway.auth.token`（或 `OPENCLAW_GATEWAY_TOKEN`）粘贴到 Control UI 设置里。

在实际使用里，我建议这样理解：

- 本地回环地址不等于“天然免认证”；
- 即使通过 SSH 隧道访问，Gateway 如果配置了 token，客户端仍然要带上 token；
- 控制界面属于管理员入口，不应该直接裸露到公网。

如果你只是快速验证连通性，最直接的方式是先在服务器上执行：

```bash
openclaw dashboard
```

然后使用它输出的 Dashboard 链接，并在需要时填入 token 完成首次登录。

## 第六步：理解文件会落在哪里

部署完成后，很多关键状态都不在项目仓库里，而是在 OpenClaw 自己的状态目录中。  
这对后续备份和排障非常重要。

官方文档提到的几个重点位置：

- 配置文件：`~/.openclaw/openclaw.json`
- 工作区：`~/.openclaw/workspace`
- 凭据目录：`~/.openclaw/credentials/`

另外，首次 agent 运行时，默认工作区也会被自动初始化。官方文档目前提到的默认工作区是：

```text
~/.openclaw/workspace
```

其中通常会出现这些基础文件：

- `AGENTS.md`
- `SOUL.md`
- `TOOLS.md`
- `IDENTITY.md`
- `USER.md`
- `HEARTBEAT.md`

如果你的 Gateway 跑在远程服务器上，这些文件也都在远程主机上，而不是在你的本地电脑上。  
所以后续你要改 workspace、技能、记忆或提示词时，应该登录到服务器那边去处理。

## 第七步：后续更新怎么做

OpenClaw 迭代很快，所以部署完成以后，更新路径最好一开始就想清楚。  
如果你是 npm 全局安装，官方推荐的更新方式是：

```bash
npm i -g openclaw@latest
openclaw doctor
openclaw gateway restart
openclaw health
```

如果你想用官方统一更新入口，也可以直接：

```bash
openclaw update
```

更新这件事最好别只做一半。  
比较稳的顺序通常是：

1. 更新；
2. 跑 `openclaw doctor`；
3. 重启 Gateway；
4. 用 `openclaw health` 再确认一次。

## 第八步：几个最常见的问题

### 1. 浏览器打不开控制界面

优先按这个顺序查：

```bash
openclaw gateway status
openclaw health
```

然后确认本地 SSH 隧道是否还开着。

### 2. 页面能打开，但提示 unauthorized

这通常不是服务挂了，而是 token 没带上。  
可以重新运行：

```bash
openclaw dashboard
```

然后把 `gateway.auth.token` 粘贴进 Dashboard 设置里再试一次。

### 3. SSH 断开后服务也没了

大概率是 Linux 的 user service 没有正确启用 lingering：

```bash
sudo loginctl enable-linger $USER
```

### 4. 升级后行为异常

先不要急着重装，优先执行：

```bash
openclaw doctor
openclaw gateway restart
openclaw health
```

如果还不行，再去看日志。

### 5. 想看 Linux 上的服务日志

官方 FAQ 给出的常用排障命令是：

```bash
journalctl --user -u openclaw-gateway -n 200 --no-pager
```

如果你用了带 profile 的服务名，再把 unit 名称替换成对应的 `openclaw-gateway-<profile>`。

## 一条适合照着执行的最小部署路径

如果你只想先把 OpenClaw 部署成功，不想一开始就研究所有配置，那么我建议按下面这个最小流程走：

```bash
# 服务器上
npm i -g openclaw@latest
openclaw onboard --install-daemon
openclaw gateway status
openclaw health
```

```bash
# 本地电脑上
ssh -N -L 18789:127.0.0.1:18789 <user>@<host>
```

然后在本地浏览器打开：

```text
http://127.0.0.1:18789/
```

这套路径的优点是足够短，但又没有牺牲掉后续扩展性。  
等你把第一套实例跑稳了，再去接 Telegram、Discord、Tailscale、插件和多 agent，会更从容。

## 最后

我觉得 OpenClaw 这种项目，最容易卡住人的地方并不是“怎么安装包”，而是“怎么把它部署成一个稳定、长期在线、还能安全访问的服务”。  
一旦把 Linux 常驻、SSH 隧道和控制界面这一层理顺，后面的事情会简单很多。

如果后面我继续写这个主题，我会更想补三类内容：

- OpenClaw 接入具体聊天渠道的流程；
- 远程 Gateway 和本地工作区如何协同；
- 更新、备份和回滚的一套更稳的维护策略。

## 参考资料

- [OpenClaw 官方仓库](https://github.com/openclaw/openclaw)
- [Linux App 文档](https://docs.openclaw.ai/platforms/linux)
- [Remote Access 文档](https://docs.openclaw.ai/gateway/remote)
- [Dashboard 文档](https://docs.openclaw.ai/dashboard)
- [Updating 文档](https://docs.openclaw.ai/updating)
