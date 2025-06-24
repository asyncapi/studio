# Use UUIDs as placeholder values to have a unique strings to replace. 
ARG BASE_URL_PLACEHOLDER=189b303e-37a0-4f6f-8c0a-50333bc3c36e
ARG BASE_PATH_PLACEHOLDER=/b9ca70d1-7ebf-418a-967a-87500ff31894


FROM node:18-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN npm install --global turbo@1
COPY . .
RUN turbo prune --scope=@asyncapi/studio --docker
 
# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer

ARG BASE_URL_PLACEHOLDER
ARG BASE_PATH_PLACEHOLDER

RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN npm install --global pnpm@latest-10

# First install the dependencies (as they change less often)

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
RUN PUPPETEER_SKIP_DOWNLOAD=true pnpm install

# Build the project
COPY --from=builder /app/out/full/ .
RUN PUBLIC_URL=${BASE_URL_PLACEHOLDER} NEXT_BASE_PATH=${BASE_PATH_PLACEHOLDER} NEXT_CONFIG_OUTPUT=export pnpm run build:studio
 

FROM docker.io/library/nginx:1.25.5-alpine AS runtime

ARG BASE_URL_PLACEHOLDER
ARG BASE_PATH_PLACEHOLDER
# The base Nginx image automatically executes all shell scripts 
# within the /docker-entrypoint.d/ directory ("entrypoint scripts")
# when the container is started. See the relevant logic at
# https://github.com/nginxinc/docker-nginx/blob/master/entrypoint/docker-entrypoint.sh#L16.
ARG ENTRYPOINT_SCRIPT=/docker-entrypoint.d/set-public-url.sh

COPY --from=installer --chown=nginx:nginx /app/apps/studio/build /usr/share/nginx/html/
# Add an entrypoint script that replaces all occurrences of the 
# placeholder values by the configured base URL. If no base URL
# is configured we assume the application is running at '/'.
RUN echo "find /usr/share/nginx/html/ -type f -print0 | xargs -0 sed -i \"s|${BASE_URL_PLACEHOLDER}|\${BASE_URL}|g\"" >> $ENTRYPOINT_SCRIPT && \
    echo "find /usr/share/nginx/html/ -type f -print0 | xargs -0 sed -i \"s|${BASE_PATH_PLACEHOLDER}|\${BASE_URL}|g\"" >> $ENTRYPOINT_SCRIPT && \
    chmod +x $ENTRYPOINT_SCRIPT

FROM runtime
