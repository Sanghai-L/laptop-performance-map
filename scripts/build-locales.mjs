import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const source=path.join(root,'locales','en.json');
const dictionary=JSON.parse(await readFile(source,'utf8'));
for(const [key,value] of Object.entries(dictionary))if(!key||typeof value!=='string')throw new Error('Invalid translation: '+key);
await mkdir(path.join(root,'dist','locales'),{recursive:true});
await writeFile(path.join(root,'dist','locales','en.js'),"'use strict';\nwindow.CPU_EN="+JSON.stringify(dictionary)+';\n');
console.log(`Built ${Object.keys(dictionary).length} English translations.`);
