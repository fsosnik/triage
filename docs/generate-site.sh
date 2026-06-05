#!/bin/bash
# Convert markdown docs to HTML site

npx markdown-it docs/README.md > docs/index.html
npx markdown-it docs/QUICK_START.md > docs/quickstart.html
npx markdown-it docs/API_GUIDE.md > docs/api.html
npx markdown-it docs/ARCHITECTURE.md > docs/architecture.html

echo "✅ HTML site generated in docs/"
