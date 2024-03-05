const handleMessage =
  (redisClient, { EX }) =>
  async (context) => {
    const { message_id: messageId } = context.message;
    const isDuplicate = await redisClient.get(messageId);

    if (isDuplicate) {
      console.log(
        ` [*] Message with ID ${messageId} is a duplicate. Accepting to remove it from queue.`
      );
      context.delivery.accept();
      return;
    }

    console.log(
      ` [*]  Storing in Redis and accepting message: ${context.message}`
    );
    await redisClient.set(messageId, messageId, { EX });
    context.delivery.accept();
  };

export { handleMessage };
