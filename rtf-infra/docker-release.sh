#!/usr/bin/env bash

set -euo pipefail

# ===== CONFIG =====
DOCKER_NAMESPACE="cxs001"   # e.g. sirdev or my-org
TARGET_TAG="1.0.0"                            # version to push

# List of images (local_image_name:local_tag)
IMAGES=(
  "yfinance-fastapi:latest"
  "rtf-backend:latest"
  "rtf-frontend:latest"
)

# ===== SCRIPT =====
echo "Starting Docker tag & push..."

for IMAGE in "${IMAGES[@]}"; do
  LOCAL_NAME="${IMAGE%%:*}"
  LOCAL_TAG="${IMAGE##*:}"
  REMOTE_IMAGE="${DOCKER_NAMESPACE}/${LOCAL_NAME}:${TARGET_TAG}"

  echo "Tagging ${LOCAL_NAME}:${LOCAL_TAG} -> ${REMOTE_IMAGE}"
  docker tag "${LOCAL_NAME}:${LOCAL_TAG}" "${REMOTE_IMAGE}"

  echo "Pushing ${REMOTE_IMAGE}"
  docker push "${REMOTE_IMAGE}"
done

echo "All images pushed successfully."


# Run Script Command:
# ./docker-release.sh