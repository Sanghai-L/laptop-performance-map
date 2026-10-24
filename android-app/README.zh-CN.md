# 笔记本性能地图 Android 离线版

[English](README.md) · 简体中文

[下载 Android 1.2.2](https://github.com/Sanghai-L/laptop-performance-map/releases/download/v1.2.2/Laptop-Performance-Map-1.2.2.apk) · [版本与校验文件](https://github.com/Sanghai-L/laptop-performance-map/releases/tag/v1.2.2)

将 `Laptop-Performance-Map-1.2.2.apk` 发送到 Android 手机，点击安装。系统如有提示，允许当前文件管理器 / 浏览器安装此来源的应用。适用于 Android 8.0 及以上，手机需要可用且较新的 Android System WebView / Chrome。

CPU 型号、用途、游戏实测与估算、真实机型示例、命名规则、配置核对及中英文页面随包保存，可离线查看。资料来源链接在系统浏览器中打开，需要联网。复制讲解链接时复制对应网页版地址。核心数据是打包时的快照，不会自动联网更新；更新内容需安装后续版本。

应用没有广告、账号和统计服务，不申请网络、存储、相机、通知等权限。WebView 只加载包内内容，外部资料交给系统浏览器。签名为本项目生成的独立发行签名，不是 Google Play 商店签名。

本版加入更明确的 CPU 用途定位、相近型号对照与发布时间，支持记住主题配色、隐藏开场示例，并统一栏目导航。详见 [1.2.2 更新说明](../CHANGELOG.zh-CN.md)。

## 验证范围

公开验证记录位于 `validation.json`：验证 Java 编译、DEX、APK 格式、资源、签名、对齐与包内网页哈希。23 个包内网页资源与本仓库 `dist/` 及当前网站源码一致。网页复核包含 522 次 CPU 简介渲染、两套主题、中英文、六种屏幕宽度、状态保留与键盘操作。作者已在发布后完成 Android 实机测试，反馈记录于 2026-10-24。

## 后续重建

工具来源与校验信息保存在 `toolchain/`，工具仅放在本目录 `.tools` 中，不改系统环境。`python bootstrap.py` 从官方来源下载并校验工具，之后运行 `python build.py`（需要 Windows x64 与 Python 3.9 及以上）。构建会在 `build/<时间戳>/assets/site` 冻结当前 `../dist`，不会改动网页项目。Android 原生部分位于 `src`、`res` 与 `AndroidManifest.xml`；无需 Gradle 或 Android Studio。

首次自行构建时，会在 `.signing` 中生成新的签名密钥和本地密码。仓库不包含发行版的私钥；自行生成的密钥无法覆盖升级这里发布的 APK。请私下妥善备份，不要公开上传；以后沿用同一签名，才能覆盖升级已安装的应用。源代码分享时应排除此目录及 `.tools`、`downloads`、`build`。

版本：1.2.2。内容快照日期：2026-10-24。

使用已有签名时，可在本机设置 `LAPTOP_MAP_SIGNING_DIR` 指向私钥目录；不要提交该目录。

## 开源协议

应用原创源码与文档采用 [MIT 许可证](../LICENSE)，版权声明为 Copyright (c) 2026 Sanghai-L。引用的第三方内容保留原有权利及授权条款。
