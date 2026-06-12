# 海螺 two video 项目 — 接手文档

> 编写人：Hermes (调度 Agent)
> 编写时间：2026-06-11
> 项目地址：`/Users/zhanglongchao/programPJ/hailuo2videonew`
> 备份：`/Users/zhanglongchao/programPJ/hailuo2videonew.bak-2026-06-10`（6月10日 17:01 的全量备份）
> 上一个开发者：mask 一龙马（用户）+ Hermes（AI agent）
> 状态：**MVP 已构建完成，本地 dev 服务在跑，但有未提交的修改和已知设计问题**

---

## 一、项目是什么

一个 Hailuo AI 文生视频 / 图生视频的展示站 + 调用站（定位类似 OpenClaw / Dify 的 SaaS 模板壳）。

- 域名：`hailuo2.video`
- 应用名：`Hailuo AI Video Generator`
- 描述：把图片变成电影级短视频
- **注意**：与 Hailuo 官方无任何官方合作关系，页面底部必须有"Not affiliated with Hailuo AI"之类的免责

## 二、技术栈

| 维度 | 选型 |
|------|------|
| 框架 | Next.js 15 (App Router) + Turbopack |
| UI | React 19 + Radix UI + Tailwind CSS |
| 包管理 | pnpm |
| 数据库 | libsql (Turso / 本地 SQLite) |
| ORM | Drizzle ORM |
| 国际化 | next-intl（当前：en + zh） |
| 支付 | PayPal + Stripe（集成好但未上线） |
| AI | Vercel AI SDK + OpenRouter + Replicate |
| 部署 | Cloudflare Pages（`pnpm cf:deploy`） |

## 三、本地启动

```bash
cd /Users/zhanglongchao/programPJ/hailuo2videonew
pnpm install        # 已装，跳过
pnpm dev            # 启动 dev 服务（next dev --turbopack）

# 验证：curl -I http://localhost:3000/  (默认 3000 端口)
# 当前跑在：localhost:3201 (用 PORT=3201 pnpm dev 启动的)
```

数据库初始化（如果 schema 没建）：
```bash
pnpm db:generate    # 生成 Drizzle schema
pnpm db:migrate     # 应用迁移
pnpm db:studio      # 打开 Studio GUI
```

## 四、目录结构（关键路径）

```
src/
├── app/[locale]/
│   ├── (landing)/           # 营销页（首页 + blog + pricing + showcases）
│   │   ├── page.tsx         # 首页 = sample-video-gallery + hero-input + CTA
│   │   ├── blog/            # MDX 博客
│   │   ├── showcases/       # 案例展示
│   │   └── pricing/         # 价格页
│   ├── (app)/               # 应用区（需登录）
│   │   └── layout.tsx
│   ├── (admin)/admin/       # 后台
│   └── video/               # 视频编辑器（/animate 路由）
├── shared/components/
│   ├── video/               # 视频相关组件
│   │   ├── sample-videos.ts # 91 行 — featured sample + 7 个视频数据
│   │   ├── video-gallery.tsx
│   │   ├── video-generator.tsx
│   │   ├── video-generation-form.tsx
│   │   ├── video-preview.tsx
│   │   ├── hero-input.tsx
│   │   ├── upload-image.tsx
│   │   ├── credits-display.tsx
│   │   └── ...              # 13 个组件文件
│   └── ...
├── config/
│   ├── index.ts             # envConfigs（app_url / app_name / etc.）
│   ├── model-config.ts      # 265 行 — 只保留 hailuo 一个模型（之前是多模型，被砍成单模型）
│   ├── locale/index.ts      # 国际化配置
│   └── theme/               # 主题
├── themes/default/blocks/   # 主题 blocks
└── ...

content/pages/               # MDX 内容
├── privacy-policy.mdx
└── terms-of-service.mdx

public/videos/                # 7 个 demo 视频（mp4）+ 7 张 poster（jpg/png）
├── woman-city-doodle.jpg    # featured sample 的原图
├── *.mp4                     # 7 个 demo 视频
└── posters/                  # 7 张视频封面图
```

## 五、当前未提交的修改（git status 概要）

⚠️ **6 月 10 日的开发过程中有一波未提交的改动**，接手前需要决定怎么处理。

### 5.1 已修改文件（需要 review 或 commit）

```
modified:   README.md
modified:   content/pages/privacy-policy.mdx
modified:   content/pages/terms-of-service.mdx
modified:   package.json
modified:   src/app/[locale]/(admin)/admin/dashboard/page.tsx
modified:   src/app/[locale]/(app)/layout.tsx
modified:   src/app/[locale]/(landing)/page.tsx
```

### 5.2 已删除文件（重要 — 这些是产品决策的结果）

```
deleted:    src/app/[locale]/(landing)/compare/hailuo-vs-kling/page.tsx
deleted:    src/app/[locale]/(landing)/compare/hailuo-vs-runway/page.tsx
deleted:    src/app/[locale]/(landing)/compare/hailuo-vs-sora/page.tsx
deleted:    src/app/[locale]/(landing)/hailuo-2-3/page.tsx
deleted:    src/app/[locale]/(landing)/hailuo-ai-contact/page.tsx
deleted:    src/app/[locale]/(landing)/hailuo-ai-video/page.tsx
deleted:    src/app/[locale]/(landing)/hailuo-minimax/page.tsx
```

### 5.3 决策上下文（这些删除是产品定位调整）

