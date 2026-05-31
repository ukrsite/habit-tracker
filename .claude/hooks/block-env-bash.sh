#!/usr/bin/env bash
# Block Bash commands that touch .env files (redirect, cp, cat, etc.)
# This is a best-effort advisory check; the Edit/Write hooks provide the real guardrail.

command="$1"

# Look for .env as a path token: after redirection, space, slash, equals, or at line start/end
# Matches: > .env, >> .env, < .env, cat .env, ./.env, path/.env, etc.
# Case-insensitive
if echo "$command" | grep -qiE '(^|[/\s=<>|;&])\.env(\s|$|[/\.])'; then
  echo "Cannot execute shell commands that touch .env files through Claude — they contain OAuth secrets" >&2
  exit 2
fi

exit 0
