#!/bin/bash

REPO="diesel-rs/diesel"
OUTPUT_DIR="content/en/changelog"
LIMIT=3  # Change this to get the last N releases

mkdir -p $OUTPUT_DIR

echo "Fetching latest $LIMIT releases for $REPO..."
RELEASES_JSON=$(curl -L \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  https://api.github.com/repos/diesel-rs/diesel/releases?per_page=$LIMIT)

# Loop through the limited releases
echo "$RELEASES_JSON" | jq -c '.[]' | while read -r row; do

    TAG=$(echo "$row" | jq -r '.tag_name')

    # Check if file already exists to avoid overwriting or double-entry
    FILENAME="${OUTPUT_DIR}/${TAG}.md"
    if [ -f "$FILENAME" ]; then
        echo "Skipping $TAG: File already exists."
        continue
    fi

    # Extract & Format Data
    NAME="Diesel ${TAG#v}"
    SLUG=$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | sed -e 's/[^a-z0-9_]/-/g' -e 's/-\{2,\}/-/g' -e 's/^-//' -e 's/-$//')
    DATE=$(echo "$row" | jq -r '.published_at')
    BODY=$(echo "$row" | jq -r '.body')
    HTML_URL=$(echo "$row" | jq -r '.html_url')

    # 1. Create Markdown file
    echo "Writing new release: $FILENAME..."
    cat <<EOF > "$FILENAME"
---
title: "${NAME}"
slug: "$SLUG"
date: ${DATE}
tag: "${TAG}"

htmlUrl: "${HTML_URL}"
---

${BODY}
EOF

done

echo "Update complete."
