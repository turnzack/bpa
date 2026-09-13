# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Production Stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/dist ./dist

# Install ffmpeg if needed for video processing features
# RUN apk add --no-cache ffmpeg

EXPOSE 4000

CMD ["node", "dist/server.js"]
