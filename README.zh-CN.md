# 笔记本性能地图

[English](README.md) · 简体中文

[更新说明：1.1.0–1.2.2](CHANGELOG.zh-CN.md)

面向没有笔记本参数基础的读者，用交互说明 CPU 能完成什么工作，以及只用集成显卡时的游戏体验。

- [中文在线版](https://cpu-field-guide-sanghai.songngao764.chatgpt.site/?lang=zh)
- [English version](https://cpu-field-guide-sanghai.songngao764.chatgpt.site/?lang=en)

## 使用

下载仓库并解压，用浏览器打开 `dist/index.html`。无需安装依赖、登录或运行服务器。页面右上角切换“中文 / EN”；当前 CPU、类型和任务会保留，语言偏好保存在本机浏览器。公开页面的分享链接包含语言选择。

页面交互和中英文内容可以离线运行；官方规格与测评原文链接需要联网。部署时上传 `dist` 中的全部文件。

顶部“配色”可在自然绿与科技蓝之间切换，默认自然绿。切换不刷新页面，也不改变 CPU、任务和游戏设置；浏览器会记住选择，刷新或切换语言后仍然保留。

“轻薄本配置示例”可隐藏或显示，收起后仍保留操作栏，浏览器会记住状态。点击顶部同名导航会重新显示示例。手机上的栏目导航可横向滑动。

## 内容

- 轻薄本、全能本、游戏本三类入口，可按品牌、系列、完整型号或核显搜索。
- 261 项型号 / 配置：Intel 142、AMD 76、Apple 25、Qualcomm 18；Apple 核心组合与 Qualcomm 料号分别列出。
- 每项增加 CPU 负载定位、用途简介及相近型号对照，分别说明核心规模、功耗和集显差异；相近型号不会刻意分出明显等级。
- 每项增加发布时间与厂商来源，区分芯片首次公布、系列公布和官方上市季度。259 项可核实到日期、季度或年份；Ryzen 7 449、Ryzen 5 439 官方未公布时间，页面如实标注。部分 Apple 配置另列笔记本配置发布日。
- 编译、剪辑、CPU 渲染三类任务，结合核型、功耗、内存与图形条件解释取舍。
- 集显游戏包括无畏契约、原神、赛博朋克 2077、黑神话：悟空，以及星露谷物语和第一代哈迪斯。
- 公开测试优先显示为绿色；缺测试时显示黄色的性能估算，附前提与依据。
- 开头用三台真实轻薄本，区分整机型号与 CPU 型号，并连接到对应的用途与集显讲解。
- 24 个代表 CPU、30 条整机配置示例，附官方来源；可筛选只看附有机型示例的 CPU。
- 原整机实验室与测验改为四条实用配置核对步骤。
- Intel、AMD、Apple、高通四品牌的交互命名说明：45 个示例、33 项后缀或标记，并可直接拆解当前 CPU，明确不同体系的适用范围与例外。

## 数字的含义

实测来自所链接的原始测评，本站没有亲测硬件。单机平均、跨机器平均范围、数据库聚合与游戏过程观察分别标注。

估算为按核显与游戏人工校准的宽区间，参考架构、图形规模、整机功耗和内存条件；不是统计置信区间，也不是最低帧保证。平台不兼容或没有核显时，不用估算假装游戏能运行。目录收录不代表当地商店实时有货。

规格及资料核对：2026-10-23；CPU 简介与发布时间补充核对：2026-10-24。详细范围见 [COVERAGE.md](catalogue/COVERAGE.md)。

## 维护

- `dist/`：完整静态站点。
- `locales/en.json`：英文翻译词典；`dist/i18n.js`：语言、格式和界面更新。
- `scripts/build-locales.mjs`：从词典生成浏览器使用的 `dist/locales/en.js`。
- `catalogue/processor-specs.json`：处理器规格和直接来源。
- `catalogue/gaming-evidence.json`：公开游戏测试记录。
- `catalogue/estimate-ranges.json` / `estimate-anchors.json`：估算参考区间和校准依据。
- `catalogue/notebook-examples.json`：中英文整机示例、确切配置、官方来源与开场讲解。
- `scripts/build-notebooks.mjs`：校验整机示例并生成浏览器数据。
- `catalogue/naming-rules.json`：中英文命名规则、例外、示例、后缀表与官方来源。
- `dist/naming.js`：当前型号拆解与交互界面。
- `scripts/build-naming.mjs`：校验命名资料并生成浏览器数据。

修改翻译后，运行 `node scripts/build-locales.mjs`。无需构建即可打开网页。

修改整机示例后，运行 `node scripts/build-notebooks.mjs`。

处理器时间来源在 `catalogue/processor-releases.json`，简介规则在 `scripts/profile-editorial.mjs`。修改规格、日期或简介后运行 `node scripts/build-profiles.mjs`，会检查全型号覆盖并生成浏览器数据。CPU 定位用于概括负载能力，不是跨品牌跑分排名；GPU 核心增加不会自动提高 CPU 档位。

修改命名规则后，运行 `node scripts/build-naming.mjs`。命名检查覆盖 261 个目录型号、45 个示例中的 220 个可点击片段、中英文、键盘操作及五种屏幕宽度。名字提供定位线索，不能代替硬件性能测试。

验证涵盖所有 CPU / 任务组合、中英切换、游戏和估算、30 条整机配置、引入机型跳转与筛选，以及桌面与手机布局。网页验证不等于硬件性能测试。

## Android 离线版

[下载 Android 1.2.2](https://github.com/Sanghai-L/laptop-performance-map/releases/download/v1.2.2/Laptop-Performance-Map-1.2.2.apk) · [版本与校验文件](https://github.com/Sanghai-L/laptop-performance-map/releases/tag/v1.2.2)

支持 Android 8.0 及以上，中英文指南可离线查看，来源链接需要联网。Android 源码位于 GitHub 仓库的 `android-app/` 目录。包格式、签名和离线网页检查已通过，尚未进行 Android 真机或模拟器安装与启动验证。
