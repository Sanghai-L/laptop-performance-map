# Changelog

English · [简体中文](CHANGELOG.zh-CN.md)

## 1.2.1 · 2026-10-23

Shortened the homepage, CPU descriptions, and naming guidance. Suffix and exception references now open by default, with 14px body text and improved mobile cards. Fixed split labels such as HX, completed English translations, and updated the Android offline app.

## 1.2.0 · 2026-10-23

Added a **CPU naming reference** for Intel, AMD, Apple, and Qualcomm.

- **Interactive breakdowns:** 45 examples explain the family, tier, generation, SKU, and suffix when a name fragment is selected. A link from the CPU profile opens the current model’s explanation, covering all 261 catalog configurations.
- **Separate naming systems:** Covers Core i, Core, Core Ultra, traditional Ryzen, Ryzen AI, AI Max, Apple M / A, and Snapdragon X / X2 without applying one family’s numbering rules to another.
- **Suffix and label lookup:** 33 entries cover U, H, HS, HX, V, PRO, Max, Plus, and other labels, with their applicable families and limits.
- **Practical exceptions:** Explains the different power targets of Ryzen AI HX 370 and traditional 9955HX, why a MacBook Pro may use a base M chip, and why Snapdragon configurations need a full part number. Actual CPU and integrated-GPU specifications appear beside the breakdown.
- **References and interaction:** Includes manufacturer naming and specification links, both languages, keyboard navigation, and mobile layouts. Browsing examples does not change the CPU selected in the explorer.

The naming features first appeared on the website and were included in the GitHub 1.2.1 release. No separate 1.2.0 APK was distributed.

## 1.1.0 · 2026-10-23

Added **real laptop examples** to connect CPU models with actual computers and workloads.

- **Three introductory laptops:** Zenbook S14 with Core Ultra 7 258V, Zenbook S16 with Ryzen AI 9 HX 370, and M4 MacBook Air. Each explains its CPU, graphics, suitable tasks, and limits, with direct links to its CPU or integrated-gaming section.
- **30 laptop configurations:** Added official examples for 24 representative CPUs. Submodels, regions, and years help distinguish configurations within one laptop family; historical configurations are labelled.
- **Example filter:** Added “Only CPUs with laptop examples,” alongside the existing search and category controls.
- **Practical configuration checks:** Replaced the old laptop lab and quiz with four checks: complete CPU name, memory and upgrades, integrated versus dedicated graphics, and software compatibility and sustained performance.

Updated Chinese and English content and the Android offline app.

## Download and validation

[Download Android 1.2.1](https://github.com/Sanghai-L/laptop-performance-map/releases/download/v1.2.1/Laptop-Performance-Map-1.2.1.apk) · [Release and checksums](https://github.com/Sanghai-L/laptop-performance-map/releases/tag/v1.2.1)

Requires Android 8.0 or later. Both languages and interactions work offline; external references need a connection. The package name and signing certificate match previous releases.

Browser checks for 1.2.1 cover 261 CPUs, 783 CPU/task combinations, 45 naming examples, 220 selectable fragments, both languages, and five viewport widths. APK checks cover compilation, resources, DEX, alignment, signatures, and bundled-webpage consistency. Android device/emulator installation, startup, and upgrades have not been tested.
