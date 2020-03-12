interface sendMessage {
   message: string;
}

export type lobbyActions = {
   sendMessage: (actions: sendMessage) => void,
   createNewPrivateRoom: () => void,
   searchForPublicRoom: () => void,
   leaveRoom: () => void,
   inviteFriendToRoom: (userId: string, roomId: string) => void,
   connectToPrivateRoom: (roomId: string) => void,
   startGame: () => void
}
