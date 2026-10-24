import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {explain,tiers} from './profile-editorial.mjs';
const root=path.resolve(import.meta.dirname,'..');
const read=file=>readFile(path.join(root,file),'utf8').then(JSON.parse);
const models=await read('catalogue/processor-specs.json');
const releases=await read('catalogue/processor-releases.json');
const B=(zh,en)=>({zh,en});
const core=m=>parseInt(m.cores);
const name=m=>m.brand==='Qualcomm'?m.variant:m.name.replace(/^Apple /,'');
const englishGpu=g=>g.replace(/(\d+) 核 Apple GPU/,'$1-core Apple GPU').replace('无集成显卡','no integrated GPU').replace('（需符合内存条件）',' (memory conditions apply)');
const explicit={
 'intel-315':'intel-304','intel-304':'intel-315','intel-360':'intel-315',
 'intel-n100':'intel-i3-n305','intel-i3-n305':'intel-n100',
 '258v':'255h','intel-238v':'258v','intel-288v':'258v',
 '358h':'intel-386h','intel-386h':'358h',
 'amd-ryzen-ai-max-388':'amd-ryzen-ai-max-395','amd-ryzen-ai-max-392':'amd-ryzen-ai-max-395',
 'amd-ryzen-ai-max-395':'amd-ryzen-ai-max-388','370':'amd-ryzen-ai-7-350',
 'amd-ryzen-ai-9-365':'370','450':'amd-ryzen-ai-5-435',
 'amd-ryzen-ai-5-430':'amd-ryzen-ai-5-435',
 'amd-7520u':'amd-7530u','amd-7730u':'amd-7840u','amd-7840u':'amd-7730u',
 '9955hx':'amd-ryzen-9-9955hx3d','amd-ryzen-9-9955hx3d':'9955hx',
 'apple-m5-pro-18-20':'apple-m5-max-18-40','apple-m5-max-18-40':'apple-m5-pro-18-20'
};
const editorial=Object.fromEntries(models.map(m=>[m.id,explain(m)]));
function compare(m){
  let peer=models.find(x=>x.id===explicit[m.id]);
  const peers=models.filter(x=>x.id!==m.id&&x.brand===m.brand&&x.family===m.family);
  if(!peer&&m.brand==='Apple')peer=peers.find(x=>x.name===m.name&&core(x)===core(m)&&x.gpu!==m.gpu)||peers.find(x=>x.name===m.name&&core(x)!==core(m));
  if(!peer)peer=peers.find(x=>core(x)!==core(m))||peers.find(x=>x.gpu!==m.gpu)||peers.find(x=>x.coreNote!==m.coreNote)||peers[0];
  if(!peer)return B('这类 CPU 的定位以日常使用为主；不要仅凭核心总数与高功耗平台比较。','This CPU focuses on everyday use. Core totals alone do not make it comparable to high-power platforms.');
  const a=releases.models[m.id],b=releases.models[peer.id];
  const prefixZh=`与 ${name(peer)} 相比：`,prefixEn=`Compared with ${name(peer)}: `;
  if(/9955HX/.test(m.name)&&/9955HX/.test(peer.name))return B(prefixZh+'同为 16 核 32 线程；HX3D 多出的 3D V-Cache 主要帮助部分游戏，不能直接等同于所有编译和渲染都更快。',prefixEn+'both have 16 cores and 32 threads. HX3D adds 3D V-Cache for some games; that does not automatically speed up every build or render.');
  const factsZh=[],factsEn=[];
  if(core(m)!==core(peer)){
    factsZh.push(`CPU 为 ${core(m)} 核，对方为 ${core(peer)} 核`);
    factsEn.push(`${core(m)} CPU cores versus ${core(peer)}`);
  }
  if(m.gpu!==peer.gpu){
    if(core(m)===core(peer)){factsZh.push(`CPU 同为 ${core(m)} 核`);factsEn.push(`both have ${core(m)} CPU cores`);}
    factsZh.push(`集显为 ${m.gpu}，对方为 ${peer.gpu}`);
    factsEn.push(`integrated graphics are ${englishGpu(m.gpu)} versus ${englishGpu(peer.gpu)}`);
  }else if(core(m)!==core(peer)){
    factsZh.push(`集显均标注为 ${m.gpu}`);
    factsEn.push(`both list ${englishGpu(m.gpu)} integrated graphics`);
  }
  if(!factsZh.length&&a.maxTurboGHz&&b?.maxTurboGHz&&a.maxTurboGHz!==b.maxTurboGHz){
    factsZh.push(`核心规模和集显型号相同，最高睿频 ${a.maxTurboGHz.toFixed(1)} GHz，对方 ${b.maxTurboGHz.toFixed(1)} GHz`);
    factsEn.push(`the same core count and GPU model, with maximum turbo of ${a.maxTurboGHz.toFixed(1)} GHz versus ${b.maxTurboGHz.toFixed(1)} GHz`);
    return B(prefixZh+factsZh.join('；')+'；属于同一性能级别，频率差不等于整体速度差。',prefixEn+factsEn.join('; ')+'. These belong to the same broad class; a clock difference is not an equivalent overall speed difference.');
  }
  if(!factsZh.length&&m.power!==peer.power){
    factsZh.push(`CPU 核心规模相同，主要区别在频率与功耗配置；本型号为 ${m.power}`);
    factsEn.push(`the same CPU core count; frequency and power settings are the main distinction. This model is rated ${m.power.replace('基础功耗','base power').replace('默认 TDP','default TDP').replace('见官方 / 整机规格','see vendor/laptop specifications')}`);
  }
  if(factsZh.length)return B(prefixZh+factsZh.join('；')+'。CPU 计算与图形性能要分开看。',prefixEn+factsEn.join('; ')+'. CPU compute and graphics performance are separate.');
  if(m.coreNote!==peer.coreNote)return B(prefixZh+'核心总数相同，但架构或核心组合不同；新旧架构不能只按“同为几核”画等号。',prefixEn+'the total core count matches, but architecture or core composition differs. Equal core totals do not establish equal performance.');
  return B(prefixZh+'核心规模和集显型号相同，处于相近性能级别；更应比较具体整机的持续功耗与散热，而不是只看型号数字。',prefixEn+'the core count and GPU model match, placing them in a similar broad class. Compare sustained laptop power and cooling rather than model numbers alone.');
}
for(const m of models){
  const data=releases.models[m.id];
  if(!data?.release)throw Error('Missing release '+m.id);
  for(const entry of [data.release,data.configurationRelease].filter(Boolean)){
    const host=new URL(entry.source).hostname;
    if(!/^(?:[\w-]+\.)*(?:intel\.com|amd\.com|apple\.com|qualcomm\.com)$/.test(host))throw Error('Non-vendor date source '+m.id);
    if(entry.precision!=='unknown'&&!/^\d{4}(?:-Q[1-4]|-\d{2}(?:-\d{2})?)?$/.test(entry.date))throw Error('Invalid date '+m.id);
    if(entry.date&&entry.date.slice(0,4)>'2026')throw Error('Unexpected future date '+m.id);
  }
  const e=editorial[m.id];e.difference=compare(m);
  e.release=data.release;
  if(data.configurationRelease)e.configurationRelease=data.configurationRelease;
  if(data.maxTurboGHz)e.maxTurboGHz=data.maxTurboGHz;
  m.role=tiers[e.tier].zh;m.summary=e.summary.zh;
}
for(const [id,e] of Object.entries(editorial))for(const field of ['summary','difference']){
  if(!e[field].zh||!e[field].en||/[\u3400-\u9fff]/.test(e[field].en))throw Error('Incomplete translation '+id+' '+field);
}
if(models.length!==Object.keys(releases.models).length)throw Error('Release data coverage mismatch');
const output={checked:releases.checked,tiers,models:editorial};
await writeFile(path.join(root,'catalogue/processor-profiles.json'),JSON.stringify(output,null,2)+'\n');
await writeFile(path.join(root,'catalogue/processor-specs.json'),JSON.stringify(models,null,2)+'\n');
await writeFile(path.join(root,'dist/catalog.js'),"'use strict';\n// Generated from catalogue/processor-specs.json by scripts/build-profiles.mjs.\nwindow.CPU_GUIDE.checked='"+releases.checked+"';\nwindow.CPU_GUIDE.models="+JSON.stringify(models)+';\n');
await writeFile(path.join(root,'dist/profiles.js'),"'use strict';\nwindow.CPU_PROFILES="+JSON.stringify(output)+';\n');
console.log(JSON.stringify({entries:models.length,editorialGroups:new Set(Object.values(editorial).map(x=>x.group)).size,tiers:Object.fromEntries(Object.keys(tiers).map(k=>[k,Object.values(editorial).filter(x=>x.tier===k).length])),dated:Object.values(editorial).filter(x=>x.release.date).length,undisclosed:Object.entries(editorial).filter(([,x])=>!x.release.date).map(([id])=>id)}));
