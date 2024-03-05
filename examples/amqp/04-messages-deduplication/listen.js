import { createClient } from "redis";
import { ReceiverEvents } from "rhea-promise";
import { establishConnection } from "../connection/connection.js";
import {
  handleReceiverError,
  handleReceiverSessionError,
} from "../handlers/handlers.js";
import { handleMessage } from "./handle-message.js";

const { DEDUPLICATION_EXAMPLE_QUEUE = "deduplication_example_queue" } =
  process.env;

// The name displayed in the Connections tab in the ActiveMQ Web Console.
const RECEIVER_NAME = `receiver-${Math.random().toString(36).substring(2, 5)}`;
const connection = establishConnection({ containerId: RECEIVER_NAME });

const receiverOptions = {
  source: {
    address: DEDUPLICATION_EXAMPLE_QUEUE,
    durable: true,
  },
  // A 'prefetch' window controlling the flow of messages over this receiver.
  // Without this, the receiver would fetch several messages by default.
  credit_window: 1,
  onSessionError: handleReceiverSessionError({
    receiverName: RECEIVER_NAME,
    connection,
  }),
};

await connection.open();
const redisClient = await createClient().connect();

const receiver = await connection.createReceiver(receiverOptions);

receiver.on(ReceiverEvents.message, handleMessage(redisClient, { EX: 1 }));

receiver.on(
  ReceiverEvents.receiverError,
  handleReceiverError({ connection, receiverName: RECEIVER_NAME })
);

process.on("SIGINT", async () => {
  await receiver.close();
  await connection.close();
  await redisClient.quit();
  console.log(" [x] Connection closed. Exiting.");
  process.exit(0);
});

console.log(" [x] Listening for messages. To exit press CTRL+C");
