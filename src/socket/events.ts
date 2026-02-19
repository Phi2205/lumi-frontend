export const SocketEvents = {
  // comment
  JOIN_POST: "join_post",
  NEW_COMMENT: "new_comment",
  DELETE_COMMENT: "delete_comment",

  // message
  SEND_MESSAGE: "send_message",
  RECEIVE_MESSAGE: "receive_message",

  // notification
  RECEIVE_NOTIFICATION: "receive_notification",
} as const;
