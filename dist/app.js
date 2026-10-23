'use strict';
(() => {
  const D = window.CPU_GUIDE;
  const localize=root=>window.CPU_I18N?.apply(root);
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const params = new URLSearchParams(location.search);
  const state = { category: Object.hasOwn(D.categories, params.get('category')) ? params.get('category') : 'thin', model: '258v', task: D.tasks.some(t => t.id === params.get('task')) ? params.get('task') : 'code', search: '', brand:'all', family:'all', examplesOnly: false };
  const requestedModel = D.models.find(m => m.id === params.get('cpu'));
  if (requestedModel) {
    state.model = requestedModel.id;
    if (!requestedModel.categories.includes(state.category)) state.category = requestedModel.categories[0];
  } else state.model = D.categories[state.category].defaultModel;
  const model = () => D.models.find(m => m.id === state.model);

  function updateURL() {
    const url = new URL(location.href);
    url.searchParams.set('category', state.category);
    url.searchParams.set('cpu', state.model);
    url.searchParams.set('task', state.task);
    url.searchParams.set('lang', window.CPU_I18N.language);
    try { history.replaceState(null, '', url); } catch { /* Some local-file browser policies block history changes. */ }
  }
  function renderCategory() {
    $$('.category').forEach(button => {
      const active = button.dataset.category === state.category;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    $('#category-panel').setAttribute('aria-labelledby', `tab-${state.category}`);
    $('#category-description').textContent = D.categories[state.category].description;
    $('#category-focus').textContent = D.categories[state.category].focus;
    localize($('#category-description'));localize($('#category-focus'));
  }
  const normalize = value => String(value).toLowerCase().replace(/[\s\-®™·+（）()]/g,'').replace(/graphics|gpu/g,'').replace(/英特尔|酷睿/g,'intel').replace(/锐龙/g,'ryzen').replace(/苹果/g,'apple').replace(/骁龙|高通/g,'qualcomm');
  function renderFilters() {
    $('#brand-filter').innerHTML = '<option value="all">全部品牌</option>' + ['Intel','AMD','Apple','Qualcomm'].map(brand => `<option value="${brand}" ${state.brand===brand?'selected':''}>${brand} (${D.models.filter(m=>m.brand===brand).length})</option>`).join('');
    const families = [...new Set(D.models.filter(m=>state.brand==='all'||m.brand===state.brand).map(m=>m.family))];
    if (!families.includes(state.family)) state.family='all';
    $('#family-filter').innerHTML = '<option value="all">全部系列</option>' + families.map(family=>`<option value="${escape(family)}" ${state.family===family?'selected':''}>${escape(family)}</option>`).join('');
  }
  function renderModels() {
    localize($('#brand-filter'));localize($('#family-filter'));
    const query = normalize(state.search.trim());
    const terms=state.search.trim().split(/\s+/).map(normalize).filter(Boolean);
    const global = !!query || state.brand!=='all' || state.family!=='all';
    const list = D.models.filter(m => (!state.examplesOnly || window.CPU_NOTEBOOKS.has(m.id)) && (global || m.categories.includes(state.category)) && (state.brand==='all'||m.brand===state.brand) && (state.family==='all'||m.family===state.family) && (!query || terms.every(term=>normalize(`${m.name} ${m.short} ${m.family} ${m.brand} ${m.gpu} ${m.variant||''} ${(m.aliases||[]).join(' ')}`).includes(term))));
    $('#model-count').textContent = `${list.length} 项`;
    $('#search-hint').textContent = global ? `搜索全部 ${D.models.length} 项型号 / 配置` : `当前查看${D.categories[state.category].title}中常见的系列`;
    let lastFamily='';
    $('#model-list').innerHTML = list.length ? list.map(m => {
      const group = lastFamily!==m.family ? `<div class="model-group-title">${escape(m.brand)} · ${escape(m.family)}</div>` : ''; lastFamily=m.family;
      return group+`<button class="model-button ${m.id === state.model ? 'selected' : ''}" data-model="${m.id}" aria-pressed="${m.id === state.model}" aria-label="了解 ${escape(m.name)}${m.variant ? '，' + escape(m.variant) : ''}"><span class="model-logo ${m.brand.toLowerCase()}" aria-hidden="true">${({Intel:'intel',AMD:'AMD',Apple:'M',Qualcomm:'S'})[m.brand]}</span><span><strong>${escape(m.short)}</strong><small>${escape(m.variant || m.role)}</small></span><span class="model-arrow" aria-hidden="true">↗</span></button>`;
    }).join('') : '<p class="empty-state">没有找到匹配项。可以重置筛选，或尝试完整型号，例如“i5-13420H”“8845HS”“Arc 140V”。</p>';
    localize($('#model-count'));localize($('#search-hint'));localize($('#model-list'));
    const selected=$('.model-button.selected'),listNode=$('#model-list');
    if(selected){const a=selected.getBoundingClientRect(),b=listNode.getBoundingClientRect();if(a.top<b.top||a.bottom>b.bottom)listNode.scrollTop+=a.top-b.top-8;}
  }
  function renderProfile() {
    localize($('#model-count'));localize($('#search-hint'));localize($('#model-list'));
    const m = model();
    $('#cpu-profile').innerHTML = `<div class="profile-meta"><span class="profile-tag">${escape(m.family)}</span><span>${escape(m.platform)}</span><a href="${m.source}" target="_blank" rel="noopener noreferrer" style="margin-left:auto;text-decoration:underline;text-underline-offset:3px">官方规格 ↗</a></div>
      <div class="profile-title"><div><span class="profile-brand">${escape(m.brand.toUpperCase())}${m.variant ? ' / ' + escape(m.variant) : ' / PROCESSOR'}</span><h3 id="cpu-name">${escape(m.name)}</h3></div><span class="profile-symbol" aria-hidden="true">✳</span></div>
      <p class="profile-summary">${escape(m.summary)}</p>
      <button class="profile-naming-link text-button" data-naming-model="${escape(m.id)}">这个型号怎么读？ ↗</button>
      <dl class="specs"><div><dt>CPU 核心</dt><dd>${escape(m.cores)}<small>${escape(m.coreNote)}</small></dd></div><div><dt>集成显卡</dt><dd>${escape(m.gpu)}<small>${m.graphics==='none'?'需要整机另配显卡':'集显游戏体验见下方 ↓'}</small></dd></div><div><dt>功耗规格</dt><dd>${escape(m.power)}<small>${escape(m.powerNote)}</small></dd></div></dl>
      <p class="profile-footnote">同一 CPU 的实际速度和续航，还取决于整机散热、功耗和电池。</p>`;
    localize($('#cpu-profile'));
    window.CPU_NAMING.setCurrent(m);
    window.CPU_NOTEBOOKS.renderExamples(m);
    renderTask();
    window.CPU_GAMES.update(m);
  }
  function renderTask() {
    $('#task-list').innerHTML = D.tasks.map(t => `<button class="task-button ${t.id === state.task ? 'selected' : ''}" data-task="${t.id}" aria-pressed="${t.id === state.task}"><span aria-hidden="true">${t.icon}</span>${t.label}</button>`).join('');
    const r = window.CPU_TASKS.explain(model(), state.task);
    $('#task-result').className = `task-result ${r.kind}`;
    $('#task-result').innerHTML = `<div class="result-label">${D.tasks.find(t => t.id === state.task).label} / 用途解读</div><h5>${escape(r.title)}</h5><p>${escape(r.body)}</p><dl class="task-facts">${r.facts.map(f=>`<div><dt>${escape(f.label)}</dt><dd>${escape(f.text)}</dd></div>`).join('')}</dl><div class="task-extra"><b>使用建议</b><span>${escape(r.check)}</span></div>`;
    localize($('#task-list'));localize($('#task-result'));
  }
  function chooseCategory(category, focus = false) {
    state.category = category;
    state.model = D.categories[category].defaultModel;
    state.search = '';
    state.brand='all';state.family='all';state.examplesOnly=false;$('#examples-only').checked=false;renderFilters();
    $('#model-search').value = '';
    renderCategory(); renderModels(); renderProfile(); updateURL();
    if (focus) $(`#tab-${category}`).focus();
  }
  $('.category-tabs').addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (button) chooseCategory(button.dataset.category);
  });
  $('.category-tabs').addEventListener('keydown', event => {
    if (!['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const keys = Object.keys(D.categories);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? keys.length - 1 : (keys.indexOf(state.category) + (event.key === 'ArrowRight' ? 1 : -1) + keys.length) % keys.length;
    chooseCategory(keys[next], true);
  });
  $('#model-search').addEventListener('input', event => { state.search = event.target.value; renderModels(); });
  $('#brand-filter').addEventListener('change',event=>{state.brand=event.target.value;state.family='all';renderFilters();renderModels();});
  $('#family-filter').addEventListener('change',event=>{state.family=event.target.value;renderModels();});
  $('#reset-filters').addEventListener('click',()=>{state.search='';state.brand='all';state.family='all';state.examplesOnly=false;$('#examples-only').checked=false;$('#model-search').value='';renderFilters();renderModels();});
  $('#examples-only').addEventListener('change',event=>{state.examplesOnly=event.target.checked;renderModels();});
  $('#model-list').addEventListener('click', event => {
    const button = event.target.closest('[data-model]');
    if (!button) return;
    state.model = button.dataset.model;
    if (!model().categories.includes(state.category)) { state.category = model().categories[0]; renderCategory(); }
    renderModels(); renderProfile(); updateURL();
    $(`[data-model="${state.model}"]`).focus({preventScroll:true});
  });
  $('#task-list').addEventListener('click', event => {
    const button = event.target.closest('[data-task]');
    if (!button) return;
    state.task = button.dataset.task;
    renderTask(); updateURL();
    $(`[data-task="${state.task}"]`).focus({preventScroll:true});
  });
  let toastTimer;
  function toast(message) {
    clearTimeout(toastTimer);
    $('#toast').textContent = window.CPU_I18N.t(message);
    $('#toast').classList.add('visible');
    toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3500);
  }
  $('#share-model').addEventListener('click', async () => {
    if (location.protocol === 'file:') { toast('本地文件无法生成公开链接；在在线页面可复制当前讲解链接。'); return; }
    const url = new URL(location.href); url.hash = 'explore';
    try { await navigator.clipboard.writeText(url.href); toast('链接已复制。'); }
    catch { toast('浏览器未允许复制。可直接复制地址栏中的链接。'); }
  });

  document.addEventListener('click', event => {
    const button=event.target.closest('[data-open-cpu]');
    if(!button)return;
    const m=D.models.find(item=>item.id===button.dataset.openCpu);
    if(!m)return;
    state.model=m.id;state.category=m.categories[0];state.search='';state.brand='all';state.family='all';state.examplesOnly=false;
    $('#model-search').value='';$('#examples-only').checked=false;
    renderFilters();renderCategory();renderModels();renderProfile();updateURL();
    const destination=button.dataset.target==='igpu'?'#igpu':'#cpu-panel';
    $(destination).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
    if(destination==='#cpu-panel'){$('#cpu-name').tabIndex=-1;$('#cpu-name').focus({preventScroll:true});}
  });
  $('#source-list').className = 'source-list';
  $('#source-list').innerHTML = D.models.map(m => `<div><a href="${m.source}" target="_blank" rel="noopener noreferrer">${escape(m.name)}${m.variant ? ' / '+escape(m.variant) : ''} ↗</a></div>`).join('') + '<div><a href="https://support.microsoft.com/en-us/windows/experience/platform-variants/windows-arm-based-pcs-faq" target="_blank" rel="noopener noreferrer">微软 · Windows Arm 兼容性说明 ↗</a></div>';
  $('#catalog-scope').textContent=`已收录 ${D.models.length} 项型号 / 配置：${['Intel','AMD','Apple','Qualcomm'].map(b=>b+' '+D.models.filter(m=>m.brand===b).length+' 项').join('，')}。按系列覆盖主流与近代机型，部分旧款仍可见于销售渠道；不是逐店实时库存。资料核对：${D.checked}。`;
  renderFilters(); renderCategory(); renderModels(); renderProfile(); window.CPU_NOTEBOOKS.init(); window.CPU_NAMING.init(); updateURL();localize();
})();
