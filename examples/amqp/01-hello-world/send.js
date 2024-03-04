import { Connection } from "rhea-promise";

const {
  AMQP_HOST: host = "host",
  AMQP_USERNAME: username = "guest",
  AMQP_PASSWORD: password = "guest",
  AMQP_PORT,
  HELLO_QUEUE = "hello_queue",
} = process.env;

const port = parseInt(AMQP_PORT ?? "5672", 10);

const SENDER_NAME = "sender-1";

const connection = new Connection({
  host,
  username,
  password,
  port,
  container_id: SENDER_NAME,
  reconnect: false,
});

const senderOptions = {
  target: {
    address: HELLO_QUEUE,
  },
  onError: (context) => {
    const senderError = context.sender?.error;
    if (senderError) {
      console.log(
        ` [*] [${connection.id}] An error occurred for sender '${senderName}': ${senderError}.`
      );
    }
  },
  onSessionError: (context) => {
    const sessionError = context.session?.error;
    if (sessionError) {
      console.log(
        ` [*] [${connection.id}] An error occurred for session of sender '${senderName}': ${sessionError}.`
      );
    }
  },
};

await connection.open();
const sender = await connection.createSender(senderOptions);

const constructMessage = () => ({
  body: `Hello World ${new Date().toISOString()}!`,
  message_id: Math.random().toString(36),
});

const message = constructMessage();
console.log(` [x] Sent '${JSON.stringify(message)}'`);
const delivery = sender.send(message);
console.log(
  ` [*] [${connection.id}] Delivery id: ${delivery.id}, settled: ${delivery.settled}`
);

await sender.close();
await connection.close();
