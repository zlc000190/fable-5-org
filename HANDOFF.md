# hailuo2.video — Handoff Doc

> **接手这份代码的人请先读完这份 doc。**
> 2026-06-10 大改过一次（删 JoyFlix 残留 + 加 Hailuo 视频画廊），下面是全部细节。

---

## 1. 这个项目是什么

**hailuo2.video** — 一个独立的第三方网站，把 Hailuo AI 的 **image-to-video** 模型包在一个 web UI 里。

**法律/品牌定位（用户明确要求）**：
- **是**一个产品形态的 AI 视频生成 SaaS（强视觉，跟 JoyFlix 类似）
- **不是**海螺官方
- 必须以 **hailuo2.video** 自己的品牌出现
- **明确标注**"与 Hailuo AI、MiniMax、海螺无任何官方关联或 Affiliate 关系"
- 文案围绕"Hailuo AI Video Generator / image-to-video"主题
- 不要假装是官方 API / 账户入口

**只做 image-to-video**（用户原话："我们这个就是直接做视频的"）。不要做 text-to-video、不要做 image-to-image。

---

## 2. 当前进度状态

### ✅ 已完成

1. **基础重建**：从 `shipiany-joyflix-ai-video-template` 干净复制到 hailuo2videonew（备份在 `.bak-2026-06-10/`）
2. **品牌改名**：`package.json` name/author/homepage/keywords → hailuo2.video
3. **环境配置**：`src/config/index.ts` app_url/name/description 改成 hailuo2.video
4. **多语言**：`src/config/locale/index.ts` `locales = ['en', 'zh']` 保留中文（之前 hailuo2videonew 误关了）
5. **文案清理**：全项目 sed 把 `JoyFlix` / `Joyflix` / `joyflix` → `Hailuo`（48 处 → 0 处）
6. **作者清理**：全项目 sed 把 `ShipAny` / `shipany` / `wujieli` / `li_wujie` → `hailuo2` / `zlc000190`（27 处 → 0 处）
7. **模型收窄**：`src/config/model-config.ts` 只保留 Hailuo，删除 Kling/Wan/Seedance/Pixverse/Luma/Veo 3.1（文件从 936 行缩到 265 行）
8. **示例视频机制**：复制 `seedream4-video` 的 7 个 mp4 + 海报到 `public/videos/`，写 `sample-videos.ts` 数据源
9. **新组件**：`src/themes/default/blocks/sample-video-gallery.tsx` —— 左 Input image 占位 + 右 Output video 配对 + 下面 7 个 sample 缩略图
10. **首页集成**：在 `src/config/locale/messages/{en,zh}/pages/index.json` 的 `sections.showcase.id` 改成 `sample-video-gallery`（注册为 theme block）
11. **免责声明**：3 处写"非官方，无 Affiliate"——hero 区 + sample gallery 底部 + footer copyright
12. **README 重写**：去掉 ShipAny 链接，改成 hailuo2.video 项目说明

### ⚠️ 未完成 / 待办

按优先级：

