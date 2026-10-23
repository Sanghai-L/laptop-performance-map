import {readFile,writeFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..');
const output=process.argv[2];
if(!output||!path.isAbsolute(output)||path.relative(root,output).split(path.sep)[0]!=='..')throw new Error('Pass an absolute output path outside the source checkout.');
const files=[];
async function collect(relative){
  const absolute=path.join(root,relative);
  if((await stat(absolute)).isDirectory()){
    for(const name of (await readdir(absolute)).sort())await collect(path.posix.join(relative,name));
  }else{
    const content=await readFile(absolute,'utf8');
    if(/gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|Bearer\s+[A-Za-z0-9_-]{20,}/.test(content))throw new Error('Possible credential in '+relative);
    files.push({path:relative,mode:'100644',type:'blob',content,sha256:createHash('sha256').update(content).digest('hex')});
  }
}
// Export the standalone project. The Site binding and local browser evidence stay local.
for(const relative of ['README.md','README.zh-CN.md','.gitignore','dist','catalogue','locales','scripts'])await collect(relative);
await writeFile(output,JSON.stringify({repository:'Sanghai-L/laptop-performance-map',files}));
console.log(JSON.stringify({output,files:files.length,characters:(await readFile(output,'utf8')).length}));
