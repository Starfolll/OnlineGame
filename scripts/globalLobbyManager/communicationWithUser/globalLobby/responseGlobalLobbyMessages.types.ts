export enum userGlobalLobbyResponse {
    chatMessage = "chatMessage",
}

export type userInitialConnection = {
    messageType: string;
    token: string;
    id: string;
}

export type lobbyChatMessage = {
    messageType: string;
    message: string;
}