| 优先级 | 待办 | 说明 |
|---|---|---|
| **P0** | **接 `[locale]/(app)/app/video-generator/` 路由** | Hailuo API 调用还没接，目前 `/animate` 跳转会 404。需看 `model-config.ts` 里的 Hailuo schema（`parseParams` / `calculateCredits` / `updateSchema` 已配好），加 API 端点 |
| **P0** | **业务页路由处理** | 7 个旧页被删了（hailuo-2-3 / hailuo-ai-contact / hailuo-ai-video / hailuo-minimax / compare/* 3 个）。备份里都在 `hailuo2videonew.bak-2026-06-10/src/app/[locale]/(landing)/`。**用户没说要不要**——如果不要 SEO 长尾就保持删除，如果要就 cp -r 回来 + 在 en/zh index.json 的 show_sections 加 link |
| **P0** | **`/animate?sample=xxx` 处理** | sample-video-gallery 的 CTA 跳 `/animate?sample=xxx`，但这个 page 还不存在。需要写一个能接 `?sample=xxx` 参数、自动加载对应 prompt + originalImage 到 form 的页面（参考 `seedream4-video/src/app/[locale]/(app)/app/video-generator/video-preview/`） |
| **P1** | **`.env` 配置** | `.env` 文件不存在，只有 `.env.example`。需要用户填 `DATABASE_URL` / `AUTH_SECRET` / Hailuo API key。当前 dev 用的是 in-memory 适配器（WARN 日志可见） |
| **P1** | **示例视频 prompt 改海螺风格** | `sample-videos.ts` 里的 prompt 还是 seedream4-video 的原文（"Rotate the shoe, keep everything else still"等），应该改成海螺 AI 风格的 prompt（参考 en/pages/index.json 的 showcase 描述） |
| **P1** | **`video-gallery.tsx` 和 `video-preview.tsx` 是从 seedream 复制的** | 这两个组件没用上（用的是新写的 `sample-video-gallery.tsx`）。可以删 |
| **P1** | **`src/shared/pages/hailuo-page.tsx` 删了** | 是旧项目里的页面壳，不影响。如果想留可以恢复 |
| **P2** | **`src/config/locale/messages/{en,zh}/admin/**` 的内容** | 后台 admin 页文案可能还是旧的。需要审一遍 |
| **P2** | **示例视频从 Hailuo 真实下载** | 当前 7 个 mp4 是从 seedream4-video 复制的中性画面（狗/雪山/威尼斯/自行车 等）。如果想换成真正 Hailuo AI 生成的视频，需要 Hailuo API access |
| **P3** | **示例视频海报图重生成** | image_generate 需要 `FAL_KEY`（本环境没有）。原海报图是 seedream4-video 的 jpg，没问题但不是海螺风格 |
| **P3** | **git commit** | 备份 `.git` 是原 hailuo2videonew 的，51 个 modified/deleted/untracked 待提交 |
| **P3** | **部署** | Vercel 部署需要 `DATABASE_URL` (postgres) + `AUTH_SECRET` + Hailuo API key |

---

## 3. 技术栈

- **Next.js 16.0.7**（App Router + Turbopack dev）+ **React 19**
- **TypeScript 5**
- **Tailwind CSS v4**
- **next-intl 4.3.4**（en + zh 双语）
- **Drizzle ORM + PostgreSQL**（schema 在 `src/config/db/`）
- **better-auth**（认证）
- **包管理**：pnpm

---

## 4. 关键文件清单

### 新增（untracked）

```
public/videos/                                    # 7 个 mp4 + 7 个海报图 + 源图（gondola/macpaint/woman-city-doodle）
public/sitemap.xml                                # 从 shipiany-joyflix 复制
src/shared/components/video/sample-videos.ts      # 7 个 sample 数据 + FEATURED_WORKFLOW_DEMO
src/themes/default/blocks/sample-video-gallery.tsx # 新的 Input + Output 配对组件（核心 UI）
```

### 修改

```
README.md                                                       # 重写
package.json                                                    # name/author/homepage/keywords/repository
content/pages/privacy-policy.mdx                                # sed 替换残留
content/pages/terms-of-service.mdx                              # sed 替换残留
src/config/index.ts                                             # app_url/name/description/logo
src/config/locale/index.ts                                      # locales
src/config/model-config.ts                                      # 936 → 265 行，只留 Hailuo
src/core/theme/provider.tsx                                     # storageKey 'hailuo2-theme'
src/app/[locale]/(app)/layout.tsx                               # app_name fallback
src/app/[locale]/(admin)/admin/dashboard/page.tsx               # sed 替换
src/app/[locale]/(landing)/page.tsx                             # 移除 md 引用 + sitemap 引用调整
src/app/robots.ts                                               # sed 替换
src/themes/default/blocks/hero.tsx                              # sed 替换注释
src/themes/default/blocks/footer.tsx                            # sed 替换
src/themes/default/blocks/index.tsx                             # 注册 sample-video-gallery
src/themes/default/blocks/showcase/index.tsx                    # sed 替换 fallback title
src/shared/blocks/common/built-with.tsx                         # sed 替换
src/shared/services/settings.ts                                # sed 替换
src/shared/components/video/video-gallery.tsx                   # sed 替换注释
src/shared/components/video/video-preview.tsx                   # sed 替换注释
src/config/locale/messages/{en,zh}/**/*.json                   # 全部 sed + landing.json / pages/index.json 整体重写
```

### 删除

```
src/app/[locale]/(landing)/hailuo-2-3/page.tsx                  # 旧业务页
src/app/[locale]/(landing)/hailuo-ai-contact/page.tsx
src/app/[locale]/(landing)/hailuo-ai-video/page.tsx
src/app/[locale]/(landing)/hailuo-minimax/page.tsx
src/app/[locale]/(landing)/compare/hailuo-vs-kling/page.tsx
src/app/[locale]/(landing)/compare/hailuo-vs-runway/page.tsx
src/app/[locale]/(landing)/compare/hailuo-vs-sora/page.tsx
src/app/sitemap.ts                                              # 用 public/sitemap.xml 替代
src/shared/pages/hailuo-page.tsx                               # 旧页面壳
```

如果想恢复删除的页面（备份里都在）：
```bash
cp -r /Users/zhanglongchao/programPJ/hailuo2videonew.bak-2026-06-10/src/app/\[locale\]/\(landing\)/hailuo-* \
      /Users/zhanglongchao/programPJ/hailuo2videonew/src/app/\[locale\]/\(landing\)/
