"""Fetch a project-local Android toolchain; never edit system PATH."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import hashlib
import json
import urllib.request
import zipfile

ROOT = Path(__file__).resolve().parent
DOWNLOADS = ROOT / 'downloads'
TOOLS = ROOT / '.tools'
for folder in [DOWNLOADS, TOOLS, ROOT / 'evidence']:
    folder.mkdir(parents=True, exist_ok=True)
HEADERS = {'User-Agent': 'LaptopPerformanceMap-Build/1.0'}

def fetch(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=HEADERS), timeout=90)

packages = json.loads((ROOT / 'toolchain/packages.json').read_text(encoding='utf-8'))
selected = [p for p in packages if p['url'] in ['platform-36_r02.zip', 'build-tools_r36_windows.zip', 'platform-tools_r37.0.1-win.zip']]
for p in selected:
    p['url'] = 'https://dl.google.com/android/repository/' + p['url']
    p['algorithm'] = 'sha1'
    p['expected'] = p['checksum']
    p['folder'] = 'sdk'
links = json.loads((ROOT / 'toolchain/jdk-links.json').read_text(encoding='utf-8'))
jdk_url = next(x for x in links if x.endswith('.zip'))
with fetch(next(x for x in links if x.endswith('.sha256sum.txt'))) as response:
    checksum = response.read().decode().strip().split()[0]
selected.append({'url': jdk_url, 'expected': checksum, 'algorithm':'sha256', 'folder':'jdk', 'package':'Microsoft OpenJDK 17'})

def install(p):
    name = p['url'].rsplit('/',1)[-1]
    destination = DOWNLOADS / name
    if not destination.exists():
        print('Downloading ' + name, flush=True)
        temporary = destination.with_suffix('.partial')
        with fetch(p['url']) as response, temporary.open('wb') as output:
            while chunk := response.read(1024 * 1024):
                output.write(chunk)
        temporary.replace(destination)
    digest = hashlib.new(p['algorithm'], destination.read_bytes()).hexdigest()
    if digest.lower() != p['expected'].lower():
        raise RuntimeError('Checksum mismatch: ' + name)
    target = TOOLS / p['folder']
    target.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(destination) as archive:
        # The official archives are still checked for path containment.
        for info in archive.infolist():
            resolved = (target / info.filename).resolve()
            if not resolved.is_relative_to(target.resolve()):
                raise RuntimeError('Unsafe archive path')
        archive.extractall(target)
    result = {'package':p['package'], 'url':p['url'], 'bytes':destination.stat().st_size,
              'verified_algorithm':p['algorithm'], 'verified_checksum':digest,
              'sha256':hashlib.sha256(destination.read_bytes()).hexdigest()}
    print('Verified and extracted ' + name, flush=True)
    return result

with ThreadPoolExecutor(max_workers=4) as pool:
    results = list(pool.map(install, selected))
(ROOT / 'evidence/toolchain.json').write_text(json.dumps(results, indent=2) + '\n', encoding='utf-8')
java = next((TOOLS / 'jdk').glob('*/bin/java.exe'))
android = next((TOOLS / 'sdk').glob('*/android.jar'))
build_tools = next((TOOLS / 'sdk').glob('*/aapt2.exe')).parent
config = {'java_home':str(java.parent.parent), 'android_jar':str(android), 'build_tools':str(build_tools)}
(ROOT / '.tools/paths.json').write_text(json.dumps(config, indent=2) + '\n', encoding='utf-8')
print('Toolchain ready', flush=True)
