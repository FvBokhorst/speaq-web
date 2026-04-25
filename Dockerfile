# Cache-buster 2026-04-25T17:22 - C2.2 ratchet-derived call signaling key.
# Switched alpine -> debian-slim because Next.js 16 Turbopack needs glibc-bound
# native bindings (@next/swc-linux-x64-gnu); alpine ships only musl which
# breaks the build with "Turbopack is not supported on this platform".
FROM node:22-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 8080
CMD ["node", "server.js"]
