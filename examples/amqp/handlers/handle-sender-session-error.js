const handleSenderSessionError =
  ({ senderName, connection }) =>
  (context) => {
    const sessionError = context.session?.error;
    if (sessionError) {
      console.log(
        ` [*] [${connection.id}] An error occurred for session of sender '${senderName}': ${sessionError}.`
      );
    }
  };

export { handleSenderSessionError };
