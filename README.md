### PUBSUB SERVICE
- the high throughput pubsub service, written by node.js 
- to use this source :
    - install postgress
    - install rabbitmq
    - npm run build
    - npm run production
- to build docker image :
    - docker build --no-cache -t .
    - docker-compose up -d --force-recreate --no-deps

- docker-compose.yml sample :
    version: '3'
    services:
    core-bases-service: 
        image: xxx:TAG_yyy
        restart: always
        network_mode: "host"