import {extendedLobbyData} from "../../../models/lobby/lobby";
import {chatMessageInfo} from "../../../chat/chatMessage";

export type redirectToGameTable = {
    messageType: string;
    tableId: string;
}

export type redirectToRoom = {
    messageType: string;
    tableId: string;
}

export type globalLobbyInfo = {
    messageType: string;
    lobbyData: extendedLobbyData;
}

export type newLobbyChatMessage = {
    messageType: string;
    message: chatMessageInfo;
}