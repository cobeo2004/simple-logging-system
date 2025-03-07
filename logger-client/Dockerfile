FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Force update the package-lock.json if needed
RUN npm install --package-lock-only

# Then install dependencies normally
RUN npm install --no-audit

# Copy source code
COPY . .

# Build the client and server
RUN npm run build

# Second stage: run
FROM node:18-alpine

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Copy built application and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.js ./

# Expose the port the app runs on
EXPOSE 3000

# Healthcheck to ensure client is responsive
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["node", "server.js"]
