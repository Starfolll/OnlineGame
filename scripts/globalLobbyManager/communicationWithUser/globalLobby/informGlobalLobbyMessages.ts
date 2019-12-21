import {globalLobbyInfo, newLobbyChatMessage, redirectToGameTable} from "./informGlobalLobbyMessages.types";
import {extendedLobbyData} from "../../../models/lobby/lobby";
import {chatMessageInfo} from "../../../chat/chatMessage";

export default class GetGlobalLobbyMessage {
    public static RedirectToGameTable(tableId: string): redirectToGameTable {
        return {
            "messageType": "redirectToGameTable",
            "tableId": tableId
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