#!/bin/bash

# Exit on error
set -e

echo "Setting up logging system monorepo..."

# Create necessary directories if they don't exist
mkdir -p .github/workflows

# Initialize git repo if it doesn't exist
if [ ! -d .git ]; then
  git init
  echo "Git repository initialized."
else
  echo "Git repository already exists."
fi

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
  cat > .gitignore << EOF
# Dependency directories
node_modules/

# Environment variables
.env

# Build files
dist/
build/

# Log files
*.log
npm-debug.log*

# Database files
*.sqlite

# OS files
.DS_Store
Thumbs.db

# IDE files
.idea/
.vscode/
EOF
  echo "Created .gitignore file."
fi

# Create GitHub Actions workflow file
cat > .github/workflows/publish.yml << EOF
name: Publish SDK

on:
  push:
    tags:
      - 'v*'
    paths:
      - 'logger-sdk/**'
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to publish (e.g., patch, minor, major, or specific version)'
        required: true
        default: 'patch'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16.x'
          registry-url: 'https://registry.npmjs.org/'

      - name: Install dependencies
        run: npm ci
        working-directory: ./logger-sdk

      - name: Build
        run: npm run build
        working-directory: ./logger-sdk

      - name: Publish to npm
        if: github.event_name == 'push' && startsWith(github.ref, 'refs/tags/v')
        run: npm publish
        working-directory: ./logger-sdk
        env:
          NODE_AUTH_TOKEN: \${{ secrets.NPM_TOKEN }}

      - name: Version and Publish (manual trigger)
        if: github.event_name == 'workflow_dispatch'
        run: |
          git config --global user.name "GitHub Actions"
          git config --global user.email "actions@github.com"
          npm version \${{ github.event.inputs.version }} -m "Bump version to %s [skip ci]"
          npm publish
        working-directory: ./logger-sdk
        env:
          NODE_AUTH_TOKEN: \${{ secrets.NPM_TOKEN }}
EOF
echo "Created GitHub Actions workflow file."

# Ensure logger-sdk/.npmignore exists and has content
cat > logger-sdk/.npmignore << EOF
# Source files
src/

# TypeScript config
tsconfig.json

# Development files
node_modules/
.DS_Store
.vscode/
.idea/
*.log

# Testing
*.test.ts
*.spec.ts
__tests__/
coverage/

# Git files
.git/
.gitignore
EOF
echo "Updated logger-sdk/.npmignore file."

# Add all files
git add .

# Initial commit if needed
if [ -z "$(git log -1 --oneline 2>/dev/null)" ]; then
  git commit -m "Initial commit: Logging system monorepo"
  echo "Created initial commit."
else
  echo "Repository already has commits."
fi

# Install dependencies in each package
echo "Installing dependencies..."
npm install

# Build the SDK
echo "Building the SDK..."
cd logger-sdk
npm run build
cd ..

echo ""
echo "Repository setup complete!"
echo ""
echo "Next steps:"
echo "1. Create a repository on GitHub: https://github.com/new"
echo "2. Add the remote: git remote add origin <repository-url>"
echo "3. Push the code: git push -u origin main"
echo ""
echo "To publish the SDK to npm:"
echo "1. Navigate to the logger-sdk directory: cd logger-sdk"
echo "2. Login to npm: npm login"
echo "3. Run: npm publish"
echo ""
echo "See github-setup-instructions.md for detailed GitHub configuration instructions."
echo ""
