import {leaveRoom, removeUserFromRoom, roomChatMessage} from "./responseRoomMessage.types";

export default class IsRoomMessageValid {
    public static GetValidChatMessage(message: any): roomChatMessage | undefined {
        if (typeof message !== "object") return undefined;
        if (!message["messageType"] && message["messageType"] !== "roomChatMessage") return undefined;
        if (!message["message"] && typeof message["message"] !== "string") return undefined;
        return message as roomChatMessage;
    }

    public static GetValidLeaveRoom(message: any): leaveRoom | undefined {
        if (typeof message !== "object") return undefined;
        if (!message["messageType"] && message["messageType"] !== "leaveRoom") return undefined;
        return message as leaveRoom;
    }

    public static GetValidRemoveUser(message: any): removeUserFromRoom | undefined {
        if (typeof message !== "object") return undefined;
        if (!message["messageType"] && message["messageType"] !== "removeUserFromRoom") return undefined;
        if (!message["userId"] && typeof message["userId"] !== "string") return undefined;
        return message as removeUserFromRoom;
    }
}