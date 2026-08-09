# Private analytics setup

The analytics system is first-party only. It stores a keyed hash of an anonymous browser cookie plus aggregate-safe event fields. It never stores IP addresses, user-agent strings, document contents, form values, names, email addresses, phone numbers, or full referring URLs.

## 1. Provision PostgreSQL

Create a PostgreSQL database with a provider of your choice (for example, Neon, Supabase, or a managed PostgreSQL instance). Use its pooled connection string as `ANALYTICS_DATABASE_URL`.

## 2. Configure environment variables

Add these values locally in `.env.local` and in the hosting provider's production environment settings. Never commit this file.

```ini
ANALYTICS_DATABASE_URL=postgresql://...
ANALYTICS_HASH_SECRET=generate-a-random-32-byte-or-longer-secret
ADMIN_ANALYTICS_PASSWORD=choose-a-long-unique-admin-password
ADMIN_SESSION_SECRET=generate-a-second-random-32-byte-or-longer-secret
ANALYTICS_TIME_ZONE=Asia/Kolkata
```

Generate each random secret separately:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

`ANALYTICS_TIME_ZONE` is optional and defaults to `Asia/Kolkata`.

## 3. Create the database tables

With `ANALYTICS_DATABASE_URL` available in the environment, run:

```powershell
npm run analytics:migrate
```

The idempotent migration creates `analytics_visitors` and `analytics_events` plus reporting indexes.

## 4. Deploy and sign in

Redeploy after adding the environment variables. Then visit `/admin/analytics`, enter `ADMIN_ANALYTICS_PASSWORD`, and view real database-backed analytics. Admin sessions are HTTP-only, signed cookies that expire after 12 hours.

If the analytics database is unavailable, public DocSprintHub pages continue working normally and tracking requests quietly return without interrupting users.
