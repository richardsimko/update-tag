FROM node:alpine

COPY . .

RUN yarn install

ENTRYPOINT ["node", "/src/main.js"]
