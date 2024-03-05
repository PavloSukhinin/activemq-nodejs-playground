const handleMessage = (context) => {
  console.log(` [*] Accepting message: ${context.message}`);
  context.delivery.accept();
};

export { handleMessage };
