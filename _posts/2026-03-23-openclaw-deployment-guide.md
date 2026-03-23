---
layout: post
title: "OpenClaw 部署教程：在 Linux 服务器上完成安装、常驻与远程访问"
date: 2026-03-23 21:00:00 +0800
topic: 工程
read_time: 9 分钟
summary: 按官方推荐路径，把 OpenClaw 部署到 Linux/VPS：安装运行时、完成 onboarding、挂成 systemd 服务，并通过 SSH 隧道远程访问控制界面。
description: 基于官方文档整理一套 OpenClaw Linux 部署流程，覆盖安装、服务化、SSH 隧道、控制台访问、更新与排障。
---
> 鏈枃鍩轰簬 2026-03-23 鏌ラ槄鐨?OpenClaw 瀹樻柟鏂囨。鏁寸悊锛屼紭鍏堥噰鐢ㄥ畼鏂圭洰鍓嶆帹鑽愮殑 Linux / VPS 璺緞銆?
## 涓轰粈涔堟垜鏇存帹鑽?Linux / VPS 閮ㄧ讲

濡傛灉鍙槸鏈満涓存椂浣撻獙锛岀洿鎺ュ湪妗岄潰璁惧涓婅窇褰撶劧涔熷彲浠ャ€? 
浣嗗鏋滀綘鎯宠鐨勬槸涓€涓洿绋冲畾銆侀暱鏈熷湪绾裤€佸彲浠ヨ繙绋嬭繛鍥炴潵鐨?OpenClaw 瀹炰緥锛岄偅涔堟妸 Gateway 鏀惧湪 Linux 鏈嶅姟鍣ㄤ笂浼氭洿鐪佸績銆?
瀹樻柟鐩墠缁?Linux 鐨勬帹鑽愬揩閫熻矾寰勪篃寰堢洿鎺ワ細

1. 瀹夎 Node 24锛?2. 鍏ㄥ眬瀹夎 `openclaw`锛?3. 杩愯 `openclaw onboard --install-daemon`锛?4. 鏈湴閫氳繃 SSH 闅ч亾杞彂 `18789` 绔彛锛?5. 鍦ㄦ祻瑙堝櫒鎵撳紑鎺у埗鐣岄潰骞跺畬鎴愯璇併€?
杩欏娴佺▼鐨勫ソ澶勬槸锛?
- 閮ㄧ讲璺緞绠€鍗曪紝鍩烘湰涓嶉渶瑕佽嚜宸辨嫾 systemd 鏂囦欢锛?- Gateway 鍙互甯搁┗杩愯锛屼笉渚濊禆浣犱竴鐩存寕鐫€缁堢锛?- 鎺у埗鐣岄潰榛樿璧版湰鍦板洖鐜?+ SSH 闅ч亾锛屽畨鍏ㄨ竟鐣屾洿娓呮櫚锛?- 鍚庣画鏇存柊銆佹帓闅溿€佸浠介兘鏈夊畼鏂瑰懡浠ゅ彲浠ユ帴涓娿€?
## 閮ㄧ讲鍓嶅噯澶?
鍏堟槑纭湰鏂囩殑鐩爣鐜锛?
- 涓€鍙?Linux 鏈嶅姟鍣ㄦ垨 VPS锛?- 浣犳湁杩欎釜鏈哄櫒鐨?SSH 鏉冮檺锛?- 鏈嶅姟鍣ㄥ彲浠ユ甯歌闂缃戯紱
- 鏈湴鐢佃剳鍙互閫氳繃 SSH 杩炴帴杩欏彴鏈哄櫒銆?
瀹樻柟鏂囨。褰撳墠寤鸿锛?
- Node 24 涓烘帹鑽愮増鏈紱
- Node 22 LTS 涔熶粛鐒跺吋瀹癸紝浣嗗缓璁紭鍏堟寜 Node 24 鏉ヨ锛?- Bun 涓嶄綔涓?Gateway 鐨勬帹鑽愯繍琛屾椂銆?
濡傛灉浣犳槸 Windows 鐢ㄦ埛锛屽畼鏂逛粛鐒舵洿鎺ㄨ崘鍦?WSL2 閲岃繍琛?OpenClaw锛岃€屼笉鏄洿鎺ュ湪鍘熺敓 Windows 鐜閲岄儴缃?Gateway銆?
## 绗竴姝ワ細瀹夎 Node.js 涓?OpenClaw

