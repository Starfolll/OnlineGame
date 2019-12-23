import {chatMessageInfo} from "../../../chat/chatMessage";
import {newRoomChatMessage, userConnectedToRoom, userRemovedFromRoom} from "./informRoomMessages.types";
import {userPublicData} from "../../../models/user/user";

export default class GetRoomMessage {
    public static RoomChatMessage(message: chatMessageInfo): newRoomChatMessage {
        return {
            "messageType": "roomChatMessage",
            "message": message
        }
    }

    public static UserConnected(user: userPublicData): userConnectedToRoom{
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
}