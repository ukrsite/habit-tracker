#!/usr/bin/env bash
# Scans staged changes for common secret patterns before commit.
# Blocks (exit 2) if secrets detected, to prevent accidental credential commits.

COMMIT_CMD="$@"

# Only run on git commit
if ! echo "$COMMIT_CMD" | grep -q "git commit"; then
  exit 0
fi

# Check staged diff for common secret patterns
SECRET_PATTERNS=(
  'GOOGLE_CLIENT_SECRET='
  'GITHUB_CLIENT_SECRET='
  'SESSION_SECRET='
  'password\s*='
  'token\s*='
  'api[_-]?key\s*='
  'secret\s*='
  'bearer\s+[A-Za-z0-9_-]{20,}'
  'Authorization:\s*Bearer\s'
)

staged_diff=$(git diff --cached 2>/dev/null)

for pattern in "${SECRET_PATTERNS[@]}"; do
  if echo "$staged_diff" | grep -iE "$pattern" > /dev/null 2>&1; then
    echo "⚠️  Secret pattern detected in staged changes: '$pattern'" >&2
    echo "Commit blocked to prevent credential leaks." >&2
    exit 2
  fi
done

exit 0
