const handleReceiverError =
  ({ receiverName, connection }) =>
  (context) => {
    const receiverError = context.receiver?.error;
    if (receiverError) {
      console.log(
        ` [*] [${connection.id}] An error occurred for receiver '${receiverName}': ${receiverError}.`
      );
    }
  };

export { handleReceiverError };
