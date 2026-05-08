FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ENV HOST=0.0.0.0
EXPOSE 3000

CMD ["npm", "start"]
