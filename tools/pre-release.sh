#!/bin/bash

set -e

DIST_TAG=$1;shift;

yarn lerna publish --canary --yes --preid "$DIST_TAG" --dist-tag "$DIST_TAG"

docker built -t digirati/capture-models:"$DIST_TAG" --build-arg PINNED_CAPTURE_MODEL_VERSION="$DIST_TAG" .

docker push digirati/capture-models:"$DIST_TAG"
