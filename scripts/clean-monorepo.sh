#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Define colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
RESET='\033[0m'

echo -e "${CYAN}Starting cleanup of Turbo monorepo...${RESET}"

# Define folders to clean
BUILD_DIRS=("dist" "build" ".turbo" ".next" "node_modules" "out", "coverage")
TEMP_FILES=("*.log" "*.tmp" "*.tsbuildinfo" "*.cache")

# Clean up build artifacts and Turbo cache
echo -e "${YELLOW}Cleaning build directories and Turbo cache...${RESET}"
for BUILD_DIR in "${BUILD_DIRS[@]}"; do
  find . -name "$BUILD_DIR" -type d -exec rm -rf {} + 2>/dev/null
done

# Clean up temporary files
echo -e "${YELLOW}Cleaning temporary files...${RESET}"
for TEMP_FILE in "${TEMP_FILES[@]}"; do
  find . -type f -name "$TEMP_FILE" -exec rm -f {} + 2>/dev/null
done

# Clean Node.js packages
read -p "$(echo -e "${BLUE}Do you want to remove all 'node_modules'? \n${YELLOW}WARNING: This will erase all current dependencies and require reinstallation. (y/n): ${RESET}")" CLEAN_NODE_MODULES
if [[ "$CLEAN_NODE_MODULES" == "y" || "$CLEAN_NODE_MODULES" == "Y" ]]; then
  echo -e "${RED}Removing node_modules...${RESET}\n"
  find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null
fi

# Clean Yarn cache
read -p "$(echo -e "${BLUE}Do you want to clean the Yarn Cache? (y/n): ${RESET}")" CLEAN_YARN_CACHE
if [[ "$CLEAN_YARN_CACHE" == "y" || "$CLEAN_YARN_CACHE" == "Y" ]]; then
  echo -e "${RED}Cleaning Yarn cache...${RESET}\n"
  yarn cache clean
fi

echo -e "${GREEN}Cleanup is complete!${RESET}\n"
echo -e "${YELLOW}You may need to reinstall dependencies by running 'yarn install' if 'node_modules' was removed.${RESET}"
