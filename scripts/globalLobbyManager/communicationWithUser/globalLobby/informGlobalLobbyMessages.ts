import {
    globalLobbyInfo,
    newLobbyChatMessage,
    redirectToGameTable,
    redirectToRoom
} from "./informGlobalLobbyMessages.types";
import {extendedLobbyData} from "../../../models/lobby/lobby";
import {chatMessageInfo} from "../../../utils/chat/chatMessage";
import {extendedRoomData} from "../../../models/room/room";

export default class GetGlobalLobbyMessage {
    public static RedirectToGameTable(tableId: string): redirectToGameTable {
        return {
            "messageType": "redirectToGameTable",
            "tableId": tableId
        }
    }

    public static RedirectToRoom(room: extendedRoomData): redirectToRoom {
        return {
            "messageType": "redirectToRoom",
            "room": room
        }
    }

    public static LobbyInfo(lobbyData: extendedLobbyData): globalLobbyInfo {
        return {
            "messageType": "lobbyInfo",
            "lobbyData": lobbyData,
        }
    }

    public static GlobalLobbyChatMessage(message: chatMessageInfo): newLobbyChatMessage {
        return {
            "messageType": "globalLobbyChatMessage",
            "message": message
        }
    }
}