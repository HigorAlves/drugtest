#!/bin/bash
set -e

# Define color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directories to ignore (e.g. node_modules)
IGNORE_DIRS=("node_modules")

# Root package file
ROOT_PKG="package.json"

# Get current root package name
CURRENT_ROOT_NAME=$(jq -r '.name // empty' "$ROOT_PKG")
if [ -z "$CURRENT_ROOT_NAME" ]; then
  echo -e "${RED}Error: Couldn't retrieve name from $ROOT_PKG${NC}"
  exit 1
fi

echo -e "${GREEN}Current root package name: $CURRENT_ROOT_NAME${NC}"

# Prompt for new root package name
read -p "$(echo -e ${YELLOW}"Enter the new root package name: "${NC})" NEW_ROOT_NAME
if [ -z "$NEW_ROOT_NAME" ]; then
  echo -e "${RED}Error: No package name provided.${NC}"
  exit 1
fi

echo -e "${GREEN}New root package name will be set to: $NEW_ROOT_NAME${NC}"
echo

# Function to preview changes in a package.json file.
preview_changes() {
  local pkg_file="$1"
  local original
  # Get original name from the file (if present)
  original=$(jq -r '.name // empty' "$pkg_file")

  # Determine what the updated package name should be.
  local new_name=""
  if [ "$pkg_file" = "$ROOT_PKG" ]; then
    new_name="$NEW_ROOT_NAME"
  else
    if [[ "$original" =~ ^@bia\.money\/ ]]; then
      suffix=${original#@enterprise/}
      new_name="@$NEW_ROOT_NAME/$suffix"
    else
      new_name="$original"
    fi
  fi

  echo -e "${YELLOW}File: $pkg_file${NC}"
  echo "  Package name:"
  echo "    current: $original"
  echo "    new:     $new_name"

  # Preview dependency updates if any.
  for section in dependencies devDependencies; do
    # Check if the section exists and contains any relevant keys.
    if jq -e "has(\"$section\")" "$pkg_file" >/dev/null; then
      # Collect keys matching @enterprise/...
      keys=()
      while IFS= read -r line; do
        keys+=("$line")
      done < <(jq -r --arg section "$section" '.[ $section ] | to_entries[] | select(.key | test("^@bia\\.money/")) | .key' "$pkg_file")

      if [ ${#keys[@]} -gt 0 ]; then
        echo "  In $section:"
        for key in "${keys[@]}"; do
          suffix=$(echo "$key" | sed 's/^@bia\.money\///')
          new_dep="@$NEW_ROOT_NAME/$suffix"
          echo "    $key  ->  $new_dep"
        done
      fi
    fi
  done
  echo
}

echo -e "${GREEN}Preview of changes:${NC}"
echo "===================================="
# Preview changes for the root package.json first.
preview_changes "$ROOT_PKG"

# Build find command (to include only package.json files at least one level below the root)
find_cmd=( find . -mindepth 2 -type f -name package.json )
for ignore in "${IGNORE_DIRS[@]}"; do
  find_cmd+=( "!" "-path" "*/${ignore}/*" )
done

# Preview changes for each sub-package.json
while IFS= read -r pkg_file; do
  preview_changes "$pkg_file"
done < <("${find_cmd[@]}")

# Ask for final confirmation
read -p "$(echo -e ${YELLOW}"Are you sure you want to apply these changes? (y/N): "${NC})" confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo -e "${RED}Operation cancelled by the user.${NC}"
  exit 0
fi

# Function to update a package.json file
update_pkg() {
  local pkg_file="$1"
  local tmp_file
  tmp_file=$(mktemp)

  # For the root package, set .name directly to NEW_ROOT_NAME.
  # For sub-packages with a name starting with "@enterprise/", rebuild the name.
  # Also update dependency and devDependency keys that start with "@enterprise/".
  if [ "$pkg_file" = "$ROOT_PKG" ]; then
    jq --arg new "$NEW_ROOT_NAME" '
      .name = $new
      |
      (if has("dependencies") then
         .dependencies |= with_entries(.key |= (if test("^@bia\\.money/") then ("@" + $new + "/" + sub("^@bia\\.money/"; "")) else . end))
       else . end)
      |
      (if has("devDependencies") then
         .devDependencies |= with_entries(.key |= (if test("^@bia\\.money/") then ("@" + $new + "/" + sub("^@bia\\.money/"; "")) else . end))
       else . end)
    ' "$pkg_file" > "$tmp_file"
  else
    jq --arg new "$NEW_ROOT_NAME" '
      if (.name? | test("^@bia\\.money/")) then
        .name = ("@" + $new + "/" + (.name | sub("^@bia\\.money/"; "")))
      else
        .
      end
      |
      (if has("dependencies") then
         .dependencies |= with_entries(.key |= (if test("^@bia\\.money/") then ("@" + $new + "/" + sub("^@bia\\.money/"; "")) else . end))
       else . end)
      |
      (if has("devDependencies") then
         .devDependencies |= with_entries(.key |= (if test("^@bia\\.money/") then ("@" + $new + "/" + sub("^@bia\\.money/"; "")) else . end))
       else . end)
    ' "$pkg_file" > "$tmp_file"
  fi

  mv "$tmp_file" "$pkg_file"
  echo -e "${GREEN}Updated $pkg_file${NC}"
}

echo -e "${GREEN}Applying changes...${NC}"
# Update root package.json
update_pkg "$ROOT_PKG"

# Update sub-package.json files:
while IFS= read -r pkg_file; do
  update_pkg "$pkg_file"
done < <("${find_cmd[@]}")

echo -e "${GREEN}All updates are complete.${NC}"
