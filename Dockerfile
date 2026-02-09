FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Development
FROM base AS development
EXPOSE 3000
CMD ["bun", "--hot", "src/serve.ts"]

# Build
FROM base AS build
RUN bun run build

# Production
FROM oven/bun:1-slim AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
EXPOSE 3000
CMD ["bun", "run", "dist/handler/entry-server.js"]
