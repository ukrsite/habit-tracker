#!/usr/bin/env bash
# Block editing of .env files to prevent accidental credential commits

path="$1"

# Normalize the path to prevent bypass via .. or symlinks
if command -v realpath &>/dev/null; then
  normalized=$(realpath "$path" 2>/dev/null) || normalized="$path"
else
  normalized="$path"
fi

base=$(basename "$normalized")

case "$base" in
  .env|.env.*)
    echo "Cannot edit .env files through Claude — they contain OAuth secrets" >&2
    exit 2  # exit 2 blocks PreToolUse and feeds message back to Claude
    ;;
esac

exit 0
