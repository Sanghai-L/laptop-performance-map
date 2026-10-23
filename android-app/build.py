"""Rebuild the signed universal APK using only the pinned project-local tools."""
from pathlib import Path
import hashlib
import json
import os
import secrets
import shutil
import subprocess
import time
import zipfile

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT.parent / 'dist'
BUILD = ROOT / 'build' / str(int(time.time()))
OUTPUT = ROOT / 'output'
EVIDENCE = ROOT / 'evidence'
SIGNING = ROOT / '.signing'
for folder in [BUILD, OUTPUT, EVIDENCE, SIGNING]: folder.mkdir(parents=True,exist_ok=True)
config=json.loads((ROOT / '.tools/paths.json').read_text(encoding='utf-8'))
JAVA=Path(config['java_home']) / 'bin/java.exe'
JAVAC=JAVA.with_name('javac.exe')
KEYTOOL=JAVA.with_name('keytool.exe')
SDK=Path(config['android_jar'])
TOOLS=Path(config['build_tools'])
logs=[]

def run(args):
    result=subprocess.run([str(a) for a in args],cwd=ROOT,encoding='utf-8',errors='replace',stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
    logs.append({'command':[str(a) for a in args], 'exit_code':result.returncode,'output':result.stdout})
    if result.stdout.strip(): print(result.stdout.strip(),flush=True)
    if result.returncode:
        (EVIDENCE/'build-log.json').write_text(json.dumps(logs,ensure_ascii=False,indent=2),encoding='utf-8')
        raise RuntimeError('Build step failed: '+str(args[0]))
    return result.stdout

def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()

# A new snapshot per build preserves the user's website and any in-progress edits.
assets=BUILD/'assets/site'
assets.mkdir(parents=True)
snapshot=[]
for path in sorted(SOURCE.rglob('*')):
    if not path.is_file(): continue
    relative=path.relative_to(SOURCE)
    before=sha(path)
    destination=assets/relative
    destination.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(path,destination)
    if sha(path)!=before or sha(destination)!=before: raise RuntimeError('Website changed while copying: '+str(relative))
    snapshot.append({'path':relative.as_posix(),'bytes':destination.stat().st_size,'sha256':before})
for item in snapshot:
    if sha(SOURCE / item['path']) != item['sha256']:
        raise RuntimeError('Website changed before snapshot completed: '+item['path'])

resources=BUILD/'resources.zip'
generated=BUILD/'generated'
classes=BUILD/'classes'
dex=BUILD/'dex'
for folder in [generated,classes,dex]: folder.mkdir()
base=BUILD/'base.apk'
run([TOOLS/'aapt2.exe','compile','--dir',ROOT/'res','-o',resources])
run([TOOLS/'aapt2.exe','link','-I',SDK,'--manifest',ROOT/'AndroidManifest.xml','--java',generated,'-A',assets.parent,'-o',base,resources])
sources=list((ROOT/'src').rglob('*.java'))+list(generated.rglob('*.java'))
boot_classpath=str(SDK)+os.pathsep+str(TOOLS/'core-lambda-stubs.jar')
run([JAVAC,'-J-Duser.language=en','-J-Dfile.encoding=UTF-8','-encoding','UTF-8','-source','8','-target','8','-bootclasspath',boot_classpath,'-d',classes,*sources])
run([JAVA,'-cp',TOOLS/'lib/d8.jar','com.android.tools.r8.D8','--release','--min-api','26','--lib',SDK,'--output',dex,*classes.rglob('*.class')])
unsigned=BUILD/'unsigned.apk'
with zipfile.ZipFile(base) as original, zipfile.ZipFile(unsigned,'w') as apk:
    # Rewrite both local and central headers together before adding DEX. Appending
    # with Python can otherwise change UTF-8 flags only in aapt2's central headers.
    for info in original.infolist(): apk.writestr(info,original.read(info.filename))
    for path in dex.glob('*.dex'): apk.write(path,path.name)
aligned=BUILD/'aligned.apk'
run([TOOLS/'zipalign.exe','-f','-p','4',unsigned,aligned])
password_file=SIGNING/'store-password.txt'
key=SIGNING/'laptop-map-release.p12'
if not password_file.exists(): password_file.write_text(secrets.token_urlsafe(36),encoding='utf-8')
if not key.exists():
    run([KEYTOOL,'-genkeypair','-keystore',key,'-storetype','PKCS12','-alias','laptopmap','-keyalg','RSA','-keysize','3072','-validity','10000',
         '-storepass:file',password_file,'-keypass:file',password_file,'-dname','CN=Laptop Performance Map, O=Offline Application, C=CN'])
apk=OUTPUT/'Laptop-Performance-Map-1.0.0.apk'
run([JAVA,'-jar',TOOLS/'lib/apksigner.jar','sign','--ks',key,'--ks-key-alias','laptopmap','--ks-pass','file:'+str(password_file),
     '--v1-signing-enabled','false','--v2-signing-enabled','true','--v3-signing-enabled','true','--v4-signing-enabled','false','--out',apk,aligned])
signature=run([JAVA,'-jar',TOOLS/'lib/apksigner.jar','verify','--verbose','--print-certs',apk])
run([TOOLS/'zipalign.exe','-c','-p','4',apk])
badging=run([TOOLS/'aapt2.exe','dump','badging',apk])
permissions=run([TOOLS/'aapt2.exe','dump','permissions',apk])
with zipfile.ZipFile(apk) as archive:
    if archive.testzip() is not None: raise RuntimeError('Corrupt APK ZIP')
    if not archive.read('classes.dex').startswith(b'dex\n'): raise RuntimeError('DEX missing')
    for item in snapshot:
        if hashlib.sha256(archive.read('assets/site/'+item['path'])).hexdigest()!=item['sha256']:
            raise RuntimeError('Asset mismatch: '+item['path'])
    if b'android.permission.' in permissions.encode(): raise RuntimeError('Unexpected app permissions')
report={'status':'passed','apk':str(apk),'bytes':apk.stat().st_size,'sha256':sha(apk),'application_id':'app.laptopmap.offline',
        'version':'1.0.0','minimum_android':'8.0 (API 26)','target_sdk':36,'permissions':[],
        'signature':signature,'assets':snapshot,'snapshot_root':str(assets),'build_dir':str(BUILD),
        'checks':['Java compiled against Android API36','D8 generated Android-compatible DEX','APK alignment verified','v2/v3 signatures verified',
                  'aapt2 manifest/resource/package checks passed','All bundled website asset SHA256 hashes match source snapshot'],
        'runtime_note':'No physical Android device or emulator was used; browser content QA is recorded separately.'}
(EVIDENCE/'build-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(EVIDENCE/'build-log.json').write_text(json.dumps(logs,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(OUTPUT/'SHA256.txt').write_text(report['sha256']+'  '+apk.name+'\n',encoding='ascii')
shutil.copy2(ROOT/'README.md',OUTPUT/'安装说明.md')
print(json.dumps({'apk':str(apk),'bytes':report['bytes'],'sha256':report['sha256'],'assets':len(snapshot)},ensure_ascii=False),flush=True)
