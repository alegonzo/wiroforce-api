FROM node:14-alpine
RUN apk update
RUN apk upgrade --available && sync
RUN apk add --no-cache make gcc python3 
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start:prod"]