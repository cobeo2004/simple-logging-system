# Publishing Guide

This document provides detailed instructions for publishing the `experimental-logging-client` package to npm.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- An npm account (create one at [npmjs.com](https://www.npmjs.com/signup))
- For GitHub publishing: A GitHub account and a repository for this project

## Option 1: Manual Publishing

The simplest way to publish the package is manually through the npm CLI.

### Step 1: Prepare the Package

1. Ensure you're in the repository root directory
2. Build the SDK:

```bash
npm run build:sdk
```

3. Verify that the build was successful

### Step 2: Login to npm

```bash
cd logger-sdk
npm login
```

Follow the prompts to log in with your npm credentials.

### Step 3: Publish

```bash
npm publish
```

If this is your first time publishing a scoped package, you may need to specify public access:

```bash
npm publish --access=public
```

## Option 2: Using the GitHub Actions Workflow

If you've set up the GitHub repository with the included workflow file, you can publish through GitHub Actions.

### Step 1: Configure GitHub Repository

1. Create a repository on GitHub
2. Add your local repository as a remote:

```bash
git remote add origin https://github.com/yourusername/logging-system.git
git push -u origin main
```

### Step 2: Set up NPM Token

1. Generate an npm access token at [npmjs.com](https://www.npmjs.com/settings/yourusername/tokens)
2. Add this token as a repository secret in your GitHub repository:
   - Go to your repository on GitHub
   - Click "Settings" > "Secrets and variables" > "Actions"
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: [your npm token]
   - Click "Add secret"

### Step 3: Publish through GitHub Actions

#### Method 1: Using Tags

Create and push a tag to trigger the workflow:

```bash
git tag v1.0.0
git push origin v1.0.0
```

#### Method 2: Using the Workflow Dispatch

1. Go to your repository on GitHub
2. Click on the "Actions" tab
3. Select the "Publish SDK" workflow
4. Click "Run workflow"
5. Choose the version increment type (patch, minor, major) or enter a specific version
6. Click "Run workflow"

## Versioning

The package follows [Semantic Versioning](https://semver.org/):

- `MAJOR` version when you make incompatible API changes
- `MINOR` version when you add functionality in a backward compatible manner
- `PATCH` version when you make backward compatible bug fixes

To bump the version manually:

```bash
cd logger-sdk
npm version patch  # or 'minor' or 'major'
```

## After Publishing

After publishing, verify that your package is available on npm:

```bash
npm view experimental-logging-client
```

You can also check the npm website: https://www.npmjs.com/package/experimental-logging-client

## Troubleshooting

### Common Issues

1. **"You must be logged in to publish packages"**

   - Run `npm login` and try again

2. **"Package name already exists"**

   - Choose a different package name in `package.json`

3. **"You do not have permission to publish"**

   - Ensure you're logged in with the correct account
   - For scoped packages, check the scope name matches your npm username or organization

4. **"No valid auth token found"** in GitHub Actions
   - Verify that the NPM_TOKEN secret is correctly set in your repository
   - Ensure the token has the appropriate permissions
