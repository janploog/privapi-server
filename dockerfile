# The image is built on top of one that has node preinstalled
FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .


# Open appropriate port 
EXPOSE 5000

# Start the application
CMD [ "node", "server.js" ]