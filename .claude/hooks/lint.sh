#!/usr/bin/env bash
# Lints TypeScript files on edit using ESLint (if configured).
# Exit code 2 = block + show output, 0 = pass/no-op.

FILE="$1"

# Only lint .ts and .tsx files
if [[ ! "$FILE" =~ \.(ts|tsx)$ ]]; then
  exit 0
fi

# Detect workspace (backend or frontend)
DIR=$(echo "$FILE" | grep -oP '(backend|frontend)')
if [[ -z "$DIR" ]]; then
  exit 0
fi

# Check if ESLint is available in this workspace
cd "$DIR" || exit 0
if ! npx eslint --version &>/dev/null 2>&1; then
  # ESLint not configured, skip
  exit 0
fi

# Run ESLint on the file
if npx eslint "$FILE" 2>&1; then
  exit 0
else
  echo "ESLint errors found — fix before continuing"
  exit 2
fi
