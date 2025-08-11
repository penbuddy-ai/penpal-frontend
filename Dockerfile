# Stage 0: Base (libc for Next.js SWC on Alpine)
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat

# Stage 1: Dependencies
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies) for development
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
RUN npm ci

# Stage 2: Builder
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Stage 3: Development
FROM base AS development
WORKDIR /app

# Copy all files including node_modules for development
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set development environment
ENV NODE_ENV=development
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Stage 4: Production
FROM base AS production
WORKDIR /app

# Set to production environment
ENV NODE_ENV=production

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

EXPOSE 3000

# Set environment variables for runtime
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

CMD ["node", "server.js"] 