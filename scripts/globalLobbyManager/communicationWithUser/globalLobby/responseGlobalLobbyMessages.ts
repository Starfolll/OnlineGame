import {lobbyChatMessage, userInitialConnection} from "./responseGlobalLobbyMessages.types";

export default class IsLobbyMessageValid {
    public static GetValidUserInitialConnection(message: any): userInitialConnection | undefined {
        if (typeof message !== "object") return undefined;
        if (!message["messageType"] && message["messageType"] !== "userInitialConnection") return undefined;
        if (!message["token"] && typeof message["token"] !== "string") return undefined;
        if (!message["id"] && typeof message["id"] !== "string") return undefined;
        return message as userInitialConnection;
    }

    public static GetValidChatMessage(message: any): lobbyChatMessage | undefined {
        if (typeof message !== "object") return undefined;
        if (!message["messageType"] && message["messageType"] !== "chatMessage") return undefined;
        if (!message["message"] && typeof message["message"] !== "string") return undefined;
        return message as lobbyChatMessage;
    }
}