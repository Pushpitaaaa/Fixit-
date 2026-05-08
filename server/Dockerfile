FROM node:18-bullseye-slim

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN apt-get update && apt-get install -y python3 build-essential make g++ && rm -rf /var/lib/apt/lists/* \
  && npm ci --only=production

COPY . .

RUN mkdir -p uploads data

EXPOSE 5000

CMD ["node", "server.js"]
