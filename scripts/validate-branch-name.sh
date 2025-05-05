#!/bin/bash

# ANSI color codes for feedback
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RESET="\033[0m"

# List of allowed branch name prefixes
VALID_BRANCH_PREFIXES="^(feat|fix|docs|style|refactor|test|chore)/(.+)$"

# Branches to ignore validation for
IGNORED_BRANCHES="^(main|staging|develop)$"

# Detect branch name if not passed as an argument
if [[ -z "$1" ]]; then
  BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
else
  BRANCH_NAME=$1
fi

# Check if branch name was successfully retrieved
if [[ -z "$BRANCH_NAME" ]]; then
  echo -e "${RED}Error: Unable to determine the branch name.${RESET}"
  exit 1
fi

# Check if the branch name matches the ignored branches list
if [[ "$BRANCH_NAME" =~ $IGNORED_BRANCHES ]]; then
  echo -e "${YELLOW}⚠️  Skipping branch name validation for '${BRANCH_NAME}'.${RESET}"
  exit 0
fi

# Validate the branch name
if [[ ! "$BRANCH_NAME" =~ $VALID_BRANCH_PREFIXES ]]; then
  echo -e "${RED}❌ Invalid branch name: '${BRANCH_NAME}'${RESET}"
  echo -e "${YELLOW}Branch name must follow the convention:${RESET}"
  echo -e "${GREEN}  feat: ${RESET}(new feature)"
  echo -e "${GREEN}  fix: ${RESET}(bug fix)"
  echo -e "${GREEN}  docs: ${RESET}(changes to documentation)"
  echo -e "${GREEN}  style: ${RESET}(formatting, etc; no production code change)"
  echo -e "${GREEN}  refactor: ${RESET}(refactoring production code, no functional changes)"
  echo -e "${GREEN}  test: ${RESET}(adding or updating tests)"
  echo -e "${GREEN}  chore: ${RESET}(other tasks, no production code change)"
  echo -e "${YELLOW}Example:${RESET} ${GREEN}'feat/ISSUE-1'${RESET}"
  exit 1
fi

echo -e "${GREEN}✅ Branch name is valid: '${BRANCH_NAME}'${RESET}"