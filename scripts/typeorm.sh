#!/bin/bash

# Define ANSI color codes using $'' syntax so escapes are interpreted
RED=$'\033[0;31m'
GREEN=$'\033[0;32m'
YELLOW=$'\033[1;33m'
BLUE=$'\033[0;34m'
NC=$'\033[0m' # No Color

# Function to display the menu
display_menu() {
  echo -e "${BLUE}Select the migration operation:${NC}"
  echo -e "${YELLOW}1) create${NC}"
  echo -e "${YELLOW}2) generate${NC}"
  echo -e "${YELLOW}3) run${NC}"
  echo -e "${YELLOW}4) revert${NC}"
  echo -e "${YELLOW}5) show${NC}"
  echo -e "${YELLOW}6) schema drop${NC}"
  echo -e "${YELLOW}6) schema log${NC}"
  echo -e "${YELLOW}7) fake migration${NC}"
  echo -e "${YELLOW}8) fake revert migration${NC}"
}

# Display menu and ask for user's choice
display_menu
read -p "${BLUE}Enter your choice [1-6]: ${NC}" choice

# Base variables for your data source & migrations location
DATA_SOURCE="src/postgres/data-source.ts"
MIGRATIONS_DIR="src/postgres/migration"

case "$choice" in
  1)
    read -p "${BLUE}Enter the migration name for creation (without extension): ${NC}" migrationName
    echo -e "${GREEN}Creating migration: ${migrationName}.ts${NC}"
    turbo run --filter=@enterprise/database typeorm -- migration:create "${MIGRATIONS_DIR}/${migrationName}"
    ;;
  2)
    read -p "${BLUE}Enter the migration name for generation (without extension): ${NC}" migrationName
    echo -e "${GREEN}Generating migration: ${migrationName}.ts${NC}"
    turbo run --filter=@enterprise/database typeorm -- migration:generate "${MIGRATIONS_DIR}/${migrationName}.ts"
    ;;
  3)
    echo -e "${GREEN}Running migrations...${NC}"
    turbo run --filter=@enterprise/database typeorm -- migration:run
    ;;
  4)
    echo -e "${GREEN}Reverting last migration...${NC}"
    turbo run --filter=@enterprise/database typeorm -- migration:revert
    ;;
  5)
    echo -e "${GREEN}Showing migrations status...${NC}"
    turbo run --filter=@enterprise/database typeorm -- migration:show
    ;;
  6)
    echo -e "${GREEN}Dropping schema...${NC}"
    turbo run --filter=@enterprise/database typeorm -- schema:drop
    ;;
  7)
    echo -e "${GREEN}Showing schema logs...${NC}"
    turbo run --filter=@enterprise/database typeorm -- schema:log
    ;;
  8)
    echo -e "${GREEN}Running fake migrations...${NC}"
    turbo run --filter=@enterprise/database typeorm -- migration:run --fake
    ;;
  9)
    echo -e "${GREEN}Reverting last migration...${NC}"
    turbo run --filter=@enterprise/database typeorm -- migration:revert --fake
    ;;
  *)
    echo -e "${RED}Invalid option chosen!${NC}"
    ;;
esac
