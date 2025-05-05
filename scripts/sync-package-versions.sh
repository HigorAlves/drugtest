#!/bin/bash
set -e

# Define color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Set list of directories to ignore. Here we only ignore node_modules.
IGNORE_DIRS=("node_modules" "dist")

# Get the version from the root package.json
ROOT_PKG="package.json"
ROOT_VERSION=$(jq -r '.version' "$ROOT_PKG")
if [ -z "$ROOT_VERSION" ]; then
  echo -e "${RED}Error: Couldn't retrieve version from $ROOT_PKG${NC}"
  exit 1
fi

echo -e "${GREEN}Current root version: $ROOT_VERSION${NC}"

# Ask the user for the version to set
read -p "$(echo -e ${YELLOW}"Enter the version you want to set: "${NC})" NEW_VERSION

if [ -z "$NEW_VERSION" ]; then
  echo -e "${RED}Error: No version provided.${NC}"
  exit 1
fi

# If the new version differs from the root version, display both and ask for confirmation
if [ "$NEW_VERSION" != "$ROOT_VERSION" ]; then
  echo -e "${GREEN}Root version: $ROOT_VERSION${NC}"
  echo -e "${GREEN}New version: $NEW_VERSION${NC}"
  read -p "$(echo -e ${YELLOW}"The new version is different from the root. Are you sure you want to proceed? (y/N): "${NC})" confirm
  if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo -e "${RED}Operation cancelled by the user.${NC}"
    exit 0
  fi
fi

# Build the find command to exclude files inside any ignored directory (node_modules).
find_cmd=( find . -mindepth 2 -type f -name package.json )
for ignore in "${IGNORE_DIRS[@]}"; do
  find_cmd+=( "!" "-path" "*/${ignore}/*" )
done

# Debug: Uncomment the following line to see the full find command:
# echo "Running: ${find_cmd[@]}"

# Execute the find command and update each package.json with the new version.
"${find_cmd[@]}" | while read -r pkg_file; do
  echo -e "${GREEN}Updating version in $pkg_file to $NEW_VERSION${NC}"
  tmp_file=$(mktemp)
  jq --arg ver "$NEW_VERSION" '.version = $ver' "$pkg_file" > "$tmp_file"
  mv "$tmp_file" "$pkg_file"
done

echo -e "${GREEN}All package.json files synced to version $NEW_VERSION.${NC}"
