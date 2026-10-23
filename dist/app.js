'use strict';
(() => {
  const D = window.CPU_GUIDE;
  const localize=root=>window.CPU_I18N?.apply(root);
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const params = new URLSearchParams(location.search);
  const state = { category: Object.hasOwn(D.categories, params.get('category')) ? params.get('category') : 'thin', model: '258v', task: D.tasks.some(t => t.id === params.get('task')) ? params.get('task') : 'code', search: '', brand:'all', family:'all', memory: 16, cooling: 'limited', graphics: 'integrated', work: 'office', quizIndex: 0, answers: [] };
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
    const list = D.models.filter(m => (global || m.categories.includes(state.category)) && (state.brand==='all'||m.brand===state.brand) && (state.family==='all'||m.family===state.family) && (!query || terms.every(term=>normalize(`${m.name} ${m.short} ${m.family} ${m.brand} ${m.gpu} ${m.variant||''} ${(m.aliases||[]).join(' ')}`).includes(term))));
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
      <dl class="specs"><div><dt>CPU · 处理计算</dt><dd>${escape(m.cores)}<small>${escape(m.coreNote)}</small></dd></div><div><dt>集成 GPU · 处理画面</dt><dd>${escape(m.gpu)}<small>${m.graphics==='none'?'需要整机另配显卡':'集显游戏体验见下方 ↓'}</small></dd></div><div><dt>功耗规格 · 不是跑分</dt><dd>${escape(m.power)}<small>${escape(m.powerNote)}</small></dd></div></dl>
      <p class="profile-footnote">核心数量不可跨架构直接排位；以上为芯片规格，不承诺具体电脑的速度或续航。</p>`;
    localize($('#cpu-profile'));
    renderTask();
    window.CPU_GAMES.update(m);
  }
  function renderTask() {
    $('#task-list').innerHTML = D.tasks.map(t => `<button class="task-button ${t.id === state.task ? 'selected' : ''}" data-task="${t.id}" aria-pressed="${t.id === state.task}"><span aria-hidden="true">${t.icon}</span>${t.label}</button>`).join('');
    const r = window.CPU_TASKS.explain(model(), state.task);
    $('#task-result').className = `task-result ${r.kind}`;
    $('#task-result').innerHTML = `<div class="result-label">${D.tasks.find(t => t.id === state.task).label} / 用途解读</div><h5>${escape(r.title)}</h5><p>${escape(r.body)}</p><dl class="task-facts">${r.facts.map(f=>`<div><dt>${escape(f.label)}</dt><dd>${escape(f.text)}</dd></div>`).join('')}</dl><div class="task-extra"><b>实际怎么用</b><span>${escape(r.check)}</span></div>`;
    localize($('#task-list'));localize($('#task-result'));
  }
  function chooseCategory(category, focus = false) {
    state.category = category;
    state.model = D.categories[category].defaultModel;
    state.search = '';
    state.brand='all';state.family='all';renderFilters();
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
  $('#reset-filters').addEventListener('click',()=>{state.search='';state.brand='all';state.family='all';$('#model-search').value='';renderFilters();renderModels();});
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
    try { await navigator.clipboard.writeText(url.href); toast('已复制当前型号与任务的链接。页面访问权限保持不变。'); }
    catch { toast('浏览器未允许复制。可直接复制地址栏中的链接。'); }
  });

  function renderLab() {
    $('#memory-node b').textContent = `${state.memory} GB`;
    $('#gpu-node b').textContent = state.graphics === 'integrated' ? '集显' : '独显';
    for (const [key, value] of [['memory', state.memory], ['cooling', state.cooling], ['graphics', state.graphics]]) $$(`[data-${key}]`).forEach(button => {
      const active = button.dataset[key] === String(value); button.classList.toggle('selected', active); button.setAttribute('aria-pressed', String(active));
    });
    let title, body;
    const points = [];
    if (state.work === 'office') {
      title = state.memory === 8 ? '先关注内存，而不是只盯着 CPU。' : '日常任务，几位队友一起配合。';
      body = state.memory === 8 ? '同时运行很多网页、会议和文档时，8 GB 内存更容易紧张。若系统频繁向 SSD 换页，即使 CPU 不差也可能感觉卡顿。' : '在内存足够装下当前任务时，普通办公通常不需要把 CPU 长期跑满。内存继续增加也不会让所有操作等比例加快。';
      points.push(state.cooling === 'limited' ? '安静模式可能限制瞬时或持续加速；轻任务中未必有明显影响。' : '更强散热通常对长负载更有意义，日常点击不会按散热能力等比提速。');
      points.push(state.graphics === 'integrated' ? '集显通常可承担桌面和常规视频显示，也会使用系统内存。' : '多一块独显不代表文档和网页自动更快，是否调用由应用和系统决定。');
    } else if (state.work === 'render') {
      title = state.cooling === 'limited' ? '长时间重任务，散热会限制发挥。' : '散热足够，CPU 才更有机会持续工作。';
      body = state.cooling === 'limited' ? 'CPU 刚开始的短时加速不代表半小时后的速度。散热或供电受限时，系统可能降低频率与功耗，延长处理时间。' : '较充足的散热和供电有助于维持持续负载下的频率，但不会增加核心数，也不能让串行软件自动变成并行软件。';
      points.push(state.memory === 8 ? '8 GB 可能装不下复杂项目；换页会拖慢过程，严重时任务会失败。' : state.memory === 16 ? '16 GB 能否装下项目取决于规模、纹理和后台程序，不能保证所有大任务。' : '32 GB 给大项目更多空间；如果任务本来装得下，它不一定更快。');
      points.push(state.graphics === 'dedicated' ? '这是 CPU 渲染 / 编译示例：除非软件有对应加速路径，独显不会直接加速这部分计算。' : '只用集显不妨碍受支持的 CPU 渲染或编译，但视口显示是另一类负载。');
    } else {
      title = state.graphics === 'integrated' ? '高画质大型游戏，先关注图形能力。' : '独显加入后，仍需看它的具体规格。';
      body = state.graphics === 'integrated' ? 'CPU 能算游戏逻辑，不等于集显能流畅画出高画质场景。降低分辨率、画质可能减轻 GPU 压力，具体效果需按游戏实测。' : '独显可以承担图形渲染，但型号、显存与可持续 GPU 功耗差异很大。“有独显”本身还不能保证目标帧率。';
      points.push(state.memory === 8 ? '8 GB 内存可能紧张；集显还会共享它，游戏要求需要单独核对。' : `${state.memory} GB 是容量条件之一；还需要看显存、内存带宽及游戏要求。`);
      points.push(state.cooling === 'limited' ? 'CPU 与 GPU 往往共享散热预算，受限时可能一起降速。' : '更充分的散热可帮助维持表现；屏幕分辨率和游戏设置仍决定压力。');
    }
    $('#lab-result').innerHTML = `<h3>${title}</h3><p>${body}</p><ul class="lab-points">${points.map(t => `<li>${t}</li>`).join('')}</ul><p class="lab-conclusion">原理示意：这些选项不对应某款在售电脑，也不代表其内存或显卡可以后期升级。</p>`;
    localize($('#gpu-node'));localize($('#lab-result'));
  }
  $('#lab-work').addEventListener('change', event => { state.work = event.target.value; renderLab(); });
  for (const [container, key] of [['memory-options','memory'],['cooling-options','cooling'],['graphics-options','graphics']]) $(`#${container}`).addEventListener('click', event => {
    const button = event.target.closest(`[data-${key}]`); if (!button) return;
    state[key] = key === 'memory' ? Number(button.dataset[key]) : button.dataset[key]; renderLab();
  });
  function renderQuiz() {
    const index = state.quizIndex;
    if (index === D.quiz.length) {
      const correct = state.answers.filter((answer, i) => answer === D.quiz[i].answer).length;
      $('#quiz-content').innerHTML = `<p class="quiz-number">完成 · ${correct} / ${D.quiz.length} 题答对</p><p class="quiz-question">现在，把完整型号和真实任务放在一起看。</p><p class="quiz-finish">不需要记住每一个参数。知道 CPU 负责什么、其他部件影响什么，就能少受一个档位数字的误导。</p><button class="quiz-next" data-quiz-restart>再试一次 ↻</button>`;
      localize($('#quiz-content'));return;
    }
    const q = D.quiz[index], answered = state.answers[index] !== undefined, choice = state.answers[index];
    $('#quiz-content').innerHTML = `<div class="quiz-progress" aria-hidden="true">${D.quiz.map((_, i) => `<span class="${i <= index ? 'done' : ''}"></span>`).join('')}</div><p class="quiz-number">第 ${index + 1} 题 / 共 ${D.quiz.length} 题</p><p class="quiz-question">${q.question}</p><div class="quiz-options">${q.options.map((option, i) => `<button class="quiz-option ${answered && i === q.answer ? 'correct' : answered && i === choice ? 'wrong' : ''}" data-answer="${i}" ${answered ? 'disabled' : ''}><span>${String.fromCharCode(65 + i)}</span>${option}${answered && i === q.answer ? ' ✓' : ''}</button>`).join('')}</div><div class="quiz-feedback" aria-live="polite">${answered ? `<strong>${choice === q.answer ? '答对了。' : '这一题换个角度看。'}</strong> ${q.explanation}` : ''}</div>${answered ? `<button class="quiz-next" data-quiz-next>${index === D.quiz.length - 1 ? '完成小测' : '下一题'} →</button>` : ''}`;
    localize($('#quiz-content'));
  }
  $('#quiz-content').addEventListener('click', event => {
    const answer = event.target.closest('[data-answer]');
    if (answer && state.answers[state.quizIndex] === undefined) { state.answers[state.quizIndex] = Number(answer.dataset.answer); renderQuiz(); $('[data-quiz-next]').focus({preventScroll:true}); }
    else if (event.target.closest('[data-quiz-next]')) { state.quizIndex++; renderQuiz(); const target = $('[data-answer]') || $('[data-quiz-restart]'); if (target) target.focus({preventScroll:true}); }
    else if (event.target.closest('[data-quiz-restart]')) { state.quizIndex = 0; state.answers = []; renderQuiz(); $('[data-answer]').focus({preventScroll:true}); }
  });
  $('#source-list').className = 'source-list';
  $('#source-list').innerHTML = D.models.map(m => `<div><a href="${m.source}" target="_blank" rel="noopener noreferrer">${escape(m.name)}${m.variant ? ' / '+escape(m.variant) : ''} ↗</a></div>`).join('') + '<div><a href="https://support.microsoft.com/en-us/windows/experience/platform-variants/windows-arm-based-pcs-faq" target="_blank" rel="noopener noreferrer">微软 · Windows Arm 兼容性说明 ↗</a></div>';
  $('#catalog-count').textContent=`${D.models.length} 项型号 / 配置`;
  $('#catalog-scope').textContent=`已收录 ${D.models.length} 项型号 / 配置：${['Intel','AMD','Apple','Qualcomm'].map(b=>b+' '+D.models.filter(m=>m.brand===b).length+' 项').join('，')}。按系列覆盖主流与近代机型，部分旧款仍可见于销售渠道；不是逐店实时库存。资料核对：${D.checked}。`;
  renderFilters(); renderCategory(); renderModels(); renderProfile(); renderLab(); renderQuiz(); updateURL();localize();
})();
