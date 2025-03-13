FROM node:23-slim AS base

WORKDIR /app/bff

# get protobuf compiler
RUN apt-get update && \ 
    apt-get install -y protobuf-compiler

# setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Copy source code
COPY bff/package.json bff/pnpm-lock.yaml ./

# get prod dependencies for final stage
FROM base AS prod-deps
RUN pnpm install --prod --frozen-lockfile

# build app using dev dependencies
FROM base AS build
RUN pnpm install --frozen-lockfile

COPY proto ../proto
COPY bff ./

RUN pnpm run build

#  final stage
FROM base

COPY --from=prod-deps /app/bff/node_modules ./node_modules
COPY --from=build /app/bff/dist ./dist
EXPOSE 3003

ENTRYPOINT ["pnpm", "start"]
