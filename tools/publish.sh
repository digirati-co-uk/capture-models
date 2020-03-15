# Builds based on current tag in lerna.json
# - major/minor/patch
# - Builds NPM packages and publishes
# - Builds docker image and publishes
# - Pushes git tags

BUMP_BY=$1; shift;

if [[ "$BUMP_BY" != "major" ]] && [[ "$BUMP_BY" != "minor" ]] && [[ "$BUMP_BY" != "patch" ]]; then
  echo -d
  echo -e "Usage :"
  echo -e " ./tools/publish.sh [ major | minor | patch ] "
  echo -e
  exit 1;
fi;

# Create new tag
yarn lerna version "$BUMP_BY" --allow-branch master --yes

# Publish latest tag to NPM
yarn lerna publish from-git --yes

# Publish latest tag to docker hub.
./tools/docker/publish.sh
