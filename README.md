# Habit Tracker with Streaks

Full-stack MVP habit tracking app with daily check-ins, streak calculation, single sign-on (SSO) authentication, and real-time WebSocket milestone notifications. Built with Node.js, React, and SQLite.

## Features

- **Multi-user SSO** — Log in with Google or GitHub
- **Create & manage habits** — Add, edit, pause, and archive habits
- **Daily check-ins** — Track daily progress with status enforcement
- **Streak calculation** — Current streak, best streak, and total check-ins
- **Real-time notifications** — WebSocket-driven milestone alerts for 3, 7, and 30-day streaks
- **Search & filter** — Find habits by name and filter by status or completion
- **Responsive design** — Works on desktop and mobile
- **Automated tests** — Comprehensive test suite with 9 test scenarios

## Tech Stack

| Layer         | Technology                                  |
|---------------|---------------------------------------------|
| **Runtime**   | Node.js 20 + TypeScript (strict mode)       |
| **Backend**   | Fastify 4                                   |
| **Database**  | SQLite via `better-sqlite3`                 |
| **ORM**       | Drizzle ORM                                 |
| **Auth**      | Passport.js (Google + GitHub strategies)    |
| **Sessions**  | `@fastify/session` + `connect-sqlite3`      |
| **WebSocket** | `@fastify/websocket`                        |
| **Frontend**  | React 18 + Vite                             |
| **UI**        | Tailwind CSS + shadcn/ui                    |
| **State**     | TanStack Query v5                           |
| **Testing**   | Vitest + Supertest                          |

## Quick Start

