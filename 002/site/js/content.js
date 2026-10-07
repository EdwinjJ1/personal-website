// 全站文案（中英）。事实来自简历和上一代网站的自我介绍；改内容只改这里。
// 面板可选字段：image { src, alt }（配图）、sections [{ heading, items }]（带小标题的分组要点）。

export const LANGS = ['zh', 'en'];

// 十个宇宙：id 对应 assets/styles/<id>.webp
export const STYLES = [
  { id: 'comic', earth: 'EARTH-1610', sfx: 'THWIP!', ink: '#14121c', paper: '#fff6e0', accent: '#e5484d', name: { zh: '布鲁克林墨线', en: 'Brooklyn Ink' } },
  { id: 'noir', earth: 'EARTH-90214', sfx: 'BANG.', ink: '#0c0c10', paper: '#f2efe6', accent: '#e5484d', name: { zh: '黑白默片', en: 'Noir' } },
  { id: 'pop', earth: 'EARTH-1962', sfx: 'WHAAM!', ink: '#101014', paper: '#fffbea', accent: '#e8212b', name: { zh: '波普', en: 'Pop Art' } },
  { id: 'anime', earth: 'EARTH-14512', sfx: 'KIRA!', ink: '#3a2466', paper: '#f6f0ff', accent: '#ff7ac8', name: { zh: '机甲动漫', en: 'Mecha Anime' } },
  { id: 'watercolor', earth: 'EARTH-65', sfx: 'SPLASH~', ink: '#4a4660', paper: '#fffaf0', accent: '#5fb8b0', name: { zh: '水彩', en: 'Watercolor' } },
  { id: 'punk', earth: 'EARTH-138', sfx: 'OI!', ink: '#0c0b10', paper: '#f8f400', accent: '#ff2e88', name: { zh: '朋克拼贴', en: 'Punk Zine' } },
  { id: 'neon', earth: 'EARTH-928', sfx: 'BZZT!', ink: '#e8f6ff', paper: '#0d0a24', accent: '#00f0ff', name: { zh: '霓虹 2099', en: 'Neon 2099' } },
  { id: 'sketch', earth: 'EARTH-1504', sfx: 'SCRITCH', ink: '#3d2616', paper: '#e8d5ac', accent: '#a8402a', name: { zh: '文艺复兴手稿', en: 'Renaissance Sketch' } },
  { id: 'pixel', earth: 'EARTH-8BIT', sfx: 'BLIP!', ink: '#1a1c2c', paper: '#f4f4f4', accent: '#ef7d57', name: { zh: '像素街机', en: 'Arcade Pixel' } },
  { id: 'void', earth: 'EARTH-42B', sfx: 'BLOT.', ink: '#111114', paper: '#fbfaf6', accent: '#ff5a1f', name: { zh: '墨点虚空', en: 'Ink Void' } },
];

// 场景里的热点名 → 面板；action 表示不是面板的特殊行为
export const HOTS = {
  board: { panel: 'about' },
  press: { panel: 'press' },
  monitor: { action: 'chat' },
  keyboard: { action: 'chat' },
  mask: { action: 'style' },
  'zine-echo': { panel: 'echo' },
  phone: { panel: 'echoMobile' },
  'zine-roundtable': { panel: 'roundtable' },
  roundtable: { panel: 'roundtable' },
  'zine-athena': { panel: 'athena' },
  trophy: { panel: 'awards' },
  'zine-preuni': { panel: 'preuni' },
  notebook: { panel: 'blog' },
  hypha: { panel: 'hypha' },
  mosi: { panel: 'mosi' },
  news: { panel: 'news' },
  photos: { panel: 'photos' },
  projects: { panel: 'projects' },
  friends: { panel: 'friends' },
  contact: { panel: 'contact' },
  camera: { panel: 'photos' },
  fries: { panel: 'fries' },
};

export const LABELS = {
  board: { zh: '我是谁', en: 'Who is Evan?' },
  press: { zh: '剪报：获奖与收录', en: 'Press clippings' },
  monitor: { zh: '跟我聊聊', en: 'Talk to me' },
  keyboard: { zh: '点键盘，跟我聊', en: 'Click the keyboard. Talk to me.' },
  mask: { zh: '换一个宇宙', en: 'Switch universe' },
  'zine-echo': { zh: '回声 echo agent', en: 'Echo Agent' },
  phone: { zh: '回声手机端', en: 'Echo on your phone' },
  'zine-roundtable': { zh: 'Roundtable', en: 'Roundtable' },
  roundtable: { zh: 'Roundtable 小圆桌', en: 'The round table' },
  'zine-athena': { zh: 'Athena', en: 'Athena' },
  trophy: { zh: '奖杯柜', en: 'Trophies' },
  'zine-preuni': { zh: 'PreUni 课程笔记', en: 'PreUni notes' },
  notebook: { zh: '博客', en: 'Blog' },
  hypha: { zh: 'Hypha · 17 岁的创业', en: 'Hypha · founder at 17' },
  mosi: { zh: '模思智能 · 实习', en: 'MOSI · internship' },
  news: { zh: '今日新闻', en: 'News desk' },
  photos: { zh: '摄影', en: 'Photography' },
  projects: { zh: '全部项目', en: 'All projects' },
  friends: { zh: '朋友们', en: 'Friends' },
  contact: { zh: '联系我', en: 'Contact' },
  camera: { zh: '摄影', en: 'Photography' },
  fries: { zh: '一盘薯条', en: 'A plate of fries' },
};

