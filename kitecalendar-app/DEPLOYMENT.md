# Hosting Kitecalendar.com

The recommended first production stack is:

- Vercel for the Next.js app
- Neon, Supabase, or another managed PostgreSQL host for the database
- Vercel Cron for daily crawler and forecast jobs

## 1. Create The Database

Create a PostgreSQL database and copy the connection string. Use the pooled connection string when your provider offers one.

Add it to your local shell when running production database commands:

```powershell
$env:DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
```

If your provider gives you separate pooled and direct URLs, use pooled for `DATABASE_URL` and direct for migrations:

```powershell
$env:DATABASE_URL="postgresql://USER:PASSWORD@POOLED_HOST:PORT/DATABASE?sslmode=require"
$env:DIRECT_URL="postgresql://USER:PASSWORD@DIRECT_HOST:PORT/DATABASE?sslmode=require"
```

## 2. Run Production Migrations

```powershell
cd "C:\Users\User\Documents\New project\kitecalendar-app"
npm.cmd run db:deploy
```

If Prisma's migration engine is blocked on your machine, use the included direct SQL fallback:

```powershell
npm.cmd run db:apply-sql
```

## 3. Seed Events

Curated public-source starter pack:

```powershell
npm.cmd run db:import -- data/curated-events.json
```

Large launch-density seed with curated events plus generated starter entries:

```powershell
npm.cmd run db:seed:large -- --generated=180
```

Use generated starter entries for product demos and launch testing. For a live public directory, replace them with verified organizer data or keep them pending until reviewed.

## 4. Deploy To Vercel

Push the app to GitHub, then import the project in Vercel.

If the repository root is `New project`, set Vercel's Root Directory to:

```text
kitecalendar-app
```

Set these Vercel environment variables:

```text
DATABASE_URL
DIRECT_URL
AUTH_SECRET
ADMIN_EMAIL
ADMIN_PASSWORD or ADMIN_PASSWORD_HASH
CRON_SECRET
NEXT_PUBLIC_SITE_URL
WEATHER_PROVIDER=open-meteo
WEATHER_API_KEY
```

Deploy. After Vercel gives you a URL, update `NEXT_PUBLIC_SITE_URL` to the production URL and redeploy.

Open-Meteo does not require `WEATHER_API_KEY` for the basic forecast integration, so it can be left blank.

## 5. Domain

Add `kitecalendar.com` in Vercel's Domains settings, then update your domain registrar DNS records as Vercel instructs.

## 6. Ongoing Event Growth

Use three pipelines:

1. Admin-approved user submissions
2. Curated imports from JSON using `npm run db:import`
3. Responsible crawlers that only read public pages where robots.txt and terms permit it

Crawler candidates go to the admin queue before publishing.
