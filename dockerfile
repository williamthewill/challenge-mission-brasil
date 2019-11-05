FROM node:8-slim

WORKDIR /usr/challenge
COPY package.json .

RUN npm install
RUN yarn run tsc
COPY . .
RUN yarn run tsc

EXPOSE 3000

CMD ["node", "./dist/src/index.js"]