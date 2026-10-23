'use strict';
(() => {
  const $=s=>document.querySelector(s);
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const state={game:'aaa',aaa:'cyberpunk',indie:'stardew',estimateQuality:'low',forceEstimate:false,preset:'',mode:'integrated'};
  const games=[['valorant','无畏契约','电竞射击'],['genshin','原神','开放世界'],['aaa','3A 游戏','2077 / 黑神话'],['indie','Steam 独立游戏','按具体作品看']];
  const refs={valorant:['Riot 官方要求','https://support.riotgames.com/en-us/valorant/support-tools/minimum-recommended-pc-specs'],genshin:['HoYoverse 官方要求','https://support.hoyoverse.com/hc/en-us/articles/52089402685593-What-are-the-system-requirements-to-play-Genshin-Impact'],aaa:['赛博朋克 2077 · 官方页面','https://store.steampowered.com/app/1091500/Cyberpunk_2077/'],indie:['星露谷物语 · 官方页面','https://store.steampowered.com/app/413150/Stardew_Valley/']};
  let current;
  function gpuKey(m){
    if(m.graphics==='none')return 'none';
    if(m.arm)return m.arm;
    const g=m.gpu;
    for(const s of ['B390','B370','140V','130V','140T','130T'])if(g.includes(s))return 'Intel Arc '+s;
    const r=g.match(/\b(\d{3,4}[MS])\b/);if(r)return 'AMD Radeon '+r[1];
    if(m.family==='Core Ultra 100H')return /1[568]5H/.test(m.name)?'Intel Arc 8-Core (Meteor Lake)':'Intel Arc 7-Core (Meteor Lake)';
    // Only map explicitly Iris-Xe-enabled SKUs. Basic UHD and HX are not Xe96.
    if(/Iris Xe/.test(g))return /i[79]-/.test(m.name)?'Intel Iris Xe G7 96 EU':'Intel Iris Xe G7 80 EU';
    if(m.id==='intel-n100')return 'Intel UHD 24 EU (Alder Lake-N)';
    return null;
  }
  function gameMatches(r){return state.game==='valorant'?r.game==='Valorant':state.game==='genshin'?r.game==='Genshin Impact':state.game==='aaa'?(state.aaa==='cyberpunk'?r.game.startsWith('Cyberpunk'):r.game==='Black Myth: Wukong'):false;}
  const settingKey=r=>r.resolution+'|'+r.preset;
  const presetName=p=>({Low:'低画质',Medium:'中画质',High:'高画质',Ultra:'超高画质',Cinematic:'影视级','High / On; 16xAF FXAA':'高画质 · FXAA / 16×AF','Medium / On; 8xAF':'中画质 · 8×AF'}[p]||p);
  function settingName(r){return `${r.resolution.replace('1920x1080','1080p').replace('2560x1440','1440p').replace('1920x1200','1200p')} · ${presetName(r.preset)}`;}
  const number=n=>Number.isInteger(n)?String(n):n.toFixed(1);
  function groups(m){
    const records=CPU_BENCH.records.filter(r=>r.gpu===gpuKey(m)&&gameMatches(r)&&r.recordType!=='controlled-power');
    const map=new Map();
    for(const r of records){const k=settingKey(r);if(!map.has(k))map.set(k,[]);map.get(k).push(r);}
    return [...map].map(([id,rs])=>{
      const singles=rs.filter(r=>r.recordType==='single-machine'||r.recordType==='gameplay-observation');
      const compact=s=>String(s).replace(/\s/g,'');
      const exact=singles.filter(r=>compact(r.cpu)===compact(m.name));
      const samples=exact.length?exact:singles.length?singles:rs.filter(r=>r.recordType==='database-aggregate');
      const avgs=samples.map(r=>r.fpsavg).filter(Number.isFinite);
      const observation=samples.some(r=>r.recordType==='gameplay-observation');
      const range=observation?samples[0].observedRange:[Math.min(...avgs),Math.max(...avgs)];
      return {id,samples,range,aggregate:!singles.length,observation,label:settingName(samples[0])};
    }).filter(g=>g.samples.length&&g.range?.every(Number.isFinite));
  }
  function sense(g){
    const [lo,hi]=g.range;
    if(g.observation)return '作者记录的跑图 / 战斗读数，并非统一路线统计的平均帧率。';
    if(hi<30)return '这档设置平均不足 30 FPS，动作与镜头移动会显得不连贯；应降低设置或分辨率。';
    if(lo<30)return '有样本平均不足 30 FPS，不能按稳定 30 帧来期待。';
    if(hi<60)return '处于可游玩的帧率区间；若目标为稳定 60 FPS，需要降低设置，并检查低帧。';
    if(lo<60)return '样本跨过 60 FPS 门槛，整机设置会影响能否保持 60 帧。';
    if(lo>=120)return '有高帧率参考价值；平均帧高于 120，不保证团战低帧或全程 144 帧。';
    return '具备 60 FPS 级别的平均表现参考；平均值不能保证战斗中每一帧都高于 60。';
  }
  function sampleDetails(g){return `<details class="benchmark-evidence"><summary>查看 ${g.samples.length} 条样本与测试条件 <span>＋</span></summary>${g.samples.map(r=>`<div class="benchmark-sample"><strong>${esc(r.machine||'Notebookcheck 测评数据库聚合')}</strong><p>${esc(r.cpu||'未提取具体 CPU')} · ${r.observedRange?`观察约 ${r.observedRange.map(number).join('–')} FPS`:`平均 ${number(r.fpsavg)} FPS`}${r.fpslow?` · ${esc(r.fpslow.type)} ${number(r.fpslow.value)} FPS`:''}</p><dl><div><dt>内存</dt><dd>${esc(r.memory||'此条记录未提取，不能视为统一配置')}</dd></div><div><dt>功耗</dt><dd>${esc(r.power||'未提取独立功耗条件')}</dd></div><div><dt>渲染</dt><dd>${esc(r.upscaling||'未公开')} · 插帧：${esc(r.frameGeneration||'未公开')}</dd></div><div><dt>版本 / 驱动</dt><dd>${esc(r.gameVersion||'未提取补丁')} / ${esc(r.driver||'未提取驱动')}</dd></div></dl>${r.notes?.length?`<p class="sample-note">${esc(r.notes.join(' '))}</p>`:''}<a href="${esc(r.sourceURL)}" target="_blank" rel="noopener noreferrer">原始测试 ↗</a></div>`).join('')}</details>`;}
  function unavailable(m){
    if(m.graphics==='none')return ['需要独立显卡','这颗处理器本身没有核显。','不能组成“仅靠这颗 CPU 的集显”运行游戏的配置。请查看整机另配显卡的型号、显存和功耗。'];
    if(state.game==='valorant'&&m.arm)return ['官方不支持 Arm','这款游戏先卡在运行平台。','Riot 的 PC 要求明确不支持 Arm。Apple 芯片与骁龙均为 Arm，不能用 GPU 强弱绕过反作弊与平台要求。'];
    if(state.game==='genshin'&&m.arm==='mac')return ['官方 PC 要求未列 macOS','不能把 Windows 核显成绩套给 Mac。','官方列出的 PC 本地客户端平台是 Windows。转译、移动版与云游戏不属于相同测试，本站不把它们合并成核显 FPS。'];
    if(state.game==='aaa'&&state.aaa==='wukong'&&m.arm==='mac')return ['官方未列 macOS 本地版本','先确认运行方案，不能凭 GPU 性能承诺启动。','Steam 当前列出 Windows 平台。转译的兼容性和性能差异很大，因此这里保留平台提示；可切换查看有原生 Mac 版的赛博朋克 2077。'];
    if(state.game==='aaa'&&state.aaa==='cyberpunk'&&/A18/.test(m.name))return ['未达到官方 Mac 配置要求','官方 Mac 版要求 M1 或更新 M 系列与至少 16 GB 内存。','A18 Pro 不在这份官方最低配置范围内；不把其他 M 系列的成绩套给它。'];
    return null;
  }
  function estimateGame(){return state.game==='aaa'?state.aaa:state.game==='indie'?state.indie:state.game;}
  function estimateCard(m,hasMeasured=false){
    const game=estimateGame(),r=CPU_ESTIMATE.estimate(m,game,state.estimateQuality);
    if(!r)return '<div class="igpu-experience limited"><h5>先确认游戏平台与运行条件。</h5><p>不能用 FPS 估算替代游戏能否正常运行的判断。</p></div>';
    const val=r.range.join('–'),reading=sense({range:r.range,observation:false}).replace('有样本','估计').replace('样本跨过','估算区间跨过');
    return `<div class="estimate-topline"><span>按性能给你一个可用范围</span>${hasMeasured?'<button class="text-button" data-show-measured>返回公开实测 ↗</button>':''}</div>${game==='stardew'?'':`<div class="benchmark-controls" role="group" aria-label="估算画质"><button class="benchmark-preset ${state.estimateQuality==='low'?'selected':''}" data-estimate-quality="low" aria-pressed="${state.estimateQuality==='low'}">1080p · 低画质估算</button><button class="benchmark-preset ${state.estimateQuality==='medium'?'selected':''}" data-estimate-quality="medium" aria-pressed="${state.estimateQuality==='medium'}">1080p · 中画质估算</button></div>`}<div class="fps-card estimated" data-kind="estimated" data-fps="${esc(val)}"><div><span class="experience-badge">性能估算 · 非实测</span><div class="fps-number">${val}<small>FPS</small></div><p>${esc(r.label)}</p><small>估计典型整机的平均帧率，不是最低帧</small></div><div class="fps-reading"><b>大致游玩体验</b><p>${reading}</p><span>${esc(r.profile.name)} · ${esc(r.basis)}</span></div></div><p class="estimate-assumptions"><b>估算前提</b>${esc(r.assumptions)}</p>${['genshin','stardew','hades'].includes(game)?`<p class="benchmark-scope">${esc(r.notes.find(n=>n.includes(game==='hades'?'哈迪斯':'60'))||r.notes[0])}</p>`:''}<details class="benchmark-evidence estimate-evidence"><summary>这个范围怎么估出来的？<span>＋</span></summary><div class="benchmark-sample"><p>${esc(CPU_ESTIMATE.method)}</p><p>本条匹配：${esc(r.profile.key)}。${esc(r.basis)}。同名 CPU 的不同整机仍可能落在区间外。</p>${r.notes.map(n=>`<p>${esc(n)}</p>`).join('')}<p>低 / 中画质分别考虑游戏负载；未用核心数、TOPS 或单个理论分数直接换算全部游戏。对新平台、Arm 转译和独立游戏，区间更粗。</p><div class="estimate-sources">${r.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a>`).join('')}</div></div></details>`;
  }
  function indie(m){return `<label class="benchmark-game-label">看哪款独立游戏？<select id="indie-game"><option value="stardew" ${state.indie==='stardew'?'selected':''}>星露谷物语 · 原版 2D</option><option value="hades" ${state.indie==='hades'?'selected':''}>哈迪斯 · 第一代</option></select></label>${estimateCard(m)}<p class="benchmark-scope">以上只代表所选作品。3D 生存、复杂模拟经营或大型模组，不能套用这两个游戏的范围。</p>`;}
  function benchmark(m){
    const gs=groups(m);
    if(!gs.length||state.forceEstimate)return estimateCard(m,gs.length>0);
    if(!gs.some(g=>g.id===state.preset))state.preset=(state.game==='aaa'?gs.find(g=>g.samples[0].preset==='Low'):null)?.id||gs[0].id;
    const g=gs.find(g=>g.id===state.preset),[lo,hi]=g.range;
    const val=lo===hi?number(lo):`${Math.floor(lo)}–${Math.ceil(hi)}`;
    const sample=g.samples[0], lowSample=g.samples.find(r=>r.fpslow?.type.includes('1%'));
    const basis=g.observation?'单机游戏过程观察':g.aggregate?'测评数据库平均参考':g.samples.length>1?`${g.samples.length} 条笔记本 / 模式样本的平均值范围`:'单台笔记本的平均帧率';
    const exact=g.samples.every(r=>String(r.cpu).replace(/\s/g,'')===m.name.replace(/\s/g,''));
    const proxy=exact?'包含当前 CPU 的测试':`同核显参考 · 未视作 ${m.short} 整机实测`;
    const render=sample.renderLabel||(g.observation?sample.upscaling:'原生分辨率 · 无超分 · 无插帧');
    const broader=CPU_BENCH.records.find(r=>r.recordType==='database-aggregate'&&r.gpu===gpuKey(m)&&gameMatches(r)&&settingKey(r)===g.id);
    const context=!g.aggregate&&g.samples.length===1&&broader?.sampleCount>5?`<p class="benchmark-scope">补充对照：同核显、同命名设置的数据库聚合约 ${number(broader.fpsavg)} FPS（${broader.sampleCount} 个样本，可能含掌机 / 迷你主机），说明单台样本不能代表全部产品。<a href="${esc(broader.sourceURL)}" target="_blank" rel="noopener noreferrer">查看聚合来源 ↗</a></p>`:'';
    return `<div class="estimate-topline"><span>优先展示公开测试</span><button class="text-button" data-show-estimate>查看统一条件估算 ↗</button></div><div class="benchmark-controls" role="group" aria-label="切换已有实测设置">${gs.map(x=>`<button class="benchmark-preset ${x.id===g.id?'selected':''}" data-preset="${esc(x.id)}" aria-pressed="${x.id===g.id}">${esc(x.label)}</button>`).join('')}</div><div class="fps-card" data-kind="measured" data-fps="${esc(val)}"><div><span class="experience-badge">${esc(basis)}</span><div class="fps-number">${val}<small>FPS</small></div><p>${esc(g.label)}</p><small>${esc(render)}</small></div><div class="fps-reading"><b>玩起来意味着什么</b><p>${sense(g)}</p><span>${esc(proxy)}</span></div></div><p class="benchmark-scope">${g.aggregate?'聚合可能含笔记本、掌机和迷你主机；不是笔记本专属范围。':g.observation?'观察读数不是平均值或 1% low；不与原生 1080p 的基准测试直接比较。':g.samples.length>1?'区间是所列不同整机 / 模式的平均值最小到最大，不是瞬时波动、1% low 或所有产品的保证范围。':'只有一台样本，不扩写成整机范围。'}${lowSample?` 其中 ${esc(lowSample.machine||'一条样本')} 还记录了 1% low：${number(lowSample.fpslow.value)} FPS。`:''}</p>${context}${sampleDetails(g)}`;
  }
  function render(){
    const m=current;if(!m)return;
    const gate=unavailable(m),ref=state.game==='aaa'&&state.aaa==='wukong'?['黑神话：悟空 · 官方页面','https://store.steampowered.com/app/2358720/Black_Myth_Wukong/']:refs[state.game];
    const selector=state.game==='aaa'?`<label class="benchmark-game-label">看哪款 3A？<select id="benchmark-game"><option value="cyberpunk" ${state.aaa==='cyberpunk'?'selected':''}>赛博朋克 2077</option><option value="wukong" ${state.aaa==='wukong'?'selected':''}>黑神话：悟空</option></select></label>`:'';
    const content=state.mode==='dedicated'?'<div class="igpu-experience"><span class="experience-badge">看实际调用的显卡</span><h5>游戏调用独显时，要看独显的测试。</h5><p>本区数字仅供集显运行参考。独显机型应核对独显型号、显存、整机功耗与游戏是否实际使用独显，不能把集显与独显帧率相加。</p></div>':gate?`<div class="igpu-experience limited"><span class="experience-badge">${gate[0]}</span><h5>${gate[1]}</h5><p>${gate[2]}</p></div>`:state.game==='indie'?indie(m):benchmark(m);
    $('#igpu-content').innerHTML=`<div class="igpu-identity"><strong>${esc(m.gpu)}</strong><span>实测优先 · 缺项用估算</span></div>
      <div class="segmented igpu-mode" role="group" aria-label="整机显卡配置"><button data-igpu-mode="integrated" class="${state.mode==='integrated'?'selected':''}" aria-pressed="${state.mode==='integrated'}">只用集成显卡</button><button data-igpu-mode="dedicated" class="${state.mode==='dedicated'?'selected':''}" aria-pressed="${state.mode==='dedicated'}">另有独立显卡</button></div>
      <div class="game-matrix" role="group" aria-label="选择游戏类型">${games.map(([id,name,kind])=>{const estimate=CPU_ESTIMATE.estimate(m,id==='aaa'?state.aaa:id==='indie'?state.indie:id,'low');return `<button class="game-card ${id===state.game?'selected':''}" data-game="${id}" aria-pressed="${id===state.game}"><strong>${name}</strong><small>${kind}</small><span class="game-fit">${estimate?(id==='indie'&&state.indie==='stardew'?'默认估算 ':'低画质估算 ')+estimate.range.join('–')+' FPS':m.graphics==='none'?'需要独显':'先看平台支持'}</span></button>`;}).join('')}</div>
      ${state.mode==='integrated'?selector:''}${content}
      <p class="igpu-boundary">有公开测试时优先显示；缺测试时按核显与整机条件给性能估算。估算标为黄色、只作大致平均 FPS 参考，不是实测或最低帧保证。内存带宽、功耗、驱动和具体场景可让实际结果超出区间。</p><div class="igpu-links"><a href="${ref[1]}" target="_blank" rel="noopener noreferrer">${ref[0]} ↗</a><span>资料与估算更新：${CPU_BENCH.accessedDate}</span></div>`;
    window.CPU_I18N?.apply($('#igpu-content'));
  }
  $('#igpu-content').addEventListener('click',e=>{
    const g=e.target.closest('[data-game]'),p=e.target.closest('[data-preset]'),mode=e.target.closest('[data-igpu-mode]'),quality=e.target.closest('[data-estimate-quality]');
    if(e.target.closest('[data-show-estimate]')){state.forceEstimate=true;render();$('[data-estimate-quality]')?.focus({preventScroll:true});}
    if(e.target.closest('[data-show-measured]')){state.forceEstimate=false;render();$('[data-show-estimate]')?.focus({preventScroll:true});}
    if(quality){state.estimateQuality=quality.dataset.estimateQuality;render();$('[data-estimate-quality="'+state.estimateQuality+'"]').focus({preventScroll:true});}
    if(g){state.game=g.dataset.game;state.preset='';state.forceEstimate=false;render();$(`[data-game="${state.game}"]`).focus({preventScroll:true});}
    if(p){state.preset=p.dataset.preset;render();[...document.querySelectorAll('[data-preset]')].find(x=>x.dataset.preset===state.preset)?.focus({preventScroll:true});}
    if(mode){state.mode=mode.dataset.igpuMode;render();$(`[data-igpu-mode="${state.mode}"]`).focus({preventScroll:true});}
  });
  $('#igpu-content').addEventListener('change',e=>{if(e.target.id==='benchmark-game'){state.aaa=e.target.value;state.preset='';state.forceEstimate=false;render();$('#benchmark-game').focus({preventScroll:true});}if(e.target.id==='indie-game'){state.indie=e.target.value;render();$('#indie-game').focus({preventScroll:true});}});
  window.CPU_GAMES={estimateCard,update(m){current=m;state.preset='';state.forceEstimate=false;render();},classify:gpuKey,groups};
})();
