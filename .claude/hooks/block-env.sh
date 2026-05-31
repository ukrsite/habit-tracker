#!/usr/bin/env bash
# Block editing of .env files to prevent accidental credential commits

path="$1"

check_basename() {
  local candidate="$1"
  local base=$(basename "$candidate")
  shopt -s nocasematch
  case "$base" in
    .env|.env.*)
      return 0  # blocked
      ;;
  esac
  return 1
}

# Check original path's basename
if check_basename "$path"; then
  echo "Cannot edit .env files through Claude — they contain OAuth secrets" >&2
  exit 2
fi

# Check what symlink resolves to (if it's a symlink)
if [[ -L "$path" ]]; then
  target=$(readlink -f "$path" 2>/dev/null)
  if [[ -n "$target" ]] && check_basename "$target"; then
    echo "Cannot edit .env files through Claude — they contain OAuth secrets" >&2
    exit 2
  fi
fi

# Check resolved path if file exists
if [[ -e "$path" ]]; then
  if command -v realpath &>/dev/null; then
    resolved=$(realpath "$path" 2>/dev/null)
    if [[ -n "$resolved" ]] && check_basename "$resolved"; then
      echo "Cannot edit .env files through Claude — they contain OAuth secrets" >&2
      exit 2
    fi
  fi
fi

exit 0
