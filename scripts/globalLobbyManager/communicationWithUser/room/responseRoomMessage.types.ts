export enum userRoomResponse {
    chatMessage = "roomChatMessage",
    leaveRoom = "leaveRoom",
    removeUserFromRoom = "removeUserFromRoom"
}

export type roomChatMessage = {
    messageType: string;
    message: string;
}

export type leaveRoom = {
    messageType: string;
}

export type removeUserFromRoom = {
    messageType: string;
    userId: string;
}