---
name: security-audit
description: Audit authorization guards and vulnerability patterns in backend code
---

# Security Audit Skill

Scans the backend for missing authorization checks, session fixation risks, and common vulnerabilities.

## What it does

1. **Ownership guard sweep**: Checks all route handlers in `backend/src/routes/` for the required pattern:
   ```typescript
   if (habit.userId !== req.session.userId) return reply.status(403)...
   ```

2. **WebSocket auth**: Verifies `backend/src/ws/` handlers reject unauthenticated upgrades

3. **Session handling**: Flags potential session fixation in `backend/src/middleware/requireAuth.ts`

4. **SQL injection audit**: Scans for raw Drizzle queries that bypass parameterization

5. **npm audit summary**: Runs `npm audit` and references `docs/SECURITY.md` for build-tool-chain risk assessment

## Usage

```bash
claude ask "run the security-audit skill"
```

Or invoke directly:
```
/security-audit
```

## Findings format

Reports three severity levels:
- **🔴 Critical**: Missing 401/403 checks on auth-required routes
- **🟡 Medium**: Potential session issues or unvalidated inputs
- **🟢 Info**: Best-practice improvements (logging, comments)

## See also

- `docs/SECURITY.md` — npm audit triage and build-chain analysis
- `CLAUDE.md` Authorization Rules section — the baseline this audit checks against
