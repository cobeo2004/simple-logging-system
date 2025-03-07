#!/bin/bash
# Script to build and publish the package to npm

# Exit on error
set -e

echo "Building package..."
npm run build

# echo "Running tests..."
# npm test || { echo "Tests failed, not publishing"; exit 1; }

# Optional step to bump version if needed
# read -p "Do you want to bump the version (y/n)? " answer
# if [ "$answer" = "y" ]; then
#   read -p "Enter version bump type (patch, minor, major): " bump_type
#   npm version $bump_type
# fi

echo "Publishing to npm..."
npm publish

echo "Done! Package published successfully."
