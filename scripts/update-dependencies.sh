#!/bin/bash

# Loop through each package in the monorepo
for package in $(find packages -name "package.json" -not -path "*/node_modules/*"); do
  package_dir=$(dirname "$package")

  echo "Updating dependencies in $package_dir"

  # Move into the package directory
  cd "$package_dir" || continue

  # Run npm-check-updates to update only non-dev dependencies
  npx npm-check-updates -u --dep prod -t minor

  echo "Dependencies updated in $package_dir"

  # Return to the root directory
  cd - > /dev/null

  # Install the updated dependencies
  yarn install
done

echo "Dependency updates completed for all packages."
