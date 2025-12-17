FROM node:20-alpine AS builder

WORKDIR /app

# Copy root files needed for context
COPY package*.json ./
COPY prisma ./prisma/

# Install root dependencies (for shared tools if any, but mainly to cache layer)
RUN npm ci

# Setup backend
WORKDIR /app/backend
COPY backend/package*.json ./

# Install backend dependencies
RUN npm ci

# Copy backend source
COPY backend/ .
COPY tsconfig.json ../

# Generate Prisma Client
# The schema is in ../prisma/schema.prisma
RUN npx prisma generate --schema=../prisma/schema.prisma

# Build NestJS app
RUN npm run build

# Runner Stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built assets and dependencies
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/package.json ./
# Copy Prisma client if it was generated into root node_modules or backend node_modules
# Usually it's in the node_modules where prisma is installed.
# If backend has @prisma/client, it should be in backend/node_modules.

EXPOSE 3001

CMD ["node", "dist/main"]
