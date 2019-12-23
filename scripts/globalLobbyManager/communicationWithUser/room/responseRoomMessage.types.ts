export enum userRoomResponse {
    chatMessage = "roomChatMessage",
}

export type roomChatMessage = {
    messageType: string;
    message: string;
}