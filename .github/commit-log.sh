#!/bin/bash

BASE="${1}"
HEAD="${2}"

git fetch origin $BASE
git fetch origin $HEAD

echo "Generating commit log for $BASE → $HEAD..."
COMMIT_LOG=$(git log origin/$HEAD..origin/$BASE --pretty=format:"- %s" | sed -E 's/ *\(#?[0-9]+\) *$//')

if [ -z "$COMMIT_LOG" ]; then
  echo "No commits found between $BASE and $HEAD. Exiting."
  exit 1
fi

TEMPLATE_PATH=".github/PULL_REQUEST_TEMPLATE/${BASE}-to-${HEAD}-deployment.md"
DEFAULT_TEMPLATE=".github/PULL_REQUEST_TEMPLATE/main-to-val-deployment.md"

if [ -f "$TEMPLATE_PATH" ]; then
  TEMPLATE=$(cat "$TEMPLATE_PATH")
else
  TEMPLATE=$(cat "$DEFAULT_TEMPLATE")
fi

BODY="${TEMPLATE//- Description of work (CMDCT-)/$COMMIT_LOG}"

# Generate dependency upgrade table
YARN_LOCK_FILES=$(git diff --name-only origin/$HEAD..origin/$BASE -- '*.yarn.lock' '*/yarn.lock')

TABLE_HEAD="| package | prior version | upgraded version |
|-|-|-|
"
TABLE_BODY=""

for FILE in $YARN_LOCK_FILES; do
  echo "Processing diff for $FILE"

  DIFF=$(git diff origin/$HEAD..origin/$BASE -- "$FILE")

  PARSED=$(echo "$DIFF" | awk '
    BEGIN {
      pkg = "";
      old = "";
      new = "";
    }
    {
      # If line ends with ":" and does NOT start with -/+ (package line)
      if ($0 ~ /^[^+-].*:\s*$/) {
        # Before overwriting pkg, if previous pkg and versions differ, print
        if (pkg != "" && old != "" && new != "" && old != new) {
          printf "| %s | %s | %s |\n", pkg, old, new;
        }
        # Extract pkg name from line (remove trailing colon and everything from @ onwards)
        pkg_line = $0;
        sub(/:\s*$/, "", pkg_line);
        sub(/@.*$/, "", pkg_line);
        gsub(/^[ \t]+|[ \t]+$/, "", pkg_line);
        pkg = pkg_line;
        old = "";
        new = "";
      }
      else if ($0 ~ /^-  version /) {
        old_line = $0;
        sub(/^-  version "?/, "", old_line);
        sub(/"?$/, "", old_line);
        old = old_line;
      }
      else if ($0 ~ /^\+  version /) {
        new_line = $0;
        sub(/^\+  version "?/, "", new_line);
        sub(/"?$/, "", new_line);
        new = new_line;
      }
    }
    END {
      if (pkg != "" && old != "" && new != "" && old != new) {
        printf "| %s | %s | %s |\n", pkg, old, new;
      }
    }
  ')

  while IFS= read -r line; do
    if ! echo "$TABLE_BODY" | grep -Fxq "$line"; then
      TABLE_BODY+="$line"
    fi
  done <<< "$PARSED"
done

if [ -z "$TABLE_BODY" ]; then
  BODY=$(echo "$BODY" | perl -0777 -pe 's/### Dependency updates:.*\z//s')
else
  REPLACEMENT=$(printf '%s\n%s\n' "### Dependency updates:" "$TABLE_HEAD$TABLE_BODY" | sed 's/[&/\]/\\&/g')
  BODY=$(echo "$BODY" | perl -0777 -pe 's/### Dependency updates:.*\z/'"$REPLACEMENT"'/s')
fi

echo "$BODY"
