# ActiveMQ Classic playground

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

To stop and remove docker containers run `docker-compose down`.

### Hello world

[example source](./examples/amqp/01-hello-world/)

- start consumer
  - `npm run 01:listen`
  - you can start several consumers running this command in different shell instances to see how messages are distributed between them.
- open another shell/terminal and send message with
  - `npm run 01:send`
  - you can run this command several times to send new messages

In this example consumer releases the first message delivery and accepts it on second try. 

### Send messages with delay

[example source](./examples/amqp/02-messages-with-delay/)

- start consumer
  - `npm run 02:listen`
- open another shell/terminal and send message with
  - `npm run 02:send`
  - you can run this command several times to send new messages

The messages scheduler is enabled by setting the broker schedulerSupport attribute to true in the [broker config](./broker.config.xml)
```
<broker xmlns="http://activemq.apache.org/schema/core" schedulerSupport="true" brokerName="localhost" dataDirectory="${activemq.data}">
```
The delay instructions are controlled with `x-opt-delivery-delay` headers. In this example, it's set to 5 seconds; you can control it through the `MESSAGE_DELAY_MS` value.

More about [Scheduling Messages with ActiveMQ](https://activemq.apache.org/components/classic/documentation/delay-and-schedule-message-delivery)

### The mix of delayed and instant messages

[example source](./examples/amqp/03-mixed-delayed-and-not/)

- start consumer
  - `npm run 03:listen`
- open another shell/terminal and send message with
  - `npm run 03:send`
  - you can run this command several times to send new messages

Extends the previous example and sends two messages - delayed and instant.

### Message deduplication

[example source]('./examples/amqp/04-messages-deduplication/)

- start consumer
  - `npm run 04:listen`
- open another shell/terminal and send message with
  - `npm run 04:send`
  - you can run this command several times to send new messages

In this example, a consumer uses Redis to store message IDs for 1 second. The message is considered duplicate when its ID is in this cache. Classic ActiveMQ does not have a built-in feature for message deduplication (ActiveMQ Artemis has it).
Review [handle-message.js file](./examples/amqp/04-messages-deduplication/handle-message.js) to see how it's handled.
