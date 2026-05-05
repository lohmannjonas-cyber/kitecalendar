# Kitecalendar.com

Modern full-stack calendar for kitesurfing events worldwide.

## Stack

- Next.js App Router with TypeScript
- Tailwind CSS
- Prisma ORM with PostgreSQL
- JWT cookie admin auth
- OpenStreetMap embeds
- Mock weather provider with a provider interface for real APIs
- Responsible crawler architecture with admin review queue
- English and German i18n dictionaries

## Local Setup

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

The app works without `DATABASE_URL` by using seeded in-memory demo data. Connect PostgreSQL for persistent submissions, alerts, review actions, and admin-created data.

## Hosting

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel, PostgreSQL, migrations, large event seeding, cron jobs, and domain setup.

## Admin

Set these values in `.env`:

```bash
AUTH_SECRET="replace-with-a-long-random-secret"
ADMIN_EMAIL="admin@kitecalendar.com"
ADMIN_PASSWORD="change-this-before-production"
```

For production, prefer `ADMIN_PASSWORD_HASH` with a bcrypt hash.

## Crawler Notes

Crawler examples live in `src/lib/crawler/sources`. Every real crawler must:

- Respect robots.txt and public site terms
- Avoid paywalls, logins, captchas, anti-bot systems, and private content
- Store source URL and crawl date
- Run duplicate detection before review
- Send all candidates to admin review before publishing

## Weather Notes

The default provider is `mock`. Add a provider in `src/lib/weather`, normalize wind to knots, register it in `src/lib/weather/index.ts`, then set `WEATHER_PROVIDER` and `WEATHER_API_KEY`.

## Verification

In this Codex sandbox, Next.js build/dev startup is blocked by a child-process permission error (`spawn EPERM`) after compilation starts. The source has been verified with:

```bash
npm run db:generate
npm run lint
node ./node_modules/typescript/bin/tsc --noEmit
```
