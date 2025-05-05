#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Define colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
RESET='\033[0m'

echo -e "${CYAN}Turbo Monorepo - Create New Package${RESET}"

# Prompt for the package name
read -p "Enter the name of the new package: " PACKAGE_NAME
if [[ -z "$PACKAGE_NAME" ]]; then
  echo -e "${RED}Package name cannot be empty. Exiting.${RESET}"
  exit 1
fi

# Define the packages directory (adjust if your packages are stored elsewhere)
PACKAGES_DIR="./packages"

# Prompt for package type (library/tool/other, optional customization)
read -p "Is this a library package? (y/n): " IS_LIBRARY
if [[ "$IS_LIBRARY" == "y" || "$IS_LIBRARY" == "Y" ]]; then
  PACKAGE_TYPE="library"
else
  PACKAGE_TYPE="tool"
fi

# Final folder path for the package
PACKAGE_PATH="$PACKAGES_DIR/$PACKAGE_NAME"

# Check if the package already exists
if [[ -d "$PACKAGE_PATH" ]]; then
  echo -e "${RED}Package '$PACKAGE_NAME' already exists in $PACKAGES_DIR. Exiting.${RESET}"
  exit 1
fi

# Create the package directory structure
echo -e "${YELLOW}Creating package directory at: $PACKAGE_PATH${RESET}"
mkdir -p "$PACKAGE_PATH/src"
mkdir -p "$PACKAGE_PATH/tests"

# Create the package.json file
echo -e "${YELLOW}Creating package.json...${RESET}"
cat > "$PACKAGE_PATH/package.json" <<EOL
{
  "name": "@bia-money/$PACKAGE_NAME",
  "version": "0.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest"
  },
  "dependencies": {},
  "devDependencies": {}
}
EOL

# Add an index file in src
echo -e "${YELLOW}Creating src/index.ts...${RESET}"
cat > "$PACKAGE_PATH/src/index.ts" <<EOL
// Entry point for @bia-money/$PACKAGE_NAME

export const greet = (name: string) => {
  return \`Hello, \${name}!\`;
};
EOL

# Add a basic test file
echo -e "${YELLOW}Creating tests/index.test.ts...${RESET}"
cat > "$PACKAGE_PATH/tests/index.test.ts" <<EOL
import { greet } from "../src/index";

test("greet function", () => {
  expect(greet("World")).toBe("Hello, World!");
});
EOL

# Add a README file
echo -e "${YELLOW}Creating README.md...${RESET}"
cat > "$PACKAGE_PATH/README.md" <<EOL
# @bia-money/$PACKAGE_NAME

This is the \`$PACKAGE_NAME\` package.

## Installation

\`\`\`
npm install @my-scope/$PACKAGE_NAME
\`\`\`

## Usage

\`\`\`typescript
import { greet } from "@my-scope/$PACKAGE_NAME";

console.log(greet("World")); // "Hello, World!"
\`\`\`
EOL

# (Optional) Add package to the root "workspace" (yarn workspaces)
if [[ -f "./package.json" ]]; then
  echo -e "${YELLOW}Adding the package to the root package.json...${RESET}"
  ROOT_PACKAGE_JSON="./package.json"
  TMP_FILE="./package.json.tmp"
  jq --arg pkg "$PACKAGES_DIR/$PACKAGE_NAME" \
    '.workspaces.packages += [$pkg]' "$ROOT_PACKAGE_JSON" > "$TMP_FILE" && mv "$TMP_FILE" "$ROOT_PACKAGE_JSON"
fi

# Summary
echo -e "${GREEN}Package '$PACKAGE_NAME' created successfully at $PACKAGE_PATH.${RESET}"
echo -e "${CYAN}Next steps:${RESET}"
echo -e "${YELLOW}- cd $PACKAGE_PATH${RESET}"
echo -e "${YELLOW}- Implement your package logic in src/index.ts and add tests in tests/index.test.ts.${RESET}"
echo -e "${YELLOW}- Run 'turbo run build' to build the package (or add it to your pipeline).${RESET}"