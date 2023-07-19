FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Install the dependencies
RUN apk add --update --no-cache python3 make g++ && \
    apk update && apk add --no-cache git openssh-client ca-certificates && \
    git config --global url."https://".insteadOf git://

ENV PYTHON /usr/bin/python3

# Copy package.json and yarn.lock to the working directory
COPY package*.json yarn.lock ./

# Clean yarn cache and install dependencies
RUN yarn cache clean && yarn install

# Copy the app's source code to the working directory
COPY . .

# Build the React app
ENV NODE_OPTIONS=--max_old_space_size=4096
RUN yarn build

# Expose the container's port
EXPOSE 3000

# Set the command to run when the container starts
CMD ["yarn", "start"]
