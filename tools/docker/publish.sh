#!/bin/bash

set -e

LATEST_TAG="$(git describe --abbrev=0)"
COMMIT_HASH="$(git rev-parse --short HEAD)"

# Create short commit hash for tagging.
COMMIT_HASH="$(git rev-parse --short HEAD)"

# Create temporary name for our tagged image.
TEMP_IMAGE="capture-models--$COMMIT_HASH"

# Build
docker build -t "$TEMP_IMAGE" .

# Tag
docker tag "$TEMP_IMAGE" digirati/capture-models:"$LATEST_TAG"
docker tag "$TEMP_IMAGE" digirati/capture-models:"$COMMIT_HASH"
docker tag "$TEMP_IMAGE" digirati/capture-models:latest

# Let user know.
echo -e
echo -e "Successfully created and tagged:";
echo -e "    digirati/capture-models:latest"
echo -e "    digirati/capture-models:$LATEST_TAG"
echo -e "    digirati/capture-models:$COMMIT_HASH"
echo -e


docker push digirati/capture-models:"$LATEST_TAG"
docker push digirati/capture-models:"$COMMIT_HASH"
docker push digirati/capture-models:latest
