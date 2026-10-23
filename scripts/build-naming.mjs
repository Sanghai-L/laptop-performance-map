import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const data=JSON.parse(await readFile(path.join(root,'catalogue/naming-rules.json'),'utf8'));
const context={window:{}};vm.createContext(context);
for(const name of ['data','catalog'])vm.runInContext(await readFile(path.join(root,'dist',name+'.js'),'utf8'),context);
const models=context.window.CPU_GUIDE.models;
for(const e of data.examples){if(e.modelId&&!models.some(m=>m.id===e.modelId&&m.brand===e.brand))throw Error('Missing naming example '+e.modelId);if(!e.modelId&&(!e.name||!e.brand))throw Error('Invalid naming example');}
function validate(value){if(value&&typeof value==='object'){if('zh' in value&&(!value.zh||typeof value.en!=='string'||!value.en||/[\u3400-\u9fff]/.test(value.en)))throw Error('Incomplete bilingual naming text');for(const v of Object.values(value))validate(v);}}
validate(data);
for(const brand of Object.values(data.brands))for(const source of brand.sources)if(!source.url.startsWith('https://'))throw Error('Invalid official source URL');
await writeFile(path.join(root,'dist/naming-data.js'),"'use strict';\nwindow.CPU_NAMING_DATA="+JSON.stringify(data)+';\n');
console.log(JSON.stringify({brands:Object.keys(data.brands).length,examples:data.examples.length,marks:Object.values(data.brands).reduce((n,b)=>n+b.marks.length,0)}));