鏈€绋冲Ε鐨勬柟寮忥紝鏄洿鎺ユ寜瀹樻柟瀹夎鑴氭湰鏉ワ細

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

濡傛灉浣犳洿鎯宠嚜宸辨帉鎺у畨瑁呰繃绋嬶紝涔熷彲浠ュ厛瀹夎 Node锛屽啀閫氳繃 npm 鍏ㄥ眬瀹夎锛?
```bash
npm i -g openclaw@latest
```

杩欓噷鎴戞洿寤鸿璁颁綇涓ょ偣锛?
- 濡傛灉浣犲彧鏄兂鈥滃敖蹇窇璧锋潵鈥濓紝浼樺厛鐢ㄥ畼鏂瑰畨瑁呰剼鏈紱
- 濡傛灉浣犲湪缁存姢鑷繁鐨勬湇鍔″櫒鐜锛屽凡缁忔湁 Node 鍜?npm 瑙勮寖锛岄偅灏辩敤 `npm i -g openclaw@latest`銆?
瀹夎瀹屾垚鍚庯紝鍏堢‘璁?CLI 鍙敤锛?
```bash
openclaw --help
```

## 绗簩姝ワ細杩愯 onboarding锛屽苟椤烘墜瀹夎甯搁┗鏈嶅姟

Linux 涓婃渶鍏抽敭鐨勪竴姝ワ紝涓嶆槸鈥滆兘璺戣捣鏉モ€濓紝鑰屾槸鈥滆窇璧锋潵浠ュ悗鑳戒竴鐩存椿鐫€鈥濄€? 
鎵€浠ヨ繖閲岀洿鎺ヤ娇鐢ㄥ畼鏂规帹鑽愬懡浠わ細

```bash
openclaw onboard --install-daemon
```

杩欎釜鍛戒护浼氭妸鍑犱欢浜嬪敖閲忎竴娆″仛瀹岋細

- 寮曞浣犲畬鎴?OpenClaw 鐨勫熀纭€閰嶇疆锛?- 鍒濆鍖?Gateway 鐩稿叧璁剧疆锛?- 瀹夎 systemd user service锛?- 灏藉彲鑳藉府浣犳妸 Gateway 鎸傛垚甯搁┗鏈嶅姟銆?
濡傛灉浣犲悗闈㈡兂鍗曠嫭澶勭悊鏈嶅姟瀹夎锛屼篃鍙互鐢ㄨ繖浜涘畼鏂瑰懡浠わ細

```bash
openclaw gateway install
```

鎴栬€咃細

```bash
openclaw configure
```

鐒跺悗鍦ㄤ氦浜掗噷閫夋嫨 Gateway service銆?
## 绗笁姝ワ細纭 Gateway 鐪熺殑鍦ㄥ悗鍙拌繍琛?
寰堝鈥滈儴缃插畬鎴愪絾鎵撲笉寮€鈥濈殑闂锛屾牴鏈師鍥犱笉鏄綉缁滐紝鑰屾槸鏈嶅姟鏍规湰娌¤捣鏉ャ€? 
鎵€浠ュ湪缁х画涔嬪墠锛屽厛鍋氬熀纭€妫€鏌ワ細

```bash
openclaw gateway status
openclaw health
```

濡傛灉涓€鍒囨甯革紝浣犲簲璇ュ凡缁忔湁涓€涓繍琛屼腑鐨?Gateway锛屽苟涓斿畠榛樿鐩戝惉鏈満鍥炵幆鍦板潃涓婄殑 `18789` 绔彛銆?
瀹樻柟鏂囨。涔熸彁鍒帮紝Linux 榛樿浣跨敤鐨勬槸 `systemd user service`銆? 
杩欐剰鍛崇潃濡傛灉浣犵殑绯荤粺娌℃湁鍚敤 lingering锛屾煇浜涚幆澧冧笅鐢ㄦ埛閫€鍑哄悗鏈嶅姟鍙兘浼氳 systemd 鍋滄帀銆?
濡傛灉浣犲彂鐜版湇鍔″湪閫€鍑虹櫥褰曞悗娑堝け锛屽彲浠ユ墽琛岋細

```bash
sudo loginctl enable-linger $USER
```