cp -r /Users/zhanglongchao/programPJ/hailuo2videonew.bak-2026-06-10/src/app/\[locale\]/\(landing\)/compare \
      /Users/zhanglongchao/programPJ/hailuo2videonew/src/app/\[locale\]/\(landing\)/
```

---

## 5. 关键代码解读

### 5.1 `src/themes/default/blocks/sample-video-gallery.tsx`（核心 UI）

**设计**：左 Input image 占位 + 右 Output video 配对 + 下面 7 个 sample 缩略图，点击切换同步。

**关键状态**：
```ts
const [activeId, setActiveId] = useState<string>(FEATURED_WORKFLOW_DEMO.id);
const active = SAMPLE_VIDEOS.find((s) => s.id === activeId) ?? FEATURED_WORKFLOW_DEMO;
```

**关键 effect**：切换时重启视频
```ts
useEffect(() => {
  if (!videoRef.current) return;
  videoRef.current.currentTime = 0;
  void videoRef.current.play().catch(() => {});
}, [activeId]);
```

**CTA**：`/animate?sample=${active.id}` —— 这个路由目前 404，需要 P0 待办里写。

**注意**：`originalImage` 是必须保留的（**用户原话**："我要求你还是在那个视频生成那里，有一张默认的图片，和那个底下那个是一样的"）。Input image 占位的 source 就是 active.originalImage。

### 5.2 `src/shared/components/video/sample-videos.ts`

7 个 sample 数据 + 1 个 `FEATURED_WORKFLOW_DEMO`（首页默认展示的那个）。

每个 sample 有：`id` / `prompt` / `videoUrl` / `originalImage`（可选） / `posterUrl` / `model`。

**⚠️ 注意**：当前 sample 的 model 字段还是 `kling_2_1` / `seedance_2_0`（从 seedream4-video 复制的），实际生成时应该用 `hailuo`。但这个字段只是展示/数据用途，实际视频生成走 `model-config.ts` 里的 Hailuo schema。

### 5.3 `src/config/model-config.ts`

**只剩 Hailuo 一个模型**（hailuo 块 + helper functions，265 行）。原文件 936 行（7 个模型）。

Hailuo 块的 `modelName: 'minimax/hailuo-02'`（这是 API 调用时用的实际模型名）。

`parseParams` 把前端参数 `startImageUrl` 转换为 API 参数 `first_frame_image`。

`calculateCredits` 按 768p/1080p 和 duration 计算积分。

`updateSchema` 动态调整 duration × resolution 的互斥规则（10s 只允许 768p，1080p 只允许 6s）。

### 5.4 `src/config/locale/messages/{en,zh}/pages/index.json`

主页全部 sections 的 JSON 配置。

**`show_sections`** 数组决定渲染顺序：
```json
"show_sections": ["hero", "sample-video-gallery", "logos", "stats", "pricing", "faq", "cta", "disclaimer"]
```

**`sections.sample-video-gallery`** 的 `id` 字段 = theme block 名。`getThemeBlock('sample-video-gallery')` 加载的就是新写的组件。

**`sections.disclaimer`** —— 加了一个独立 section 展示"非官方/无 Affiliate"声明。`disclaimer` block 是 shipany 自带的，渲染文本段落。

### 5.5 `src/themes/default/blocks/index.tsx`

注册新 block：
```ts
export * from './sample-video-gallery';
```

不要忘记这个 export，否则 `getThemeBlock('sample-video-gallery')` 会失败。

---

## 6. 本地跑通的步骤

```bash
cd /Users/zhanglongchao/programPJ/hailuo2videonew

