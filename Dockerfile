FROM node:16.6-alpine AS builder
WORKDIR /src
COPY ./package.json .
RUN npm install
#app
FROM node:16.6-alpine
WORKDIR /app
COPY --from=builder /src/node_modules/ /app/node_modules/
COPY ./inform-event.js .
CMD ["node", "inform-event.js"]