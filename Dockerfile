FROM node:20.13.1-alpine3.18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

RUN npm run migration:run

CMD [ "npm", "start" ]


