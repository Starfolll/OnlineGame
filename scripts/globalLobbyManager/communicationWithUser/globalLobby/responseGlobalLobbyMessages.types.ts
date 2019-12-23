export enum userGlobalLobbyResponse {
    globalLobbyChatMessage = "globalLobbyChatMessage",
    publicLobbySearch = "publicLobbySearch"
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