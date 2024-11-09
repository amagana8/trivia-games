FROM node:20.15.0 AS base

WORKDIR /app

# get protobuf compiler
RUN apt-get update && \ 
    apt-get install -y protobuf-compiler

# setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Copy source code
COPY proto ./proto
COPY ./bff ./bff

WORKDIR /app/bff

# get prod dependencies for final stage
FROM base AS prod-deps
RUN pnpm install --prod --frozen-lockfile

# build app using dev dependencies
FROM base AS build
RUN pnpm install --frozen-lockfile && \
    pnpm run build

#  final stage
FROM base

COPY --from=prod-deps /app/bff/node_modules /app/node_modules
COPY --from=build /app/bff/dist /app/dist
EXPOSE 3003

CMD ["pnpm", "start:prod"]