### Prerequisites
- Node.js 20 or later
- npm or yarn
- Google and GitHub OAuth credentials (see [Environment Setup](#environment-setup) below)

### 1. Clone & Install

```bash
git clone <repository-url>
cd habit-tracker
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your OAuth credentials (see [Environment Setup](#environment-setup) section below).

### 3. Set Up Database

From the root directory:

```bash
npm run db:migrate -w backend
npm run db:seed -w backend
```

This creates the database schema and seeds sample data (1 user, 3 habits with check-ins).

**Note:** If seed fails with a UNIQUE constraint error, the sample data already exists — this is safe to ignore.

### 4. Run Both Servers

From the root directory, start both servers in parallel:

```bash
npm run dev
```

Or in separate terminals:

**Terminal 1 — Backend:**
```bash
npm run dev -w backend
# Backend runs on http://localhost:3000
```

**Terminal 2 — Frontend:**
```bash
npm run dev -w frontend
# Frontend runs on http://localhost:5173
```

Open your browser to **http://localhost:5173** and log in with Google or GitHub.

## Environment Setup

### Create `.env` file

Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

### Environment Variables

| Variable              | Description                                         | Example                        |
|-----------------------|-----------------------------------------------------|--------------------------------|
| `GOOGLE_CLIENT_ID`    | Google OAuth 2.0 Client ID                          | `abc123.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 Client Secret                      | `secret_key_xyz`              |
| `GITHUB_CLIENT_ID`    | GitHub OAuth App Client ID                          | `abc123xyz`                   |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret                      | `secret_key_xyz`              |
| `SESSION_SECRET`      | Secret for session encryption (32+ random chars)    | see below                     |
| `DATABASE_PATH`       | SQLite database file location                       | `./data/habits.db`            |
| `PORT`                | Backend server port                                 | `3000`                        |
| `FRONTEND_URL`        | Frontend URL for CORS and redirects                 | `http://localhost:5173`       |

### Generate SESSION_SECRET

Run this command to generate a secure random string:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output to `SESSION_SECRET` in your `.env` file.

## OAuth Setup

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create or select a project
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web application**
6. Add **Authorized redirect URI**: `http://localhost:3000/api/auth/google/callback`
7. Copy **Client ID** and **Client Secret** to your `.env` file

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in the form:
   - **Application name**: Habit Tracker
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/github/callback`
4. Copy **Client ID** and **Client Secret** to your `.env` file

## Database Commands

```bash
cd backend

# Run migrations to create schema
npm run db:migrate

# Seed sample data (1 user, 3 habits, check-ins)
npm run db:seed

# (Optional) Reset and rebuild database
npm run db:reset
```

## Running Tests

From the backend directory:

```bash
cd backend
npm test
```

This runs all test scenarios:
- **T1**: SSO login (Google/GitHub)
- **T2**: Create and retrieve habits
- **T3**: Duplicate check-in prevention
- **T4**: Future-date and status validation
- **T5**: User ownership enforcement (403 on unauthorized access)
- **T6–T8**: Milestone notifications (3, 7, 30-day streaks)
- **T9**: Milestone de-duplication after reconnect
- **T10**: Cascade deletion (check-ins and milestones removed with habit)

### Type Checking

Check TypeScript types in backend:

```bash
cd backend
npm run typecheck
```

Check TypeScript types in frontend:

```bash
cd frontend
npm run typecheck
```

## Project Structure

```
habit-tracker/
├── README.md
├── CLAUDE.md                    # Project specification
├── .env.example                 # Environment variable template
├── package.json                 # Root package manifest
│
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.ts        # Drizzle ORM table definitions
│   │   │   ├── migrate.ts       # Database migrations
│   │   │   └── seed.ts          # Sample data seeding
│   │   ├── routes/
│   │   │   ├── auth.ts          # Authentication routes (Google, GitHub, logout, /me)
│   │   │   ├── habits.ts        # Habit CRUD operations
│   │   │   └── checkins.ts      # Check-in routes
│   │   ├── ws/
│   │   │   └── handler.ts       # WebSocket handler + milestone engine
│   │   ├── utils/
│   │   │   └── streaks.ts       # Pure streak calculation function
│   │   ├── middleware/
│   │   │   └── requireAuth.ts   # Session authentication guard
│   │   └── app.ts               # Fastify app setup + plugin registration
│   ├── tests/
│   │   ├── auth.test.ts         # T1: SSO login tests
│   │   ├── habits.test.ts       # T2, T5: Habit CRUD + authorization tests
│   │   ├── checkins.test.ts     # T3, T4: Check-in validation tests
│   │   └── ws.test.ts           # T6–T9: WebSocket + milestone tests
│   ├── drizzle.config.ts        # Drizzle CLI configuration
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── HabitCard.tsx      # Habit card with streak display
    │   │   ├── HabitModal.tsx     # Create/edit habit modal
    │   │   ├── NotificationPanel.tsx  # Real-time milestone notifications
    │   │   └── Calendar.tsx       # Monthly calendar view
    │   ├── pages/
    │   │   ├── LoginPage.tsx      # OAuth login page
    │   │   ├── DashboardPage.tsx  # Habit list + search/filter
    │   │   └── HabitDetailPage.tsx # Single habit detail + calendar
    │   ├── hooks/
    │   │   ├── useHabits.ts       # Habit data fetching with TanStack Query
    │   │   ├── useCheckin.ts      # Check-in mutations
    │   │   └── useWebSocket.ts    # WebSocket connection + milestone listener
    │   ├── main.tsx               # React app entry point
    │   └── index.css              # Tailwind CSS imports
    └── package.json
```

## API Overview

All API routes are prefixed with `/api`. Authentication required except for `/api/auth/*`.

### Authentication Routes

- `GET /api/auth/google` — Redirect to Google OAuth consent
- `GET /api/auth/google/callback` — OAuth callback (auto-create user)
- `GET /api/auth/github` — Redirect to GitHub OAuth consent
- `GET /api/auth/github/callback` — OAuth callback (auto-create user)
- `POST /api/auth/logout` — Destroy session
- `GET /api/auth/me` — Get current user profile

### Habits Routes

- `GET /api/habits` — List habits (filter by status, search, completion)
- `POST /api/habits` — Create habit
- `GET /api/habits/:id` — Get habit with streak stats
- `PATCH /api/habits/:id` — Update habit
- `DELETE /api/habits/:id` — Delete habit (removes all associated check-ins and milestones)

### Check-in Routes

- `GET /api/habits/:id/checkins?month=YYYY-MM` — List check-ins for month
- `POST /api/habits/:id/checkins` — Create check-in for date
- `DELETE /api/habits/:id/checkins/:date` — Delete check-in (must be today)

### WebSocket

- `GET /ws` — WebSocket upgrade (same session cookie required)
  - Client sends `{ "type": "subscribe", "payload": { "milestones": true } }`
  - Server responds with `milestone` messages for 3, 7, 30-day streaks
  - Client acknowledges with `{ "type": "ack", "payload": { "habitId": "...", "milestoneDays": 3 } }`

## Database Schema

All IDs are UUIDs. Timestamps are Unix timestamps.

### `users`
```sql
id TEXT PRIMARY KEY
provider TEXT NOT NULL             -- 'google' | 'github'
provider_user_id TEXT NOT NULL
email TEXT
display_name TEXT NOT NULL
avatar_url TEXT
created_at INTEGER NOT NULL
UNIQUE(provider, provider_user_id)
```

### `habits`
```sql
id TEXT PRIMARY KEY
user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
name TEXT NOT NULL
description TEXT
start_date TEXT NOT NULL           -- YYYY-MM-DD
status TEXT NOT NULL DEFAULT 'active'  -- 'active' | 'paused' | 'archived'
created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL
```

### `checkins`
```sql
id TEXT PRIMARY KEY
habit_id TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE
user_id TEXT NOT NULL
date TEXT NOT NULL                 -- YYYY-MM-DD
created_at INTEGER NOT NULL
UNIQUE(habit_id, date)
```

### `milestone_notifications`
```sql
id TEXT PRIMARY KEY
habit_id TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE
user_id TEXT NOT NULL
milestone_days INTEGER NOT NULL    -- 3 | 7 | 30
sent_at INTEGER NOT NULL
UNIQUE(habit_id, milestone_days)
```

## Features Checklist

- [x] Multi-user SSO (Google, GitHub)
- [x] Create, edit, pause, archive habits
- [x] Daily check-ins with status enforcement
- [x] Streak tracking (current, best, total check-ins)
- [x] Real-time milestone notifications (3, 7, 30 days via WebSocket)
- [x] Search and filter habits by name and status
- [x] Responsive mobile-friendly design
- [x] Automated test suite (9 test scenarios + cascade deletion tests)
- [x] Type-safe TypeScript throughout
- [x] Authorization: user ownership enforced on all resources

## Business Rules & Design Decisions

### Habit Deletion & Check-in History

**Rule:** When a habit is deleted, its entire check-in history is automatically removed.

**Implementation:** Cascade delete via foreign key constraint at the database level.
```sql
CREATE TABLE checkins (
  ...
  habit_id TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  ...
)
```

**Why this approach:**
- **Simplicity**: No manual cleanup logic needed; database handles it atomically
- **Data integrity**: Prevents orphaned check-in records
- **User experience**: Users can delete habits at any time (active, paused, or archived) without friction
- **Consistency**: Milestone notifications are also cascaded deleted

**Alternative considered:** Require archival before deletion
- Would add workflow friction (two-step deletion process)
- Archival already provides a "soft delete" option for historical record-keeping
- Hard deletion is available for users who want complete removal

**Tested:** Test T10 verifies cascade deletion works for check-ins and milestone notifications

## Troubleshooting

### "Unauthorized" on API routes
- Check that you're logged in by visiting `/api/auth/me`
- Verify session cookie is being sent with requests
- Check `SESSION_SECRET` is set and consistent

### OAuth login redirects to error page
- Verify `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` are correct
- Confirm redirect URIs match in OAuth app settings
- Check that frontend and backend URLs are correct in `.env`

### Database errors
- Run `npm run db:migrate` to ensure schema is created
- Delete `data/habits.db` and re-run migrations if corrupted
- Check `DATABASE_PATH` points to a writable location

### WebSocket not connecting
- Ensure backend is running on the correct port (default 3000)
- Check browser console for WebSocket errors
- Verify CORS is not blocking the upgrade (should use session auth, not CORS)

## Development

### Run all type checks and tests
```bash
npm run test
```

### Enable debug logging
```bash
# Backend
DEBUG=habit-tracker:* npm run dev

# Frontend
DEBUG=habit-tracker:* npm run dev
```

### Reset everything
```bash
# Delete database
rm -rf backend/data

# Reinstall and reseed
cd backend
npm run db:migrate
npm run db:seed
```

## License

MIT