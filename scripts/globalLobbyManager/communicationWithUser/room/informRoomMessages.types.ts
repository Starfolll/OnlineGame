import {chatMessageInfo} from "../../../chat/chatMessage";
import {userPublicData} from "../../../models/user/user";

export type newRoomChatMessage = {
    messageType: string;
    message: chatMessageInfo;
}

export type userConnectedToRoom = {
    messageType: string;
    user: userPublicData;
}

export type userRemovedFromRoom = {
    messageType: string;
    userId: string;
}
