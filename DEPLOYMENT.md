# LifeOS Production Deployment & Operations Guide

## 1. Environment Variable Reference
Your production environment requires these specific variables to be securely injected. Never commit these to Git.

| Variable | Description | Placeholder |
| --- | --- | --- |
| `DATABASE_URL` | Transactional PostgreSQL endpoint (e.g. Supabase, Vercel Postgres) | `postgresql://user:password@host:port/db?schema=public` |
| `NEXTAUTH_SECRET` | Cryptographic secret for signing session boundaries | `[Generated via openssl rand -base64 32]` |
| `NEXTAUTH_URL` | Canonical URL of your deployment | `https://your-production-app.com` |
| `OPENAI_API_KEY` | OpenAI authentication for the Decision Simulator | `sk-xxxx` |
| `GOOGLE_CLIENT_ID` | OAuth Client ID (from Google Cloud Console) | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret | `GOCSPX-xxxx` |
| `CRON_SECRET` | Pre-shared key for external scheduler authentication | `secure-random-string` |
| `EMAIL_PROVIDER_API_KEY`| *(Optional)* Outbound email transactional engine API | `provider-api-key` |

## 2. CI/CD & Automated Testing
LifeOS utilizes **GitHub Actions** (`.github/workflows/ci.yml`) to enforce branch protections mechanically:
- **Build & Test Web Application**: Pull Requests targeted against `main` compile a production Next.js artifact using mocked env variables to certify build integrity. Vitest runs unit verification checking RBAC, Database isolation, and route integrity.
- **Dependency Checks**: Runs via Node 18 environments catching typescript errors (`npx tsc --noEmit`).

## 3. Database Readiness & State Recovery
PostgreSQL databases linked via Prisma must maintain sequential health. 

### Applying Database Migrations (Staging & Prod)
When orchestrating a production deployment with new schema boundaries:
1. Connect via terminal: `npx prisma migrate deploy`
2. Never utilize `npx prisma db push` against production unless you are okay with data loss constraints being overridden forcefully in edge-cases.

### Disaster Recovery & Backups
If utilizing managed providers (Supabase / AWS RDS):
- **Backups**: Configure automated daily snapshots (PITR).
- **Rollbacks**: If a schema migration results in app crashing, immediately roll back the Vercel deployment strictly to the previous `git` SHA deployment. If data was corrupted, restore the managed PostgreSQL slice to the latest 15-minute chunk.

## 4. Platform Deployment (Vercel)
LifeOS is heavily optimized for edge-network integration via Vercel. 
1. Push your repository to GitHub. 
2. Import project via Vercel Dashboard.
3. Configure the `Environment Variables`.
4. Deploy. 
5. Notice the repository contains a `vercel.json`. This securely sets HTTP Security Headers (HSTS, NoSniff, X-Frame-Options) and natively configures the Cron-Scheduler bound triggering `/api/scheduler/dispatch` automatically mapping against `CRON_SECRET`.

## 5. Security & Authorization
- **Role-Based Access Control**: Standard users are scoped internally. Escalation into the `/admin` route requires manual PostgreSQL row adjustment (`UPDATE "User" SET role = 'ADMIN'`).
- **Data Scoping**: Prisma ORM calls check `userId` exclusively masking endpoints against token forging.
- **Monitoring & Logging**: Structured logs execute securely stripping API Keys out of request footprints. You are heavily advised to attach a Vercel Log Drain (e.g. Datadog or Axiom) checking for volume anomalies.

## 6. AI and Provider Resilience
LifeOS incorporates failure isolation mapping structured `Zod` endpoints against the OpenAI Vercel AI SDK wrappers:
- **Timeouts**: Generative calls natively resolve or kill if API latency cascades. 
- **Graceful Failure**: If Open-Meteo or OpenAI drop, the application halts the transaction locally retaining the existing state instead of pushing fabricated mock data.

## 7. Android Release Packaging
To build an `.apk` or `.aab` for production mapping:
1. Load `/android` native scope within Android Studio.
2. Ensure you have populated `.jks` (Java Keystore) variables inside your local `local.properties` (never commit these variables).
3. Validate API URL targeting (`com.lifeos.mobile.data.api.ApiClient.BASE_URL`) dynamically points to your SSL-enabled backend root.
4. Run `Build -> Generate Signed Bundle`. 
5. The output natively compiles obfuscating Kotlin footprints correctly mapping standard Material 3 layouts efficiently against production queries.
