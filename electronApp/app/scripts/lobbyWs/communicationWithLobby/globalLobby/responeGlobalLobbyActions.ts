interface sendMessage {
   message: string;
}

export type lobbyActions = {
   sendMessage: (actions: sendMessage) => void,
   createNewPrivateRoom: () => void,
   searchForPublicRoom: () => void,
   leaveRoom: () => void
}
