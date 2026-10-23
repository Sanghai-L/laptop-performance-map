'use strict';
(() => {
  const data=window.CPU_NAMING_DATA;
  const lang=window.CPU_I18N.language;
  const t=value=>window.CPU_I18N.t(value);
  const L=(zh,en)=>lang==='en'?en:zh;
  const text=value=>typeof value==='string'?value:value[lang];
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const part=(value,zhLabel,enLabel,zh,en)=>({value,label:L(zhLabel,enLabel),body:L(zh,en)});
  const models=window.CPU_GUIDE.models;
  const brandList=['Intel','AMD','Apple','Qualcomm'];
  let currentModel, selectedModel, activePart=0, initialized=false;

  function suffix(brand,value){
    const entry=data.brands[brand].marks.find(mark=>mark.code===value);
    return part(value||'—','后缀 / 标记','Suffix / marker',
      entry?entry.meaning.zh+' '+entry.scope.zh+' '+entry.limit.zh:'该标记需要在对应产品家族中查询，不能套用另一家的规则。',
      entry?entry.meaning.en+' '+entry.scope.en+' '+entry.limit.en:'Look up this marker within its product family; another vendor’s rule does not apply.');
  }
  function describe(model){
    const name=model.name.replace(/^Intel\s+/,'').replace(/(\d)(u|hs|hx|h)$/i,(_match,digit,mark)=>digit+mark.toUpperCase());
    const brand=model.brand;
    let scheme, parts=[], match;
    const sku=value=>part(value,'具体型号','SKU / model identifier','这是具体型号编号。核心数、频率和功耗需按完整型号查规格。','This distinguishes the exact product. It does not directly encode core count, frequency, power, or FPS; check the complete model’s specifications.');
    const tier=(value,x=false)=>part(value,'产品档位','Product tier',
      x?'X7 / X9 是 Core Ultra Series 3 档位。这里的 X 不表示旧款 X 后缀的“解锁”，具体集显型号需查规格。':'表示同一家族中的产品档位。跨代或跨系列比较时，还要看具体规格。',
      x?'X7 / X9 are Core Ultra Series 3 tier labels. This X is part of the tier, not the older unlocked X suffix. Check the exact GPU specification separately.':'This is positioning within a product family, not a core count. It cannot rank performance across families, generations, or power segments.');
    if(brand==='Intel'){
      if((match=name.match(/^(?:Core (i?3)[- ]|Processor )?N(\d{3})$/))){
        scheme='intel-n';
        parts=[part(match[1]?'Core '+match[1]:'Intel Processor','产品品牌','Product brand','这是入门 N 系列。Core i3-N305 和 Core 3 N355 都属于这条分支，采用独立编号。','Identify the entry-level N branch first. Core i3-N305 and Core 3 N355 use different branding, but neither follows the regular three-digit Core Series rule.'),part('N','N 系列前缀','N-series prefix','编号前的 N 表示 N 系列，具体功耗按型号查询。','N before the number identifies the N-series branch; it is not a suffix defining a fixed wattage.'),sku(match[2])];
      }else if((match=name.match(/^Core (Ultra )?(X?[3579]) (\d{3})([A-Z]*)( Plus)?$/))){
        const ultra=!!match[1],number=match[3],mark=match[4];
        scheme=ultra?'intel-ultra':'intel-core';
        parts=[part(ultra?'Core Ultra':'Core','产品家族','Product family',
          ultra?'Core Ultra 与 Core、传统 Core i 使用不同编号。查询时保留 Ultra。':'这是新 Core 家族，不带 i 或 Ultra。它使用自己的 Series 编号，改名不一定代表新架构。',
          ultra?'This is the Core Ultra family. It follows a different naming system from new Core and traditional Core i; keep “Ultra” when comparing model names.':'This is the new Core family without i or Ultra. It has its own Series numbering; a branding update does not guarantee a new architecture in every model.'),tier(match[2],match[2].startsWith('X')),part(number[0],'系列编号','Series number',
          `${number[0]} 表示 ${ultra?'Core Ultra':'Core'} Series ${number[0]}。这是该家族的 Series，不能改称旧 Core i 的第 ${Number(number[0])+14} 代，也不是制程或核心数。`,
          `${number[0]} identifies ${ultra?'Core Ultra':'Core'} Series ${number[0]}. It is this family’s Series number, not a process node, core count, or a continuation of the old Core i generation count.`),sku(number.slice(1)),suffix('Intel',mark)];
        if(mark==='V'&&number[0]==='2')parts[3]=part(number.slice(1),'200V 中的具体型号','SKU within 200V',
          '200V 系列中，256V 配 16 GB、258V 配 32 GB 封装内存。这一规律不适用于所有尾数为 8 的型号。',
          'Identify Core Ultra 200V as a family first. In this group, 256V has 16 GB and 258V has 32 GB of on-package memory. This family-specific distinction does not make every final 8 mean 32 GB.');
        if(match[5])parts.push(part('Plus','同系列的增强型号标记','Enhanced variant in the same Series','Plus 表示该系列的更新型号，仍属于 Ultra Series 2。具体提升需查规格和测试。','Plus marks an enhanced / updated model within Core Ultra Series 2, not an automatic move to Series 3. Retain the full name for lookup; it specifies neither a fixed core-count increase nor a fixed speedup percentage.'));
      }else if((match=name.match(/^Core i([3579])[- ](\d{4,5})([A-Z]+\d?)$/))){
        scheme='intel-legacy';
        const number=match[2],length=number.length===5||/^1[0-4]/.test(number)?2:1;
        parts=[part('Core','传统 Core 品牌','Traditional Core branding','带 i3 / i5 / i7 / i9 的传统命名体系。型号数字前一位或两位用来识别这一体系里的代数。','The traditional i3 / i5 / i7 / i9 system. One or two leading digits identify the generation in this naming system.'),tier('i'+match[1]),part(number.slice(0,length),'Core i 代数','Core i generation',
          `这里表示第 ${number.slice(0,length)} 代 Core。10–14 代通常要读前两位；不能只取第一位。`,
          `This is generation ${number.slice(0,length)} of Core. For generations 10–14, read the first two digits rather than the first digit alone.`),sku(number.slice(length)),suffix('Intel',/^G\d$/.test(match[3])?'G1 / G4 / G7':match[3])];
        parts[parts.length-1].value=match[3];
      }
    }else if(brand==='AMD'){
      if((match=name.match(/^Ryzen AI Max(\+)? (\d{3})$/))){
        scheme='amd-max';parts=[part('Ryzen AI','产品家族','Product family','这是 Ryzen AI 产品线，不能套用旧 Ryzen 7000 / 8000 的逐位解码方式。','This is the Ryzen AI product line; the old Ryzen 7000 / 8000 digit-by-digit rules do not apply.'),part('Max'+(match[1]||''),'Max 产品分支','Max product branch','Max / Max+ 是系列标签。Max+ 395、392、388 的 CPU 核心数不同，需按完整型号查询。','Read Max / Max+ as complete product labels. The plus sign is not a fixed core count or performance multiplier; Max+ 395, 392, and 388 have different CPU core counts.'),sku(match[2])];
      }else if((match=name.match(/^Ryzen AI ([3579]) (HX )?(\d{3})$/))){
        scheme='amd-ai';parts=[part('Ryzen AI','产品家族','Product family','AI 是产品线名称。NPU 算力需查规格，能否加速取决于应用支持。','AI is a product-line label. It does not promise faster performance in every AI app or specify NPU throughput; software support still matters.'),tier(match[1])];
        if(match[2])parts.push(part('HX','AI 系列里的 HX','HX in the AI family','这里必须连同 Ryzen AI 一起读。例如 HX 370 的 cTDP 为 15–54 W；不能套成传统 Ryzen 9955HX 的 55–75 W 功耗定位。','Read this HX within Ryzen AI. HX 370 has a 15–54 W cTDP range; it does not inherit the 55–75 W positioning of the traditional Ryzen 9955HX.'));
        parts.push(part(match[3][0],'AI 系列编号','AI Series number',`${match[3][0]}xx 对应该家族的 ${match[3][0]}00 系列，不表示 Zen ${match[3][0]} 架构。AI 300 与 AI 400 的具体 CPU、GPU、NPU 仍要按完整型号查规格。`,`${match[3][0]}xx identifies this family’s ${match[3][0]}00 Series, not Zen ${match[3][0]} architecture. Look up the exact CPU, GPU, and NPU configuration for each AI 300 / 400 model.`),sku(match[3].slice(1)));
      }else if((match=name.match(/^Ryzen ([3579]) (PRO )?(\d{4})(U|H|HS|HX|HX3D)?$/))){
        const number=match[3],oldRule=/^[78]/.test(number),oldFamily=/^[456]/.test(number);
        scheme=oldRule?'amd-7000':oldFamily?'amd-older':'amd-hx';
        parts=[part('Ryzen','产品品牌','Product brand','先确认 Ryzen 的具体系列；不同年份使用过不同编号方案，四位数字也不一定能按同一张表逐位解释。','Identify the exact Ryzen family first. AMD has used different numbering systems over time; four digits do not always follow the same decoding chart.'),tier(match[1])];
        if(match[2])parts.push(suffix('AMD','PRO'));
        if(oldRule){
          parts.push(part(number[0],'产品组合年份','Portfolio model year',`${number[0]} 在这套方案中表示 202${Number(number[0])-4} 产品组合年份，不是 Zen 架构代数，也不等于实际上市日期。例如 7520U 归入 2023 产品组合，却在 2022 年已发布。`,`${number[0]} identifies the 202${Number(number[0])-4} portfolio model year in this scheme, not the Zen generation or exact launch date. The 7520U belongs to the 2023 portfolio but launched in 2022.`),part(number[1],'市场定位细分','Market-segment digit','这一位与 Ryzen 3 / 5 / 7 / 9 一起区分市场定位，仅在本命名体系内比较。','Together with Ryzen 3 / 5 / 7 / 9, this digit describes the market segment. It is not a core count or a universal performance score.'),part(number[2],'架构家族位','Architecture-family digit',
            `在这套 7000 / 8000 移动命名规则中，2 指 Zen 2，3 指 Zen 3 家族，4 指 Zen 4。这里的 ${number[2]} 应在这套规则里读，不能推广到 Ryzen AI 或所有三位型号。`,
            `Within this 7000 / 8000 mobile scheme, 2 indicates Zen 2, 3 the Zen 3 family, and 4 Zen 4. Read this ${number[2]} only within that scheme, not Ryzen AI or every three-digit model.`),part(number[3],'具体特性区分','Feature-isolation digit','最后一位用于同一架构家族内的具体产品区分。例如 7730U 是 Zen 3，7735HS 是 Zen 3+；但尾数 5 并不在所有型号中都表示“+”架构。','The final digit distinguishes products within an architecture family. For example, 7730U uses Zen 3 and 7735HS uses Zen 3+, but a final 5 does not always mean a “+” architecture.'));
        }else{
          parts.push(part(number,'产品系列与具体型号','Product series and SKU',oldFamily?'例如 6800H 属于较早的 Ryzen 6000 系列。不能拿后来 7000 / 8000 的“年份—定位—架构—特性”规则倒推 6000 或 5000。':'这是传统高性能 Ryzen HX 分支的完整型号。9955HX 的 Zen 5、16 核等是官方规格，不能把同一套逐位规则推广到所有 Ryzen 名称。',oldFamily?'For example, 6800H belongs to the earlier Ryzen 6000 family. Do not retroactively apply the later 7000 / 8000 portfolio-year / segment / architecture / feature scheme to 6000 or 5000.':'This is the complete model in the traditional high-performance Ryzen HX branch. The 9955HX’s Zen 5 architecture and 16 cores come from its specifications; no single digit chart applies to every Ryzen name.'));
        }
        if(match[4]){parts.push(suffix('AMD',match[4].replace('3D','')));if(match[4].includes('3D'))parts.push(suffix('AMD','3D'));}
      }else if((match=name.match(/^Ryzen ([3579]) (\d{3})$/))){
        scheme='amd-short';parts=[part('Ryzen','产品家族','Product family','这是没有 AI / AI Max 字样的 Ryzen 产品线，要与 Ryzen AI 的三位数编号分开读。','This Ryzen product line has no AI / AI Max label. Read it separately from three-digit Ryzen AI names.'),tier(match[1]),part(match[2],'系列与完整型号','Series and complete SKU','200 / 400 等短编号是各自产品系列和型号，不再套用 7840HS 的第三位架构规则。没有 U / H 也不代表低功耗；具体架构与瓦数查官方规格。','Short 200 / 400-family numbers are series and SKU identifiers. The architecture-digit rule from 7840HS does not apply. Missing U / H does not establish low power; check the architecture and power specifications.')];
      }
    }else if(brand==='Apple'){
      if((match=name.match(/^Apple M(\d)(?: (Pro|Max|Ultra))?$/))){
        scheme='apple-m';parts=[part('Apple','厂商','Vendor','Apple 是芯片厂商；MacBook Air / Pro 是电脑系列。','Apple is the chip vendor. MacBook Air and MacBook Pro name whole laptops, separate from the chip model.'),part('M','芯片家族','Chip family','M 表示 Apple M 芯片家族。','M identifies an Apple chip family; it is not a memory capacity or CPU core count.'),part(match[1],'M 系列代际','M-family generation',`M${match[1]} 中的 ${match[1]} 是芯片家族代际。跨系列或跨品牌时，不能直接比较编号大小。`,`The ${match[1]} in M${match[1]} identifies the chip-family generation. It is not directly comparable with A-series, Intel, or AMD numbering.`)];
        if(match[2])parts.push(part(match[2],'芯片分支','Chip variant','Pro / Max 是 M 芯片分支；MacBook Pro 则是电脑系列。Ultra 用于桌面 Mac。跨代性能需结合具体配置比较。','Pro / Max / Ultra identify chip variants within the M family. They differ from the MacBook Pro laptop name and cannot rank performance across generations. Ultra is used in desktop Macs, not a laptop tier.'));
      }else if((match=name.match(/^Apple A(\d+) (Pro)$/))){
        scheme='apple-a';parts=[part('Apple','厂商','Vendor','这是 Apple 芯片的型号，不是笔记本电脑的整机型号。','This names an Apple chip rather than a complete laptop.'),part('A','A 系列家族','A-series family','A 系列与 M 系列是不同家族。MacBook Neo 的官方配置包含 A18 Pro；不能认为所有 MacBook 都必须使用 M 芯片。','A and M are different chip families. The official MacBook Neo configuration includes A18 Pro; not every MacBook must use an M chip.'),part(match[1],'A 系列型号编号','A-series model number','18 是 A 系列编号，不能与 M5 的 5 直接比较性能。','18 is the A-series model number. It is not a performance scale shared with M5.'),part('Pro','A 系列里的 Pro','Pro in the A family','这里的 Pro 是 A 家族的型号标签，不等同于 M Pro 的资源规模，也不是 MacBook Pro 整机。','This Pro is an A-family variant label, not the same resource configuration as M Pro or the MacBook Pro laptop.')];
      }
      if(parts.length&&model.variant)parts.push(part(t(model.variant),'同名芯片的具体配置','Configuration of this chip','这是本例的 CPU / GPU 核心组合。同叫 M4 或 M4 Pro 仍可能有不同组合；统一内存容量也需单独核对，不能只记芯片名。','This is the example’s CPU / GPU core configuration. The same M4 or M4 Pro name can cover multiple configurations; unified-memory capacity also needs a separate check.'));
    }else if(brand==='Qualcomm'){
      const code=(model.variant||model.short||'').match(/X[12][EP]?[-–]\d{2}[-–]\d{3}/)?.[0]||model.name.match(/X[12][EP]?[-–]\d{2}[-–]\d{3}/)?.[0];
      if(code&&(match=code.match(/^(X[12])([EP]?)[-–](\d{2})[-–](\d{3})$/))){
        scheme='qualcomm-x';parts=[part('Snapdragon','产品品牌','Product brand','这是高通 Snapdragon 品牌。笔记本 X 家族与手机 Snapdragon 8 等产品线采用不同命名。','This is Qualcomm’s Snapdragon brand. Laptop X-family naming differs from phone lines such as Snapdragon 8.'),part(match[1],'PC 平台家族 / 代际','PC platform family / generation',`${match[1]} 是这条 PC 产品线的家族代际线索。X1 对应第一代 Snapdragon X 料号，X2 对应 Snapdragon X2；不是 CPU 核心数。`,`${match[1]} identifies the PC platform family / generation. X1 belongs to the first Snapdragon X generation and X2 to Snapdragon X2; it is not a CPU core count.`)];
        if(match[2])parts.push(part(match[2],'料号中的档位分支','Tier branch in the part number',match[2]==='P'?'P 对应 Plus 分支。实际 CPU 核数、GPU 型号和频率仍由后面的完整料号区分。':'E 对应 Elite 家族。第二代的 Elite 与 Elite Extreme 都使用 X2E 前缀，不能仅凭 E 区分二者。',match[2]==='P'?'P identifies the Plus branch. The complete part number still determines CPU cores, GPU model, and frequencies.':'E identifies the Elite family. Both second-generation Elite and Elite Extreme use X2E, so E alone does not distinguish them.'));
        parts.push(part(match[3],'具体 SKU 区分','SKU distinction','这组数字区分具体型号，需在对应家族的规格表中查询，不能跨代按大小比较性能。','These digits identify the SKU within its family. Look it up in the specification table; the numbers do not rank performance across generations.'),part(match[4],'配置料号尾段','Part-number ending','这是完整料号的一部分。查询时需保留；没有公开的通用内存或功耗解码规则。','Keep this ending when looking up specifications. There is no public universal rule that decodes it into memory or power.'));
      }
    }
    return {model,scheme:scheme||'lookup',parts:parts.length?parts:[sku(model.name)],recognized:parts.length>0};
  }

  function renderPart(){
    const decoded=describe(selectedModel),p=decoded.parts[activePart]||decoded.parts[0];
    document.querySelectorAll('[data-name-part]').forEach(button=>{const active=Number(button.dataset.namePart)===activePart;button.setAttribute('aria-pressed',String(active));button.classList.toggle('selected',active);});
    document.querySelector('#naming-part-detail').innerHTML=`<span class="naming-detail-token">${esc(p.value)}</span><div><h4>${esc(p.label)}</h4><p>${esc(p.body)}</p></div>`;
  }
  function render(){
    const brand=selectedModel.brand,rules=data.brands[brand],decoded=describe(selectedModel);
    const options=data.examples.filter(e=>e.brand===brand).map(example=>models.find(m=>m.id===example.modelId)||example);
    if(!options.some(m=>m.id===selectedModel.id))options.unshift(selectedModel);
    document.querySelectorAll('[data-name-brand]').forEach(button=>{const selected=button.dataset.nameBrand===brand;button.setAttribute('aria-selected',String(selected));button.classList.toggle('selected',selected);button.tabIndex=selected?0:-1;});
    document.querySelector('#naming-panel').setAttribute('aria-labelledby','name-brand-'+brand.toLowerCase());
    document.querySelector('#naming-example').innerHTML=options.map(model=>`<option value="${esc(model.id)}" ${model.id===selectedModel.id?'selected':''}>${esc(model.name+(model.variant?' · '+t(model.variant):''))}</option>`).join('');
    document.querySelector('#naming-scheme').textContent=text(data.schemes[decoded.scheme]||data.schemes.lookup);
    document.querySelector('#naming-model-name').textContent=selectedModel.name;
    document.querySelector('#naming-tokens').innerHTML=decoded.parts.map((p,i)=>`<button data-name-part="${i}" aria-pressed="${i===activePart}" class="naming-token ${i===activePart?'selected':''}"><strong>${esc(p.value)}</strong><small>${esc(p.label)}</small></button>`).join('');
    renderPart();
    const specs=document.querySelector('#naming-specs');
    specs.innerHTML=selectedModel.cores?`<div><b>${esc(L('具体配置','Configuration'))}</b><p>${esc(t(selectedModel.cores))} · ${esc(t(selectedModel.gpu))}</p></div><a href="${esc(selectedModel.source)}" target="_blank" rel="noopener noreferrer">${esc(L('官方规格 ↗','Official specifications ↗'))}</a>`:`<p>${esc(L('旧款命名示例，具体配置见官方资料。','An older naming example. See official specifications for its configuration.'))}</p>`;
    document.querySelector('#naming-brand-overview').textContent=text(rules.overview);
    document.querySelector('#naming-rules').innerHTML=rules.rules.map(r=>`<article><h4>${esc(text(r.title))}</h4><p>${esc(text(r.body))}</p></article>`).join('');
    document.querySelector('#naming-mark-head').textContent=text(rules.markHeading);
    document.querySelector('#naming-marks').innerHTML=rules.marks.map(mark=>`<tr><th scope="row">${esc(mark.code||L('无后缀','No suffix'))}</th><td data-label="${esc(L('含义与范围','Meaning and scope'))}"><b>${esc(text(mark.meaning))}</b><small>${esc(text(mark.scope))}</small></td><td data-label="${esc(L('注意事项','What to check'))}">${esc(text(mark.limit))}</td></tr>`).join('');
    document.querySelector('#naming-sources').innerHTML=rules.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(text(s.title))} ↗</a>`).join('');
  }
  function setCurrent(model){
    currentModel=model;
    const button=document.querySelector('#naming-current');
    if(button)button.textContent=L('查看当前 CPU：','View current CPU: ')+model.name;
  }
  function selectModel(model,scroll=false){
    selectedModel=model;activePart=0;render();
    if(scroll){document.querySelector('#naming').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});document.querySelector('#naming-title').tabIndex=-1;document.querySelector('#naming-title').focus({preventScroll:true});}
  }
  function init(){
    if(initialized)return;initialized=true;
    selectedModel=currentModel||models.find(m=>m.id==='258v');render();
    document.querySelector('#naming-brands').addEventListener('click',event=>{const button=event.target.closest('[data-name-brand]');if(!button)return;const example=data.examples.find(e=>e.brand===button.dataset.nameBrand);selectModel(models.find(m=>m.id===example.modelId)||example);document.querySelector('#name-brand-'+button.dataset.nameBrand.toLowerCase()).focus({preventScroll:true});});
    document.querySelector('#naming-brands').addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const index=brandList.indexOf(selectedModel.brand),next=event.key==='Home'?0:event.key==='End'?brandList.length-1:(index+(event.key==='ArrowRight'?1:-1)+brandList.length)%brandList.length;document.querySelector('#name-brand-'+brandList[next].toLowerCase()).click();});
    document.querySelector('#naming-example').addEventListener('change',event=>{const id=event.target.value;selectModel(models.find(m=>m.id===id)||data.examples.find(e=>e.id===id));});
    document.querySelector('#naming-tokens').addEventListener('click',event=>{const button=event.target.closest('[data-name-part]');if(!button)return;activePart=Number(button.dataset.namePart);renderPart();});
    document.querySelector('#naming-current').addEventListener('click',()=>selectModel(currentModel));
    document.addEventListener('click',event=>{const button=event.target.closest('[data-naming-model]');if(!button)return;const model=models.find(m=>m.id===button.dataset.namingModel);if(model)selectModel(model,true);});
  }
  window.CPU_NAMING={describe,setCurrent,selectModel,init};
})();
