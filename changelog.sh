#!/bin/bash

REPO="diesel-rs/diesel"
OUTPUT_DIR="content/en/changelog"
SIDEBAR_FILE="data/en/changelog/sidebar.yml"

mkdir -p $OUTPUT_DIR
mkdir -p "$(dirname "$SIDEBAR_FILE")"

echo "Fetching releases for $REPO..."
RELEASES_JSON=$(curl -L \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  https://api.github.com/repos/diesel-rs/diesel/releases?per_page=100)

# Initialize Sidebar YAML
echo "- title: Changelog" > "$SIDEBAR_FILE"
echo "  pages:" >> "$SIDEBAR_FILE"

# Process each release using jq
echo "$RELEASES_JSON" | jq -c '.[]' | while read -r row; do

    # Extract data fields
    # NAME=$(echo "$row" | jq -r 'if (.name != "") then .name else .tag_name end')
    TAG=$(echo "$row" | jq -r '.tag_name')
    NAME="Diesel ${TAG#v}" # Fix missing & strange names
    # SLUG=$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | sed -e 's/[^a-z0-9]/-/g' -e 's/-\{2,\}/-/g' -e 's/^-//' -e 's/-$//') # diesel_derives_v2.0.2
    SLUG=$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | sed -e 's/[^a-z0-9_]/-/g' -e 's/-\{2,\}/-/g' -e 's/^-//' -e 's/-$//')
    DATE=$(echo "$row" | jq -r '.published_at')
    BODY=$(echo "$row" | jq -r '.body') # ⚠️ v0.9.1 empty body
    HTML_URL=$(echo "$row" | jq -r '.html_url')

    # 1. Create individual Markdown file based on the tag (e.g., v1.0.0.md)
    FILENAME="${OUTPUT_DIR}/${TAG}.md"
    echo "Writing $FILENAME..."
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

    # 2. Append entry to sidebar.yml
    echo "Writing $SIDEBAR_FILE..."
    echo "    - title: ${NAME}" >> "$SIDEBAR_FILE"

done

echo "Successfully created $OUTPUT_DIR and $SIDEBAR_FILE."
