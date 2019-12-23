import {roomChatMessage} from "./responseRoomMessage.types";

export default class IsRoomMessageValid {
    public static GetValidChatMessage(message: any): roomChatMessage | undefined {
        if (typeof message !== "object") return undefined;
        if (!message["messageType"] && message["messageType"] !== "roomChatMessage") return undefined;
        if (!message["message"] && typeof message["message"] !== "string") return undefined;
        return message as roomChatMessage;
    }
}