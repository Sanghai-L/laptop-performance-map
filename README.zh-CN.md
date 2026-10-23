# 笔记本性能地图

[English](README.md) · 简体中文

面向没有笔记本参数基础的读者，用交互说明 CPU 能完成什么工作，以及只用集成显卡时的游戏体验。

- [中文在线版](https://cpu-field-guide-sanghai.songngao764.chatgpt.site/?lang=zh)
- [English version](https://cpu-field-guide-sanghai.songngao764.chatgpt.site/?lang=en)

## 使用

下载仓库并解压，用浏览器打开 `dist/index.html`。无需安装依赖、登录或运行服务器。页面右上角切换“中文 / EN”；当前 CPU、类型和任务会保留，语言偏好保存在本机浏览器。公开页面的分享链接包含语言选择。

页面交互和中英文内容可以离线运行；官方规格与测评原文链接需要联网。部署时上传 `dist` 中的全部文件。

## 内容

- 轻薄本、全能本、游戏本三类入口，可按品牌、系列、完整型号或核显搜索。
- 261 项型号 / 配置：Intel 142、AMD 76、Apple 25、Qualcomm 18；Apple 核心组合与 Qualcomm 料号分别列出。
- 编译、剪辑、CPU 渲染三类任务，结合核型、功耗、内存与图形条件解释取舍。
- 集显游戏包括无畏契约、原神、赛博朋克 2077、黑神话：悟空，以及星露谷物语和第一代哈迪斯。
- 公开测试优先显示为绿色；缺测试时显示黄色的性能估算，附前提与依据。
- 整机实验室、入门小课堂与交互测验。

## 数字的含义

实测来自所链接的原始测评，本站没有亲测硬件。单机平均、跨机器平均范围、数据库聚合与游戏过程观察分别标注。

估算为按核显与游戏人工校准的宽区间，参考架构、图形规模、整机功耗和内存条件；不是统计置信区间，也不是最低帧保证。平台不兼容或没有核显时，不用估算假装游戏能运行。目录收录不代表当地商店实时有货。

规格及资料核对：2026-10-23。详细范围见 [COVERAGE.md](catalogue/COVERAGE.md)。

## 维护

- `dist/`：完整静态站点。
- `locales/en.json`：英文翻译词典；`dist/i18n.js`：语言、格式和界面更新。
- `scripts/build-locales.mjs`：从词典生成浏览器使用的 `dist/locales/en.js`。
- `catalogue/processor-specs.json`：处理器规格和直接来源。
- `catalogue/gaming-evidence.json`：公开游戏测试记录。
- `catalogue/estimate-ranges.json` / `estimate-anchors.json`：估算参考区间和校准依据。

修改翻译后，运行 `node scripts/build-locales.mjs`。无需构建即可打开网页。

验证涵盖所有 CPU / 任务组合、中英切换、游戏和估算、36 种实验室条件，以及桌面与手机布局。网页验证不等于硬件性能测试。