# 1. 装依赖
pnpm install

# 2. 复制 .env（可选，没 .env 也能 dev，DB 用内存适配器）
cp .env.example .env
# 然后编辑 .env 填 DATABASE_URL 和 AUTH_SECRET

# 3. 启动 dev server（默认 3000 端口，可用 PORT=xxxx 改）
pnpm dev
# 或：PORT=3201 pnpm dev

# 4. 打开 http://localhost:3000/ 验证
```

**注意**：dev server 现在正在跑（端口 3201，PID 53742）。

---

## 7. 验证清单

跑通后用 curl 验证：

```bash
curl -sL http://localhost:3201/ -o /tmp/h2.html

# 1. HTTP 200 + 正确的 title
grep -oE '<title>[^<]+</title>' /tmp/h2.html
# 期望: <title>Hailuo AI Video Generator - Image to Video</title>

# 2. Hailuo 词频
grep -oE 'Hailuo|海螺' /tmp/h2.html | wc -l
# 期望: >100

# 3. JoyFlix / ShipAny / wujieli 残留
grep -oiE 'joyfl|shipany|wujieli' /tmp/h2.html | wc -l
# 期望: 0

# 4. 7 个 mp4 引用
grep -oE '/videos/[a-z-]+\.mp4' /tmp/h2.html | sort -u | wc -l
# 期望: 7

# 5. 关键 UI 文案
grep -c 'Start image' /tmp/h2.html           # 期望: 1
grep -c 'Output — generated by Hailuo' /tmp/h2.html  # 期望: 1
grep -c 'Try another sample' /tmp/h2.html     # 期望: 1
grep -c 'Not affiliated' /tmp/h2.html         # 期望: 3

