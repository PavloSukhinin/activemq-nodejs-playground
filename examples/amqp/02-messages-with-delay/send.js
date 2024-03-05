import {
  handleSenderError,
  handleSenderSessionError,
} from "../handlers/handlers.js";
import { establishConnection } from "../connection/connection.js";

const { DELAYED_QUEUE = "delayed_queue" } = process.env;

const MESSAGE_DELAY_MS = 5000;

const SENDER_NAME = "sender-1";

const connection = establishConnection({ container_id: SENDER_NAME });

const senderOptions = {
  target: {
    durable: true,
    address: DELAYED_QUEUE,
  },
  onError: handleSenderError({ connection, senderName: SENDER_NAME }),
  onSessionError: handleSenderSessionError({
    connection,
    senderName: SENDER_NAME,
  }),
};

await connection.open();
const sender = await connection.createSender(senderOptions);

const constructMessage = () => ({
  body: `Hello World ${new Date().toISOString()}!`,
  message_id: Math.random().toString(36),
  // This adds a delay to the message
  message_annotations: { "x-opt-delivery-delay": MESSAGE_DELAY_MS },
});

const message = constructMessage();
const delivery = sender.send(message);
console.log(` [x] Sent '${JSON.stringify(message)}'`);
console.log(
  ` [*] [${connection.id}] Delivery id: ${delivery.id}, settled: ${delivery.settled}`
);

await sender.close();
await connection.close();
