'use strict';
(() => {
  const params=new URLSearchParams(location.search);
  let saved;
  try{saved=localStorage.getItem('laptop-map-language');}catch{}
  const language=['zh','en'].includes(params.get('lang'))?params.get('lang'):saved==='en'?'en':'zh';
  const dictionary=window.CPU_EN||{};
  const han=/[\u3400-\u9fff]/;
  const entries=Object.entries(dictionary).filter(([k])=>han.test(k)&&k.length>1).sort((a,b)=>b[0].length-a[0].length);
  const singles=Object.entries(dictionary).filter(([k])=>han.test(k)&&k.length===1);
  const untranslated=new Set();
  const cache=new Map();
  const formats=[
    [/^查看 (\d+) 条样本与测试条件\s*$/,(_,n)=>`View ${n} ${n==='1'?'sample':'samples'} and test conditions `],
    [/^第 (\d+) 题 \/ 共 (\d+) 题$/,(_,n,total)=>`Question ${n} of ${total}`],
    [/^完成 · (\d+) \/ (\d+) 题答对$/,(_,n,total)=>`Finished · ${n} / ${total} correct`],
    [/^搜索全部 (\d+) 项型号 \/ 配置$/,(_,n)=>`Search all ${n} models / configurations`],
    [/^已收录 (\d+) 项型号 \/ 配置：(.+)。按系列覆盖主流与近代机型，部分旧款仍可见于销售渠道；不是逐店实时库存。资料核对：(.+)。$/,(_,n,brands,date)=>`Catalog: ${n} models / configurations (${brands.replace(/ 项/g,'').replace(/，/g,', ')}). Major current and recent laptop families; some older chips are still sold. This is not a live store inventory. Checked: ${date}.`]
  ];
  function t(value){
    const original=String(value);
    if(language!=='en'||!han.test(original))return original;
    if(cache.has(original))return cache.get(original);
    for(const [pattern,format] of formats)if(pattern.test(original)){const result=original.replace(pattern,format);cache.set(original,result);return result;}
    if(Object.hasOwn(dictionary,original))return dictionary[original];
    const trimmed=original.trim();
    if(Object.hasOwn(dictionary,trimmed))return original.replace(trimmed,dictionary[trimmed]);
    let text=original;
    for(const [from,to] of entries)if(text.includes(from))text=text.split(from).join(to);
    text=text.replace(/(\d+)\s*核\s*\/\s*(\d+)\s*线程/g,'$1 cores / $2 threads')
      .replace(/(\d+)\s*核 Apple GPU/g,'$1-core Apple GPU').replace(/(\d+)\s*核 CPU/g,'$1-core CPU')
      .replace(/(\d+)\s*核 GPU/g,'$1-core GPU').replace(/(\d+)\s*性能核/g,'$1 performance cores')
      .replace(/(\d+)\s*低功耗能效核/g,'$1 low-power efficiency cores').replace(/(\d+)\s*能效核/g,'$1 efficiency cores')
      .replace(/第\s*(\d+)\s*代/g,'Gen $1').replace(/(\d+)\s*项/g,'$1 entries');
    for(const [from,to] of singles)if(text.includes(from))text=text.split(from).join(to);
    text=text.replace(/；/g,'; ').replace(/，/g,', ').replace(/。/g,'. ').replace(/：/g,': ').replace(/、/g,', ').replace(/（/g,'(').replace(/）/g,')').replace(/《/g,'“').replace(/》/g,'”');
    if(han.test(text))untranslated.add(original);
    cache.set(original,text);
    return text;
  }
  function apply(root=document){
    if(language!=='en'||!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){return !node.parentElement?.closest('script,style,[data-no-translate]')&&han.test(node.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    for(const node of nodes)node.nodeValue=t(node.nodeValue);
    const elements=root.nodeType===1?[root,...root.querySelectorAll('*')]:[...root.querySelectorAll('*')];
    for(const element of elements){
      if(element.closest('[data-no-translate]'))continue;
      for(const name of ['aria-label','placeholder','title','alt'])if(element.hasAttribute(name))element.setAttribute(name,t(element.getAttribute(name)));
      if(element.matches('meta[name="description"]'))element.content=t(element.content);
    }
  }
  document.documentElement.lang=language==='en'?'en':'zh-CN';
  document.documentElement.dataset.language=language;
  document.querySelectorAll('[data-language]').forEach(button=>{button.setAttribute('aria-pressed',String(button.dataset.language===language));button.classList.toggle('selected',button.dataset.language===language);});
  document.querySelector('.language-switch')?.addEventListener('click',event=>{
    const button=event.target.closest('[data-language]');if(!button)return;
    const next=button.dataset.language;try{localStorage.setItem('laptop-map-language',next);}catch{}
    const url=new URL(location.href);url.searchParams.set('lang',next);location.assign(url.href);
  });
  window.CPU_I18N={language,t,apply,untranslated};
  apply();
})();
