'use strict';
(() => {
  const D=window.CPU_NOTEBOOK_DATA;
  const language=window.CPU_I18N.language;
  const e=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const text=value=>typeof value==='string'?value:(value?.[language]||value?.zh||'');
  const localize=root=>window.CPU_I18N.apply(root);
  const byCPU=new Map(D.processors.map(item=>[item.cpuId,item]));
  let current=0;
  const getModel=id=>window.CPU_GUIDE.models.find(item=>item.id===id);
  function renderExamples(model){
    const root=document.querySelector('#notebook-examples');
    const entry=byCPU.get(model.id);
    root.hidden=!entry;
    if(!entry){root.replaceChildren();return;}
    root.innerHTML=`<section class="notebook-examples" aria-labelledby="notebook-examples-title"><div class="notebook-examples-heading"><h4 id="notebook-examples-title">搭载这颗 CPU 的笔记本</h4><span>${e(D.checked)}</span></div><div class="notebook-example-list">${entry.laptops.map(l=>`<article class="notebook-example"><div class="notebook-example-title"><strong>${e(text(l.name))}</strong><a href="${e(l.url)}" target="_blank" rel="noopener noreferrer">官方配置 ↗</a></div><p>${e(text(l.config))}</p><small>${e(text(l.region))}${l.historical?' · '+e(language==='en'?'Historical configuration':'历史配置示例'):''}</small></article>`).join('')}</div><p class="notebook-example-note">同一系列还有其他处理器版本，按这里的子型号与配置核对。</p></section>`;
    localize(root);
  }
  function renderStarter(){
    const cards=document.querySelector('#intro-cards');
    cards.innerHTML=D.intro.map((item,i)=>{
      const entry=byCPU.get(item.cpuId), laptop=entry.laptops[0],model=getModel(item.cpuId);
      return `<button class="starter-card ${i===current?'selected':''}" role="tab" id="intro-tab-${i}" aria-selected="${i===current}" aria-controls="intro-detail" tabindex="${i===current?'0':'-1'}" data-intro="${i}" style="--case-color:${item.color}"><span class="starter-card-top"><span class="case-counter">0${i+1}</span><span>${e(text(item.tag))}</span><span aria-hidden="true">↗</span></span><span class="notebook-sketch" aria-hidden="true"><span class="sketch-screen"><i></i><i></i><i></i><span>${e(model.brand)}</span></span><span class="sketch-base"></span></span><span class="starter-laptop">${e(text(laptop.name))}</span><span class="starter-cpu-label">里面的 CPU</span><strong class="starter-cpu">${e(model.name)}</strong><span class="starter-caption">${e(text(item.caption))}</span></button>`;
    }).join('');
    const item=D.intro[current],entry=byCPU.get(item.cpuId),laptop=entry.laptops[0],model=getModel(item.cpuId);
    const detail=document.querySelector('#intro-detail');
    detail.setAttribute('aria-labelledby',`intro-tab-${current}`);
    detail.innerHTML=`<div class="starter-concept"><p class="eyebrow muted">这一例子，先看懂：</p><h2>${e(text(item.concept))}</h2><p>${e(text(item.explanation))}</p><a href="${e(laptop.url)}" target="_blank" rel="noopener noreferrer">官方配置 ↗</a></div><div class="starter-use"><div><h3>它能做什么</h3><p>${e(text(item.ability))}</p></div><div><h3>任务变重以后</h3><p>${e(text(item.boundary))}</p></div><div class="starter-actions"><button class="primary" data-open-cpu="${e(item.cpuId)}">继续看这颗 CPU ↗</button><button class="text-button" data-open-cpu="${e(item.cpuId)}" data-target="igpu">看看集显游戏 ↓</button></div></div>`;
    localize(cards);localize(detail);
  }
  function init(){
    renderStarter();
    const cards=document.querySelector('#intro-cards');
    cards.addEventListener('click',event=>{const button=event.target.closest('[data-intro]');if(!button)return;current=Number(button.dataset.intro);renderStarter();document.querySelector('#intro-tab-'+current).focus({preventScroll:true});});
    cards.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();current=event.key==='Home'?0:event.key==='End'?D.intro.length-1:(current+(event.key==='ArrowRight'?1:-1)+D.intro.length)%D.intro.length;
      renderStarter();document.querySelector('#intro-tab-'+current).focus({preventScroll:true});
    });
  }
  window.CPU_NOTEBOOKS={has:id=>byCPU.has(id),renderExamples,init};
})();
