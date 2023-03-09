FROM --platform=linux/amd64 node:16

# Create app directory
WORKDIR /usr/src/app

RUN --mount=type=cache,target=/var/cache/apt apt-get -y update && apt-get -y install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb

COPY package*.json ./
RUN --mount=type=cache,target=/var/cache/yarn yarn config set cache-folder /var/cache/yarn && yarn install

COPY . .
EXPOSE 1017

RUN npm install pm2 -g
RUN npm run build

CMD ["pm2-runtime", "start", "npm", "--name", "users-microservice", "--", "start", "--watch"]