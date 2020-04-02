"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class IsLobbyMessageValid {
    static GetValidUserInitialConnection(message) {
        const m = joi_1.default.object({
            messageType: "userInitialConnection",
            token: joi_1.default.string(),
            id: joi_1.default.string()
        });
        console.log(m.validate(message));
        return !!m.validate(message)["error"] ? undefined : message;
    }
    static GetValidChatMessage(message) {
        if (typeof message !== "object")
            return undefined;
        if (!message["messageType"] && message["messageType"] !== "globalLobbyChatMessage")
            return undefined;
        if (!message["message"] && typeof message["message"] !== "string")
            return undefined;
        return message;
    }
    static GetValidPublicRoomSearch(message) {
        if (typeof message !== "object")
            return undefined;
        if (!message["messageType"] && message["messageType"] !== "publicRoomSearch")
            return undefined;
        return message;
    }
    static GetValidCreateNewPrivateRoom(message) {
        if (typeof message !== "object")
            return undefined;
        if (!message["messageType"] && message["messageType"] !== "createNewPrivateRoom")
            return undefined;
        return message;
    }
    static GetValidConnectToPrivateRoom(message) {
        if (typeof message !== "object")
            return undefined;
        if (!message["messageType"] && message["messageType"] !== "connectToPrivateRoom")
            return undefined;
        if (!message["roomId"] && typeof message["roomId"] !== "string")
            return undefined;
        return message;
    }
    static GetValidSendInviteToRoom(message) {
        if (typeof message !== "object")
            return undefined;
        if (!message["messageType"] && message["messageType"] !== "sendInviteToRoom")
            return undefined;
        if (!message["userId"] && typeof message["userId"] !== "string")
            return undefined;
        if (!message["roomId"] && typeof message["roomId"] !== "string")
            return undefined;
        return message;
    }
}
exports.default = IsLobbyMessageValid;
