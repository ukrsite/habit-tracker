---
name: pr-check
description: Run all acceptance checks (typecheck, tests, e2e) before opening a PR
disable-model-invocation: true
---

# PR Check Skill

Runs the full acceptance test suite mapped to the CLAUDE.md "Acceptance Checklist".

## What it does

1. **Typecheck**: `npm run typecheck` (both backend and frontend)
2. **Backend tests**: `npm test -w backend` (9 unit + integration tests)
3. **E2E tests**: `npm run test:ui` (Playwright acceptance tests)
4. Reports a pass/fail checklist of the 14 items in CLAUDE.md

## Usage

```bash
/pr-check
```

## Success criteria

All three stages must pass:
- ✅ No TypeScript errors in backend or frontend
- ✅ All backend tests pass (auth, habits, checkins, ws)
- ✅ All Playwright acceptance tests pass

If any stage fails, the skill stops and shows which tests failed. Fix those and run `/pr-check` again.

## Checklist

This skill verifies alignment with the CLAUDE.md Acceptance Checklist:
- [ ] TypeScript strict mode compliance
- [ ] Database schema and migrations
- [ ] OAuth login (Google + GitHub)
- [ ] Habit CRUD operations
- [ ] Check-in validation (future date, duplicates, paused habits)
- [ ] Streak calculation correctness
- [ ] Ownership guards (403 for cross-user access)
- [ ] WebSocket milestone notifications
- [ ] Milestone acknowledgment idempotence
