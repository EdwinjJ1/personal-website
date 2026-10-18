# Evan 的个人网站：一张桌子，十个宇宙

Blender 建模的工位场景，同一个机位渲染后合成 10 种印刷 / 漫画风格，网页里用 WebGL 切换。
点桌上的蜘蛛面具或按空格换宇宙；点物件看对应的项目和经历，相机和拍立得是摄影集，报纸是新闻，笔记本是博客和日记，手柄是全部项目，显示器是 AI 对话，唱片是能放歌的黑胶唱片机，杯子是友链蛛网，台灯下那对拼图是 BuilderSpace 创客社，显示器前那座绿色小城是 GitHub 贡献墙。

![十个宇宙](preview/ten-universes.jpg)

整体创意（Blender 渲染一张工位，再切换多种画风）来自抖音 @硕哥，梦想哭了 的个人网站，感谢。这个仓库是照着那个思路，用 Claude + Blender 从头做的一版。

![制作思路](preview/how-its-made.jpg)

## 怎么跑

```sh
npm run dev      # http://localhost:4173
npm test         # 坐标换算 + 内容完整性（node --test，带覆盖率）
```

`site/` 是纯静态站，没有构建步骤，任何静态托管都能直接放。

## 目录

| 路径 | 内容 |
|---|---|
| `site/` | 网页：`js/app.js`（交互）、`js/stage.js`（WebGL）、`js/geometry.js`（坐标换算）、`js/content.js`（中英文案）、`js/music.js`（播放器）、`js/web.js`（友链蛛网布局）、`js/github.js`（贡献墙）、`js/tour.js` + `css/mobile.css`（手机 / 触屏适配） |
| `site/assets/` | 渲染产物：`styles/<宇宙>.webp`（全尺寸 + `@1x`）、`hot.png`（热点图）、`scene.json`；`data/*.json` 和 `photos/` 是从上一代网站导入的内容 |
| `blender/` | `kit.py` 建模工具，`layout.py` 场景内容，`scene.py` 分通道渲染入口，`tex/` 贴图 |
| `pipeline/` | `textures.py` 画场景里的印刷品（顺带从 `assets/` 里的 logo 描出 BuilderSpace 拼图吉祥物的轮廓），`stylize.py` 把通道合成十种风格；`sync_news.py` / `sync_music.py` / `sync_github.py` 部署时同步新闻、歌单、贡献墙 |
| `workers/api/` | 后端（Cloudflare Worker）：`/chat` 转发到模型，`/journal` 私人日记，部署方式见下 |
| `tests/` | 单元测试 |

## 重新出图

需要 Blender（5.x）、uv 和 Node 23.6+。几步可以单独跑：

```sh
npm run import     # 从 ../001 导入项目、博客、新闻、友链，并把全部摄影作品缩成网页尺寸
npm run photos     # 只更新摄影：重写清单，缩新增的照片（已有的不重新缩）
npm run textures   # 软木板、剪报、刊物封面、屏幕等贴图 → blender/tex
npm run render     # Blender 渲染底色 / 发光 / ID / 法线 / 深度 / 5 组灯光 → build/passes
npm run stylize    # 合成 10 种风格 + 热点图 → site/assets
```

- 改桌上有什么、摆在哪：`blender/layout.py`。物件的 `hot="名字"` 就是网页里的热点名。
- 改墙上、封面上的字：`pipeline/textures.py`。
- 改某个宇宙的画风：`pipeline/stylize.py` 里同名的函数。
- 改面板文案：`site/js/content.js`。加了新热点要在 `HOTS` 和 `LABELS` 里登记，测试会检查。

调画风时先用小图：把 `render` 里的 `--width 3840` 换成 `1600`，再 `uv run pipeline/stylize.py build/passes build/test --only=comic,noir`。

## 拿去做你自己的

代码是 MIT，可以直接 fork。要换成你自己的站，改这几处：

