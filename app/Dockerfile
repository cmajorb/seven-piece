FROM node
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install nodemon -g
RUN npm install
COPY . .
EXPOSE 8000
CMD [ "nodemon", "app.js" ]
