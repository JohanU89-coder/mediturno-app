FROM node:20-bookworm-slim AS build

WORKDIR /app/src/backend

COPY src/backend/package.json src/backend/package-lock.json ./
RUN npm ci

COPY src/backend ./
COPY src/frontend ./public

RUN JWT_SECRET=build-time-test-secret npm test
RUN npm prune --omit=dev

FROM node:20-bookworm-slim AS runtime

ENV NODE_ENV=production
ENV PORT=5000

WORKDIR /app/src/backend

COPY --from=build --chown=node:node /app/src/backend ./

USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD node -e "require('http').get('http://127.0.0.1:5000/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["npm", "start"]
