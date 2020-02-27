"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GetGlobalLobbyMessage {
    static RedirectToGameTable(tableId) {
        return {
            "messageType": "redirectToGameTable", tableId
        };
    }
    static RedirectToRoom(roomData) {
        return {
            "messageType": "redirectToRoom", roomData
        };
    }
    static LobbyInfo(lobbyData) {
        return {
            "messageType": "lobbyInfo", lobbyData,
        };
    }
    static GlobalLobbyChatMessage(message) {
        return {
            "messageType": "globalLobbyChatMessage", message
        };
    }
    static FriendConnectedToLobby(friendId) {
        return {
            "messageType": "friendConnectedToLobby", friendId
        };
    }
    static FriendDisconnectedFromLobby(friendId) {
        return {
            "messageType": "friendDisconnectedFromLobby", friendId
        };
    }
    static FriendsConnectedToGame(friendsId) {
        return {
            "messageType": "friendsConnectedToGame", friendsId
        };
    }
}
exports.default = GetGlobalLobbyMessage;
