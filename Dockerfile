FROM --platform=linux/amd64 node:16

# Create app directory
WORKDIR /usr/src/app

RUN apt-get -y update && apt-get -y install

COPY package*.json ./
RUN yarn install

COPY . .
EXPOSE 1017

RUN npm install pm2 -g
RUN npm run build

CMD ["pm2-runtime", "start", "npm", "--name", "users-microservice", "--", "start", "--watch"]