FROM node:18-alpine as base

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN npm install --global pnpm@9.0.6
RUN npm install --global turbo
COPY . .
