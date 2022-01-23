FROM docker.io/library/node:16.13.2 as build
COPY ./ ./
RUN npm install && npm run build

FROM docker.io/library/nginx:1.21.5-alpine
COPY --from=build /build /usr/share/nginx/html/
