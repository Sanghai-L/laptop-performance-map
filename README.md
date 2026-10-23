# Laptop Performance Map

English · [简体中文](README.zh-CN.md)

[Changelog: 1.1.0–1.2.1](CHANGELOG.md)

An interactive, beginner-friendly guide to laptop CPUs and integrated-graphics gaming. Start with the work you want to do, then explore what the hardware contributes.

**[English website](https://cpu-field-guide-sanghai.songngao764.chatgpt.site/?lang=en)** · **[中文在线版](https://cpu-field-guide-sanghai.songngao764.chatgpt.site/?lang=zh)**

## Open it

Download or clone this repository and open **`dist/index.html`** in a browser. No installation, build step, account, or server is required.

Use the **中文 / EN** buttons in the header. Switching languages preserves the selected CPU, laptop category, and task. Your browser remembers the language, and share links include it.

The interface, translations, and interactions work offline. Links to vendor specifications and original reviews need an internet connection. To host the guide elsewhere, upload the entire `dist` directory to a static website host.

## Explore

- Three laptop categories: thin-and-light, all-rounder, and gaming.
- Search and filters for **261 model/configuration entries**: Intel 142, AMD 76, Apple 25, and Qualcomm 18. Apple CPU/GPU configurations and Qualcomm part numbers are listed separately.
- Workload explanations for programming/compilation, video editing, and CPU rendering, with hardware-specific resources and limits.
- Integrated-graphics references for **Valorant, Genshin Impact, Cyberpunk 2077, Black Myth: Wukong, Stardew Valley, and the original Hades**.
- Published measurements in green; explicitly labelled performance estimates in yellow when measurements are missing.
- Three real thin-and-light laptops introduce the difference between a laptop name and its CPU model.
- **24 representative CPUs and 30 laptop configuration examples**, with direct manufacturer sources and an example-only filter.
- Four practical configuration checks replace the former whole-laptop lab and quiz.
- An interactive Intel, AMD, Apple, and Qualcomm naming guide, with 45 examples, 33 suffix/marker entries, and a shortcut for the current CPU. It separates naming systems and explains their exceptions.

## Read the numbers correctly

Measurements are attributed to the linked original reviewers. This project has not tested the hardware itself. Single-laptop averages, ranges of averages across machines, database aggregates, and gameplay observations are labelled separately.

Estimates are broad, editorially calibrated ranges based on the GPU, game, architecture, graphics configuration, laptop power, and memory assumptions. They are not statistical confidence intervals or minimum-FPS guarantees. Real scenes, drivers, memory bandwidth, and cooling can put a laptop outside the range.

Platform incompatibility and CPUs with no integrated GPU are shown as such. The catalog is not a live store inventory. Specifications and sources were checked on **2026-10-23**.

## Project files

| Path | Purpose |
| --- | --- |
| `dist/` | Complete, standalone static website |
| `locales/en.json` | English translation dictionary |
| `dist/i18n.js` | Language selection, translated rendering, and number/text formatting |
| `scripts/build-locales.mjs` | Generates the browser dictionary from `locales/en.json` |
| `catalogue/processor-specs.json` | CPU specifications and direct vendor sources |
| `catalogue/gaming-evidence.json` | Published gaming measurements and conditions |
| `catalogue/estimate-ranges.json` | GPU profiles, broad ranges, and model mapping |
| `catalogue/estimate-anchors.json` | Additional measurement anchors and estimate reasoning |
| `catalogue/notebook-examples.json` | Bilingual laptop examples, exact configurations, official sources, and introductory explanations |
| `scripts/build-notebooks.mjs` | Validates the laptop examples and generates their browser data |
| `catalogue/naming-rules.json` | Bilingual naming rules, exceptions, representative examples, suffixes, and official sources |
| `dist/naming.js` | Current-model name breakdown and interactive naming interface |
| `scripts/build-naming.mjs` | Validates naming content and generates the browser data |

After editing translations, run:

```sh
node scripts/build-locales.mjs
```

The browser does not require Node.js. The maintenance scripts use Node.js.

After editing laptop examples, run `node scripts/build-notebooks.mjs`.

After editing naming rules, run `node scripts/build-naming.mjs`. Naming validation covers all 261 catalog entries, the 45 examples and their 220 selectable parts, both languages, keyboard navigation, and five viewport widths. Model-name clues are not hardware performance tests.

Validation covers every CPU/task combination, language switching, game/estimate interactions, all 30 laptop examples, introductory links, configuration filtering, and desktop/mobile layouts. Website checks do not validate hardware performance.

## Android app

[Download Android 1.2.1](https://github.com/Sanghai-L/laptop-performance-map/releases/download/v1.2.1/Laptop-Performance-Map-1.2.1.apk) · [Release and checksums](https://github.com/Sanghai-L/laptop-performance-map/releases/tag/v1.2.1)

Android 8.0 or later. The Chinese and English guide works offline; source links need a connection. The Android source is in the GitHub repository's `android-app/` directory. Package, signature, and offline webpage checks passed; installation and startup on an Android device or emulator have not been tested.
