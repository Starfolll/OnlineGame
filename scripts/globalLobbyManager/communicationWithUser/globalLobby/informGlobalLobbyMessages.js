"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GetGlobalLobbyMessage {
    static RedirectToGameTable(tableId) {
        return {
            "messageType": "redirectToGameTable",
            "tableId": tableId
        };
    }
    static RedirectToRoom(room) {
        return {
            "messageType": "redirectToRoom",
            "room": room
        };
    }
    static LobbyInfo(lobbyData) {
        return {
            "messageType": "lobbyInfo",
            "lobbyData": lobbyData,
        };
    }
    static GlobalLobbyChatMessage(message) {
        return {
            "messageType": "globalLobbyChatMessage",
            "message": message
        };
    }
}
exports.default = GetGlobalLobbyMessage;
