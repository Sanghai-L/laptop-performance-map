'use strict';
(() => {
  // Editorial estimates of typical average FPS, not measurements or confidence intervals.
  // Each game is calibrated separately. No universal 3DMark-to-FPS / core-count formula.
  const sources={
    catalog:['厂商规格 · 本型号的核显、核型与功耗',null],
    cp:['Notebookcheck · 2077 原始测试数据库','https://www.notebookcheck.com/Cyberpunk-2077-Phantom-Liberty-im-Test-Laptop-und-Desktop-Benchmarks.758157.0.html'],
    valo:['Notebookcheck · 无畏契约原始测试','https://www.notebookcheck.com/Valorant-Notebook-und-Desktop-Benchmarks.489489.0.html'],
    b390:['Notebookcheck · B390 / 358H 整机测试','https://www.notebookcheck.com/Dell-XPS-16-Core-Ultra-X7-358H-Test-Raus-mit-Nvidia-rein-mit-Intel-Arc-B390.1272004.0.html'],
    halo:['Notebookcheck · ROG Flow Z13 / 8060S','https://www.notebookcheck.net/Asus-ROG-Flow-Z13-GZ302EA-Convertible-Review-AMD-s-Strix-Halo-GPU-is-neck-and-neck-with-the-RTX-4070-Laptop.963266.0.html'],
    px13:['Notebookcheck · Max+ 388 / 8060S 直接测试','https://www.notebookcheck.net/AMD-Strix-Halo-with-32-GB-RAM-for-1899-Asus-ProArt-PX13-2026-Convertible-Review.1352377.0.html'],
    halogames:['the比較 · 8060S 无畏契约 / 原神整机测试','https://thehikaku.net/pc/other/Ryzen-AI-MAX-392.html'],
    genshin:['乔木 leon · B390 原神游戏观察（0.6 渲染精度）','https://zhuanlan.zhihu.com/p/2045883606346815036'],
    lunar:['电脑报 · 258V / 140V 原神测试','https://www.sohu.com/a/815345527_404443'],
    xe3:['Notebookcheck · 4 Xe3 游戏测试与架构对照','https://www.notebookcheck.net/Intel-Graphics-4-Xe3-Panther-Lake-Benchmarks-and-Specs.1193658.0.html'],
    x2:['Notebookcheck · Adreno X2-90 游戏测试','https://www.notebookcheck.com/Qualcomm-Adreno-X2-90-Grafikkarte-Benchmarks-und-Spezifikationen.1130807.0.html'],
    apple:['Notebookcheck · M5 原生 macOS 游戏测试','https://www.notebookcheck.net/Apple-MacBook-Pro-M5-2025-review-The-fastest-single-core-performance-in-the-world.1144391.0.html'],
    applem5:['Notebookcheck · M5 Pro / Max GPU 分析','https://www.notebookcheck.net/Apple-M5-Pro-M5-Max-GPU-Analysis-M5-Max-GPU-on-par-with-the-GeForce-RTX-5070-and-faster-than-Strix-Halo.1246060.0.html'],
    hades:['Gizbot · 12 Xe3 掌机 Hades 测试（非笔记本锚点）','https://www.gizbot.com/computer/reviews/msi-claw-8-ex-ai-review-did-intel-benchmark-handheld-gaming-performance-128733.html'],
    stardew:['星露谷物语 · 官方平台与要求','https://store.steampowered.com/app/413150/Stardew_Valley/'],
    hadesreq:['哈迪斯 · 官方平台与要求','https://store.steampowered.com/app/1145360/Hades/']
  };
  // Per-game ranges at 1080p native, low preset, RT/FG off. CPU-sensitive Valorant
  // gets a broad range; Genshin and Stardew respect their standard 60 FPS cap.
  // Order: Valorant, Genshin, Cyberpunk2077, Wukong, Hades. Stardew handled separately.
  const table={
    'n24':[[30,65],[12,25],[4,10],[3,8],[30,65]],
    'n32':[[40,80],[15,30],[6,13],[4,10],[40,80]],
    'uhd16':[[35,80],[10,25],[4,11],[3,9],[30,75]],
    'uhd32':[[45,100],[15,30],[7,16],[5,13],[40,95]],
    'xe48':[[60,120],[25,45],[10,22],[8,18],[55,120]],
    'xe64':[[70,140],[30,50],[12,25],[10,20],[65,140]],
    'xe80':[[80,160],[30,55],[13,25],[10,22],[75,160]],
    'xe96':[[100,185],[35,60],[15,28],[12,25],[90,185]],
    'ultra4':[[85,165],[35,60],[15,30],[12,25],[90,180]],
    'xe3-2':[[60,120],[25,45],[12,26],[10,22],[60,135]],
    'xe3-4':[[100,190],[40,60],[25,45],[20,35],[110,220]],
    'arc7':[[110,200],[45,60],[23,40],[18,33],[110,220]],
    'arc8':[[120,215],[45,60],[25,45],[20,37],[120,240]],
    '130T':[[110,195],[40,60],[20,36],[17,32],[110,220]],
    '140T':[[130,230],[45,60],[28,52],[22,40],[130,260]],
    '130V':[[120,215],[45,60],[28,50],[20,37],[120,240]],
    '140V':[[140,250],[50,60],[33,60],[23,42],[150,280]],
    'B370':[[145,270],[50,60],[60,90],[35,60],[150,300]],
    'B390':[[160,300],[55,60],[65,100],[40,65],[170,340]],
    '610M':[[40,100],[15,30],[5,15],[4,13],[40,100]],
    '820M':[[45,110],[20,35],[8,19],[7,17],[50,115]],
    '740M':[[70,145],[30,50],[14,29],[11,25],[75,160]],
    '840M':[[75,155],[30,55],[16,32],[13,28],[80,175]],
    '660M':[[85,165],[35,55],[15,28],[12,27],[85,180]],
    '680M':[[105,195],[40,60],[22,40],[18,35],[110,230]],
    '760M':[[110,200],[40,60],[23,42],[18,35],[115,230]],
    '780M':[[125,230],[50,60],[30,55],[23,42],[135,270]],
    '860M':[[115,210],[45,60],[23,47],[18,38],[120,250]],
    '880M':[[135,245],[50,60],[33,60],[25,45],[145,285]],
    '890M':[[150,275],[50,60],[38,70],[28,52],[160,310]],
    '8040S':[[140,260],[50,60],[45,80],[30,60],[145,280]],
    '8050S':[[175,320],[55,60],[80,130],[50,85],[175,330]],
    '8060S':[[190,360],[55,60],[90,150],[60,100],[190,360]],
    'vega6':[[65,140],[25,50],[10,24],[8,20],[70,150]],
    'vega7':[[75,155],[30,55],[12,27],[10,23],[80,170]],
    'vega8':[[85,175],[30,60],[14,30],[11,26],[90,190]],
    'x1-45':[[0,0],[20,45],[10,25],[8,22],[50,130]],
    'x1-85':[[0,0],[30,60],[17,35],[12,30],[75,180]],
    'x2-45':[[0,0],[30,60],[20,40],[15,35],[90,210]],
    'x2-85':[[0,0],[40,60],[30,55],[23,45],[120,260]],
    'x2-90':[[0,0],[45,60],[35,70],[25,55],[140,300]],
    'apple-a18':[[0,0],[0,0],[0,0],[0,0],[40,100]],
    'apple-m2':[[0,0],[0,0],[20,40],[0,0],[90,200]],
    'apple-m3':[[0,0],[0,0],[23,45],[0,0],[100,220]],
    'apple-m4':[[0,0],[0,0],[28,55],[0,0],[115,250]],
    'apple-m5':[[0,0],[0,0],[38,70],[0,0],[140,300]],
    'apple-m2-pro':[[0,0],[0,0],[35,70],[0,0],[140,280]],
    'apple-m3-pro':[[0,0],[0,0],[40,80],[0,0],[150,300]],
    'apple-m4-pro':[[0,0],[0,0],[50,100],[0,0],[180,340]],
    'apple-m5-pro':[[0,0],[0,0],[65,125],[0,0],[200,380]],
    'apple-m2-max':[[0,0],[0,0],[60,110],[0,0],[180,340]],
    'apple-m3-max':[[0,0],[0,0],[70,130],[0,0],[200,380]],
    'apple-m4-max':[[0,0],[0,0],[85,155],[0,0],[230,420]],
    'apple-m5-max':[[0,0],[0,0],[95,175],[0,0],[250,450]]
  };
  const gameIndex={valorant:0,genshin:1,cyberpunk:2,wukong:3,hades:4};
  const generic={name:'规格未细分的基础集显',ranges:[[35,120],[15,40],[5,25],[4,20],[40,120]]};
  function profile(m){
    if(m.graphics==='none')return {key:'none',name:'没有集成显卡',basis:'无法估算集显性能'};
    let key,name=m.gpu,basis='同核显 / 邻近核显的整机测试与架构对照';
    if(m.arm==='mac'){
      key=/A18/.test(m.name)?'apple-a18':'apple-'+m.name.replace(/^Apple /,'').toLowerCase().replace(/ /g,'-');
      basis='macOS 原生游戏测试的代际与 GPU 配置对照；跨型号宽估算';
    }else if(m.arm==='windows'){
      key='x'+(/X2/.test(m.gpu)?'2':'1')+'-'+(m.gpu.match(/-(\d+)/)?.[1]||'45');
      basis='Adreno 游戏样本与同代 GPU 配置；计入转译及驱动的不确定性';
    }else if(m.brand==='AMD'){
      key=m.gpu.match(/\b(\d{3,4}[MS])\b/)?.[1];
      if(!key){key=/7730/.test(m.name)?'vega8':/7530|7525/.test(m.name)?'vega7':'vega6';name='Radeon / Vega '+key.slice(-1);basis='厂商集显规格与旧 Radeon / Vega 整机性能档位对照';}
    }else{
      key=m.gpu.match(/B3[79]0|1[34]0[TV]/)?.[0];
      if(!key && m.family==='Core Ultra 100H')key=/1[568]5H/.test(m.name)?'arc8':'arc7';
      if(!key && /Iris Xe/.test(m.gpu))key=/i[79]-/.test(m.name)?'xe96':'xe80';
      if(!key && m.family==='Intel N / Core N 系列')key=/N200|N250|N300|N305|N350|N355/.test(m.name)?'n32':'n24';
      if(!key && /Core Ultra 300/.test(m.family))key='xe3-4';
      if(!key && m.family==='Core 300 系列')key='xe3-2';
      if(!key && /Core Ultra.*U/.test(m.family))key='ultra4';
      if(!key && /HX/.test(m.name))key=/Ultra/.test(m.name)?'uhd64':'uhd32';
      if(!key && /13620H|12650H/.test(m.name))key='xe64';
      if(!key && /13420H|12450H/.test(m.name))key='xe48';
      if(!key && /^Core [579] \d{3}[HU]/.test(m.name))key=/^Core [79]/.test(m.name)?'xe96':'xe80';
      if(!key && /i3-/.test(m.name))key='xe64';
      if(!key)key='xe64';
      if(!m.gpu.includes('Arc')&&!m.gpu.includes('Iris'))basis='按该 CPU 系列的集显架构与规模匹配性能档位；较宽估算';
    }
    if(key==='uhd64')key='xe64';
    return {key,name,basis,ranges:table[key]||generic.ranges};
  }
  function sourceKeys(p,game){
    if(game==='stardew')return ['stardew'];
    if(p.key.startsWith('apple'))return [game==='hades'?'hadesreq':'apple',...(p.key.includes('m5-')?['applem5']:[])];
    if(/^x[12]-/.test(p.key))return ['x2',game==='hades'?'hadesreq':'cp'];
    if(/80[456]0S/.test(p.key))return [game==='valorant'||game==='genshin'?'halogames':'halo','px13','cp'];
    if(game==='hades')return ['hades','hadesreq'];
    if(game==='stardew')return ['stardew'];
    if(game==='genshin')return ['lunar','genshin'];
    if(game==='valorant')return ['valo'];
    if(p.key.startsWith('xe3'))return ['xe3','cp'];
    return ['cp',...(game==='wukong'?['b390']:[])];
  }
  function estimate(m,game,quality='low'){
    const p=profile(m);
    if(p.key==='none')return null;
    if(game==='valorant'&&m.arm)return null;
    if(m.arm==='mac'&&['genshin','wukong'].includes(game))return null;
    if(p.key==='apple-a18'&&game==='cyberpunk')return null;
    let range=game==='stardew'?(['n24','n32','uhd16','uhd32'].includes(p.key)?[40,60]:[55,60]):[...p.ranges[gameIndex[game]]];
    let notes=[];
    if(game==='valorant' && /8060S|8050S/.test(p.key) && parseInt(m.cores)<12){range=range.map(n=>n*.85);notes.push('这款 CPU 核心配置较小，电竞高帧估算比 12 / 16 核锚点更保守。');}
    if(m.arm==='mac'&&game!=='stardew'){
      const cores=parseInt(m.gpu),max=p.key.includes('max')?(/m2/.test(p.key)?38:40):p.key.includes('pro')?(/m2/.test(p.key)?19:/m3/.test(p.key)?18:20):10;
      if(cores<max){const factor=Math.max(.75,Math.sqrt(cores/max));range=range.map(n=>n*factor);notes.push('按本条较小的 GPU 核心配置下调范围；没有把 CPU 核心数当作 GPU 数。');}
    }
    // Quality changes are game-specific editorial bands, not a universal pixel multiplier.
    if(quality==='medium' && game!=='stardew'){
      const reduction={valorant:[.82,.9],genshin:[.78,.95],cyberpunk:[.73,.86],wukong:[.68,.84],hades:[.8,.92]}[game];
      range=[range[0]*reduction[0],range[1]*reduction[1]];
      notes.push('中画质是结合该游戏负载的二次估算，误差比同核显同设置推估更大。');
    }
    const step=range[1]>=100?10:range[1]>20?5:1;
    range=[Math.max(1,Math.floor(range[0]/step)*step),Math.max(step,Math.ceil(range[1]/step)*step)];
    if(game==='genshin'||game==='stardew')range=range.map(n=>Math.min(60,n));
    const assumptions=m.arm==='mac'?'macOS 原生版本、至少 16 GB 统一内存；持续负载下被动散热机型更接近区间下沿':/80[456]0S/.test(p.key)?'插电、性能模式、至少 32 GB 高带宽统一内存；按约 55–80 W 级持续封装功耗估算':m.arm==='windows'?'Windows Arm 上已能正常运行的游戏版本；至少 16 GB 高带宽内存；转译、驱动或插件失败时此范围不适用':'插电、性能模式、至少 16 GB 内存，正常双通道 DDR4 / DDR5 或高带宽 LPDDR；不适用于 8 GB / 单通道受限配置';
    if(game==='genshin')notes.push('PC 常规 60 帧上限；以低 / 中画质、1.0 渲染精度估算，复杂战斗与新地图可能更低。');
    if(game==='stardew')notes.push('原版游戏、常规存档与 60 帧节奏；大型模组和后期复杂农场不在此范围内。');
    if(game==='hades')notes.push('指第一代《哈迪斯》原版，不代表《哈迪斯 II》或其他独立游戏；此项缺少同配置受控测试，估算把握较低。');
    return {range,profile:p,game,quality,basis:p.basis,assumptions,notes,sources:[...new Set(['catalog',...sourceKeys(p,game)])].map(k=>({title:sources[k][0],url:sources[k][1]||m.source})),label:`1080p · ${game==='stardew'?'默认画面':quality==='medium'?'中画质':'低画质'} · 原生渲染 · 关闭光追 / 插帧`};
  }
  window.CPU_ESTIMATE={profile,estimate,table,updated:'2026-10-23',method:'人工划分各游戏性能区间，以同核显原始整机测试校准，结合架构、图形规模、CPU 与功耗条件留出余量。区间是典型平均 FPS 的粗略估算，不是实测、低帧范围或统计置信区间。'};
})();
