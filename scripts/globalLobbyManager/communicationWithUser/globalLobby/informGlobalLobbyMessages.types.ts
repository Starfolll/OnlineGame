import {extendedLobbyData} from "../../../models/lobby/lobby";
import {lobbyChatMessageInfo} from "../../../chat/lobbyChatMessage";

export type globalLobbyInfo = {
    messageType: string;
    lobbyData: extendedLobbyData;
}

export type newLobbyChatMessage = {
    messageType: string;
    message: lobbyChatMessageInfo;
}