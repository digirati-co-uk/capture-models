#!/bin/bash

set -e

# Builds based on current tag in lerna.json
# - major/minor/patch
# - Builds NPM packages and publishes
# - Builds docker image and publishes
# - Pushes git tags

BUMP_BY=$1; shift;


./tools/docker/publish.sh "$BUMP_BY"

# Publish latest tag to docker hub.
./tools/docker/publish.sh
