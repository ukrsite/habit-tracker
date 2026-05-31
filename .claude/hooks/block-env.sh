#!/usr/bin/env bash
# Block editing of .env files to prevent accidental credential commits

path="$1"

# Normalize the path to prevent bypass via .. or symlinks
if command -v realpath &>/dev/null; then
  normalized=$(realpath -s "$path" 2>/dev/null) || normalized="$path"
else
  normalized="$path"
fi

# Check both original and normalized paths, case-insensitive
shopt -s nocasematch
for candidate in "$path" "$normalized"; do
  base=$(basename "$candidate")
  case "$base" in
    .env|.env.*)
      echo "Cannot edit .env files through Claude — they contain OAuth secrets" >&2
      exit 2  # exit 2 blocks PreToolUse and feeds message back to Claude
      ;;
  esac
done

exit 0
