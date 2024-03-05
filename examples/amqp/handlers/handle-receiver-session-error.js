const handleReceiverSessionError =
  ({ receiverName, connection }) =>
  (context) => {
    const sessionError = context.session?.error;
    if (sessionError) {
      console.log(
        ` [*] [${connection.id}] An error occurred for session of receiver '${receiverName}': ${sessionError}.`
      );
    }
  };

export { handleReceiverSessionError };
