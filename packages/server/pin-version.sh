#!/bin/bash

set -e

if [[ -z "$1" ]] || [[ "$1" == "default" ]]; then
  echo "Skipping version pinning..."
  exit 0;
fi;

VERSION=$1

yarn add @capture-models/database@"$VERSION" \
         @capture-models/server-ui@"$VERSION" \
         @capture-models/types@"$VERSION"
