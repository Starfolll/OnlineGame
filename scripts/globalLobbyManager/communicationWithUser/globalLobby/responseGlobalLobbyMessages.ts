import {globalLobbyChatMessage, publicLobbySearch, userInitialConnection} from "./responseGlobalLobbyMessages.types";

export default class IsLobbyMessageValid {
    public static GetValidUserInitialConnection(message: any): userInitialConnection | undefined {
        if (typeof message !== "object") return undefined;
        if (!message["messageType"] && message["messageType"] !== "userInitialConnection") return undefined;
        if (!message["token"] && typeof message["token"] !== "string") return undefined;
        if (!message["id"] && typeof message["id"] !== "string") return undefined;
        return message as userInitialConnection;
    }

    public static GetValidChatMessage(message: any): globalLobbyChatMessage | undefined {
        if (typeof message !== "object") return undefined;
        if (!message["messageType"] && message["messageType"] !== "globalLobbyChatMessage") return undefined;
        if (!message["message"] && typeof message["message"] !== "string") return undefined;
        return message as globalLobbyChatMessage;
    }

    public static GetValidPublicLobbySearch(message: any): publicLobbySearch | undefined {
        if (typeof message !== "object") return undefined;
        if (!message["messageType"] && message["messageType"] !== "publicLobbySearch") return undefined;
        return message as publicLobbySearch;
    }
}