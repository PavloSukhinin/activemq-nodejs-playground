# ActiveMQ playground

Prerequisites:
- Node.js version 20.x
- npm version 10.x
- Docker version 20.10+
- Docker compose version 1.29+

- Install packages 
  - `npm i`
- Make a copy of a `.env.example` file and name it `.env`. 
- Start ActiveMQ
  - `docker-compose up -d`
- Verify that it's running
  - open [ActiveMQ management panel](http://localhost:8161)
  - default credentials are:
    - Username: `admin`
    - Password: `admin`

### Hello world
- start consumer
  - `npm run 01:listen`
- open another shell/terminal and send message with
  - `npm run 01:send`
  - you can run this command several times to send new messages

In this example consumer releases the first message delivery and accepts it on second try. 