杩欎竴姝ョ壒鍒€傚悎 VPS 鍦烘櫙锛屼笉鐒朵綘浼氶亣鍒颁竴绉嶅緢鐑︾殑鎯呭喌锛? 
鐪嬭捣鏉ユ湇鍔¤濂戒簡锛屼絾浜轰竴鏂紑 SSH锛屽畠涔熻窡鐫€娌′簡銆?
## 绗洓姝ワ細浠庢湰鍦扮數鑴戝缓绔?SSH 闅ч亾

瀹樻柟鏈€鎺ㄨ崘鐨勮繙绋嬭闂柟寮忥紝涓嶆槸鐩存帴鎶婃帶鍒剁晫闈㈡毚闇插埌鍏綉锛岃€屾槸淇濈暀 Gateway 鍦ㄥ洖鐜湴鍧€涓婄洃鍚紝鐒跺悗浠庢湰鍦扮敤 SSH 闅ч亾鎺ヨ繘鍘汇€?
鍦ㄤ綘鐨勬湰鍦扮數鑴戜笂鎵ц锛?
```bash
ssh -N -L 18789:127.0.0.1:18789 <user>@<host>
```

濡傛灉浣犳病鏈夋敼榛樿绔彛锛岄偅涔堣繖鏉″懡浠ょ殑鎰忔€濆氨鏄細

- 鎶婁綘鏈湴鐨?`127.0.0.1:18789`
- 杞彂鍒拌繙绋嬫湇鍔″櫒涓婄殑 `127.0.0.1:18789`

杩欐牱涓€鏉ワ紝铏界劧 OpenClaw 瀹為檯璺戝湪鏈嶅姟鍣ㄤ笂锛屼絾浣犳湰鍦版祻瑙堝櫒璁块棶鏃朵細鍍忓湪璁块棶鏈満涓€鏍枫€?
杩欎篃鏄垜姣旇緝鍠滄鐨勪竴鐐癸細  
閮ㄧ讲鍜岃闂槸鍒嗗紑鐨勩€傛湇鍔＄户缁緟鍦ㄦ湇鍔″櫒涓婏紝鎺у埗鍏ュ彛鍙湪浣犻渶瑕佺殑鏃跺€欓€氳繃 SSH 涓存椂鎵撻€氥€?
## 绗簲姝ワ細鎵撳紑鎺у埗鐣岄潰骞跺畬鎴愯璇?
SSH 闅ч亾寤哄ソ浠ュ悗锛屽湪鏈湴娴忚鍣ㄦ墦寮€锛?
```text
http://127.0.0.1:18789/
```

濡傛灉椤甸潰鎻愮ず鏈巿鏉冿紝璇存槑 Gateway 璁よ瘉鏄紑鍚殑鈥斺€旇繖鍏跺疄鏄甯镐笖鏇村畨鍏ㄧ殑鐘舵€併€? 
瀹樻柟鏂囨。褰撳墠鐨勬帹鑽愭柟寮忔槸浣跨敤 `openclaw dashboard` 閲嶆柊鎵撳紑 Dashboard锛涘鏋滅晫闈粛鐒惰姹傝璇侊紝灏辨妸 `gateway.auth.token`锛堟垨 `OPENCLAW_GATEWAY_TOKEN`锛夌矘璐村埌 Control UI 璁剧疆閲屻€?
鍦ㄥ疄闄呬娇鐢ㄩ噷锛屾垜寤鸿杩欐牱鐞嗚В锛?
- 鏈湴鍥炵幆鍦板潃涓嶇瓑浜庘€滃ぉ鐒跺厤璁よ瘉鈥濓紱
- 鍗充娇閫氳繃 SSH 闅ч亾璁块棶锛孏ateway 濡傛灉閰嶇疆浜?token锛屽鎴风浠嶇劧瑕佸甫涓?token锛?- 鎺у埗鐣岄潰灞炰簬绠＄悊鍛樺叆鍙ｏ紝涓嶅簲璇ョ洿鎺ヨ８闇插埌鍏綉銆?
濡傛灉浣犲彧鏄揩閫熼獙璇佽繛閫氭€э紝鏈€鐩存帴鐨勬柟寮忔槸鍏堝湪鏈嶅姟鍣ㄤ笂鎵ц锛?
```bash
openclaw dashboard
```

