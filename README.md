# Laptop Performance Map

English · [简体中文](README.zh-CN.md)

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
- A whole-laptop lab, introductory explanations, and an interactive quiz.

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

After editing translations, run:

```sh
node scripts/build-locales.mjs
```

The browser does not require Node.js. The maintenance scripts use Node.js.

Validation covers every CPU/task combination, language switching, game/estimate interactions, all 36 laptop-lab states, and desktop/mobile layouts. Website checks do not validate hardware performance.
