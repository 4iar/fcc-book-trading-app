export function sendNotification(status, message) {
  return {
    type: 'SEND_NOTIFICATION',
    payload: {
      status,
      message
    }
  };
}
