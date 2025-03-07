# Docker Setup for Logging System

This document provides instructions for running the logging system using Docker and Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Environment Variables

Copy the example `.env` file and modify if needed:

```bash
cp .env.example .env
```

The following environment variables can be customized in the `.env` file:

- `POSTGRES_USER`: PostgreSQL database username (default: logger)
- `POSTGRES_PASSWORD`: PostgreSQL database password (default: logger_password)
- `POSTGRES_DB`: PostgreSQL database name (default: logger_db)
- `API_KEYS`: Comma-separated list of valid API keys (default: this-is-a-secret-key)

## Starting the Services

### Production Mode

To start all services in production mode:

```bash
docker-compose up -d
```

This will start:

1. PostgreSQL database on port 5432
2. Logger API on port 3000
3. Logger Client web UI on port 3001

### Development Mode

For development with hot-reloading and source code mounting:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

This will:

- Mount your local source code into the containers
- Enable hot-reloading for both API and client
- Run the services in development mode

## Viewing Logs

To view the logs of all services:

```bash
docker-compose logs -f
```

To view logs for a specific service:

```bash
docker-compose logs -f api
docker-compose logs -f client
docker-compose logs -f postgres
```

## Stopping the Services

To stop all services:

```bash
docker-compose down
```

To stop and remove all data (including the database volume):

```bash
docker-compose down -v
```

## Individual Service Management

### Rebuilding Services

If you've made changes to the code and need to rebuild:

```bash
docker-compose build api client
docker-compose up -d
```

### Restarting Individual Services

```bash
docker-compose restart api
docker-compose restart client
```

## Troubleshooting

### Database Connection Issues

If the API can't connect to the database:

1. Check if the PostgreSQL container is running:

   ```bash
   docker-compose ps
   ```

2. Verify database credentials in the `.env` file

3. Check database logs:
   ```bash
   docker-compose logs postgres
   ```

### API Health Check Failures

If the API health check is failing:

```bash
docker-compose logs api
```

### Client Connection Issues

If the client can't connect to the API:

1. Ensure the API is running and healthy:

   ```bash
   docker-compose ps
   ```

2. Check client logs:

   ```bash
   docker-compose logs client
   ```

3. Verify the `API_URL` environment variable in the `.env` file

### Package Dependency Issues

If you encounter errors related to package dependencies (especially with experimental-logging-client):

1. Manually update package-lock.json:

   ```bash
   cd logger-client
   npm install --package-lock-only
   cd ..
   ```

2. Rebuild the client container:

   ```bash
   docker-compose build client
   docker-compose up -d client
   ```

3. For persistent issues, you may need to modify the Dockerfiles to use `npm install` instead of `npm ci`, which we've already done in the provided configurations.
