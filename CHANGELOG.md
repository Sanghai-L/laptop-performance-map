# Changelog

English · [简体中文](CHANGELOG.zh-CN.md)

## 1.2.2 · 2026-10-24

- **Rewrote all 261 CPU profiles:** Added five workload classes, from basic office tasks to flagship heavy workloads, with practical uses and limits. Nearby-model comparisons explain CPU resources, clock speeds, power and graphics. Similar models are described as similar; higher model numbers or more GPU cores do not automatically raise the CPU class. These classes are usage guidance, not a cross-brand benchmark ranking.
- **Added release timing and sources:** Every model/configuration has a date field that distinguishes chip announcements, family announcements and official launches. Precision follows the vendor source: date, quarter or year. Timing is established for 259 entries; Ryzen 7 449 and Ryzen 5 439 are explicitly marked undisclosed. Selected Apple entries also show the later laptop-configuration announcement.
- **Added a hide/show control for introductory laptops:** The control stays visible when the examples are collapsed. The browser remembers the preference across reloads and language changes; the matching navigation link reveals the examples. Selected examples, CPUs, tasks and games are preserved.
- **Corrected catalog details:** 315 is Core 5 315; Core 3 304 has 5 cores/5 threads; Core Ultra 5 332 is listed as 2 performance cores plus 4 low-power efficient cores. Existing model IDs and shared links remain valid.
- **Updated the Android offline app to 1.2.2:** Includes all of these website changes, retains the package and signing certificate, and increments versionCode to 5.

Added a remembered Natural green / Tech blue theme choice, clearer numbered headings, and navigation labels matching section titles. Updated both languages, mobile layouts and keyboard support.

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

[Download Android 1.2.2](https://github.com/Sanghai-L/laptop-performance-map/releases/download/v1.2.2/Laptop-Performance-Map-1.2.2.apk) · [Release and checksums](https://github.com/Sanghai-L/laptop-performance-map/releases/tag/v1.2.2)

Requires Android 8.0 or later. Both languages and interactions work offline; external references need a connection. The package name and signing certificate match previous releases.

Browser checks for 1.2.2 include 522 per-entry render checks (261 entries × both languages), theme and example-visibility persistence, and layouts in two themes, both languages and six viewport widths. APK checks cover compilation, resources, DEX, alignment and v2/v3 signatures; all 23 bundled web assets match this website source. Android device/emulator installation, startup and upgrades have not been tested.
