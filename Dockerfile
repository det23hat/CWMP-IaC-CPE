#app
FROM node:16.6-alpine
WORKDIR /app
COPY ./inform-event.js .
CMD ["node", "inform-event.js"]