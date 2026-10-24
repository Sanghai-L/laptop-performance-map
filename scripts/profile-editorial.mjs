// Qualitative workload positioning, not a synthetic benchmark ranking.
const B=(zh,en)=>({zh,en});
export const tiers={
  basic:B('基础办公','Basic office work'),
  daily:B('主流办公','Everyday productivity'),
  versatile:B('全能创作','General-purpose creation'),
  heavy:B('高性能计算','Demanding computation'),
  flagship:B('旗舰重负载','Flagship heavy workloads')
};
export function explain(m){
  const n=parseInt(m.cores),p=Number(m.coreNote.match(/(\d+) 性能核/)?.[1]||0);
  const highPower=/^(?:35|45|55)|35-54|45-75|55-75/.test(m.power);
  const make=(tier,group,zh,en)=>({tier,group,summary:B(zh,en)});
  if(m.brand==='Intel'){
    if(/N \/ Core N/.test(m.family)){
      return n===4?make('basic','intel-n4','4 个能效核的入门 CPU，适合文档、网课和少量网页；大型软件启动、多程序并开和编译的等待较多。','An entry-level CPU with four efficiency cores for documents, classes and a few browser tabs. Large applications, multitasking and builds involve more waiting.'):
        make('basic','intel-n8','8 个能效核，比 4 核 N 系列更能应付多任务和并行小作业；单核与持续计算能力仍属于入门级，适合办公和编程学习。','Eight efficiency cores offer more multitasking and small parallel-job capacity than four-core N chips. Single-core and sustained compute remain entry-level; office work and programming lessons fit best.');
    }
    if(/Core 300/.test(m.family))return n===5?
      make('daily','intel-core300-5','只有 1 个性能核，偏向文档、网页和会议；比同系列 6 核型号少一个性能核，多任务与编译的余量更小。','With only one performance core, it focuses on documents, browsing and calls. It has one fewer performance core than six-core siblings, leaving less headroom for multitasking and builds.'):
      make('daily','intel-core300-6','2 个性能核加 4 个低功耗核，属于日常办公型 CPU；能做编程学习和简单剪辑，长时间编译、渲染不及同代核心更多的 Ultra H。','Two performance cores and four low-power cores target everyday productivity. Programming lessons and simple edits fit; long builds and renders have less CPU capacity than more heavily equipped Ultra H chips of the same generation.');
    if(/Ultra 300/.test(m.family)){
      if(n<=8)return make('versatile','intel-ultra300-small',`${n} 核的轻薄本 CPU，适合办公、开发和轻量创作；相较同代 12 / 16 核 H 型号，并行编译和 CPU 渲染的余量较小。`,`${n} cores target office work, development and light creation in portable laptops. Parallel builds and CPU renders have less headroom than the generation's 12- and 16-core H models.`);
      return make(n===16?'heavy':'versatile','intel-ultra300-'+n,`${n} 核的性能型轻薄本 CPU，适合完整开发环境、并行编译与常规 4K 剪辑；比同代 6 / 8 核型号更适合多任务，长渲染仍看整机功耗。`,`${n} cores support a full development setup, parallel builds and routine 4K editing. It has more parallel-task capacity than six- and eight-core siblings; sustained rendering still depends on laptop power limits.`);
    }
    if(/200V/.test(m.family))return make('versatile','intel-v','8 核 8 线程，偏重轻薄本的日常响应和能效；办公、开发与单路剪辑够用，大型编译和批量 CPU 渲染的吞吐不及核心更多的 H / HX。','Eight cores and eight threads prioritize responsiveness and efficiency in portable laptops. Office work, development and single-stream editing fit; larger H/HX configurations provide more capacity for big builds and batch CPU rendering.');
    if(/HX/.test(m.name))return make(n>=24?'flagship':n>=14?'heavy':'versatile','intel-hx-'+n,
      n>=24?`${n} 核的高功耗旗舰，适合大型并行编译、复杂 CPU 渲染和密集多任务；这类优势需要插电及较强散热，附带集显只适合基础显示。`:
      n>=14?`${n} 核的高性能 HX，适合项目全量编译和持续 CPU 渲染；多核规模低于 24 核旗舰，但日常办公很难用满这些资源。`:
      `${n} 核的入门 HX，可做常规开发、剪辑及 CPU 渲染；后缀虽是 HX，多核配置仍低于同代 14 / 16 / 24 核型号。`,
      n>=24?`${n} high-power hybrid cores target large parallel builds, complex CPU renders and heavy multitasking. Plugged-in power and substantial cooling matter; the integrated GPU is primarily for basic display.`:
      n>=14?`${n} hybrid cores suit full project builds and sustained CPU rendering. Parallel capacity is below 24-core flagships, while routine office work rarely uses all these resources.`:
      `${n} hybrid cores form an entry HX configuration for development, editing and CPU renders. The HX suffix does not give it the parallel resources of the same generation's 14-, 16- or 24-core models.`);
    if(/H(?:K)?$/.test(m.name))return make(p>=6?'heavy':'versatile','intel-h-'+n+'-'+p,
      p>=6?`${p} 个性能核、共 ${n} 核，适合较大的编译任务、剪辑和多任务；相较 4 性能核 H 型号，可并行工作的资源更多，长任务速度仍看散热。`:
      `${p||4} 个性能核、共 ${n} 核，属于主流性能型 CPU，适合项目开发和常规剪辑；可做 CPU 渲染，但批量出图的余量低于高核心数 H / HX。`,
      p>=6?`${p} performance cores within ${n} total cores suit larger builds, editing and multitasking. There are more parallel resources than four-performance-core H models; cooling determines long-task speed.`:
      `${p||4} performance cores within ${n} total cores target mainstream development and editing. CPU rendering is possible, with less batch-render capacity than higher-core H/HX models.`);
    if(/P$/.test(m.name))return make(n>=12?'versatile':'daily','intel-p-'+n,`${p} 个性能核、共 ${n} 核，介于轻办公与高功耗平台之间，适合开发和中等多任务；薄机身里长编译、渲染的持续速度通常先受功耗限制。`,`${p} performance cores within ${n} total cores serve development and moderate multitasking between office-focused and high-power platforms. Thin laptops can limit sustained builds and renders through power settings.`);
    return make(n<=6&&p<=1?'basic':'daily','intel-u-'+n+'-'+(/9 W/.test(m.power)?9:15),
      `${p||2} 个性能核、共 ${n} 核，偏向文档、多网页和轻量开发；能做简单剪辑，长期多核负载的资源比同代 H 型号少${/9 W/.test(m.power)?'，9 W 基础功耗更偏重低功耗使用':''}。`,
      `${p||2} performance cores within ${n} total cores focus on documents, browser work and light development. Simple edits fit; sustained multicore capacity is below H models of the same generation${/9 W/.test(m.power)?', with its 9 W base rating emphasizing low-power use':''}.`);
  }
  if(m.brand==='AMD'){
    if(/AI Max/.test(m.name))return make(n===16?'flagship':n===12?'heavy':'versatile','amd-max-'+n,
      `${n} 核 ${n*2} 线程，${n===16?'适合重编译、CPU 渲染及较重图形创作':n===12?'适合较重开发和创作，多核规模低于 16 核 Max+ 395':'CPU 适合常规开发和创作，多核规模低于 12 / 16 核 Max 型号'}；大规模集显是这组芯片的另一项重点。`,
      `${n} cores and ${n*2} threads ${n===16?'support heavy builds, CPU renders and substantial graphics work':n===12?'target demanding development and creation, with fewer CPU resources than the 16-core Max+ 395':'target general development and creation, with fewer CPU resources than 12- and 16-core Max models'}. The large integrated GPU is a separate strength of this family.`);
    if(/AI \d/.test(m.name)||/Ryzen [57] 4[34]9/.test(m.name))return make(n>=10?'heavy':n>=6?'versatile':'daily','amd-ai-'+n,
      `${n} 核 ${n*2} 线程的${n>=10?'高性能轻薄本 CPU，适合并行编译和较重多任务；比 6 / 8 核版本有更多并行资源':n>=6?'主流全能 CPU，适合项目开发、修图和常规剪辑；重编译和批量渲染的资源低于 10 / 12 核版本':'日常型 CPU，办公和小项目够用；大型编译、多虚拟机和 CPU 渲染明显更受核心数限制'}。`,
      `${n} cores and ${n*2} threads ${n>=10?'provide a performance-oriented portable CPU for parallel builds and heavier multitasking, with more parallel resources than six- and eight-core versions':n>=6?'form a mainstream all-round CPU for development, photos and routine editing; heavy builds and batch rendering have less capacity than 10- and 12-core versions':'target everyday work and small projects; large builds, multiple VMs and CPU renders are much more constrained by core count'}.`);
    if(/HX/.test(m.name))return make(n===16?'flagship':n===12?'heavy':'versatile','amd-hx-'+n,
      `${n} 核 ${n*2} 线程的高功耗 CPU，${n>=12?'适合大型编译、CPU 渲染和持续重计算':n===8?'适合游戏本上的完整开发、常规创作和中等 CPU 渲染':'可做项目开发和常规创作，但多核规模低于 8 / 12 / 16 核 HX'}；Radeon 610M 仅是基础集显，游戏通常依靠独显。`,
      `${n} cores and ${n*2} threads at high power ${n>=12?'target large builds, CPU rendering and sustained computation':n===8?'suit full development setups, routine creation and moderate CPU renders in gaming laptops':'support development and routine creation with fewer parallel resources than 8-, 12- and 16-core HX models'}. Radeon 610M is a basic iGPU; gaming normally uses a discrete GPU.`);
    if(m.graphics==='none')return make(n===8?'versatile':'daily','amd-noigpu-'+n,`${n} 核 ${n*2} 线程，${n===8?'适合常规编译、游戏本多任务和剪辑':'适合日常使用和小项目，大型编译与 CPU 渲染的余量较小'}；没有集成显卡，整机必须配独显，不能按其他同名档位锐龙的集显能力判断。`,`${n} cores and ${n*2} threads ${n===8?'suit routine builds, gaming-laptop multitasking and editing':'target everyday work and small projects, with less room for large builds and CPU renders'}. There is no integrated GPU; the laptop requires a discrete GPU.`);
    if(/7320|7520|7525/.test(m.name))return make('basic','amd-zen2-4','4 核 Zen 2 入门 CPU，适合文档、网课和简单网页；大型开发工具、多程序并开及剪辑较吃力，不能按“Ryzen 7000”当成 7840U 那一档。','A four-core Zen 2 entry CPU for documents, classes and simple browsing. Large development tools, multitasking and editing are more demanding; the Ryzen 7000 name does not put it in the same class as a 7840U.');
    const old=/73[35]0|75[23]0|77[35]0|7525/.test(m.name),zen3plus=/7535|7735/.test(m.name);
    const architecture=old?'Zen 3':zen3plus?'Zen 3+':'Zen 4';
    return make(n===8&&highPower?'heavy':n>=6?'versatile':'daily','amd-'+architecture+'-'+n+'-'+(highPower?'h':'u'),
      `${n} 核 ${n*2} 线程${architecture==='Zen 4'?'的 Zen 4':architecture==='Zen 3+'?'的 Zen 3+':'的 Zen 3'} CPU，${n===8?'适合项目开发、较多程序并开和常规剪辑':n===6?'适合日常开发、修图和基础剪辑，重计算资源少于同代 8 核型号':'适合办公和小型开发项目，重编译、批量渲染更容易出现等待'}${highPower?'；较高功耗定位适合持续任务':'；低功耗整机里长任务速度更依赖散热'}。`,
      `${n} ${architecture} cores and ${n*2} threads ${n===8?'suit project development, substantial multitasking and routine editing':n===6?'suit everyday development, photos and basic editing, with fewer compute resources than eight-core siblings':'target office work and small development projects; heavy builds and batch renders involve more waiting'}${highPower?'; higher-power positioning suits sustained tasks':'; sustained speed in low-power laptops is especially sensitive to cooling'}.`);
  }
  if(m.brand==='Apple'){
    if(/A18/.test(m.name))return make('daily','apple-a18','6 核 CPU，侧重文档、网页和日常应用；可以写代码和轻量剪辑，但持续多核计算与大型创作的余量低于 M 系列 Pro / Max。','Six CPU cores focus on documents, browsing and daily apps. Coding and light editing are possible, with less sustained multicore and large-project capacity than M-series Pro/Max chips.');
    const gen=Number(m.name.match(/M(\d)/)?.[1]),max=/Max/.test(m.name),pro=/Pro/.test(m.name);
    if(max||pro)return make(n>=14?'flagship':'heavy','apple-'+gen+'-'+(max?'max':'pro')+'-'+n,
      `${n} 核 CPU 的 ${max?'Max':'Pro'} 配置，适合${n>=14?'大型工程编译、CPU 渲染和专业创作':'较重开发、多任务与常规专业创作'}；${max?'Max 的大规模 GPU 与内存带宽主要帮助图形任务，CPU 不会因 GPU 核心更多而同比变快':'相较同代标准 M 芯片，多核计算资源更多'}。`,
      `This ${n}-core CPU ${max?'Max':'Pro'} configuration targets ${n>=14?'large builds, CPU rendering and professional creation':'demanding development, multitasking and routine professional creation'}. ${max?'The large GPU and memory bandwidth mainly benefit graphics workloads; more GPU cores do not proportionally speed up CPU tasks':'It has more multicore resources than the generation’s base M chip'}.`);
    return make('versatile','apple-base-'+gen,`${n} 核的标准 M${gen}，适合办公、编程开发、修图和单路视频剪辑；CPU 多核规模小于同代 Pro / Max，长时间重负载还要区分无风扇 Air 与主动散热机型。`,`${n} CPU cores in the base M${gen} suit productivity, development, photos and single-stream video editing. Multicore resources are below same-generation Pro/Max chips; fanless Air and actively cooled laptops also differ under sustained load.`);
  }
  if(m.brand==='Qualcomm'){
    const x2=/X2/.test(m.name),elite=/Elite/.test(m.name);
    return make(x2&&n===18?'flagship':elite?'heavy':n===10?'versatile':'daily','snapdragon-'+(x2?2:1)+'-'+n,
      `${n} 核 ${x2?'第三代':'第一代'} Oryon CPU，${n===18?'面向较重原生 Arm 编译和密集多任务':n>=12?'适合原生 Arm 开发与较重多任务':n===10?'适合办公、原生 Arm 项目开发和轻量创作':'偏向办公、会议与轻量开发'}；${n<=10?'同代 Elite 的 CPU 并行资源更多，':''}转译软件、驱动与游戏兼容性要另外确认。`,
      `${n} ${x2?'third':'first'}-generation Oryon CPU cores ${n===18?'target heavy native Arm builds and dense multitasking':n>=12?'suit native Arm development and heavier multitasking':n===10?'suit productivity, native Arm projects and light creation':'focus on office work, calls and light development'}. ${n<=10?'Same-generation Elite models have more parallel CPU resources. ':''}Emulated software, drivers and games require separate compatibility checks.`);
  }
  throw new Error('No editorial profile for '+m.id);
}
