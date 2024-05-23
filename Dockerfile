FROM node:20.13.1-alpine3.18

WORKDIR /usr/src/app

COPY package*.json ./

RUN NODE_ENV=development npm install && npm --global install nodemon

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]