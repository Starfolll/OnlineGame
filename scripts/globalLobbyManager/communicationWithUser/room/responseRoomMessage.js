"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IsRoomMessageValid {
    static GetValidChatMessage(message) {
        if (typeof message !== "object")
            return undefined;
        if (!message["messageType"] && message["messageType"] !== "roomChatMessage")
            return undefined;
        if (!message["message"] && typeof message["message"] !== "string")
            return undefined;
        return message;
    }
    static GetValidStartGameMessage(message) {
        if (typeof message !== "object")
            return undefined;
        if (!message["messageType"] && message["messageType"] !== "startGame")
            return undefined;
        return message;
    }
    static GetValidLeaveRoom(message) {
        if (typeof message !== "object")
            return undefined;
        if (!message["messageType"] && message["messageType"] !== "leaveRoom")
            return undefined;
        return message;
    }
    static GetValidRemoveUser(message) {
        if (typeof message !== "object")
            return undefined;
        if (!message["messageType"] && message["messageType"] !== "removeUserFromRoom")
            return undefined;
        if (!message["userId"] && typeof message["userId"] !== "string")
            return undefined;
        return message;
    }
}
exports.default = IsRoomMessageValid;
