# fable-5.org · Dokploy Environment Variables
# 复制下面全部到 Dokploy → Application → Environment Variables
# (raw textarea, 一行一个 KEY=VALUE)

# === 必填 (deployment fails without these) ===

AUTH_SECRET=zymc7hCG5NydBlc8y2xpObbTDwOE465BPXGp95iTvJo=
POSTGRES_DB=fable5org
POSTGRES_USER=fable5
POSTGRES_PASSWORD=GomP1ZlhAW58ef5PjFjYS1qE
DATABASE_URL=postgresql://fable5:GomP1ZlhAW58ef5PjFjYS1qE@postgres:5432/fable5org

# === 应用 ===

NEXT_PUBLIC_APP_URL=https://fable-5.org
NEXT_PUBLIC_APP_NAME=Fable-5.org
NEXT_PUBLIC_APP_DESCRIPTION=Independent third-party reviews of Claude Fable 5 by a Pro user.
NEXT_PUBLIC_THEME=default
NEXT_PUBLIC_APPEANCE=dark
NEXT_PUBLIC_DEFAULT_LOCALE=en
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# === Auth / DB ===

DATABASE_PROVIDER=postgresql
DATABASE_AUTH_TOKEN=
DB_SCHEMA=public
DB_MIGRATIONS_TABLE=__drizzle_migrations
DB_SINGLETON_ENABLED=true
DB_MAX_CONNECTIONS=1

# === Traefik (Dokploy 自动管理，但需要这个映射域名) ===

TRAEFIK_ROUTER=fable5org
APP_RULE=Host(`fable-5.org`) || Host(`www.fable-5.org`)
ROUTER_MIDDLEWARES=fable5org-https

# === 可选 (评测站不需要，留空即可) ===

OPENROUTER_API_KEY=
REPLICATE_API_TOKEN=
RESEND_API_KEY=
RESEND_SENDER_EMAIL=noreply@fable-5.org
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
