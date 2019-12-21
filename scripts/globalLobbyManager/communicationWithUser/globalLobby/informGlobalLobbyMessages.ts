import {
    globalLobbyInfo,
    newLobbyChatMessage,
    redirectToGameTable,
    redirectToRoom
} from "./informGlobalLobbyMessages.types";
import {extendedLobbyData} from "../../../models/lobby/lobby";
import {chatMessageInfo} from "../../../chat/chatMessage";

export default class GetGlobalLobbyMessage {
    public static RedirectToGameTable(tableId: string): redirectToGameTable {
        return {
            "messageType": "redirectToGameTable",
            "tableId": tableId
        }
    }

    public static RedirectToRoom(roomId: string): redirectToRoom {
        return {
            "messageType": "redirectToRoom",
            "tableId": roomId
        }
    }

    public static LobbyInfo(lobbyData: extendedLobbyData): globalLobbyInfo {
        return {
            "messageType": "lobbyInfo",
            "lobbyData": lobbyData,
        }
    }

    public static ChatMessage(message: chatMessageInfo): newLobbyChatMessage {
        return {
            "messageType": "chatMessage",
            "message": message
        }
    }
}