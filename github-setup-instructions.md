# GitHub Repository Setup Instructions

Follow these steps to set up your GitHub repository and configure it for publishing the SDK to npm:

## 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and log in to your account
2. Click the "+" icon in the top-right corner and select "New repository"
3. Name your repository (e.g., "logging-system")
4. Add a description (optional)
5. Choose public or private visibility
6. Skip adding README, .gitignore, and license (we already have these)
7. Click "Create repository"

## 2. Push Your Code to GitHub

```bash
# Add the GitHub repository as a remote
git remote add origin https://github.com/yourusername/logging-system.git

# Push your code to GitHub
git push -u origin main
```

## 3. Configure GitHub Actions for Publishing

### Create a Personal Access Token for npm

1. Go to [npmjs.com](https://www.npmjs.com/) and log in
2. Click on your profile picture in the top-right corner
3. Go to "Access Tokens"
4. Click "Generate New Token" > "Classic Token"
5. Enter a name for your token
6. Choose the appropriate permissions (automation)
7. Click "Generate Token"
8. Copy the token (you won't be able to see it again)

### Add the Token to GitHub Secrets

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: [paste your npm token here]
6. Click "Add secret"

## 4. Publishing the SDK

### Option 1: Manual Publishing

```bash
# Navigate to the SDK directory
cd logger-sdk

# Login to npm
npm login

# Build the package
npm run build

# Publish to npm
npm publish
```

### Option 2: Publishing via GitHub Actions

```bash
# Create a new version tag
git tag v1.0.0
git push origin v1.0.0
```

This will trigger the GitHub Actions workflow to publish the package.

You can also manually trigger the workflow from the GitHub Actions tab in your repository.