鐒跺悗浣跨敤瀹冭緭鍑虹殑 Dashboard 閾炬帴锛屽苟鍦ㄩ渶瑕佹椂濉叆 token 瀹屾垚棣栨鐧诲綍銆?
## 绗叚姝ワ細鐞嗚В鏂囦欢浼氳惤鍦ㄥ摢閲?
閮ㄧ讲瀹屾垚鍚庯紝寰堝鍏抽敭鐘舵€侀兘涓嶅湪椤圭洰浠撳簱閲岋紝鑰屾槸鍦?OpenClaw 鑷繁鐨勭姸鎬佺洰褰曚腑銆? 
杩欏鍚庣画澶囦唤鍜屾帓闅滈潪甯搁噸瑕併€?
瀹樻柟鏂囨。鎻愬埌鐨勫嚑涓噸鐐逛綅缃細

- 閰嶇疆鏂囦欢锛歚~/.openclaw/openclaw.json`
- 宸ヤ綔鍖猴細`~/.openclaw/workspace`
- 鍑嵁鐩綍锛歚~/.openclaw/credentials/`

鍙﹀锛岄娆?agent 杩愯鏃讹紝榛樿宸ヤ綔鍖轰篃浼氳鑷姩鍒濆鍖栥€傚畼鏂规枃妗ｇ洰鍓嶆彁鍒扮殑榛樿宸ヤ綔鍖烘槸锛?
```text
~/.openclaw/workspace
```

鍏朵腑閫氬父浼氬嚭鐜拌繖浜涘熀纭€鏂囦欢锛?
- `AGENTS.md`
- `SOUL.md`
- `TOOLS.md`
- `IDENTITY.md`
- `USER.md`
- `HEARTBEAT.md`

濡傛灉浣犵殑 Gateway 璺戝湪杩滅▼鏈嶅姟鍣ㄤ笂锛岃繖浜涙枃浠朵篃閮藉湪杩滅▼涓绘満涓婏紝鑰屼笉鏄湪浣犵殑鏈湴鐢佃剳涓娿€? 
鎵€浠ュ悗缁綘瑕佹敼 workspace銆佹妧鑳姐€佽蹇嗘垨鎻愮ず璇嶆椂锛屽簲璇ョ櫥褰曞埌鏈嶅姟鍣ㄩ偅杈瑰幓澶勭悊銆?
## 绗竷姝ワ細鍚庣画鏇存柊鎬庝箞鍋?
OpenClaw 杩唬寰堝揩锛屾墍浠ラ儴缃插畬鎴愪互鍚庯紝鏇存柊璺緞鏈€濂戒竴寮€濮嬪氨鎯虫竻妤氥€? 
濡傛灉浣犳槸 npm 鍏ㄥ眬瀹夎锛屽畼鏂规帹鑽愮殑鏇存柊鏂瑰紡鏄細

```bash
npm i -g openclaw@latest
openclaw doctor
openclaw gateway restart
openclaw health
```

濡傛灉浣犳兂鐢ㄥ畼鏂圭粺涓€鏇存柊鍏ュ彛锛屼篃鍙互鐩存帴锛?
```bash
openclaw update
```

鏇存柊杩欎欢浜嬫渶濂藉埆鍙仛涓€鍗娿€? 
姣旇緝绋崇殑椤哄簭閫氬父鏄細

1. 鏇存柊锛?2. 璺?`openclaw doctor`锛?3. 閲嶅惎 Gateway锛?4. 鐢?`openclaw health` 鍐嶇‘璁や竴娆°€?
## 绗叓姝ワ細鍑犱釜鏈€甯歌鐨勯棶棰?
### 1. 娴忚鍣ㄦ墦涓嶅紑鎺у埗鐣岄潰

浼樺厛鎸夎繖涓『搴忔煡锛?
```bash
openclaw gateway status
openclaw health
```

鐒跺悗纭鏈湴 SSH 闅ч亾鏄惁杩樺紑鐫€銆?
### 2. 椤甸潰鑳芥墦寮€锛屼絾鎻愮ず unauthorized

杩欓€氬父涓嶆槸鏈嶅姟鎸備簡锛岃€屾槸 token 娌″甫涓娿€? 
鍙互閲嶆柊杩愯锛?
```bash
openclaw dashboard
```

鐒跺悗鎶?`gateway.auth.token` 绮樿创杩?Dashboard 璁剧疆閲屽啀璇曚竴娆°€?
### 3. SSH 鏂紑鍚庢湇鍔′篃娌′簡

