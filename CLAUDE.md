# Habit Tracker with Streaks — Claude Code Spec

## Project Goal
Full-stack MVP: multi-user habit tracking app with daily check-ins, streak calculation, SSO auth, and real-time WebSocket milestone notifications. Must run locally.

---

## Tech Stack

| Layer         | Choice                                      |
|---------------|---------------------------------------------|
| Runtime       | Node.js 20 + TypeScript (strict)            |
| Backend       | Fastify 4                                   |
| Database      | SQLite via `better-sqlite3`                 |
| ORM           | Drizzle ORM                                 |
| Auth          | Passport.js — Google + GitHub strategies   |
| Sessions      | `@fastify/session` + `connect-sqlite3`      |
| WebSocket     | `@fastify/websocket`                        |
| Frontend      | React 18 + Vite                             |
| UI            | Tailwind CSS + shadcn/ui                    |
| Server state  | TanStack Query v5                           |
| Testing       | Vitest + Supertest                          |

---

## Repository Layout

```
habit-tracker/
├── CLAUDE.md
├── .env.example
├── package.json          # root — scripts: dev, test
├── backend/
│   ├── src/
│   │   ├── db/           # schema.ts, migrate.ts, seed.ts
│   │   ├── routes/       # auth.ts, habits.ts, checkins.ts
│   │   ├── ws/           # handler.ts (WebSocket + milestone engine)
│   │   ├── utils/        # streaks.ts (pure function)
│   │   ├── middleware/   # requireAuth.ts
│   │   └── app.ts        # Fastify instance + plugin registration
│   ├── tests/
│   │   ├── auth.test.ts
│   │   ├── habits.test.ts
│   │   ├── checkins.test.ts
│   │   └── ws.test.ts
│   ├── drizzle.config.ts
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/   # HabitCard, HabitModal, NotificationPanel, Calendar
    │   ├── pages/        # LoginPage, DashboardPage, HabitDetailPage
    │   ├── hooks/        # useHabits.ts, useCheckin.ts, useWebSocket.ts
    │   └── main.tsx
    └── package.json
```

---

## Database Schema

Four tables. All IDs are UUIDs generated via `crypto.randomUUID()`.

