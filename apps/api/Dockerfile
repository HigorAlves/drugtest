FROM node:22-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json files for workspace
COPY package.json ./
COPY yarn.lock ./
COPY turbo.json ./
COPY apps/api/package.json ./apps/api/

# Create config directories
RUN mkdir -p ./config/eslint-config ./config/prettier ./config/typescript-config ./config/vitest-config

# Copy config files
COPY config/eslint-config ./config/eslint-config
COPY config/prettier ./config/prettier
COPY config/typescript-config ./config/typescript-config
COPY config/vitest-config ./config/vitest-config

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY apps/api ./apps/api

# Build the application
WORKDIR /app/apps/api
RUN yarn build

# Expose the port the app runs on
EXPOSE 4000

# Command to run the application
CMD ["yarn", "start:prod"]
