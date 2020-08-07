#!/bin/bash

set -e

DIST_TAG=$1;shift;

docker build -f Dockerfile.dev -t digirati/capture-models:"$DIST_TAG" .

