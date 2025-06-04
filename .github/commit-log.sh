#!/bin/bash

BASE="${1}"
HEAD="${2}"

echo "Generating commit log from $BASE → $HEAD..."
COMMIT_LOG=$(git log origin/$HEAD..origin/$BASE --pretty=format:"- %s" | sed -E 's/ *\(#?[0-9]+\) *$//')

if [ -z "$COMMIT_LOG" ]; then
  echo "No commits found between $BASE and $HEAD. Exiting."
  exit 1
fi

git fetch origin val

TEMPLATE=$(cat .github/PULL_REQUEST_TEMPLATE/$BASE-to-$HEAD-deployment.md)

BODY="${TEMPLATE//- Description of work (CMDCT-)/$COMMIT_LOG}"

if [ -z "$TABLE" ]; then
  BODY=$(echo "$BODY" | perl -0777 -pe 's/### Dependency updates:.*\z//s')
else
  REPLACEMENT=$(printf '%s\n%s\n' "### Dependency updates:" "$TABLE" | sed 's/[&/\]/\\&/g')
  BODY=$(echo "$BODY" | perl -0777 -pe 's/### Dependency updates:.*\z/'"$REPLACEMENT"'/s')
fi

echo "$BODY"
