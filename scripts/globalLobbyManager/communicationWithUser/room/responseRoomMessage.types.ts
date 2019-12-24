export enum userRoomResponse {
    chatMessage = "roomChatMessage",
    leaveRoom = "leaveRoom"
}

export type roomChatMessage = {
    messageType: string;
    message: string;
}

export type leaveRoom = {
    messageType: string;
}