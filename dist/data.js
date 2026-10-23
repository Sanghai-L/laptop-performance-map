'use strict';
// Specs: vendor primary sources, checked 2026-10-22. Explanations: qualitative editorial interpretation.
window.CPU_GUIDE = {
  checked: '2026-10-22',
  categories: {
    thin: { title: '轻薄本', description: '把重量、便携与移动使用放在前面。日常办公并不需要最高档 CPU；想做创作，也要留意长时间负载时的散热和内存。', focus: '看能效，也看软件适配', defaultModel: '258v' },
    versatile: { title: '全能本', description: '“全能本”没有统一硬件标准。它通常在便携与性能之间取舍，可有集显或独显；适合用具体的创作、编程任务理解能力。', focus: '看持续计算与图形搭配', defaultModel: '255h' },
    gaming: { title: '游戏本', description: '一般用更大的散热和独立显卡承接游戏、渲染等重负载。CPU 负责逻辑与调度；大型游戏的画质和帧率还要重点看 GPU。', focus: 'CPU、独显与散热一起看', defaultModel: '275hx' }
  },
  tasks: [
    { id: 'office', label: '办公网课', icon: '▤' },
    { id: 'code', label: '编程开发', icon: '⌘' },
    { id: 'edit', label: '修图剪辑', icon: '◫' },
    { id: 'render', label: '3D / 渲染', icon: '◇' },
    { id: 'esport', label: '电竞网游', icon: '⌁' },
    { id: 'aaa', label: '大型游戏', icon: '✧' },
    { id: 'ai', label: 'AI 应用', icon: '✳' }
  ],
  models: [
    {
      id: '258v', brand: 'Intel', family: 'Core Ultra 200V', name: 'Core Ultra 7 258V', short: 'Ultra 7 258V', categories: ['thin'], platform: 'x86 / Windows',
      role: '移动办公与轻创作', summary: '偏重移动能效的一类处理器。可以写文档、做演示、编程、修照片，也能借助集成显卡处理轻量图形任务；长时间全核重活要看整机散热。',
      cores: '8 核 / 8 线程', coreNote: '4 性能核 + 4 低功耗能效核', gpu: 'Intel Arc 140V', power: '17 W 基础功耗', powerNote: '最大睿频功耗 37 W', npu: '47 TOPS', level: 'mobile', graphics: 'capable',
      examples: '写论文、浏览网页与开会；学习编程；修照片和短视频剪辑。任务变复杂后，内存和软件加速很关键。',
      limits: '8 核不表示只能做轻任务，也不能保证长时间渲染的速度。官方列出的最大内存为 32 GB，仍需核对整机内存配置。',
      source: 'https://www.intel.com/content/www/us/en/products/sku/240957/intel-core-ultra-7-processor-258v-12m-cache-up-to-4-80-ghz/specifications.html'
    },
    {
      id: '358h', brand: 'Intel', family: 'Core Ultra Series 3', name: 'Core Ultra X7 358H', short: 'Ultra X7 358H', categories: ['thin', 'versatile'], platform: 'x86 / Windows',
      role: '创作与集显图形任务', summary: '把多核 CPU 与 Arc B390 集成显卡放在同一平台。可以承担开发、剪辑和一些游戏；图形能力来自 GPU 部分，不能只看“X7”三个字符。',
      cores: '16 核 / 16 线程', coreNote: '4 性能核 + 8 能效核 + 4 低功耗能效核', gpu: 'Intel Arc B390', power: '25 W 基础功耗', powerNote: '最大睿频功耗 80 W', npu: '50 TOPS', level: 'balanced', graphics: 'capable',
      examples: '同时运行开发工具与浏览器；修图、剪辑；在合适设置下运行部分 3D 游戏。',
      limits: '16 个核心并非同一种核心。薄机身和更大机身的持续表现会不同；集显仍共享系统内存与整机功耗。',
      source: 'https://www.intel.com/content/www/us/en/products/sku/245527/intel-core-ultra-x7-processor-358h-18m-cache-up-to-4-80-ghz/specifications.html'
    },
    {
      id: '225h', brand: 'Intel', family: 'Core Ultra 200H', name: 'Core Ultra 5 225H', short: 'Ultra 5 225H', categories: ['thin', 'versatile'], platform: 'x86 / Windows',
      role: '日常工作与多线程任务', summary: '“Ultra 5”不等于只能办公。它有多种核心协同工作，可以做开发、修图、视频剪辑；持续重任务仍受散热和功耗设置影响。',
      cores: '14 核 / 14 线程', coreNote: '4 性能核 + 8 能效核 + 2 低功耗能效核', gpu: 'Intel Arc 130T', power: '28 W 基础功耗', powerNote: '最大睿频功耗 115 W', npu: '13 TOPS', level: 'balanced', graphics: 'capable',
      examples: '写代码和编译课程项目；照片处理；视频剪切、字幕与常见转码。',
      limits: '不能把最大睿频功耗当作电脑持续能给的功耗。Arc 品牌有内存配置条件，集显表现也受内存带宽影响。',
      source: 'https://www.intel.com/content/www/us/en/products/sku/241749/intel-core-ultra-5-processor-225h-18m-cache-up-to-4-90-ghz/specifications.html'
    },
    {
      id: '255h', brand: 'Intel', family: 'Core Ultra 200H', name: 'Core Ultra 7 255H', short: 'Ultra 7 255H', categories: ['versatile', 'gaming'], platform: 'x86 / Windows',
      role: '开发、创作与多任务', summary: '适合用来理解 H 系列的工作方式：CPU 可以承担编译、创作和游戏逻辑，集显负责基础图形，搭配独显的整机还能承接更重的图形任务。',
      cores: '16 核 / 16 线程', coreNote: '6 性能核 + 8 能效核 + 2 低功耗能效核', gpu: 'Intel Arc 140T', power: '28 W 基础功耗', powerNote: '持续功耗由整机决定', npu: '13 TOPS', level: 'balanced', graphics: 'capable',
      examples: '项目开发与并行编译；图像处理与视频导出；配合合适显卡处理游戏和三维工作。',
      limits: '255H、255HX、258V 是不同型号。视频导出不只靠 CPU；核显、独显和媒体引擎是否被软件调用也很关键。',
      source: 'https://download.intel.com/newsroom/2025/client-computing/Intel-CES2025-Performance-Preview-Keynote.pdf',
      sourceExtra: 'https://www.intel.com/content/www/us/en/products/details/processors/core-ultra/series-2/products.html'
    },
    {
      id: '275hx', brand: 'Intel', family: 'Core Ultra 200HX', name: 'Core Ultra 9 275HX', short: 'Ultra 9 275HX', categories: ['gaming'], platform: 'x86 / Windows',
      role: '持续重计算与游戏协作', summary: '面向能提供较高供电与散热能力的整机。可以承接大型编译、CPU 渲染和游戏逻辑；附带集显并不是大型游戏高画质的主要算力来源。',
      cores: '24 核 / 24 线程', coreNote: '8 性能核 + 16 能效核', gpu: 'Intel Graphics', power: '55 W 基础功耗', powerNote: '最大睿频功耗 160 W', npu: '13 TOPS', level: 'heavy', graphics: 'basic',
      examples: '可并行的大项目编译、CPU 渲染、密集计算；与独显协作运行游戏和创作软件。',
      limits: '核心很多不代表每个应用都会更快。高画质游戏仍要看独显与显存；脱离电源或切换安静模式时表现会改变。',
      source: 'https://www.intel.com/content/www/us/en/products/sku/242293/intel-core-ultra-9-processor-275hx-36m-cache-up-to-5-40-ghz/specifications.html'
    },
    {
      id: '450', brand: 'AMD', family: 'Ryzen AI 400', name: 'Ryzen AI 7 450', short: 'Ryzen AI 7 450', categories: ['thin', 'versatile'], platform: 'x86 / Windows',
      role: '日常多任务与轻创作', summary: '8 核 16 线程的 CPU 可以处理办公、开发和创作，Radeon 860M 处理图形，NPU 处理已适配的 AI 功能。名称里的 AI 不会让所有软件自动变快。',
      cores: '8 核 / 16 线程', coreNote: '4 个 Zen 5 + 4 个 Zen 5c 核心', gpu: 'Radeon 860M', power: '15–54 W cTDP', powerNote: '默认 TDP 28 W', npu: '50 TOPS', level: 'balanced', graphics: 'capable',
      examples: '多窗口办公、编程学习与开发；照片处理和短视频；支持该 NPU 的本地 AI 效果。',
      limits: '同样的型号可以用不同功耗运行。AI 7 450 与桌面型号 450G 不是同一个产品，查看资料时要认准笔记本完整型号。',
      source: 'https://www.amd.com/en/products/processors/laptop/ryzen/ai-400-series/amd-ryzen-ai-7-450.html'
    },
    {
      id: '370', brand: 'AMD', family: 'Ryzen AI 300', name: 'Ryzen AI 9 HX 370', short: 'Ryzen AI 9 HX 370', categories: ['thin', 'versatile', 'gaming'], platform: 'x86 / Windows',
      role: '多核创作与集显图形任务', summary: '12 核 CPU、Radeon 890M 集显和独立 NPU 共同工作。可以处理开发、剪辑与多任务；名称中的 HX 不能直接套用传统高功耗 HX 的理解。',
      cores: '12 核 / 24 线程', coreNote: '4 个 Zen 5 + 8 个 Zen 5c 核心', gpu: 'Radeon 890M', power: '15–54 W cTDP', powerNote: '默认 TDP 28 W', npu: '50 TOPS', level: 'balanced', graphics: 'capable',
      examples: '并行编译与多任务；图像、视频处理；在合适设置下运行部分游戏。',
      limits: '和 9955HX 的功耗定位、集显规格不同。集显性能受内存与功耗影响；复杂图形项目仍要核对 GPU 需求。',
      source: 'https://www.amd.com/en/products/processors/laptop/ryzen/ai-300-series/amd-ryzen-ai-9-hx-370.html'
    },
    {
      id: '8845hs', brand: 'AMD', family: 'Ryzen 8000', name: 'Ryzen 7 8845HS', short: 'Ryzen 7 8845HS', categories: ['versatile', 'gaming'], platform: 'x86 / Windows',
      role: '开发、创作与游戏配合', summary: '这一代的 8 核 16 线程 CPU 仍可以承担办公、编译、剪辑与游戏逻辑。型号更新并不意味着旧代产品突然不能完成原来的任务。',
      cores: '8 核 / 16 线程', coreNote: 'Zen 4 架构', gpu: 'Radeon 780M', power: '35–54 W cTDP', powerNote: '默认 TDP 45 W', npu: '16 TOPS', level: 'balanced', graphics: 'capable',
      examples: '课程与工作项目开发；修图、视频编辑；集显轻量游戏，或与独显配合处理更重的图形。',
      limits: '不能只用“8”开头判断架构或速度。软件适配、内存与散热同样需要核对，较新的 NPU 功能也未必全部适用。',
      source: 'https://www.amd.com/en/products/processors/laptop/ryzen/8000-series/amd-ryzen-7-8845hs.html'
    },
    {
      id: '9955hx', brand: 'AMD', family: 'Ryzen 9000 HX', name: 'Ryzen 9 9955HX', short: 'Ryzen 9 9955HX', categories: ['gaming'], platform: 'x86 / Windows',
      role: '大型并行任务与独显平台', summary: '16 核 32 线程，能够承担可并行的 CPU 重负载。它的 Radeon 610M 主要用于显示与轻量图形；强 CPU 不等于强集显。',
      cores: '16 核 / 32 线程', coreNote: 'Zen 5 架构', gpu: 'Radeon 610M', power: '55–75 W cTDP', powerNote: '默认 TDP 55 W', npu: null, level: 'heavy', graphics: 'basic',
      examples: 'CPU 渲染、并行编译、较重的多任务；与合适独显配合运行大型游戏或图形软件。',
      limits: 'Radeon 610M 不是面向大型游戏高画质的集显。没有独立 NPU 也能使用云端 AI，支持的软件还可在 CPU 或 GPU 上运行 AI。',
      source: 'https://www.amd.com/en/products/processors/laptop/ryzen/9000-series/amd-ryzen-9-9955hx.html'
    },
    {
      id: 'm5', brand: 'Apple', family: 'Apple M 系列', name: 'Apple M5', short: 'Apple M5', categories: ['thin', 'versatile'], platform: 'Arm / macOS',
      role: 'macOS 办公、开发与创作', summary: 'CPU、GPU 与媒体引擎协作完成工作。可以做 macOS 办公、开发、修图和视频剪辑；视频处理能力不只是 CPU 核心数的结果。',
      cores: '10 核 CPU', coreNote: '本文以 MacBook Air 的 M5 为例', gpu: '8 / 10 核 GPU', power: '不作瓦数对比', powerNote: '所引页面未给出同口径 CPU TDP', npu: '16 核 Neural Engine', level: 'mobile', graphics: 'capable', arm: 'mac',
      examples: '运行 macOS 版办公和创作工具；支持 Apple 芯片的开发工具；利用媒体引擎进行支持格式的编解码。',
      limits: '先确认学校、公司和游戏所需软件是否支持 macOS。风扇、机身与配置会改变持续表现；统一内存也供 GPU 使用。',
      source: 'https://www.apple.com/macbook-air/specs/'
    },
    {
      id: 'm5pro', brand: 'Apple', family: 'Apple M Pro 系列', name: 'Apple M5 Pro', short: 'Apple M5 Pro', categories: ['versatile'], platform: 'Arm / macOS',
      role: 'macOS 持续开发与创作', summary: '面向更复杂的开发与创作工作。CPU 可以承担并行编译与渲染；GPU、统一内存和媒体引擎也参与图形与视频处理，不能把整体提升全部归到 CPU。',
      cores: '15 / 18 核 CPU', coreNote: '两种配置，不能只看 M5 Pro 名称', gpu: '16 / 20 核 GPU', power: '不作瓦数对比', powerNote: '所引页面未给出同口径 CPU TDP', npu: '16 核 Neural Engine', level: 'heavy', graphics: 'capable', arm: 'mac',
      examples: '较大的原生开发项目与并行编译；视频项目、照片批处理；支持 Apple 芯片的三维和计算软件。',
      limits: 'CPU 更强不会补齐不存在的 macOS 软件、插件或驱动。渲染后端、工程大小与统一内存容量决定很多实际边界。',
      source: 'https://www.apple.com/macbook-pro/specs/'
    },
    {
      id: 'x2', brand: 'Qualcomm', family: 'Snapdragon X2 Elite', name: 'Snapdragon X2 Elite', short: 'X2 Elite · X2E-88-100', variant: '本文型号：X2E-88-100', categories: ['thin', 'versatile'], platform: 'Arm / Windows',
      role: '原生 Arm 办公与开发', summary: '本文选取 18 核的 X2E-88-100 作为例子。可用于网页办公、会议和已适配的软件任务；Windows on Arm 的应用、驱动和游戏兼容性要单独确认。',
      cores: '18 核 CPU', coreNote: '12 个 Prime + 6 个 Performance 核心', gpu: 'Adreno X2-90', power: '不作瓦数对比', powerNote: '所引页面未给出同口径 CPU TDP', npu: '80 TOPS', level: 'balanced', graphics: 'capable', arm: 'windows',
      examples: '运行原生 Arm 浏览器与办公软件；会议；使用已适配的编辑和开发工具。',
      limits: 'X2 Elite 有多个规格，必须看后面的料号。转译不保证所有专业插件、外设驱动和游戏反作弊可用。',
      source: 'https://www.qualcomm.com/laptops/products/snapdragon-x2-elite',
      sourceExtra: 'https://www.qualcomm.com/content/dam/qcomm-martech/dm-assets/documents/Snapdragon-X2-Elite-Product-Brief.pdf'
    }
  ],
  quiz: [
    { question: '一台电脑用的是“9”档 CPU，所以大型游戏一定比“7”档的电脑快？', options: ['一定，数字越大游戏越快', '还要看完整型号、显卡、功耗与散热', '只需要比较 CPU 核心数量'], answer: 1, explanation: '对游戏来说，CPU 和 GPU 要一起看。画质、分辨率、显存以及整机供电都会改变帧率，单个档位数字无法下结论。' },
    { question: '视频会议时，网页、表格、聊天一起打开后开始卡顿，能直接断定 CPU 太差吗？', options: ['不能，内存、后台任务和网络都可能影响', '可以，所有卡顿都由 CPU 引起', '换成有 AI 字样的 CPU 就一定解决'], answer: 0, explanation: '需要先找到瓶颈。内存不够可能触发频繁换页，网络会影响会议，后台程序也可能占满资源。先确认原因，才能理解配置的意义。' },
    { question: '看到 Ryzen AI 9 HX 370 与 Ryzen 9 9955HX，都有 HX，下一步怎么理解？', options: ['把它们当作同一种功耗定位', '按型号数字大小判断所有任务速度', '查看各自官方规格，再看具体整机表现'], answer: 2, explanation: '完整系列很关键。这两个例子的可配置 TDP、核心配置和集成显卡均不同。字母只是线索，不是统一的性能等级。' }
  ]
};