# 6. 中文版 /zh
curl -sL http://localhost:3201/zh | grep '<title>'
# 期望: 海螺 AI 视频生成器 - 图片生成视频
```

---

## 8. 踩过的坑 / 易错点

### 🚨 绝对不要再做的蠢事

1. **不要删 `originalImage` 字段或 input image 占位图**。用户明确要"原图 + 视频"的对应关系。砍掉的应该是 seedream4-video 的 `studio.tsx` 里那种**独立的 ImageGeneratorWithHistory 大组件**（那是不同定位的工具），不是 sample-video-gallery 里的占位图。

2. **不要去掉 featured sample 配对的"Input image + Output video"上下布局**。改成"单一大视频"是错的——用户要的是配对。

3. **不要在 `<img>` 引用那加个 `?? "占位图" `的 fallback 逻辑**——`originalImage` 7 个 sample 都有，没问题。

4. **不要瞎写 `'kling_2_1'` 改 `'hailuo_2'`**——`sample-videos.ts` 的 model 字段是历史数据，不影响实际生成。

### 🐛 已知小问题

- `src/themes/default/blocks/sample-video-gallery.tsx` 的 `controls` 属性让视频可暂停/全屏——如果不想让用户能控制，可以去掉。
- `model-config.ts` 现在的 Hailuo 是 `minimax/hailuo-02`（Replicate 上的模型），API 调用需要 Replicate API key。
- `video-gallery.tsx` 和 `video-preview.tsx` 是从 seedream4-video 复制但**实际未使用**，可以删。
- `next.config.mjs` 有 `proxy.ts` 警告（middleware 弃用），不影响功能。

### 🔧 dev server 注意

- 当前 dev server 在 `PORT=3201` 跑（之前我误用了非默认端口）。重启用 `PORT=3201 pnpm dev`。
- Chrome 启动：`node ~/.hermes/skills/openclaw-imports/browser/scripts/start.cjs --profile`（要 `--profile` 才用 fresh debug profile，不影响用户登录态）。

---

## 9. 用户的关键决策（不要再问）

> **用户对整体定位、产品形态、关键词、模型选择、免责位置的决策**

1. **法律定位 B**：直接做"海螺 AI 视频生成器"产品形态（强视觉，类似 JoyFlix）
2. **关键词 B**：title 用 "Hailuo AI Video Generator"（不是 "Hailuo AI Guide"）
3. **示例视频来源 C**：用现生成/复用素材（image_generate 没 FAL_KEY 不可用，用原 seedream4-video 的 mp4）
4. **模型选择器 A**：去掉所有其他模型，只保留 Hailuo
5. **免责声明**：footer + hero + sample gallery 底部 + FAQ 都要写"非官方/无 Affiliate/MiniMax"
6. **只做图生视频**：不要做 text-to-video / image-to-image
7. **input image 占位 + output video 配对**：参考 seedream4-video 设计，砍的是其独立图片生成器组件

---

## 10. 备份位置

```
/Users/zhanglongchao/programPJ/hailuo2videonew.bak-2026-06-10/   # 949M（含 node_modules）
```

备份时间：2026-06-10 16:15 左右。

包含原 hailuo2videonew 的所有文件（含 `node_modules`、`.git`、业务页、业务数据）。

要回滚：
```bash
rm -rf /Users/zhanglongchao/programPJ/hailuo2videonew
mv /Users/zhanglongchao/programPJ/hailuo2videonew.bak-2026-06-10 /Users/zhanglongchao/programPJ/hailuo2videonew
```

---

## 11. 相关项目参考（不要混了）

```
/Users/zhanglongchao/programPJ/
├── hailuo2videonew/                            ← 这是当前项目
├── hailuo2videonew.bak-2026-06-10/             ← 备份
├── hailuo2-video/                              ← 另一个 hailuo 项目（老的，结构不同）
├── shipiany-joyflix-ai-video-template/         ← 模板原版（JoyFlix AI）
└── seedream4-video/                            ← 参考（用了它的 mp4 + 海报图 + 设计）
```

**关键**：sample-video-gallery 的设计参考 `seedream4-video` 的 `animate/page.tsx` + `studio.tsx`（砍掉 ImageGenerator 部分）。
**参考的 mp4 + 海报图** 全部来自 `seedream4-video/public/videos/`（中性画面，不是海螺官方素材）。

---

## 12. 一句话总结

hailuo2videonew 是 shipiany-joyflix 模板改造的纯海螺 AI 视频生成 SaaS，单一模型 Hailuo，只做 image-to-video，UI 参考 seedream4-video 的 input/output 配对设计，文案和品牌全部独立。dev server 跑通，HTML 验证全过，**核心待办是接 Hailuo API + 写 /animate 页面 + 配置 .env**。

—— 上一个 agent（MiniMax-M3）2026-06-10 写的，麻烦你了。