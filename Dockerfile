FROM node:16 as build
COPY ./ ./
RUN npm install && npm run build

FROM nginx:1.21.5
COPY --from=build /build /usr/share/nginx/html/
