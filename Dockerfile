FROM node:20-alpine AS deps  
WORKDIR /app

COPY package*.json ./
RUN npm ci


FROM node:20-alpine AS builder
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build


FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

ENV NODE_ENV=production
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
