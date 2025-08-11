# Stage 0: Base (libc for Next.js SWC on Alpine)
FROM node:20-alpine AS base
# Install libc6-compat for Alpine compatibility
RUN apk add --no-cache libc6-compat

# Stage 1: Dependencies
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies needed for build)
RUN npm ci

# Stage 2: Builder
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files (excluding node_modules, .git, .next)
COPY . .

# Set build-time environment variables
ARG NEXT_PUBLIC_AUTH_SERVICE_URL
ARG NEXT_PUBLIC_AI_SERVICE_URL
ARG NEXT_PUBLIC_PAYMENT_API_URL
ARG NEXT_PUBLIC_MONITORING_API_URL
ARG NEXT_PUBLIC_AI_API_KEY
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

ENV NEXT_PUBLIC_AUTH_SERVICE_URL=$NEXT_PUBLIC_AUTH_SERVICE_URL \
    NEXT_PUBLIC_AI_SERVICE_URL=$NEXT_PUBLIC_AI_SERVICE_URL \
    NEXT_PUBLIC_PAYMENT_API_URL=$NEXT_PUBLIC_PAYMENT_API_URL \
    NEXT_PUBLIC_MONITORING_API_URL=$NEXT_PUBLIC_MONITORING_API_URL \
    NEXT_PUBLIC_AI_API_KEY=$NEXT_PUBLIC_AI_API_KEY \
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

# Clean any existing build artifacts
RUN rm -rf .next

# Verify installation and show debug info
RUN echo "=== Working directory ===" && ls -la && \
    echo "=== Node.js version ===" && node --version && \
    echo "=== NPM version ===" && npm --version && \
    echo "=== Next.js version ===" && npx next --version

# Build the application
RUN npm run build

# Stage 3: Development
FROM base AS development
WORKDIR /app

# Copy node_modules and source files
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set development environment
ENV NODE_ENV=development \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Stage 4: Production
FROM base AS production
WORKDIR /app

# Create a non-root user to run the app
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder stage
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set proper permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Set production environment variables
ENV NODE_ENV=production \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["node", "server.js"] 