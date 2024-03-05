import { Connection } from "rhea-promise";

const {
  AMQP_HOST: host = "localhost",
  AMQP_USERNAME: username = "guest",
  AMQP_PASSWORD: password = "guest",
  AMQP_PORT,
} = process.env;

const port = parseInt(AMQP_PORT ?? "5672", 10);

const establishConnection = ({ containerId }) => {
  return new Connection({
    host,
    username,
    password,
    port,
    container_id: containerId,
    reconnect: true,
  });
};

export { establishConnection };
