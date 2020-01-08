export enum userGlobalLobbyResponse {
    globalLobbyChatMessage = "globalLobbyChatMessage",
    publicRoomSearch = "publicRoomSearch",
    createNewPrivateRoom = "createNewPrivateRoom",
    connectToPrivateRoom = "connectToPrivateRoom"
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

export type publicLobbySearch = {
    messageType: string;
}

export type newPrivateRoom = {
    messageType: string;
}

export type connectToPrivateRoom = {
    messageType: string;
    roomId: string;
}