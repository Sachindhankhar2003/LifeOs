# LifeOS

LifeOS is an AI-powered personal decision simulator and life planner. It provides a highly polished, aesthetic white-theme interface to model the consequences of major life choices before you make them, plan goals, track progress, and map out realistic constraints.

## Tech Stack
- Frontend: Next.js 14/15 App Router, React, Tailwind CSS 4
- Backend: Next.js API Routes, NextAuth.js
- Database: PostgreSQL
- ORM: Prisma (Version 7) with `@prisma/adapter-pg`
- AI SDK: Vercel AI SDK 
- Live Intel Providers: Open-Meteo (Weather), ExchangeRate-API (Finance)
- Validation: Zod
- Testing: Vitest

## Getting Started

### 1. Installation
Clone the repository, then install project dependencies:
```bash
npm install
```

### 2. Environment Configuration
Copy the sample environment file and provide your variables:
```bash
cp .env.example .env
```
Ensure that you establish a `DATABASE_URL` pointing forward to a fresh PostgreSQL instance and a secure `NEXTAUTH_SECRET` (`openssl rand -base64 32`). A valid `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` pair is required to utilize authentication.
An `OPENAI_API_KEY` is required for the AI Simulator. The application uses Open-Meteo and Open Exchange Rates API which are free and do not require API keys, but follow fair-use rate limits.

### 3. Database Setup & Migrations
LifeOS utilizes Prisma 7 configured with explicit explicit module loading and PostgreSQL endpoints. 

First, initialize your database schema tracking:
```bash
npx prisma migrate dev --name init
```
*(If you are just connecting an existing database, alternatively use `npx prisma db pull` and `npm run generate`)*

Generate the client:
```bash
npx prisma generate
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the LifeOS Dashboard.

## Application Architecture
- **`/`**: Minimalist Landing Page highlighting LifeOS capabilities
- **`/dashboard`**: Unified command center to observe tracked timelines and tasks
- **`/simulator`**: Multi-step AI mock decision and budgeting modeler
- **`/chat`**: Assistant workspace tailored for deep introspection
- **`/admin`**: Protected command center for system health, product analytics, and RBAC user management.
- **`/api/*`**: Contains secure standard RESTful wrappers performing validations managed by `Zod` over `getServerSession` limits ensuring full user isolation.

## Security & Admin Access
Authentication is provided securely via NextAuth. The platform utilizes server-enforced **Role-Based Access Control (RBAC)** across REST endpoints and UI components.
To elevate a user to an `ADMIN`:
1. Login to the application via Google OAuth.
2. Directly update your user record in PostgreSQL to `role = 'ADMIN'`:
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'your.email@example.com';
   ```
3. You can now access the `/admin` console. (Do not hardcode default admin credentials into the source).

## Notifications and Reminders
LifeOS includes a robust framework for managing user reminders and delivery sequences. 
- **Notification Center**: Real-time accessible badge embedded within the web layout (`src/components/NotificationBell.tsx`) allowing reads and dismissals.
- **Goal Reminders**: Configurable UI for explicitly pushing notifications targeted globally onto milestones or goals linked directly to timelines.
- **External Delivery**: Fully extensible adapters established within `src/lib/delivery.ts` supporting standard `Email` and `Web Push`. Note: you MUST manually inject `EMAIL_PROVIDER_API_KEY` and VAPID keys within `.env` to actually invoke downstream requests; mock boundaries run otherwise.
- **Scheduling Architectures**: Driven idempotently via `POST /api/scheduler/dispatch`.
  - *Local Development*: In a development environment, you must manually curl or cron this endpoint locally (e.g. `curl -X POST http://localhost:3000/api/scheduler/dispatch -H "Authorization: Bearer my-cron-secret"`). Do NOT evaluate standard `setTimeout` Node.JS polling structures within Next.js Fast Refresh environments to attempt timer stability.
  - *Production*: Connect a serverless invocation utility (like Vercel Cron or GitHub Actions) triggering the API endpoint per minute referencing `CRON_SECRET`. All executions update bounds securely preventing double dispatches.

## Android Mobile Client (Alpha)
A native Android scaffold has been implemented to mirror the LifeOS minimal web capabilities natively applying Material 3, Jetpack Compose, Kotlin, Coroutines, and Retrofit mapping.

### Implemented Mechanics
- **Structural Architecture**: Scaffolded inside the `/android` repository path running independent `settings.gradle.kts` and standard `AGP` configs.
- **Jetpack Compose Navigation**: Included nested native layouts encapsulating Dashboard (with goals & reminders lists) and Login portal wrappers rendering securely. 
- **Networking Foundations**: Retrofit bound with HTTP interceptors translating JWT `Authorization: Bearer ...` injection matching existing Web session strategies natively (intercepting API connections). 
- **DataStore Storage**: Preferences storage structure established for securely handling authentication token strings.
- **Minimal Branding**: Configured Android 12+ dynamic theming strictly enforcing brand compliance (white backgrounds, subtle shadow bounding, slate and blue semantic coloring).

### Setting Up and Running the Android Workspace
1. **Prerequisites**: Ensure you have Android Studio Jellyfish (or later) and JDK 17 installed. 
2. Open the `/android` directory via Android Studio.
3. Gradle will natively synchronize dependencies from `libs.versions.toml`. 
4. Modify Object `ApiClient.BASE_URL` inside `android/app/src/main/java/com/lifeos/mobile/data/api/ApiClient.kt` to target your local machine IP (`http://192.168.X.X:3000/` instead of `localhost` due to emulator loopbacks) or production server.
5. Hit **Run 'app'** within Studio targeting an emulator API level >= 31. 

**Known Limitations & Incompletes:**
- Next.js Auth natively configures strict secure cookies natively. To map actual OAuth (Google) authentication seamlessly natively on mobile via Retrofit, either an additional Mobile JWT adapter hook needs to be exposed on the backend (`/api/auth/mobile-callback`), or AppAuth must be natively scaffolded over PKCE redirect intercepting deep-links. As of now, `LoginScreen` mocks token parsing manually via direct text insertion.
- Not fully unit-tested natively (due to headless environment isolation boundaries running Node containers). Gradle tasks must be executed manually via Studio configurations off-server.
- Chat UI simulation loops require implementation via WebSockets or streaming.
- Notification permission prompt flow and direct Firebase Cloud Messaging proxy for push deliveries is mocked out. Standard local HTTP pushes populate local Dashboard UI accurately based on remote representations but do not ring natively outside the app instance yet. 

## Running Tests
LifeOS backend API capabilities are ensured via automated unit tests driven by Vitest.
```bash
npx vitest run
```