澶ф鐜囨槸 Linux 鐨?user service 娌℃湁姝ｇ‘鍚敤 lingering锛?
```bash
sudo loginctl enable-linger $USER
```

### 4. 鍗囩骇鍚庤涓哄紓甯?
鍏堜笉瑕佹€ョ潃閲嶈锛屼紭鍏堟墽琛岋細

```bash
openclaw doctor
openclaw gateway restart
openclaw health
```

濡傛灉杩樹笉琛岋紝鍐嶅幓鐪嬫棩蹇椼€?
### 5. 鎯崇湅 Linux 涓婄殑鏈嶅姟鏃ュ織

瀹樻柟 FAQ 缁欏嚭鐨勫父鐢ㄦ帓闅滃懡浠ゆ槸锛?
```bash
journalctl --user -u openclaw-gateway -n 200 --no-pager
```

濡傛灉浣犵敤浜嗗甫 profile 鐨勬湇鍔″悕锛屽啀鎶?unit 鍚嶇О鏇挎崲鎴愬搴旂殑 `openclaw-gateway-<profile>`銆?
## 涓€鏉￠€傚悎鐓х潃鎵ц鐨勬渶灏忛儴缃茶矾寰?
濡傛灉浣犲彧鎯冲厛鎶?OpenClaw 閮ㄧ讲鎴愬姛锛屼笉鎯充竴寮€濮嬪氨鐮旂┒鎵€鏈夐厤缃紝閭ｄ箞鎴戝缓璁寜涓嬮潰杩欎釜鏈€灏忔祦绋嬭蛋锛?
```bash
# 鏈嶅姟鍣ㄤ笂
npm i -g openclaw@latest
openclaw onboard --install-daemon
openclaw gateway status
openclaw health
```

```bash
# 鏈湴鐢佃剳涓?ssh -N -L 18789:127.0.0.1:18789 <user>@<host>
```

鐒跺悗鍦ㄦ湰鍦版祻瑙堝櫒鎵撳紑锛?
```text
http://127.0.0.1:18789/
```

杩欏璺緞鐨勪紭鐐规槸瓒冲鐭紝浣嗗張娌℃湁鐗虹壊鎺夊悗缁墿灞曟€с€? 
绛変綘鎶婄涓€濂楀疄渚嬭窇绋充簡锛屽啀鍘绘帴 Telegram銆丏iscord銆乀ailscale銆佹彃浠跺拰澶?agent锛屼細鏇翠粠瀹广€?
## 鏈€鍚?
鎴戣寰?OpenClaw 杩欑椤圭洰锛屾渶瀹规槗鍗′綇浜虹殑鍦版柟骞朵笉鏄€滄€庝箞瀹夎鍖呪€濓紝鑰屾槸鈥滄€庝箞鎶婂畠閮ㄧ讲鎴愪竴涓ǔ瀹氥€侀暱鏈熷湪绾裤€佽繕鑳藉畨鍏ㄨ闂殑鏈嶅姟鈥濄€? 
涓€鏃︽妸 Linux 甯搁┗銆丼SH 闅ч亾鍜屾帶鍒剁晫闈㈣繖涓€灞傜悊椤猴紝鍚庨潰鐨勪簨鎯呬細绠€鍗曞緢澶氥€?
濡傛灉鍚庨潰鎴戠户缁啓杩欎釜涓婚锛屾垜浼氭洿鎯宠ˉ涓夌被鍐呭锛?
- OpenClaw 鎺ュ叆鍏蜂綋鑱婂ぉ娓犻亾鐨勬祦绋嬶紱
- 杩滅▼ Gateway 鍜屾湰鍦板伐浣滃尯濡備綍鍗忓悓锛?- 鏇存柊銆佸浠藉拰鍥炴粴鐨勪竴濂楁洿绋崇殑缁存姢绛栫暐銆?
## 鍙傝€冭祫鏂?
- [OpenClaw 瀹樻柟浠撳簱](https://github.com/openclaw/openclaw)
- [Linux App 鏂囨。](https://docs.openclaw.ai/platforms/linux)
- [Remote Access 鏂囨。](https://docs.openclaw.ai/gateway/remote)
- [Dashboard 鏂囨。](https://docs.openclaw.ai/dashboard)
- [Updating 鏂囨。](https://docs.openclaw.ai/updating)


