"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IsLobbyMessageValid {
    static GetValidUserInitialConnection(message) {
        if (typeof message !== "object")
            return undefined;
        if (!message["messageType"] && message["messageType"] !== "userInitialConnection")
            return undefined;
        if (!message["token"] && typeof message["token"] !== "string")
            return undefined;
        if (!message["id"] && typeof message["id"] !== "string")
            return undefined;
        return message;
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
        if (!message["messageType"] && message["messageType"] !== "publicLobbySearch")
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
}
exports.default = IsLobbyMessageValid;