用户要求砍掉所有"图片生成器"的展示页面，**只保留视频生成**。同时砍掉所有竞品对比页和 Hailuo 品牌信息页（避免商标风险）。

- 砍掉原因：用户原话："砍掉所有 input image 占位（不要左 Start image 占位），**只保留视频生成的部分**"
- 保留：首页的 sample-video-gallery（featured = woman-city-doodle）
- 保留：视频预览 + prompt 输入 + 7 个 sample 网格 + CTA 按钮 + 底部免责

### 5.4 如何恢复已删除的文件

如果发现某个删除的文件还需要，全部都在 backup：
```bash
# 例：恢复 compare/hailuo-vs-kling
cp /Users/zhanglongchao/programPJ/hailuo2videonew.bak-2026-06-10/src/app/\[locale\]/\(landing\)/compare/hailuo-vs-kling/page.tsx \
   /Users/zhanglongchao/programPJ/hailuo2videonew/src/app/\[locale\]/\(landing\)/compare/hailuo-vs-kling/page.tsx
```

如果所有删除都不要，直接 commit 当前的 working tree：
```bash
cd /Users/zhanglongchao/programPJ/hailuo2videonew
git add -A
git commit -m "清理品牌页面 + 只保留视频生成展示"
```

## 六、模型配置（model-config.ts）

**当前状态**：265 行，**只保留 hailuo 一个模型**。

### 6.1 历史变更（接手前理解）

- 原始版本：含多个模型（hailuo + sora + runway + kling 等）
- 2026-06-10 简化：用户要求砍掉多模型，只留 hailuo
- 简化方法：`head -n 153 model-config.ts > /tmp/model_new.ts && tail -n +825 model-config.ts >> /tmp/model_new.ts`
- 含义：保留 L1-153（接口 + hailuo 块）+ L825-936（末尾 helper functions），砍掉 L154-824（其他模型）

### 6.2 当前模型定义位置

`src/config/model-config.ts` L40-153 范围是 hailuo 模型配置块。

## 七、设计 / 需求反复过的点（血泪教训）

用户对首页 sample-video-gallery 的设计反复改过 3 次，每次都要确认再改。

### 7.1 最终设计（已确认，**不要再改**）

```
┌─────────────────┐ ┌─────────────────┐
│ Input 占位图    │ │ Output 视频     │
│ (originalImage) │ │ (active.mp4)    │
│ "Input" 角标    │ │ "Output" 角标   │
└─────────────────┘ └─────────────────┘
            ↓ 点击切换
┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐
│mp4││mp4││mp4││mp4││mp4││mp4││mp4│  ← 7 个 sample 缩略图（hover 自动播放）
└──┘└──┘└──┘└──┘└──┘└──┘└──┘
```

**关键点**：
- ✅ `originalImage` **要用**（左 Input 占位图的 source）
- ✅ 切换 sample 时：左图 + 右视频 + prompt **三者同步**
- ✅ 让用户"直接上来就知道：这个图片是这样做成视频的"
- ❌ **不要**独立的 ImageGenerator 大组件（那是不同定位的工具）

### 7.2 用户的交互风格（务必遵守）

1. **先复述理解，再写代码** — 不要自作主张
2. **每次大改前必须确认** — 用「我理解对吗？」问句
3. **禁止改完后说"乱改"** — 用户原话："傻逼吗？""理解需求了吗？"
4. **确认完再说"去做吧"** — 用户给出明确指令后才动

## 八、已知问题 / 待办

1. **首页仍可能有 ShipAny / JoyFlix 等模板残留** — 之前 grep "Hailuo" 出现 142 次但其他模板字段未验证
2. **dev 服务当前跑在 3201**（不是默认 3000）— 用户主动指定端口
3. **未实现的页面**：pricing 页面、blog 内容、showcases 案例库 — 都是空架子
4. **支付集成**：PayPal + Stripe 已装但未配置 keys
5. **数据库**：当前是否已初始化过不确定，重启前建议 `pnpm db:studio` 检查

## 九、本地资源 / 工具链

- **端口 3201**：dev 服务在这里跑
- **Chrome DevTools Protocol**：localhost:9222（用户本地 Chrome 已登录 X 等）
- **备份目录**：`hailuo2videonew.bak-2026-06-10`（6月10日 17:01 全量备份，**重要的内容都在这里**）
- **原项目**：`hailuo2-video`（5月31日的版本，可能更稳）

## 十、接手检查清单

接手后请按以下顺序验证：

```bash
# 1. 启动 dev
cd /Users/zhanglongchao/programPJ/hailuo2videonew
PORT=3201 pnpm dev &
sleep 8
curl -I http://localhost:3201/  # 应该 200

# 2. 浏览首页
open http://localhost:3201/

# 3. 验证 sample-video-gallery
# - 顶部应该看到 Input 图 + Output 视频 左右配对
# - 中部看到 7 个 sample 缩略图
# - 切换 sample 时 Input 图 + Output 视频同步切换

# 4. 检查 git 状态，决定是否提交
git status
git diff --stat
# 如果认可当前修改：
git add -A
git commit -m "清理品牌页面 + 只保留视频生成展示"

# 5. 检查需要恢复的文件
# （参考第 5.4 节）
```

---

**核心交接目标**：让接手的人 30 分钟内能跑起来、看完设计、决定哪些修改保留 / 哪些还原 / 哪些继续推进。

**最重要的 1 句话**：**先复述理解，再写代码。每次大改前确认。**