const L = (zh, en) => ({ zh, en });

export const PANELS = {
  about: {
    kicker: L('WHO IS EVAN?', 'WHO IS EVAN?'),
    title: L('贾岱林 Evan', 'Evan Jia'),
    sub: L('AI 产品经理 × 全栈 Agent 开发者 · 20 岁', 'AI Product Manager × Full-Stack Agent Builder · 20'),
    body: L(
      [
        '我是贾岱林，英文名 Evan，20 岁，在悉尼的新南威尔士大学（UNSW）读计算机科学。上大学之前，我在北京带过一家 7 个人的 Web3 公司，核心产品做到过单日营业额 10 万元以上。',
        '现在我主要做语音 Agent。白天在上海模思智能做 AI 产品经理实习，负责 MosMos 的语音 Agent：产品经理的活干完，我会自己把代码写完、推上线。业余时间带 4 个人做回声 echo agent：在 Mac 上按一下快捷键说句话，它就把事情交给 Claude Code 和 Codex 去办。',
        '我喜欢从头到尾自己负责一件事：设计、前端、后端、部署、推广。野心这件事上我比较直白：想做一个真正有用的东西，宁可瞄得太高打偏，也不想瞄低了打中。',
      ],
      [
        'I’m Evan Jia (贾岱林), 20, studying Computer Science at UNSW in Sydney. Before university I ran a seven-person Web3 company in Beijing and took its core product past ¥100K in single-day revenue.',
        'These days I mostly build voice agents. By day I’m an AI product manager intern at MOSI in Shanghai, owning the voice agent in MosMos: once the PM work is done, I write the code and ship it myself. On the side I lead a team of four on Echo Agent: press a hotkey on your Mac, say it, and it hands the work to Claude Code and Codex.',
        'I like owning a thing end to end: design, frontend, backend, deploy, launch. I’m ambitious in a fairly plain way: I want to build something that actually matters, and I’d rather aim too high and miss than aim low and hit.',
      ],
    ),
    bullets: L([], []),
    sections: [
      {
        heading: L('基本信息', 'Basics'),
        items: L(
          ['贾岱林 / Evan Jia，20 岁', '悉尼 ⇄ 上海', 'UNSW 计算机科学本科，2025 – 2027（预计）', '中文母语，英语是工作语言', 'ENTJ：喜欢带队，也喜欢自己动手', 'Open to opportunities'],
          ['贾岱林 / Evan Jia, 20', 'Sydney ⇄ Shanghai', 'BSc Computer Science, UNSW, 2025 – 2027 (expected)', 'Native Mandarin, working English', 'ENTJ: comfortable leading, comfortable building', 'Open to opportunities'],
        ),
      },
      {
        heading: L('时间线', 'Timeline'),
        items: L(
          ['2023.7 – 2024.7　创立 Hypha，任 CEO，带 7 人团队', '2025.2　入读 UNSW 计算机科学', '2025.6 – 2026.5　PreUni：课程笔记分享站', '2026.4 – 5　Lark Loom：飞书 AI 校园挑战赛 Top 3', '2026.6 – 7　Roundtable 开源', '2026.7 – 8　Athena 获 Susquehanna Prize；Akeso 入围 ICON × Lyra 决赛', '2026.9 至今　模思智能 AI 产品经理实习', '2026.9 至今　回声 echo agent，入选 GitHub 61.7k★ 中国独立开发者项目列表'],
          ['Jul 2023 – Jul 2024　Founded Hypha, CEO of a team of seven', 'Feb 2025　Started Computer Science at UNSW', 'Jun 2025 – May 2026　PreUni: course notes, shared', 'Apr – May 2026　Lark Loom: Top 3 at the Feishu AI Campus Challenge', 'Jun – Jul 2026　Open-sourced Roundtable', 'Jul – Aug 2026　Athena won the Susquehanna Prize; Akeso reached the ICON × Lyra final', 'Sep 2026 – now　AI PM intern at MOSI', 'Sep 2026 – now　Echo Agent, featured in the 61.7k★ Chinese indie developer list'],
        ),
      },
      {
        heading: L('我在意的事', 'What I’m into'),
        items: L(
          ['AI 与自动化：我的大多数项目都是给开发者用的 AI 工具，让模型去做无聊的那部分', '创业：已经带过一家公司，打算再带一家更好的', '从头到尾做产品：设计、前端、后端、部署，都想自己过一遍', '摄影：街头、人像、建筑、野生动物（点桌上的相机看）'],
          ['AI and automation: most of my projects are AI tools for developers; I like making the model do the boring part', 'Entrepreneurship: I’ve run one company and intend to run a better one', 'Building products end to end: design, frontend, backend, deploy', 'Photography: street, portrait, architecture, wildlife (click the camera on the desk)'],
        ),
      },
      {
        heading: L('技能', 'Skills'),
        items: L(
          ['语言：TypeScript、Swift、Python、Dart、Go', '端：Next.js、React Native（Expo）、SwiftUI、Flutter', 'AI：LLM API、Function Calling、Agent 运行时与工具层设计、Prompt / Context Engineering', '基础设施：Cloudflare Workers、Vercel、Postgres、Stripe'],
          ['Languages: TypeScript, Swift, Python, Dart, Go', 'Clients: Next.js, React Native (Expo), SwiftUI, Flutter', 'AI: LLM APIs, function calling, agent runtime and tool design, prompt / context engineering', 'Infra: Cloudflare Workers, Vercel, Postgres, Stripe'],
        ),
      },
    ],
    tags: ['Voice agents', 'Agent tooling', 'Swift', 'TypeScript', 'React Native', 'Next.js'],
    links: [{ label: L('全部项目', 'All projects'), action: 'projects' }, { label: L('GitHub', 'GitHub'), href: 'https://github.com/EdwinjJ1' }, { label: L('LinkedIn', 'LinkedIn'), href: 'https://www.linkedin.com/in/evan-jia-152108369/' }, { label: L('联系我', 'Get in touch'), action: 'contact' }],
  },
  mosi: {
    kicker: L('实习 · 2026.9 – 至今', 'INTERNSHIP · SEP 2026 – NOW'),
    title: L('模思智能 MOSI', 'MOSI Intelligence'),
    sub: L('AI 产品经理实习生 · MosMos AI 语音助手', 'AI Product Manager Intern · MosMos voice assistant'),
    body: L(
      ['MosMos 是模思智能面向办公场景的 AI 语音助手（macOS / Windows，Flutter 客户端 + Go 服务端）。我入职首月主导了语音 Agent 的「选中提问 + 多轮对话 + 工具调用」，从策划、推动评审到验收，并且超出产品岗的职责，自己把代码写完、合入并上线。'],
      ['MosMos is MOSI’s AI voice assistant for office work (macOS / Windows, a Flutter client and a Go backend). In my first month I owned “ask about selection + multi-turn + tool calling” for its voice agent, from spec and review to acceptance, and went beyond the PM role to write, merge and ship the code myself.'],
    ),
    bullets: L([], []),
    sections: [
      {
        heading: L('语音 Agent：选中提问 + 多轮对话 + 工具调用', 'Voice agent: selection Q&A, multi-turn, tool calling'),
        items: L(
          ['选中提问：任意应用里选中文字后唤起语音 Agent，就地解释、改写、翻译、提取提醒', '用户明确要求修改时直接写回原输入框；确认写回成功后，长结果浮层才收起为「已替换 · 撤回」，撤回前校验全文仍匹配，不覆盖用户后续编辑', '多轮对话：由单轮问答扩展为带上下文的连续追问，补全长回答的完整输出与会话恢复', '工具调用：语义路由在直接回答、联网搜索、记录 / 待办 / 提醒、选区编辑之间选择动作，流式输出并附来源；模型失败时回退规则候选，不丢用户请求', '性能：文本链路由慢网关改为模型直连，本地实测选区解释 1.72s、改写 1.67s、提醒提取 1.00s，回答首字约 1.4–1.5s'],
          ['Selection Q&A: invoke the voice agent on selected text in any app to explain, rewrite, translate or extract reminders in place', 'When the user asks for an edit, it writes straight back into the original field; the result panel only collapses to “Replaced · Undo” after the write is confirmed, and undo checks the text still matches so later edits are never overwritten', 'Multi-turn: extended single-shot Q&A into follow-ups with context, complete long answers and session recovery', 'Tool calling: a semantic router picks between answering, web search, capture / to-do / reminder, and selection edits, streaming with sources; it falls back to rule candidates when the model fails so no request is lost', 'Latency: moved the text path from a slow gateway to a direct model connection; local tests measured 1.72s to explain, 1.67s to rewrite, 1.00s to extract a reminder, ~1.4–1.5s to first token'],
        ),
      },
      {
        heading: L('会议转写兜底策略', 'Meeting transcription fallback'),
        items: L(
          ['背景：会议转写依赖 MOSS 主通道，任务失败或长时间无结果时，用户拿不到逐字稿', '回退规则：明确失败立即切换豆包录音文件识别；503 / 429 等临时错误按 5 / 10 / 20 / 40 秒退避、最多重试 5 次后再切换；已受理但 30 分钟无结果同样切换', '双通道取舍：完整录音走录音文件识别（带时间戳和说话人分离），流式识别只作逐步上屏的兜底、默认关闭', '验证：89.4 秒录音在主通道被模拟拒绝后，约 15 秒返回 25 段、区分 2 位说话人的逐字稿'],
          ['Context: transcription depended on the MOSS primary channel; when a job failed or stalled, users got no transcript', 'Rules: switch to Doubao file recognition on a hard failure; for 503 / 429, back off 5 / 10 / 20 / 40s for up to 5 retries, then switch; also switch when an accepted job returns nothing for 30 minutes', 'Two channels: full recordings go through file recognition (timestamps and speaker diarisation); streaming recognition is only a progressive-display fallback, off by default', 'Verified: with the primary channel forced to reject, an 89.4s recording came back in ~15s as 25 segments with 2 speakers'],
        ),
      },
      {
        heading: L('API 文档与产品规划', 'API docs and product planning'),
        items: L(
          ['参与 MOSS-VL（图片与视频理解）和 Realtime 模型的 API 开发文档：对比市面主流 VL 模型的文档结构与接口约定，梳理调用规则、字段、示例与边界，整理成研发对接文档', '产出《MosMos 语音 Agent 竞品图谱》《MosMos 迭代路线图》并完成方向汇报，提出「用声纹记住每次开会的人，做跨会议上下文交接」的下一步方向'],
          ['Contributed to the API docs for MOSS-VL (image and video understanding) and the Realtime model: benchmarked mainstream VL model docs, then specified call rules, fields, examples and limits as a hand-off document for engineering', 'Wrote the MosMos voice-agent competitor map and iteration roadmap, presented the direction, and proposed the next step: remember meeting participants by voiceprint to carry context across meetings'],
        ),
      },
    ],
    tags: ['Flutter', 'Go', 'ASR', 'Tool calling', 'PRD'],
    links: [{ label: L('公司官网', 'Company site'), href: 'https://home.mosi.cn/' }],
  },
  echo: {
    kicker: L('独立产品 · 2026.9 – 至今', 'INDIE PRODUCT · SEP 2026 – NOW'),
    title: L('回声 echo agent', 'Echo Agent'),
    sub: L('Mac 上的语音 AI Agent · 发起人，带 4 人团队', 'A voice AI agent for Mac · founder, 4-person team'),
    image: { src: L('assets/projects/echo-cover-zh.webp', 'assets/projects/echo-cover-en.webp'), alt: L('回声 echo agent 宣传封面', 'Echo Agent cover') },
    body: L(
      ['在任何应用里按 Fn+Space 说一句话，回声直接回答，或者动手去做：把编程任务派给本机的 Claude Code 和 Codex，截下当前窗口看图回答，读写文件，操作日历、飞书、微信这些本机应用。', '顶部胶囊浮窗不抢焦点，关掉后任务在后台继续；语音在本机识别，录音不上传。我全权负责产品、架构和研发。'],
      ['Press Fn+Space in any app and say it. Echo answers, or does the work: it hands coding tasks to Claude Code and Codex on your Mac, captures the window you are looking at, reads and writes files, and drives local apps like Calendar, Feishu and WeChat.', 'A capsule at the top of the screen that never steals focus; tasks keep running after you close it. Speech is recognised on-device and recordings never leave your Mac. I own product, architecture and engineering.'],
    ),
    bullets: L(
      ['首个提交后 5 天被 GitHub 61.7k★「中国独立开发者项目列表」收录', '两周迭代到 v0.1.38'],
      ['Featured in the 61.7k★ Chinese indie developer list 5 days after the first commit', 'v0.1.38 within two weeks'],
    ),
    sections: [
      {
        heading: L('macOS 客户端', 'macOS client'),
        items: L(
          ['Swift / SwiftUI；全局快捷键 + 浮窗状态机：待命 → 聆听 → 识别 → 执行', '本地流式语音识别，中文里夹英文术语也认得出', '应用层 → 领域层 → 系统接入层单向依赖，10 个模块各管一件事'],
          ['Swift / SwiftUI; a global hotkey and an overlay state machine: idle → listening → recognising → running', 'On-device streaming speech recognition that copes with English terms inside Chinese', 'One-way dependencies from app to domain to system layers; ten modules, one job each'],
        ),
      },
      {
        heading: L('Agent 能力层', 'Agent tools'),
        items: L(
          ['运行时扩展注册 echo_* 工具，经 echoctl 执行；需要宿主权限的命令走本地 socket', '派发与续接 Claude Code / Codex 会话，几个任务可以同时跑，结果回到对话里', '窗口截图、定时任务、长期记忆（每轮注入系统提示）', '10+ 类本机应用操作：浏览器、音乐、飞书、微信、邮件、备忘录、日历等'],
          ['A runtime extension registers echo_* tools that run through echoctl; commands needing host permissions go over a local socket', 'Dispatch and resume Claude Code / Codex sessions; several tasks run in parallel and results come back into the chat', 'Window capture, scheduled tasks, long-term memory injected into every turn', '10+ kinds of local app control: browser, music, Feishu, WeChat, mail, notes, calendar and more'],
        ),
      },
      {
        heading: L('后台与增长', 'Backend and growth'),
        items: L(
          ['Next.js + Postgres：邮箱 / 手机 / Google / 微信登录、每日额度、模型转发与成本记账', 'Stripe 月卡（银行卡、微信、支付宝）与兑换码', '匿名埋点与流程漏斗、崩溃报告归组、三级角色的管理后台', '中英双语官网；用 Remotion 程序化渲染宣传片和 3 支剧情短片'],
          ['Next.js + Postgres: email / phone / Google / WeChat sign-in, daily quotas, model relay with cost accounting', 'Stripe passes (cards, WeChat Pay, Alipay) and promo codes', 'Anonymous analytics and funnels, grouped crash reports, an admin console with three roles', 'A bilingual site; promo film and three story shorts rendered programmatically with Remotion'],
        ),
      },
    ],
    tags: ['Swift', 'SwiftUI', 'On-device ASR', 'Next.js', 'Postgres', 'Stripe'],
    links: [{ label: L('echoagent.dev', 'echoagent.dev'), href: 'https://echoagent.dev/zh/' }, { label: L('收录列表', 'The 61.7k★ list'), href: 'https://github.com/1c7/chinese-independent-developer' }, { label: L('手机端', 'Mobile remote'), action: 'echoMobile' }],
  },
  echoMobile: {
    kicker: L('回声 · 手机端', 'ECHO · MOBILE'),
    title: L('手机上的回声', 'Echo on your phone'),
    sub: L('Mac 上回声的遥控器 · iOS + Android', 'A remote for Echo on your Mac · iOS + Android'),
    body: L(
      ['人不在电脑前，也能在手机上管理 session：看 Claude Code 和 Codex 在做什么、派新任务、续接、停止、审批权限、按住说话。'],
      ['Away from your desk, manage sessions from your phone: watch Claude Code and Codex, dispatch tasks, resume, stop, approve permissions, hold to talk.'],
    ),
    bullets: L(
      ['Expo / React Native，一套代码出 iOS 和 Android', '中继用 Cloudflare Worker + Durable Object，只转发端到端加密的密文', 'Mac 睡着时命令排队，醒来按顺序执行'],
      ['Expo / React Native, one codebase for iOS and Android', 'Relay on Cloudflare Workers + Durable Objects that only forwards end-to-end encrypted payloads', 'Commands queue while the Mac sleeps and run in order when it wakes'],
    ),
    tags: ['Expo', 'React Native', 'Cloudflare Workers', 'E2E encryption'],
    links: [{ label: L('手机版页面', 'Mobile page'), href: 'https://echoagent.dev/zh/mobile/' }],
  },
  roundtable: {
    kicker: L('开源 · 2026.6 – 2026.7', 'OPEN SOURCE · JUN – JUL 2026'),
    title: L('Roundtable', 'Roundtable'),
    sub: L('多 Agent 协作可视化工作台 · MIT', 'A visual workbench for multi-agent work · MIT'),
    image: { src: L('assets/projects/roundtable.webp', 'assets/projects/roundtable.webp'), alt: L('Roundtable 工作台：一组 Agent 围坐在圆桌旁', 'The Roundtable workbench: a squad of agents around the table') },
    body: L(
      ['多 Agent 工具大多是黑盒：prompt 进去，一墙文字出来。Roundtable 让 Agent 围坐一张实时圆桌，交接、评审、产物和对话都摆在眼前，成功的协作方式可以保存并重复运行。'],
      ['Most multi-agent tools are a black box. Roundtable seats agents around a live table: handoffs, reviews, artifacts and chat happen in front of you, and a way of working that succeeded can be saved and run again.'],
    ),
    bullets: L(
      ['Planner 主导的规划会议产出依赖感知的任务图，调度器按波次并行执行', 'Reviewer 把关，未通过触发有上限的 Fixer 轮次；产物落地前做安全扫描', '运行时可插拔：Claude Code / Codex / OpenCode CLI、E2B 沙箱', '项目发起人与主要作者：4 人协作，116 次提交中贡献 73 次'],
      ['A planner-led meeting produces a dependency-aware task graph; the scheduler runs it in parallel waves', 'Reviewers gate quality; failures trigger bounded fixer rounds; artifacts get a safety scan', 'Pluggable runtimes: Claude Code / Codex / OpenCode CLIs, E2B sandboxes', 'Initiator and main author: 73 of 116 commits in a team of four'],
    ),
    tags: ['Next.js 15', 'TypeScript', 'tRPC', 'Multi-agent'],
    links: [{ label: L('GitHub 仓库', 'GitHub repo'), href: 'https://github.com/EdwinjJ1/roundtable' }],
  },
  athena: {
    kicker: L('黑客松 · 2026.7 – 2026.8', 'HACKATHON · JUL – AUG 2026'),
    title: L('Athena', 'Athena'),
    sub: L('Susquehanna Prize · UNSW × Mistral AI × Atlassian', 'Susquehanna Prize · UNSW × Mistral AI × Atlassian'),
    body: L(
      ['跨职能团队的真实进度散落在 Discord、文档和每个人脑子里，没人愿意反复追问。Athena 是一张实时组织知识图谱，加一个主动追进度的 Discord Agent。'],
      ['A team’s real status is scattered across Discord, docs and heads, and nobody wants to be the one who chases. Athena is a live organisational knowledge graph plus a Discord agent that does the chasing.'],
    ),
    bullets: L(
      ['Agent 私信负责人收集进展，把回复抽取为可溯源的图谱增量', '所有团队的回答落在同一张图里，自动发现跨团队矛盾', '我负责产品架构与最终集成，24 小时内完成', '多段专用 Mistral 管线：分流 → 结构化抽取 → 外发消息 → 文档摄入 → 矛盾检测'],
      ['The agent DMs owners for updates and turns replies into source-traceable graph deltas', 'Every team’s answers land in one graph, so cross-team contradictions surface automatically', 'I owned product architecture and final integration, built in 24 hours', 'A pipeline of specialised Mistral calls: triage → extraction → outbound → ingestion → contradiction detection'],
    ),
    tags: ['TypeScript', 'Next.js', 'SQLite', 'Mistral', 'Discord'],
    links: [{ label: L('GitHub 仓库', 'GitHub repo'), href: 'https://github.com/EdwinjJ1/unsw-mistral-hackathon-2026' }],
  },
  awards: {
    kicker: L('奖杯柜', 'TROPHIES'),
    title: L('比赛与开源', 'Competitions & open source'),
    sub: L('拿过的奖，和有人在用的开源', 'Prizes, and open source people actually use'),
    body: L([], []),
    bullets: L(
      ['Athena：UNSW × Mistral AI × Atlassian Hackathon，Susquehanna Prize（2026.7–8）', 'Lark Loom：字节跳动飞书 AI 校园挑战赛，AI 全栈开发赛道 Top 3（2026.4–5）', 'Akeso：ICON × Lyra Innovation Challenge，Finalist（2026.7）', 'Chiron Prompt：仓库感知的终端提示词增强 CLI，GitHub 156★', '3D Print Skill：给 Claude Code 的 3D 打印 Skill，GitHub 27★'],
      ['Athena: Susquehanna Prize, UNSW × Mistral AI × Atlassian Hackathon (Jul–Aug 2026)', 'Lark Loom: Top 3, AI full-stack track, ByteDance Feishu AI Campus Challenge (Apr–May 2026)', 'Akeso: Finalist, ICON × Lyra Innovation Challenge (Jul 2026)', 'Chiron Prompt: a repo-aware prompt enhancer for the terminal, 156★ on GitHub', '3D Print Skill: a 3D-printing skill for Claude Code, 27★ on GitHub'],
    ),
    tags: [],
    links: [{ label: L('Chiron Prompt', 'Chiron Prompt'), href: 'https://github.com/EdwinjJ1/chiron-prompt' }, { label: L('Lark Loom', 'Lark Loom'), href: 'https://github.com/EdwinjJ1/lark-loom' }],
  },
  press: {
    kicker: L('THE DAILY ECHO', 'THE DAILY ECHO'),
    title: L('剪报墙', 'Press clippings'),
    sub: L('墙上这几张，写的都是真事', 'Everything pinned here actually happened'),
    body: L([], []),
    bullets: L(
      ['ECHO AGENT MAKES THE 61.7K-STAR LIST：首个提交后 5 天被「中国独立开发者项目列表」收录', 'ATHENA TAKES SUSQUEHANNA PRIZE：UNSW × Mistral AI × Atlassian Hackathon', 'TEEN CEO HITS ¥100K IN ONE DAY：17 岁创立 Hypha，7 人团队', 'TOP 3 AT FEISHU AI CHALLENGE：Lark Loom，AI 全栈开发赛道', 'HIRE!：AI 产品经理 × Agent 开发者，Open to opportunities'],
      ['ECHO AGENT MAKES THE 61.7K-STAR LIST: featured 5 days after the first commit', 'ATHENA TAKES SUSQUEHANNA PRIZE: UNSW × Mistral AI × Atlassian Hackathon', 'TEEN CEO HITS ¥100K IN ONE DAY: founded Hypha at 17 with a team of seven', 'TOP 3 AT FEISHU AI CHALLENGE: Lark Loom, AI full-stack track', 'HIRE!: AI PM × agent builder, open to opportunities'],
    ),
    tags: [],
    links: [{ label: L('联系我', 'Get in touch'), action: 'contact' }],
  },
  preuni: {
    kicker: L('2025.6 – 2026.5', 'JUN 2025 – MAY 2026'),
    title: L('PreUni', 'PreUni'),
    sub: L('课程笔记分享站', 'Course notes, shared'),
    body: L(
      ['把自己学过的大学计算机课程笔记系统整理成站点并公开分享。'],
      ['My university computer science course notes, organised into a site and shared openly.'],
    ),
    bullets: L(
      ['11 个月持续更新，81 次提交', 'Next.js + React，中英双语内容与交互式可视化', '独立完成内容撰写、设计与全栈开发'],
      ['Updated continuously for 11 months across 81 commits', 'Next.js + React, bilingual content and interactive visualisations', 'Wrote, designed and built it solo'],
    ),
    tags: ['Next.js', 'React', 'Bilingual'],
    links: [{ label: L('preuni.xyz', 'preuni.xyz'), href: 'https://preuni.xyz' }],
  },
  hypha: {
    kicker: L('创业 · 2023.7 – 2024.7', 'STARTUP · JUL 2023 – JUL 2024'),
    title: L('Hypha', 'Hypha'),
    sub: L('北京灵境菌络科技有限公司 · 创始人 & CEO', 'Founder & CEO · Web3 digital collectibles, Beijing'),
    body: L(
      ['17 岁创业，带领 7 人团队（3 研发 / 2 美术 / 1 法务）完成产品从 0 到 1。'],
      ['Founded at 17. Led a team of seven (3 engineers, 2 artists, 1 legal) from zero to a shipped product.'],
    ),
    bullets: L(
      ['核心 NFT 产品单日营业额突破 10 万元', '负责用户调研、产品路线图、技术架构决策、后端开发与服务器部署', '社群增长与商业化从零做到验证'],
      ['Core NFT product passed ¥100,000 in single-day revenue', 'Owned user research, roadmap, architecture decisions, backend and deployment', 'Took community growth and monetisation from zero to validation'],
    ),
    tags: ['0 → 1', 'Team of 7', 'Web3'],
    links: [],
  },
  contact: {
    kicker: L('CONTACT', 'CONTACT'),
    title: L('联系我', 'Get in touch'),
    sub: L('Open to opportunities', 'Open to opportunities'),
    body: L(['AI 产品经理、Agent 产品与工程方向的机会都欢迎聊。'], ['Happy to talk about AI product, agent product and engineering roles.']),
    bullets: L([], []),
    tags: [],
    links: [{ label: L('jiaedwin0605@gmail.com', 'jiaedwin0605@gmail.com'), href: 'mailto:jiaedwin0605@gmail.com' }, { label: L('GitHub @EdwinjJ1', 'GitHub @EdwinjJ1'), href: 'https://github.com/EdwinjJ1' }, { label: L('echoagent.dev', 'echoagent.dev'), href: 'https://echoagent.dev/zh/' }],
  },
  fries: {
    kicker: L('彩蛋', 'EASTER EGG'),
    title: L('一盘薯条', 'A plate of fries'),
    sub: L('真实工位还原', 'Faithful to the real desk'),
    body: L(['我真实的桌上确实有一盘薯条。建模的时候觉得不能删。'], ['There really was a plate of fries on my actual desk. It felt wrong to leave it out.']),
    bullets: L([], []),
    tags: [],
    links: [],
  },
};

