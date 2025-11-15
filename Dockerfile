# using multi-stage build for better building performance and reduced production image size
# 1. stage - transpile typescript to javascript
FROM node:22-alpine AS builder

WORKDIR /src

# Copy package.json and package-lock.json to the container
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# 2. stage - copy production build & run
FROM node:22-alpine
ENV NODE_ENV=production

WORKDIR /src

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /src/dist ./

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
