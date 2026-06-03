#!/bin/bash
set -e

ENVIRONMENT=${1:-production}
VERSION=$(git rev-parse --short HEAD)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "[Deploy] Version: $VERSION"
echo "[Deploy] Environment: $ENVIRONMENT"
echo "[Deploy] Timestamp: $TIMESTAMP"

# Pre-deployment checks
echo "[Check] Running tests..."
npm test

echo "[Check] Checking types..."
npx tsc --noEmit

echo "[Check] Running linter..."
npm run lint

# Build
echo "[Build] Building application..."
npm run build

# Docker build & push
echo "[Docker] Building image..."
docker build -t triage:$VERSION -t triage:latest .

if [ "$ENVIRONMENT" = "production" ]; then
  echo "[Docker] Tagging for production..."
  docker tag triage:latest triage:prod-$VERSION
  echo "[Docker] Ready to push to registry"
fi

# Create deployment manifest
cat > deployment-manifest.json << MANIFEST
{
  "version": "$VERSION",
  "environment": "$ENVIRONMENT",
  "timestamp": "$TIMESTAMP",
  "status": "ready",
  "checks": {
    "tests": "passed",
    "types": "passed",
    "lint": "passed",
    "build": "passed",
    "docker": "passed"
  }
}
MANIFEST

echo "[Deploy] Manifest created: deployment-manifest.json"
echo "[Deploy] Ready for deployment"