### `users`
```sql
id TEXT PRIMARY KEY
provider TEXT NOT NULL             -- 'google' | 'github'
provider_user_id TEXT NOT NULL
email TEXT
display_name TEXT NOT NULL
avatar_url TEXT
created_at INTEGER NOT NULL        -- Unix timestamp
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

---

## REST API

Base path: `/api`. All routes except `/api/auth/*` require an authenticated session. Return `401` if not logged in. Return `403` if the resource belongs to a different user.

### Auth routes

| Method | Path                    | Description                                                  |
|--------|-------------------------|--------------------------------------------------------------|
| GET    | /auth/google            | Redirect to Google OAuth consent                             |
| GET    | /auth/google/callback   | OAuth callback — upsert user, set session, redirect to `/`  |
| GET    | /auth/github            | Redirect to GitHub OAuth consent                             |
| GET    | /auth/github/callback   | OAuth callback — upsert user, set session, redirect to `/`  |
| POST   | /auth/logout            | Destroy session → 204                                       |
| GET    | /auth/me                | Return current user profile or 401                           |

### Habits routes

| Method | Path           | Body / Query                                      | Response         |
|--------|----------------|---------------------------------------------------|------------------|
| GET    | /habits        | `?status=active\|paused\|archived&q=text&completedToday=true\|false` | 200 array   |
| POST   | /habits        | `{ name, description?, startDate, status? }`     | 201 habit        |
| GET    | /habits/:id    | —                                                 | 200 habit + streaks |
| PATCH  | /habits/:id    | `{ name?, description?, status? }`               | 200 habit        |
| DELETE | /habits/:id    | —                                                 | 204              |

`GET /habits/:id` response includes computed fields:
```json
{ "currentStreak": 5, "bestStreak": 12, "totalCheckins": 34 }
```

Status transition rules (enforce in PATCH):
- `active` ↔ `paused` — allowed
- `active` | `paused` → `archived` — allowed
- `archived` → anything — **forbidden** (422)

### Checkins routes

| Method | Path                          | Body / Notes                               | Response |
|--------|-------------------------------|--------------------------------------------|----------|
| GET    | /habits/:id/checkins          | `?month=YYYY-MM` for calendar view         | 200 array |
| POST   | /habits/:id/checkins          | `{ date: "YYYY-MM-DD" }`                   | 201      |
| DELETE | /habits/:id/checkins/:date    | `date` must be today                       | 204      |

`POST` validation:
- Habit must be `active` → 422 otherwise
- Date must not be in the future → 422
- Duplicate (habit_id + date) → 409

---

## Streak Calculation

Implement as a **pure function** in `backend/src/utils/streaks.ts`. Called on every `GET /habits/:id`.

```typescript
export function calculateStreaks(
  dates: string[],   // array of 'YYYY-MM-DD', may be unsorted
  todayISO: string   // caller passes UTC date: new Date().toISOString().slice(0, 10)
): { current: number; best: number; total: number } {
  const sorted = [...new Set(dates)].sort();
  if (sorted.length === 0) return { current: 0, best: 0, total: 0 };

  // Best streak
  let best = 1, run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = daysBetween(sorted[i - 1], sorted[i]);
    run = diff === 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }

  // Current streak — walk backwards from today
  let current = 0;
  const dateSet = new Set(sorted);
  let day = todayISO;
  while (dateSet.has(day)) {
    current++;
    day = subtractOneDay(day);
  }

  return { current, best, total: sorted.length };
}
```

**Timezone rule:** "Today" is always UTC. The client sends the user's local date string. The server stores it as-is and compares strings. No server-side timezone conversion.

---

## WebSocket Protocol

**Endpoint:** `GET /ws` (HTTP upgrade, same session cookie required)  
**Reject** unauthenticated upgrades → HTTP 401.

All messages are JSON with the envelope:
```json
{ "type": "<message_type>", "payload": { ... } }
```

### Server → Client

| type        | Payload                                                                 | When                                      |
|-------------|-------------------------------------------------------------------------|-------------------------------------------|
| `connected` | `{ userId: string }`                                                    | Immediately after upgrade                 |
| `milestone` | `{ habitId, habitName, milestoneDays: 3\|7\|30, currentStreak: number }` | After `subscribe`, for each unacknowledged milestone |

### Client → Server

| type        | Payload                                          | Server behavior                                        |
|-------------|--------------------------------------------------|--------------------------------------------------------|
| `subscribe` | `{ milestones: true }`                           | Evaluate milestones for all user habits, push unacknowledged ones |
| `ack`       | `{ habitId: string, milestoneDays: 3\|7\|30 }`  | `INSERT OR IGNORE` into `milestone_notifications`     |

### Milestone logic (on `subscribe`)
1. Load all habits for the user.
2. For each habit, run `calculateStreaks()`.
3. Check milestones `[3, 7, 30]`: if `currentStreak >= milestone` AND no row exists in `milestone_notifications(habit_id, milestone_days)` → send `milestone` message.
4. Do **not** persist to `milestone_notifications` at send time — only persist on `ack`.

---

## Frontend Screens

### LoginPage (`/login`)
- Two buttons: **Continue with Google** → `/api/auth/google`, **Continue with GitHub** → `/api/auth/github`
- No other inputs. Redirect here if unauthenticated.

### DashboardPage (`/`)
- Habit list via `GET /api/habits` (TanStack Query).
- Per card: name, status badge, current streak 🔥, best streak ⭐, total check-ins, today check-in toggle.
- Search input + status filter dropdown + "completed today" toggle.
- Empty state when no habits. Loading skeleton while fetching.
- FAB or button to open CreateHabitModal.

### HabitModal (create / edit)
- Fields: Name (required), Description (optional), Start date, Status (select).
- Client-side validation: name required.
- Submit button shows spinner while in-flight.

### HabitDetailPage (`/habits/:id`)
- Stats row: current streak, best streak, total check-ins.
- Monthly calendar grid — highlight checked-in dates.
- Edit button opens HabitModal. Back button.

### NotificationPanel
- Fixed top-right corner or toast stack.
- Shows incoming `milestone` WS messages: habit name + "X-day streak!" badge.
- Dismiss button → sends `ack` message via WS.
- Stays visible until dismissed.

### Responsive behavior
- Mobile: single-column card layout.
- Habit cards stack vertically. Modal becomes bottom sheet.

### Required UI polish
- Consistent spacing + typography across all screens.
- Visible hover and focus states on interactive elements.
- Empty states: no habits, no search results, no check-ins yet.
- At least one loading skeleton (habit list).
- Client-side form validation feedback.
- Light theme only.

---

## Required Tests

All tests use an **in-memory SQLite** database (`:memory:`). Run migrations in `beforeAll`. Reset data in `beforeEach`. No real Google/GitHub network calls — mock Passport strategies.

| ID  | File               | What to test                                                                 |
|-----|--------------------|------------------------------------------------------------------------------|
| T1  | auth.test.ts       | SSO login: mock provider returns fixture profile → session created → `/auth/me` returns profile |
| T2  | habits.test.ts     | `POST /habits` → 201. `GET /habits` returns it.                             |
| T3  | checkins.test.ts   | `POST` check-in for today → 201. Second identical `POST` → 409.             |
| T4  | checkins.test.ts   | `POST` with future date → 422. `POST` on paused habit → 422.                |
| T5  | habits.test.ts     | User B accessing User A's habit → 403 on GET, PATCH, DELETE.                |
| T6  | ws.test.ts         | Seed 3 consecutive check-ins → connect WS → send `subscribe` → assert `milestone` message with `milestoneDays: 3` received. |
| T7  | ws.test.ts         | Same with 7 consecutive check-ins → assert `milestoneDays: 7`.              |
| T8  | ws.test.ts         | Same with 30 consecutive check-ins → assert `milestoneDays: 30`.            |
| T9  | ws.test.ts         | T6 scenario → send `ack` → disconnect → reconnect → `subscribe` → assert **no** duplicate notification. |

Run all tests:
```bash
cd backend && npm test
```

---

## Commands

```bash
# Install all dependencies (run from root)
npm install

# Run backend dev server (port 3000)
cd backend && npm run dev

# Run frontend dev server (port 5173)
cd frontend && npm run dev

# Run database migrations
cd backend && npm run db:migrate

# Seed sample data (1 user, 3 habits, check-ins)
cd backend && npm run db:seed

# Run tests
cd backend && npm test

# Type-check backend
cd backend && npm run typecheck

# Type-check frontend
cd frontend && npm run typecheck
```

---

## Environment Variables

Copy `.env.example` to `.env`. Never commit `.env`.

```bash
# .env.example
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
SESSION_SECRET=                 # random 32+ char string
DATABASE_PATH=./data/habits.db
PORT=3000
FRONTEND_URL=http://localhost:5173
```

**Google OAuth setup:**
1. Go to https://console.cloud.google.com → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Authorized redirect URI: `http://localhost:3000/api/auth/google/callback`

**GitHub OAuth setup:**
1. Go to https://github.com/settings/developers → OAuth Apps → New
2. Authorization callback URL: `http://localhost:3000/api/auth/github/callback`

---

## Authorization Rules

Enforce on **every** habit and check-in operation:

```typescript
// requireAuth middleware — attach to all /api/habits and /api/checkins routes
if (!req.session.userId) return reply.status(401).send({ error: 'Unauthorized' });

// ownership guard — inside each route handler
const habit = await db.query.habits.findFirst({ where: eq(habits.id, req.params.id) });
if (!habit) return reply.status(404).send({ error: 'Not found' });
if (habit.userId !== req.session.userId) return reply.status(403).send({ error: 'Forbidden' });
```

Apply the same pattern to WebSocket: reject upgrade if no valid session.

---

## Acceptance Checklist

Before marking done, verify every item:

- [ ] New user can log in with Google and GitHub
- [ ] User record created automatically on first SSO sign-in
- [ ] User can create, edit, and archive habits; status transitions enforced
- [ ] User can check in a habit for today and undo the check-in
- [ ] Future-date check-in rejected (422); duplicate rejected (409)
- [ ] Current streak, best streak, total check-ins display correctly
- [ ] Paused/archived habits cannot receive new check-ins
- [ ] Search and status filter work on the habit list
- [ ] Data is private: another user's habits return 403
- [ ] WebSocket connects on login; `subscribe` triggers milestone evaluation
- [ ] Milestone notifications appear in UI for 3-, 7-, and 30-day streaks
- [ ] Acknowledged milestones are not re-sent after reconnect
- [ ] All 9 automated tests pass: `cd backend && npm test`
- [ ] App starts from a clean clone using only the README
