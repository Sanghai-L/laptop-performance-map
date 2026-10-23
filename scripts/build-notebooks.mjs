import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const data=JSON.parse(await readFile(path.join(root,'catalogue/notebook-examples.json'),'utf8'));
const context={window:{}};vm.createContext(context);
for(const name of ['data','catalog'])vm.runInContext(await readFile(path.join(root,'dist',name+'.js'),'utf8'),context);
const ids=new Set(context.window.CPU_GUIDE.models.map(m=>m.id));
const seen=new Set();
for(const item of data.processors){
  if(!ids.has(item.cpuId)||seen.has(item.cpuId)||!item.laptops.length)throw Error('Invalid CPU example: '+item.cpuId);
  seen.add(item.cpuId);
  for(const laptop of item.laptops)if(!/^https:\/\//.test(laptop.url)||!laptop.name.en||!laptop.config.en||!laptop.region.en)throw Error('Incomplete bilingual laptop record: '+item.cpuId);
}
for(const intro of data.intro)if(!seen.has(intro.cpuId))throw Error('Missing introductory laptop: '+intro.cpuId);
await writeFile(path.join(root,'dist/notebooks-data.js'),"'use strict';\nwindow.CPU_NOTEBOOK_DATA="+JSON.stringify(data)+';\n');
console.log(JSON.stringify({processors:data.processors.length,laptops:data.processors.reduce((n,c)=>n+c.laptops.length,0),intro:data.intro.length}));
