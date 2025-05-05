#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Define colors for better readability
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[0;33m'
RESET='\033[0m'

echo -e "${CYAN}Retrieving commits from the current branch (with body)...${RESET}"

# Get the current branch name
CURRENT_BRANCH=$(git branch --show-current)
if [[ -z "$CURRENT_BRANCH" ]]; then
  echo -e "${YELLOW}Not currently on any branch. Are you in a Git repository?${RESET}"
  exit 1
fi

# Get formatted commits (hash, title, and body)
COMMITS=$(git log --pretty=format:'%h%n%s%n%b' --no-merges)

if [[ -z "$COMMITS" ]]; then
  echo -e "${YELLOW}No commits found on the current branch: $CURRENT_BRANCH.${RESET}"
  exit 0
fi

# Output formatted commit messages
echo -e "${CYAN}Commits from branch '${CURRENT_BRANCH}':${RESET}"
echo -e "$COMMITS"

# Write commits to a temporary file and copy to clipboard if possible
TEMP_FILE=$(mktemp)
echo "$COMMITS" > "$TEMP_FILE"

if command -v pbcopy &> /dev/null; then
  echo "$COMMITS" | pbcopy
  echo -e "${GREEN}Commit messages have been copied to your clipboard!${RESET}"
elif command -v xclip &> /dev/null; then
  echo "$COMMITS" | xclip -selection clipboard
  echo -e "${GREEN}Commit messages have been copied to your clipboard!${RESET}"
else
  echo -e "${YELLOW}Unable to copy: Clipboard utility (pbcopy or xclip) not found.${RESET}"
  echo -e "${CYAN}The commit messages are saved in the temporary file: $TEMP_FILE${RESET}"
fi