| 想换的东西 | 改哪里 | 要不要重新渲染 |
|---|---|---|
| 名字、自我介绍、每个面板的文案 | `site/js/content.js` | 不用 |
| 项目、博客、友链、摄影清单 | `site/assets/data/*.json`，照片放 `site/assets/photos/` | 不用 |
| 日记 | 不在站点文件里：加密存在 Worker 的 KV 里，网页输密码读写，见下 | 不用 |
| 墙上、封面、屏幕里的字 | `pipeline/textures.py` | 要 |
| 桌上有什么、摆在哪 | `blender/layout.py` | 要 |
| 某个宇宙的画风 | `pipeline/stylize.py` 里同名的函数 | 只跑 `npm run stylize` |
| 对话里的 AI | 自己部署 `workers/api`，把地址填进 `content.js` 的 `CHAT.api` | 不用 |
| 唱片机的歌单 | `pipeline/sync_music.py` 的 `PLAYLIST_ID` | 不用 |
| GitHub 贡献墙 | `pipeline/sync_github.py` 的 `USER`、`FIRST_YEAR`，再 `npm run github` | 面板不用；桌上那座 3D 小城要 |

- `npm run import` 和 `npm run photos` 读的是作者上一代网站（`../001`），你用不上：直接改 `site/assets/data/` 里的 JSON 就行。
- 重新渲染是 `npm run textures && npm run render && npm run stylize`，4K 一套在 M1 Max 上十分钟左右。
- 部署：`site/` 是纯静态目录，放到任何静态托管都行。仓库里的 `.github/workflows/deploy.yml` 是发到 GitHub Pages 的写法，可以照抄。
- 仓库里的摄影作品、文字、个人形象，以及 BuilderSpace 的 logo 和吉祥物不在 MIT 范围内，换成你自己的。

不想手改的话，把仓库交给 Claude Code，用大白话说就行。做这个站时说过的几句（原话，略有删减）：

- 「你看这个人的，用 Blender 做了 10 种风格的个人网站，很酷炫。忘掉我现在的网站，重新制作」（附上参考截图和自己书桌的照片）
- 「制作的高级一点，落地窗高楼都行，或者外面是 loft 那种，总之要高级」
- 「房间的布置没必要完全按照我自己的房间去搞，主要还是参考他这个，做一点点改变」
- 「现在个人网站里有的东西也要放在这里边，包括我那些摄影的照片，除了照片以外还有 news」
- 「把场景里的占位小字都换成真实内容」
- 「友链这里能不能用一种可视化、连在一起的方案，我们这个也是宇宙风格的」

## 画面是怎么来的

1. Blender 不直接出成品，而是出一组通道：纯底色、发光、每个物体一个颜色的 ID 图、法线、深度，以及白模下每组灯光单独的光照。
2. `stylize.py` 用这些通道合成：ID / 法线 / 深度的突变处是墨线，光照量化成明暗后在暗部铺网点和排线，再套各宇宙的配色和纸张。
3. ID 图同时导出成热点图，网页用它做像素级的悬停判断和描边。

## 手机上

桌子是 16:9 的横图，竖屏只放得下中间一截，所以手机上单独做了一套，电脑端不受影响：

- 样式全在 `site/css/mobile.css`，每条规则都包在媒体查询里（窄屏、竖屏、横屏、触屏各一段）；`app.js` 里对应的开关是 `touchUi`、`mqDock`、`mqSide`，两边的查询条件要一起改。
- 竖屏：底部是一条实心控制栏（提示、宇宙名、小地图、十个圆点），画面只铺到它上沿。小地图是整张桌子的缩略图，白框是现在看到的那一截，点或拖它直接过去。
- 触屏没有悬停，手停下几秒后会把视野里的物件挨个描边、报名字（`js/tour.js`，一轮走完就停）；点标签和点物件一样。手指点偏十几个像素以内也算点中，单指拖动、双指缩放和平移都支持。
- 竖屏打开面板时，面板是固定高度的半屏抽屉，镜头会把物件抬到面板上方；关掉回到打开前看的位置。横过来的手机整张桌子都看得见，面板回到右侧。

## 说明

