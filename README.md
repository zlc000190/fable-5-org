# hailuo2.video

Independent image-to-video web app built on top of the Hailuo AI model.

## What this is

hailuo2.video is a third-party site that wraps the Hailuo image-to-video
model in a simple web UI. Upload an image, add a one-line prompt, and the
Hailuo model turns it into a short cinematic video.

This site is **not** affiliated with, endorsed by, or partnered with
Hailuo AI, MiniMax, 海螺, Hailuo Video, or any similarly named organization.
We have no official partnership, agency, distributor, or affiliate
relationship with Hailuo AI or MiniMax.

## Tech stack

- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind CSS v4
- next-intl (English + Chinese)
- Drizzle ORM + PostgreSQL (configurable)

## Local development

```bash
pnpm install
cp .env.example .env       # then fill in DATABASE_URL, AUTH_SECRET, etc.
pnpm dev                   # http://localhost:3000
```

## Routes

| Path | Purpose |
|------|---------|
| `/` | Landing page with the live sample-video gallery |
| `/pricing` | Subscription plans |
| `/animate` | Full image-to-video generator |
| `/auth/sign-in` | Sign in |
| `/auth/sign-up` | Sign up |
| `/showcases` | Curated sample clips |

## Project structure

```
src/
├── app/[locale]/        # All routes (locale-prefixed)
│   ├── (landing)/       # Public marketing pages
│   ├── (app)/           # Authenticated app shell
│   └── (auth)/          # Sign-in / sign-up
├── config/
│   ├── index.ts         # App-wide env-derived config
│   ├── model-config.ts  # Hailuo model schema + helpers
│   └── locale/          # i18n message catalogs
├── core/
│   ├── auth/            # better-auth integration
│   ├── db/              # Drizzle schema + migrations
│   └── theme/           # Theme block loader
├── shared/
│   ├── blocks/          # Reusable landing blocks
│   └── components/      # UI primitives
└── themes/default/
    ├── blocks/          # Landing blocks (hero, pricing, sample-video-gallery, ...)
    ├── layouts/         # Page layouts
    └── pages/           # Page renderers
```

## Sample videos

Sample clips under `/public/videos/` are demonstration output produced by
the Hailuo model. They are bundled with the app so the homepage looks
alive on first visit.

## License

This codebase is for an independent third-party project. "Hailuo" and
"海螺" are trademarks of their respective owners; references to them are
for descriptive purposes only (nominative fair use) to identify the model
being wrapped.
<!-- last build trigger: 2026-06-14T10:18:17Z -->