// 阅读模式的顺序
export const INTRO_ORDER = ['about', 'mosi', 'echo', 'echoMobile', 'roundtable', 'athena', 'awards', 'preuni', 'hypha', 'projects', 'blog', 'photos', 'news', 'friends', 'contact'];

// 这几个面板的正文来自 assets/data/<file>.json（从上一代网站导入，见 pipeline/import_legacy.mjs）
export const DYNAMIC = {
  projects: { file: 'projects', kicker: L('PRESS START', 'PRESS START'), title: L('全部项目', 'All projects'), sub: L('做过的东西，都在这儿', 'Everything I have built') },
  blog: { file: 'blog', kicker: L('BLOG', 'BLOG'), title: L('博客', 'Blog'), sub: L('关于 AI、Agent 和做产品', 'On AI, agents and building products') },
  photos: { file: 'photos', kicker: L('PHOTOGRAPHY', 'PHOTOGRAPHY'), title: L('摄影', 'Photography'), sub: L('街头、人像、建筑、野生动物', 'Street, portrait, architecture, wildlife') },
  news: { file: 'news', kicker: L('AI DAILY', 'AI DAILY'), title: L('新闻', 'News desk'), sub: L('AI · 研究 · 行业 · 国际', 'AI · Research · Industry · Global') },
  friends: { file: 'friends', kicker: L('FRIENDS', 'FRIENDS'), title: L('朋友们', 'Friends'), sub: L('他们的站也值得看', 'Their sites are worth a visit') },
};

