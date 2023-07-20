FROM node:14-buster-slim

WORKDIR /app

RUN apt-get update && apt-get install -y python3 make g++ git openssh-client ca-certificates && \
    git config --global url."https://".insteadOf git:// && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get clean

ENV PYTHON /usr/bin/python3

COPY package*.json yarn.lock ./

RUN yarn cache clean && yarn install

COPY . .

ENV NODE_OPTIONS=--max_old_space_size=3072
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
