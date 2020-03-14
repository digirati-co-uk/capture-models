#!/bin/bash

set -e;

if [[ -z "$DOCKER_USERNAME" ]]; then
    echo -e "\033[00;32m Missing Docker username in env (DOCKER_USERNAME)";
    exit 1;
fi;

if [[ -z "$DOCKER_PASSWORD" ]]; then
    echo -e "\033[00;32m Missing Docker password in env (DOCKER_PASSWORD)";
    exit 1;
fi;