// 显示器里的对话：接旧站那个 Worker（真模型）；连不上时退回下面的预设回答
export const CHAT = {
  api: 'https://evanlin-api.jiaedwin0605.workers.dev',
  hello: L('我是 Evan 的 AI 分身。直接问，或者点下面的问题。', 'I’m Evan’s AI stand-in. Ask anything, or pick a question below.'),
  fallback: L('这个我没准备台词。试试问：回声是什么、实习做了什么、怎么联系你。', 'I don’t have a line for that. Try: what is Echo, what did you do at MOSI, how to reach you.'),
  topics: [
    { id: 'who', keys: ['你是谁', '介绍', 'who', 'about', 'yourself', 'evan'], q: L('你是谁？', 'Who are you?'), a: L('贾岱林，Evan。20 岁，UNSW 计算机在读，现在在上海模思智能做 AI 产品经理实习。我做语音 Agent：定方向，也自己写代码上线。', 'Evan Jia, 20. CS at UNSW, currently an AI PM intern at MOSI in Shanghai. I build voice agents: I set direction and ship the code myself.') },
    { id: 'echo', keys: ['回声', 'echo', 'agent', '语音'], q: L('回声是什么？', 'What is Echo Agent?'), a: L('跑在 Mac 上的语音 AI Agent。任何应用里按 Fn+Space 说一句话，它直接回答，或者把活派给本机的 Claude Code 和 Codex。首个提交后 5 天被 GitHub 61.7k★ 的中国独立开发者项目列表收录。', 'A voice AI agent for Mac. Press Fn+Space anywhere and say it; Echo answers or hands the work to Claude Code and Codex on your machine. It was featured in a 61.7k★ GitHub list 5 days after the first commit.'), panel: 'echo' },
    { id: 'mosi', keys: ['实习', '模思', 'mosi', 'mosmos', 'intern', 'work'], q: L('实习做了什么？', 'What did you do at MOSI?'), a: L('主导 MosMos 语音 Agent 的选中提问、多轮对话和工具调用，并且自己把代码写完上线；另外做了会议转写的豆包兜底策略，参与了 MOSS-VL 和 Realtime 的 API 文档。', 'I owned selection Q&A, multi-turn and tool calling for the MosMos voice agent and shipped the code myself, built the Doubao fallback for meeting transcription, and contributed to the MOSS-VL and Realtime API docs.'), panel: 'mosi' },
    { id: 'styles', keys: ['风格', '宇宙', 'style', 'universe', 'blender', '怎么做'], q: L('为什么有十种画风？', 'Why ten styles?'), a: L('同一张桌子在 Blender 里建模，一个机位渲出底色、光影和轮廓，再合成十种印刷风格。点桌上的面具，或者按空格，就换一个宇宙。', 'One desk modelled in Blender, one camera, rendered into colour, light and outline passes, then composited into ten print styles. Click the mask on the desk, or press Space, to jump universes.') },
    { id: 'contact', keys: ['联系', '邮箱', 'email', 'contact', 'hire', '招'], q: L('怎么联系你？', 'How do I reach you?'), a: L('jiaedwin0605@gmail.com。AI 产品、Agent 方向的机会都欢迎聊。', 'jiaedwin0605@gmail.com. Happy to talk about AI product and agent roles.'), panel: 'contact' },
  ],
};

