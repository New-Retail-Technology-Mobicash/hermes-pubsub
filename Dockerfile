FROM node:8.11-alpine
RUN apk update && apk add --no-cache make gcc g++ python git

WORKDIR /app/src
COPY . /app/src/
RUN cd /app/src && yarn
RUN npm run build

#Expose the port
EXPOSE 9100

CMD ["npm", "run", "production"]