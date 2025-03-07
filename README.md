# Logging System

A complete logging system with client, API, and SDK components.

## Overview

This monorepo contains three main components:

1. **logger-sdk**: A JavaScript/TypeScript library for collecting and sending logs
2. **logger-api**: A REST API for receiving and storing logs
3. **logger-client**: A web application for viewing and analyzing logs

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/logging-system.git
cd logging-system
npm install
```

### Building All Components

```bash
npm run build
```

### Starting the API Server

```bash
npm run start:api
```

### Starting the Client Application

```bash
npm run start:client
```

## Component Details

### logger-sdk

The SDK is a lightweight JavaScript/TypeScript library that can be integrated into any application to collect and send logs to the logging API.

[View SDK Documentation](./logger-sdk/README.md)

### logger-api

The API is a REST service built with Node.js that receives logs from the SDK and stores them in a database.

[View API Documentation](./logger-api/README.md)

### logger-client

The client is a web application that provides a user interface for viewing and analyzing logs collected by the system.

## Development

Each component can be developed independently by navigating to its directory and running npm commands directly, or you can use the workspace scripts from the root directory.

### Running Tests

```bash
npm test
```

### Clean Build

```bash
npm run clean
```

## Publishing

To publish the SDK to npm:

```bash
npm run build:sdk
npm run publish:sdk
```

## License

MIT
