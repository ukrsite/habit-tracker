#!/usr/bin/env bash
# Runs before every git commit Claude attempts.
# Blocks the commit (exit 2) if backend tests fail.
COMMIT_CMD="$@"
if echo "$COMMIT_CMD" | grep -q "git commit"; then
  cd backend && npm test -- --run 2>&1
  if [ $? -ne 0 ]; then
    echo "Tests failed — commit blocked. Fix tests first."
    exit 2
  fi
fi
exit 0
