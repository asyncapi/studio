# Use a UUID as placeholder value to have a unique string to replace. 
ARG BASE_URL_PLACEHOLDER=189b303e-37a0-4f6f-8c0a-50333bc3c36e

FROM docker.io/library/node:16.13.2 as build

ARG BASE_URL_PLACEHOLDER

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY ./ ./
# Set the React PUBLIC_URL to our placeholder value so that
# that it can easily be replaced with the actual base URL
# in the entrypoint script below.
RUN PUBLIC_URL=${BASE_URL_PLACEHOLDER} npm run build

FROM docker.io/library/nginx:1.21.5-alpine as runtime

ARG BASE_URL_PLACEHOLDER
# The base Nginx image automatically executes all shell scripts 
# within the /docker-entrypoint.d/ directory ("entrypoint scripts")
# when the container is started. See the relevant logic at
# https://github.com/nginxinc/docker-nginx/blob/master/entrypoint/docker-entrypoint.sh#L16.
ARG ENTRYPOINT_SCRIPT=/docker-entrypoint.d/set-public-url.sh

COPY --from=build /build /usr/share/nginx/html/
# Add an entrypoint script that replaces all occurrences of the 
# placeholder value by the configured base URL. If no base URL
# is configured we assume the application is running at '/'.
RUN echo "find /usr/share/nginx/html/ -type f -print0 | xargs -0 sed -i \"s|${BASE_URL_PLACEHOLDER}|\${BASE_URL}|g\"" > $ENTRYPOINT_SCRIPT && chmod +x $ENTRYPOINT_SCRIPT

FROM runtime
