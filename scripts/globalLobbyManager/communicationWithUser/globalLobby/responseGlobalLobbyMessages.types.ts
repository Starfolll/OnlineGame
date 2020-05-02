export enum userGlobalLobbyResponse {
   globalLobbyChatMessage = "globalLobbyChatMessage",
   publicRoomSearch = "publicRoomSearch",
   createNewPrivateRoom = "createNewPrivateRoom",
   connectToPrivateRoom = "connectToPrivateRoom",
   sendInviteToRoom = "sendInviteToRoom"
}

export type userInitialConnection = {
   messageType: string;
   token: string;
   id: string;
}

export type globalLobbyChatMessage = {
   messageType: string;
   message: string;
}

export type publicRoomSearch = {
   messageType: string;
}

export type newPrivateRoom = {
   messageType: string;
}

export type connectToPrivateRoom = {
   messageType: string;
   roomId: string;
}

export type sendInviteToRoom = {
   messageType: string;
   userId: string;
   roomId: string;
}
