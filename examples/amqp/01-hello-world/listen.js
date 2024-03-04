import { Connection, ReceiverEvents } from "rhea-promise";

const {
  AMQP_HOST: host = "host",
  AMQP_USERNAME: username = "guest",
  AMQP_PASSWORD: password = "guest",
  AMQP_PORT,
  HELLO_QUEUE: helloQueue = "hello_queue",
} = process.env;

const port = parseInt(AMQP_PORT ?? "5672", 10);

// The name displayed in the Connections tab in the ActiveMQ Web Console.
const RECEIVER_NAME = `receiver-${Math.random().toString(36).substring(2, 5)}`;

const connection = new Connection({
  host,
  username,
  password,
  port,
  reconnect: true,
  container_id: RECEIVER_NAME,
});

const receiverOptions = {
  source: {
    address: helloQueue,
  },
  onSessionError: (context) => {
    const sessionError = context.session?.error;
    if (sessionError) {
      console.log(
        ` [*] [${connection.id}] An error occurred for session of receiver '${RECEIVER_NAME}': ${sessionError}.`
      );
    }
  },
};

await connection.open();
const receiver = await connection.createReceiver(receiverOptions);
receiver.on(ReceiverEvents.message, (context) => {
  if (context.message.delivery_count >= 1) {
    // https://docs.oasis-open.org/amqp/core/v1.0/amqp-core-messaging-v1.0.html#:~:text=rejected%3A%20indicates%20an%20invalid%20and,and%20will%20not%20be
    console.log(` [*] Accepting message: ${context.message}`);
    context.delivery.accept();
  } else {
    console.log(` [*] Releasing message: ${context.message}`);
    context.delivery.release({ delivery_failed: true });
  }
});
receiver.on(ReceiverEvents.receiverError, (context) => {
  const receiverError = context.receiver?.error;
  if (receiverError) {
    console.log(
      ` [*] [${connection.id}] An error occurred for receiver '${RECEIVER_NAME}': ${receiverError}.`
    );
  }
});

process.on("SIGINT", async () => {
  await receiver.close();
  await connection.close();
  console.log(" [x] Connection closed. Exiting.");
  process.exit(0);
});

console.log(" [x] Listening for messages. To exit press CTRL+C");
