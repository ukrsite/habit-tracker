#!/usr/bin/env bash
# Block Bash commands that touch .env files (redirect, cp, cat, etc.)

command="$1"

# Patterns that could modify or read .env files
# Look for: > .env, >> .env, tee .env, cp .env, mv .env, etc.
if echo "$command" | grep -qiE '(>\s*\.env|>>\s*\.env|tee\s+\.env|cp\s+.*\.env|mv\s+.*\.env|cat\s+\.env|sed\s+.*\.env|awk\s+.*\.env)'; then
  echo "Cannot execute shell commands that touch .env files through Claude — they contain OAuth secrets" >&2
  exit 2
fi

exit 0
