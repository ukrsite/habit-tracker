#!/usr/bin/env bash
# Runs after Claude edits any .ts or .tsx file.
# Exit code 2 = block + show output to Claude so it self-corrects.
FILE="$1"
if [[ "$FILE" == *.ts || "$FILE" == *.tsx ]]; then
  DIR=$(echo "$FILE" | grep -oP '(backend|frontend)')
  if [[ -n "$DIR" ]]; then
    cd "$DIR" && npx tsc --noEmit 2>&1
    if [ $? -ne 0 ]; then
      echo "TypeScript errors found — fix before continuing"
      exit 2
    fi
  fi
fi
exit 0
