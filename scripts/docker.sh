#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Define colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RESET='\033[0m'

echo -e "${CYAN}Starting docker and our metric system...${RESET}"
# Define the path to the compose file relative to the script's location
COMPOSE_FILE="$(dirname "$0")/../infra/docker/compose.yaml"

# Run Docker Compose using the compose file in detached mode
docker-compose -f "$COMPOSE_FILE" up -d

echo -e "${GREEN}Everything looks good, happy coding :D${RESET}"
