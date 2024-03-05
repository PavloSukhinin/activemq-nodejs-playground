import {
  handleSenderError,
  handleSenderSessionError,
} from "../handlers/handlers.js";
import { establishConnection } from "../connection/connection.js";

const { DEDUPLICATION_EXAMPLE_QUEUE = "deduplication_example_queue" } =
  process.env;

const SENDER_NAME = "sender-1";

const connection = establishConnection({ container_id: SENDER_NAME });

const senderOptions = {
  target: {
    address: DEDUPLICATION_EXAMPLE_QUEUE,
    durable: true,
  },
  onError: handleSenderError({ connection, senderName: SENDER_NAME }),
  onSessionError: handleSenderSessionError({
    connection,
    senderName: SENDER_NAME,
  }),
};

await connection.open();
const sender = await connection.createSender(senderOptions);

const constructMessage = (text) => ({
  body: text,
  message_id: Math.random().toString(36),
});

const sendMessage = (message) => {
  sender.send(message);
  console.log(` [x] Sent '${JSON.stringify(message)}'`);

  return;
};

const message = constructMessage("This message will have duplicate.");
sendMessage(message);
sendMessage(message);

await sender.close();
await connection.close();
