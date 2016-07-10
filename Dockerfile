FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY index.js /usr/src/app

#EXPOSE 8080
CMD [ "npm", "start" ]

# Mongo db
#docker run --name mongodb -d mongo

# link app to the mongodb
#docker run --name yc-news-mail --link mongodb:mongo -d icadariu/node-app

# mongo express
# docker run --link mongodb:mongo -p 8081:8081 mongo-express
