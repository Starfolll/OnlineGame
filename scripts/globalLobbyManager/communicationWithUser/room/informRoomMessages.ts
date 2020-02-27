import {chatMessageInfo} from "../../../utils/chat/chatMessage";
import {
    gameStart,
    newRoomChatMessage,
    privateRoomCreated, newRoomCreator,
    userConnectedToRoom,
    userRemovedFromRoom
} from "./informRoomMessages.types";
import {userPublicData} from "../../../models/user/user";
import {extendedRoomData, roomData} from "../../../models/room/room";

export default class GetRoomMessage {
    public static RoomChatMessage(message: chatMessageInfo): newRoomChatMessage {
        return {
            "messageType": "roomChatMessage",
            "message": message
        }
    }

    public static UserConnected(user: userPublicData): userConnectedToRoom {
        return {
            "messageType": "userConnectedToRoom",
            "user": user
        }
    }

    public static UserRemoved(userId: string): userRemovedFromRoom {
        return {
            "messageType": "userRemovedFromRoom",
            "userId": userId
        }
    }

    public static GameStart(tableId: string): gameStart {
        return {
            "messageType": "gameStart",
            "tableId": tableId
        }
    }

    public static PrivateRoomCreated(roomData: extendedRoomData): privateRoomCreated {
        return {
            "messageType": "privateRoomCreated",
            "roomData": roomData
        }
    }

    public static NewRoomCreator(creatorId: string): newRoomCreator {
        return {
            "messageType": "newRoomCreator",
            "creatorId": creatorId
        }
    }
}
