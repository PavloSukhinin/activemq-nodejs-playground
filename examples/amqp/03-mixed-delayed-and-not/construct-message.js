const constructMessage = (text, deliveryDelayMs) => ({
  body: text,
  message_id: Math.random().toString(36),
  ...(deliveryDelayMs && {
    message_annotations: { "x-opt-delivery-delay": deliveryDelayMs },
  }),
});

export { constructMessage };
