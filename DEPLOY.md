# fable-5.org 部署说明

> **重要**：以下步骤由你执行。代码我已经全部提交到本地 git，没 push。

---

## 步骤 1：创建 GitHub 仓库

在 GitHub 网页创建新仓库：

- **仓库名**：`fable-5-org`
- **Owner**：`zlc000190`（你的主账号）
- **可见性**：Public 或 Private 都行
- **不要**勾选 "Add a README file"（避免冲突）

GitHub 仓库地址：`https://github.com/zlc000190/fable-5-org`

---

## 步骤 2：推送代码

```bash
cd /Users/zhanglongchao/programPJ/fable-5-org
git remote add origin git@github.com:zlc000190/fable-5-org.git
git push -u origin main
```

如果 `git@github.com` SSH 没配好（之前 hailuo2videonew 是 SSH），直接用 HTTPS：

```bash
git remote add origin https://github.com/zlc000190/fable-5-org.git
git push -u origin main
```

---

## 步骤 3：Dokploy 创建项目

1. 登录 Dokploy：http://107.172.250.153:3000
2. **Projects** → **Create Project**
   - Name: `fable-5-org`
   - Description: `Fable 5 评测站`
3. 进新项目 → **Services** → **Create Service** → **Application**

### Source 配置

- **Provider**: GitHub
- **Repository**: `zlc000190/fable-5-org`
- **Branch**: `main`
- **Build Pack**: **Docker Compose** ⚠️（不是 Dockerfile）
- **Compose path**: `./docker-compose.yml`

### Environment Variables

跟 hailuo2.video 几乎一样：

```bash
# 应用
NEXT_PUBLIC_APP_URL=https://fable-5.org
NEXT_PUBLIC_APP_NAME=Fable-5.org
NEXT_PUBLIC_APP_DESCRIPTION=Independent third-party reviews of Claude Fable 5 by a Pro user.
NEXT_PUBLIC_THEME=default
NEXT_PUBLIC_APPEANCE=dark
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# 数据库（与 docker-compose.yml 内部 service name 一致）
POSTGRES_DB=fable5org
POSTGRES_USER=fable5
POSTGRES_PASSWORD=<用 openssl 生成：openssl rand -base64 24 | tr -d '/+=' | head -c 24>
DATABASE_PROVIDER=postgresql
DATABASE_URL=postgresql://${POSTGRES_USER}:<上面同样的密码>@postgres:5432/${POSTGRES_DB}

# Auth
AUTH_SECRET=<openssl rand -base64 32>
AUTH_URL=https://fable-5.org

# Traefik
TRAEFIK_ROUTER=fable5org
APP_RULE=Host(`fable-5.org`) || Host(`www.fable-5.org`)
ROUTER_MIDDLEWARES=fable5org-https

# 跳过（评测站不需要）
# OPENROUTER_API_KEY / REPLICATE_API_TOKEN / STRIPE_* / PAYPAL_* / RESEND_*
```

### Domain 配置

进 Application → **Domains** → **Add Domain**：

- `fable-5.org` → 端口 3000
- `www.fable-5.org` → 端口 3000

启用 HTTPS（Traefik 自动 Let's Encrypt）。

---

## 步骤 4：Cloudflare DNS

去 Cloudflare Dashboard（fable-5.org 域名）：

| 类型 | 名称 | IPv4 | Proxy |
|------|------|------|-------|
| A | @ | 107.172.250.153 | **Proxied**（橙云）|
| A | www | 107.172.250.153 | **Proxied**（橙云）|

SSL/TLS：选 **Full (strict)** + Origin Certificate（从 Cloudflare → SSL → Origin Server 创建）。

---

## 步骤 5：触发部署

点 **Deploy** → 等待 5-15 分钟。

---

## 步骤 6：验证

```bash
curl -I https://fable-5.org/
curl -I https://fable-5.org/zh/
curl -I https://fable-5.org/en/
curl -I https://fable-5.org/blog/fable5-day-1-pro-user
curl -I https://fable-5.org/blog/fable5-day-1-pro-user
```

预期全部 HTTP/2 200。

---

## 我能立刻帮你做的

- 帮你写 `git push` 命令（如果你 SSH 没配好，我用 HTTPS 推）
- 帮你写 Dokploy 创建项目的具体步骤截图说明
- 帮你生成 AUTH_SECRET 和 POSTGRES_PASSWORD（用 openssl）

告诉我下一步走哪个，我立即配合。