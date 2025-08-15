# Multi-stage Dockerfile for EchoPub Frontend
# Stage 1: Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY packages/vue-admin/package*.json ./packages/vue-admin/

# Install ALL dependencies (including devDependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the Vue.js application
WORKDIR /app/packages/vue-admin
RUN npm run build

# Stage 2: Production stage
FROM nginx:alpine AS production

# Copy built application from builder stage
COPY --from=builder /app/packages/vue-admin/dist /usr/share/nginx/html

COPY ./.docker/start.sh /usr/local/bin/start.sh
COPY nginx.conf /etc/nginx/nginx.conf
RUN chmod +x /usr/local/bin/start.sh

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

# Start nginx
CMD ["sh", "/usr/local/bin/start.sh"]
