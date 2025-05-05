FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json files for workspace
COPY package.json ./
COPY yarn.lock ./
COPY turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/scraper/package.json ./packages/scraper/
COPY packages/domain/package.json ./packages/domain/
COPY packages/eslint-config/package.json ./packages/eslint-config/ 2>/dev/null || :
COPY packages/prettier/package.json ./packages/prettier/ 2>/dev/null || :
COPY packages/typescript-config/package.json ./packages/typescript-config/ 2>/dev/null || :
COPY packages/vitest-config/package.json ./packages/vitest-config/ 2>/dev/null || :

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY apps/api ./apps/api
COPY packages/scraper ./packages/scraper
COPY packages/domain ./packages/domain
COPY packages/eslint-config ./packages/eslint-config 2>/dev/null || :
COPY packages/prettier ./packages/prettier 2>/dev/null || :
COPY packages/typescript-config ./packages/typescript-config 2>/dev/null || :
COPY packages/vitest-config ./packages/vitest-config 2>/dev/null || :

# Build the application
WORKDIR /app/apps/api
RUN yarn build

# Expose the port the app runs on
EXPOSE 4000

# Command to run the application
CMD ["yarn", "start:prod"]
