# Android offline app

English · [简体中文](README.zh-CN.md)

[Download Android 1.2.2](https://github.com/Sanghai-L/laptop-performance-map/releases/download/v1.2.2/Laptop-Performance-Map-1.2.2.apk) · [Release and checksums](https://github.com/Sanghai-L/laptop-performance-map/releases/tag/v1.2.2)

Requires Android 8.0 or later and a working, recent Android System WebView or Chrome. Download the APK to your phone, open it, and allow the browser or file manager to install this app if Android asks.

The app includes the Chinese and English CPU guide, integrated-graphics measurements and estimates, real laptop examples, CPU naming reference, and configuration checks. These work offline. Source links open in your system browser and require a connection. Shared explanation links point to the online website. The bundled content is a snapshot from 2026-10-24; updates require a newer APK.

Package: `app.laptopmap.offline`. This APK requests no permissions and contains no account, advertising, or analytics service. It is signed with this project's local release key, not a Google Play signing key.

This release adds clearer CPU profiles, workload classes, nearby-model comparisons and release dates. It also includes a remembered theme choice, collapsible introductory examples and matching section navigation. See the [1.2.2 changelog](../CHANGELOG.md).

## Validation

See [validation.json](validation.json) for compilation, DEX, resource, alignment, v2/v3 signature, and bundled-file checks. All 23 bundled web assets match this repository's `dist/` files and the current Sites source. Desktop-browser checks include 522 CPU profile renders, both themes and languages, six viewport widths, state persistence and keyboard controls. The project author subsequently completed Android device testing, as reported on October 24, 2026.

## Rebuild on Windows x64

Install Python 3.9 or later, then run from this directory:

```powershell
python bootstrap.py
python build.py
```

The bootstrap downloads the toolchain from the official Google and Microsoft sources listed in `toolchain/`, checks the supplied checksums, and keeps it under `.tools/`. It does not modify system PATH. No Android Studio or Gradle is required.

`build.py` snapshots `../dist` into a new build directory and compiles the native code in `src/`, resources in `res/`, and `AndroidManifest.xml`. The signed APK is written to `output/`.

The first local build generates a new signing key and password under `.signing/`. Keep them private and backed up. A key you generate cannot update an installation signed by the distributed release key; Android requires the same signing key for updates. The release private key and password are deliberately excluded from this repository. To use an existing private key folder, set `LAPTOP_MAP_SIGNING_DIR` locally before building; never commit that directory.

Build outputs, downloaded tools, browser profiles, signing material, and local evidence directories are ignored by Git.

## License

The app's original source code and documentation use the [MIT License](../LICENSE), copyright (c) 2026 Sanghai-L. Referenced third-party material retains its own rights and terms.
