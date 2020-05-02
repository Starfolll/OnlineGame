"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GetRoomMessage {
    static RoomChatMessage(message) {
        return {
            "messageType": "roomChatMessage",
            "message": message
        };
    }
    static UserConnected(user) {
        return {
            "messageType": "userConnectedToRoom",
            "user": user
        };
    }
    static UserRemoved(userId) {
        return {
            "messageType": "userRemovedFromRoom",
            "userId": userId
        };
    }
    static GameStart(tableId) {
        return {
            "messageType": "gameStart",
            "tableId": tableId
        };
    }
    static PrivateRoomCreated(roomData) {
        return {
            "messageType": "privateRoomCreated",
            "roomData": roomData
        };
    }
    static NewRoomCreator(creatorId) {
        return {
            "messageType": "newRoomCreator",
            "creatorId": creatorId
        };
    }
}
exports.default = GetRoomMessage;
