const handleMessage = (context) => {
  if (context.message.delivery_count >= 1) {
    // https://docs.oasis-open.org/amqp/core/v1.0/amqp-core-messaging-v1.0.html#:~:text=rejected%3A%20indicates%20an%20invalid%20and,and%20will%20not%20be
    console.log(` [*] Accepting message: ${context.message}`);
    context.delivery.accept();
  } else {
    console.log(` [*] Releasing message: ${context.message}`);
    context.delivery.release({ delivery_failed: true });
  }
};

export { handleMessage };