export const UI = {
  loading: L('正在穿越宇宙…', 'Crossing universes…'),
  desk: L('DESK 探索', 'DESK explore'),
  intro: L('INTRO 阅读', 'INTRO read'),
  back: L('← 回到桌面', '← BACK TO DESK'),
  hint: L('点面具或按空格，换一个宇宙', 'Click the mask or press Space to switch universe'),
  chatPlaceholder: L('问我点什么…', 'Ask me something…'),
  send: L('发送', 'Send'),
  soundOn: L('声音：开', 'Sound: on'),
  soundOff: L('声音：关', 'Sound: off'),
  more: L('展开', 'Open'),
  introTitle: L('一张桌子，十个宇宙', 'One desk, ten universes'),
  thinking: L('正在输入…', 'typing…'),
  offline: L('（AI 暂时连不上，这是预设回答）', '(The AI is unreachable right now; this is a canned answer.)'),
  all: L('全部', 'All'),
  updated: L('更新于', 'Updated'),
  backToList: L('← 返回列表', '← Back to list'),
  loadFailed: L('内容加载失败，稍后再试。', 'Could not load this. Try again later.'),
  close: L('关闭', 'Close'),
  prev: L('上一张', 'Previous'),
  next: L('下一张', 'Next'),
  canvasLabel: L('Evan 的工位：可点击的 3D 场景。完整内容见 INTRO 阅读模式。', 'Evan’s desk: a clickable 3D scene. The full content is available in INTRO read mode.'),
};

// 文字提问 → 话题：命中关键词最多的那个（并列取靠前的）；一个都没命中返回 null。纯函数，方便测试
export function matchTopic(text) {
  const t = String(text || '').toLowerCase();
  const scored = CHAT.topics.map((topic) => ({ topic, hits: topic.keys.filter((k) => t.includes(k.toLowerCase())).length }));
  const best = scored.reduce((top, cur) => (cur.hits > top.hits ? cur : top), { topic: null, hits: 0 });
  return best.topic;
}
