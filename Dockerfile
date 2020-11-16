FROM node:10

WORKDIR /usr/local/luciana
COPY . ./
RUN npm install
EXPOSE 8000
CMD ["npm", "start"]
