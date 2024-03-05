const handleSenderError =
  ({ senderName, connection }) =>
  (context) => {
    const senderError = context.sender?.error;
    if (senderError) {
      console.log(
        ` [*] [${connection.id}] An error occurred for sender '${senderName}': ${senderError}.`
      );
    }
  };

export { handleSenderError };
