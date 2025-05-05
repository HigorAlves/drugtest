import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  "apps/*",
  "config/*",
  "infra/*",
  "kernel/*",
  "libs/*",
  "packages/*",
]);