- 蜘蛛面具、蛛网、EARTH 编号是对《蜘蛛侠：平行宇宙》的致敬，图形都是自己画的，没有使用官方素材。
- 显示器里的对话接的是 `workers/api` 这个 Cloudflare Worker。主通道是 Workers AI 的原生绑定（`@cf/meta/llama-3.3-70b-instruct-fp8-fast`，不需要任何密钥）；配了 `AI_API_KEY` 时还有一个 OpenAI 兼容的备用通道。两条都不通时，网页退回预设回答并注明。改了人设提示词（`workers/api/src/index.js`）要在那个目录下 `npx wrangler deploy` 才生效。
- 唱片机放的是网易云歌单「-EdwinJ-喜欢的音乐」。`pipeline/sync_music.py` 读公开歌单（不带登录信息），只留不用会员就能听的歌，写进 `music.json`；声音走网易云官方外链，放不了的（会员曲目、地区限制）自动跳过。换歌单改脚本里的 `PLAYLIST_ID`，本地更新用 `npm run music`；部署时也会同步一次，抓不到就用仓库里的快照。
- 摄影是旧站 `../001/src/data/photography.ts` 里的全部作品，网页上按分类归成合集（封面是每个分类的第一张，点开才是整组）。合集的先后和名字在 `content.js` 的 `ALBUMS`；加照片就是把原图放进 `../001/public/images/photography/`、在 `photography.ts` 里登记一条，再跑 `npm run photos`。`Her` 是单独的一个合集，不并进人像：哪些照片归它，列在 `photography.ts` 的 `herFiles` 里。
- GitHub 贡献墙：显示器前那座绿色小城是过去一年的贡献，一根柱子一天（53 周 × 7 天，高度按当天次数开根号，颜色是 GitHub 的四档绿），悬停时一道绿光从最早扫到最新；点开是一整年的格子图，可以切年份，移到格子上看那天几次，点格子跳到 GitHub 上那一天的动态。
  - 数据是 `pipeline/sync_github.py` 读的公开贡献日历（`github.com/users/<用户>/contributions`，和主页上那张图同一份，只有每天的数字），写进 `site/assets/data/github.json`；部署时每 6 小时同步一次，仓库里那份是兜底快照。本地更新用 `npm run github`。
  - 3D 小城是渲染那一刻的快照：`textures.py` 把 `github.json` 转成 `blender/tex/skyline.json`，`layout.py` 照着建模。想让桌上那座城跟上新数据，跑一次 `npm run textures && npm run render && npm run stylize`。
  - 扫光不是视频：`hot.png` 的 G、B 通道记着柱子像素在时间轴上的位置（`stylize.py` 的 `skyline_track`），着色器按时间往前推。
- 友链在 `site/assets/data/friends.json`（来源是 `../001/src/data/friends.ts`），加一条就多一根蛛丝。
- 日记是私人的，**不在 `site/` 里，也不进仓库**。正文用 AES-GCM 加密存在 Worker 的 KV 里（`workers/api/src/journal.js`），点笔记本 → 面板顶部切到「日记」，输入密码才解锁；解锁后能读、写、新建、删除，有网的地方都能改，不用提交也不用部署站点。密码只放在当前标签页里，关掉就忘，也可以点「锁上」。AI 和脚本走同一个接口（说明在 `workers/api/JOURNAL_API.md`），命令行是 `JOURNAL_PASSWORD=… node pipeline/journal.mjs list|get|put|append|delete|push`。
  - 第一次启用：`cd workers/api`，`npx wrangler secret put JOURNAL_PASSWORD`（日记密码）、`npx wrangler secret put JOURNAL_SECRET`（加密密钥，用 `openssl rand -base64 32` 生成一串随机的，设定后别换），再 `npx wrangler deploy`（会自动建好 KV）。想把 `private/journal/` 里本地的草稿传上去：`JOURNAL_PASSWORD=… node pipeline/journal.mjs push private/journal`。`private/` 在 `.gitignore` 里。
  - 安全边界：KV 里是用随机密钥加密的密文，只知道 4 位密码解不开；密码本身只能在线上试，同一个 IP 连错 8 次锁 15 分钟。但 4 位数字终究好猜（分布式地试一万次就能过），想更稳就换个长一点的密码——`wrangler secret put JOURNAL_PASSWORD` 重设即可，不影响已有日记。传输走 HTTPS。
- 新闻每 6 小时由 `.github/workflows/deploy.yml` 抓一次并重新部署，结果只进当次部署，不往仓库里提交；仓库里的 `news.json` 是兜底快照。本地更新用 `npm run news`。
- 部署：推到 `main`（改动涉及 `002/site/`）就会发布到 GitHub Pages（evanlin.site）。
- 简历不放在这个站里，也不进这个仓库。
- 代码以 MIT 协议开源（见仓库根目录的 `LICENSE`）。摄影作品、文字和个人形象不在此列，版权归作者所有；BuilderSpace 的 logo 和吉祥物归 BuilderSpace 创客社。
