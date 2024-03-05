import {
  handleSenderError,
  handleSenderSessionError,
} from "../handlers/handlers.js";
import { establishConnection } from "../connection/connection.js";
import { constructMessage } from "./construct-message.js";

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

const message = constructMessage("This is delayed message", MESSAGE_DELAY_MS);
const delivery = sender.send(message);
console.log(` [x] Sent '${JSON.stringify(message)}'`);
console.log(
  ` [*] [${connection.id}] Delivery id: ${delivery.id}, settled: ${delivery.settled}`
);

const instantMessage = constructMessage("This is instant message");
const instantMessageDelivery = sender.send(instantMessage);
console.log(` [x] Sent '${JSON.stringify(instantMessage)}'`);
console.log(
  ` [*] [${connection.id}] Delivery id: ${instantMessageDelivery.id}, settled: ${instantMessageDelivery.settled}`
);

await sender.close();
await connection.close();
