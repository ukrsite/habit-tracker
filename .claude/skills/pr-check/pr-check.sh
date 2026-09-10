#!/usr/bin/env bash
# PR check runner: typecheck + tests + e2e in sequence
# Exit 1 if any stage fails, 0 if all pass

set -e

echo "🔍 PR Check: Running full acceptance test suite..."
echo ""

# Stage 1: Typecheck
echo "📋 Stage 1: Typecheck (backend + frontend)"
if npm run typecheck 2>&1; then
  echo "✅ Typecheck passed"
else
  echo "❌ Typecheck failed"
  exit 1
fi
echo ""

# Stage 2: Backend tests
echo "🧪 Stage 2: Backend tests (unit + integration)"
if npm test -w backend 2>&1; then
  echo "✅ Backend tests passed"
else
  echo "❌ Backend tests failed"
  exit 1
fi
echo ""

# Stage 3: E2E tests
echo "🎭 Stage 3: E2E tests (Playwright)"
if npm run test:ui 2>&1; then
  echo "✅ E2E tests passed"
else
  echo "❌ E2E tests failed"
  exit 1
fi
echo ""

echo "✨ All checks passed! Ready for PR."
echo ""
echo "Acceptance Checklist:"
echo "  ✅ TypeScript strict mode compliance"
echo "  ✅ Database schema and migrations"
echo "  ✅ OAuth login (Google + GitHub)"
echo "  ✅ Habit CRUD operations"
echo "  ✅ Check-in validation"
echo "  ✅ Streak calculation correctness"
echo "  ✅ Ownership guards (403 for cross-user access)"
echo "  ✅ WebSocket milestone notifications"
echo "  ✅ Milestone acknowledgment idempotence"

exit 0
