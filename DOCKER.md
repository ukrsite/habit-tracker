# Docker Containerization Guide

## Overview

The Habit Tracker is fully containerized for reproducible local deployments and production readiness.

### Architecture

| Component | Technology | Port | Role |
|-----------|-----------|------|------|
| Backend | Fastify (Node 22) | 3000 | REST API + WebSocket |
| Frontend | React SPA (nginx) | 80 | Web UI |
| Data | SQLite (named volume) | — | Persistent database |

---

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- `.env` file configured with OAuth credentials

### Build & Run

```bash
# Build images and start containers
docker compose up --build

# On first startup, the backend will:
# 1. Run database migrations (create tables if needed)
# 2. Start the Fastify server on port 3000
# 3. Allow the frontend (nginx) to start once backend is healthy

# Wait 10-20 seconds for both services to start
```

### Access the App

- **Frontend UI**: http://localhost (port 80)
- **Backend API**: http://localhost:3000 (direct access for OAuth callbacks)
- **Log in**: Use Google or GitHub SSO

---

## Docker Files

### 1. `backend/Dockerfile`

**Multi-stage build:**

**Stage 1 — Builder:**
- Base: `node:22-bookworm-slim`
- Installs build tools: `python3`, `make`, `g++` (needed for `better-sqlite3` native module)
- Runs `npm ci` and compiles TypeScript with `tsc`

**Stage 2 — Production:**
- Base: `node:22-bookworm-slim`
- Copies compiled JavaScript from builder
- Runs `npm ci --omit=dev` (production dependencies only)
- Entrypoint runs migrations, then starts the app

**Key details:**
- `WORKDIR /app` ensures SQLite session paths resolve correctly
- `NODE_ENV=production` optimizes Node.js runtime
- Healthcheck via HTTP request to `/api/auth/me` (always returns 401 if not logged in — that's expected)

### 2. `frontend/Dockerfile`

**Multi-stage build:**

**Stage 1 — Builder:**
- Base: `node:22-bookworm-slim`
- Installs dependencies and runs `vite build`
- Outputs static HTML/CSS/JS to `frontend/dist/`

**Stage 2 — Nginx:**
- Base: `nginx:alpine` (lightweight)
- Copies built static files to `/usr/share/nginx/html`
- Uses custom nginx config for SPA routing and reverse proxies

**Why multi-stage:** Keeps the final image size small by excluding Node and build tools.

### 3. `frontend/nginx.conf`

Routes and behaviors:

| Path | Behavior |
|------|----------|
| `/` | Serves static SPA files; missing files fallback to `index.html` |
| `/api/*` | Reverse-proxies to backend on `http://backend:3000` |
| `/ws` | Reverse-proxies WebSocket to backend |

**Note:** The frontend code also makes direct requests to `http://localhost:3000` (hardcoded in `api.ts`). This still works because port 3000 is exposed to the host.

### 4. `docker-compose.yml`

**Services:**

- **backend**: Builds from `backend/Dockerfile`, exposes port 3000, mounts `habit_data` volume at `/app/data`
- **frontend**: Builds from `frontend/Dockerfile`, waits for backend healthcheck, exposes port 80

**Volume:** `habit_data` persists SQLite databases across container restarts

**Environment:** Loads variables from `.env` automatically (docker-compose feature)

---

## Useful Commands

### Build
```bash
# Build all images
docker compose build

# Build specific service
docker compose build backend
docker compose build frontend
```

### Run
```bash
# Start in foreground (see logs)
docker compose up

# Start in background
docker compose up -d

# Start and rebuild images
docker compose up --build
```

### Logs & Debugging
```bash
# View logs from all services
docker compose logs

# Follow logs in real-time
docker compose logs -f

# Logs from specific service
docker compose logs backend
docker compose logs frontend

# Last 50 lines
docker compose logs --tail=50
```

### Containers
```bash
# List running containers
docker compose ps

# List all containers (including stopped)
docker compose ps -a

# Execute a command in a container
docker compose exec backend sh
```

### Stop & Clean
```bash
# Stop services (keep data)
docker compose stop

# Stop and remove containers
docker compose down

# Stop and remove containers + volumes
docker compose down -v
```

### Verify Health
```bash
# Check backend is responding
curl http://localhost:3000/api/auth/me

# Check frontend is serving
curl http://localhost

# Check container health status
docker compose ps  # See "health" column
```

---

## Troubleshooting

### Backend won't start
```bash
docker compose logs backend
```

Look for:
- **"Port 3000 already in use"** → Another process or container is using it. Run `docker compose down` first.
- **"Cannot open database"** → Volume mount issue. Check `docker volume ls` and `docker compose ps`.

### Frontend shows "Cannot GET /"
- Wait 10-20 seconds; nginx may still be starting
- Check `docker compose logs frontend` for errors

### No database tables
- First startup runs migrations automatically
- Check `docker compose logs backend` for migration output

### OAuth redirects fail
- OAuth callback URLs are registered to `http://localhost:3000/api/auth/{provider}/callback`
- Backend port 3000 must be exposed and accessible
- Frontend `.env` is not used; backend `.env` at repo root is loaded by docker-compose

---

## Performance & Sizing

### Image Sizes (approximate)
- Backend: ~400 MB (Node 22 + build tools + deps)
- Frontend: ~40 MB (nginx + compiled React)

### Memory Requirements
- Backend: 100–200 MB at rest
- Frontend: 10–20 MB at rest
- SQLite: Minimal, grows with data

### Build Time
- First build (no cache): ~4 minutes (downloads base images, installs deps, compiles)
- Rebuild with cache: ~30 seconds

---

## Production Notes

### Volumes

The `habit_data` volume persists:
- `habits.db` — Main SQLite database
- `sessions.db` — Session store (SQLite)

**Backup:** Before major updates, backup the volume:
```bash
docker run --rm -v habit_data:/data -v $(pwd):/backup alpine tar czf /backup/data-backup.tar.gz -C /data .
```

### Environment Variables

Required in `.env`:
- `SESSION_SECRET` — 32+ character random string (session encryption key)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — Google OAuth credentials
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` — GitHub OAuth credentials
- `DATABASE_PATH` — `/app/data/habits.db` (set automatically in docker-compose)
- `PORT` — `3000` (set automatically in docker-compose)
- `FRONTEND_URL` — `http://localhost` (or your domain in production)

### Networking

- Backend and frontend communicate via Docker network (service name: `backend`)
- External access requires port mapping (`:3000`, `:80`)
- No exposed database port — only backend can access SQLite

### Health & Restarts

- Backend has a healthcheck via HTTP request
- Frontend waits for backend healthcheck before starting
- Both services have `restart: unless-stopped` policy

---

## Development vs. Production

### Development
- Use `npm run dev` for hot reloading
- Backend on port 3000, frontend on port 5173
- See logs in terminal immediately

### Production (Docker)
- Pre-compiled, optimized builds
- Isolated environments (less dependency surprises)
- Persistent volumes for data
- No terminal logs — use `docker compose logs`

---

## Next Steps

1. **Environment file**: Set up `.env` with OAuth credentials
2. **Start**: Run `docker compose up --build`
3. **Test**: Visit http://localhost and log in
4. **Deploy**: Push the same `docker-compose.yml` to your server

For deployment to cloud platforms (AWS, GCP, Azure, Heroku), see individual platform docs for Docker Compose or container registry integration.
