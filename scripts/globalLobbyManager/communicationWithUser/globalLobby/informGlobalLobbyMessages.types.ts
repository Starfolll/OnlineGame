import {extendedLobbyData} from "../../../models/lobby/lobby";
import {chatMessageInfo} from "../../../utils/chat/chatMessage";
import {extendedRoomData} from "../../../models/room/room";

export type redirectToGameTable = {
    messageType: string;
    tableId: string;
}

export type redirectToRoom = {
    messageType: string;
    room: extendedRoomData;
}

export type globalLobbyInfo = {
    messageType: string;
    lobbyData: extendedLobbyData;
}

export type newLobbyChatMessage = {
    messageType: string;
    message: chatMessageInfo;
}