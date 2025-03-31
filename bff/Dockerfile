FROM node:23-slim AS base

WORKDIR /app

# setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
# get protobuf compiler
RUN apt-get update && \ 
    apt-get install -y protobuf-compiler

# copy source code
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY proto ./proto
COPY bff ./bff

# build the app and get the prod deps
WORKDIR /app/bff
RUN pnpm install --frozen-lockfile
RUN pnpm run build
RUN pnpm --filter=bff --prod --legacy deploy /prod

# build the final image
FROM base
COPY --from=build /prod ./
EXPOSE 3003

ENTRYPOINT ["pnpm", "start"]
