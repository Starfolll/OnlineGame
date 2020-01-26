"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseGameMessages_types_1 = require("./responseGameMessages.types");
class IsGameMessageValid {
    static GetValidPlayerInitialConnection(message) {
        if (typeof message !== "object")
            return undefined;
        if (!message["messageType"] && message["messageType"] !== "playerInitialConnection")
            return undefined;
        if (!message["token"] && typeof message["token"] !== "string")
            return undefined;
        if (!message["id"] && typeof message["id"] !== "string")
            return undefined;
        if (!message["tableId"] && typeof message["tableId"] !== "string")
            return undefined;
        return message;
    }
    static GetValidHeroPickedMessage(message) {
        if (typeof message !== "object")
            return undefined;
        if (!message["messageType"] && message["messageType"] !== "heroPicked")
            return undefined;
        if (!message["heroWeight"] && typeof message["heroWeight"] !== "number")
            return undefined;
        return message;
    }
    static GetValidInitialHeroTurnOptionPicked(message) {
        if (typeof message !== "object")
            return undefined;
        if (!message["messageType"] && message["messageType"] !== "initialHeroTurnOptionPicked")
            return undefined;
        if (!message["pickedOption"] && !responseGameMessages_types_1.initialHeroTurnOptions.has(message["pickedOption"]))
            return undefined;
        return message;
    }
    static GetValidInitialHeroCardPicked(message) {
        if (typeof message !== "object")
            return undefined;
        if (!message["messageType"] && message["messageType"] !== "initialHeroCardPicked")
            return undefined;
        if (!message["cardInGameId"] && typeof message["cardInGameId"] !== "number")
            return undefined;
        return message;
    }
    static GetValidHeroAbilityUsed(message) {
        if (typeof message !== "object")
            return undefined;
        if (!message["messageType"] && message["messageType"] !== "heroAbilityUsed")
            return undefined;
        if (!message["abilityData"])
            return undefined;
        return message;
    }
    static GetValidBuiltDistrict(message) {
        if (typeof message !== "object")
            return undefined;
        if (!message["messageType"] && message["messageType"] !== "builtDistrict")
            return undefined;
        if (!message["cardInGameId"] && typeof message["cardInGameId"] !== "number")
            return undefined;
        return message;
    }
    static GetValidBuildTurnMade(message) {
        if (typeof message !== "object")
            return undefined;
        if (!message["messageType"] && message["messageType"] !== "buildTurnMade")
            return undefined;
        return message;
    }
    static GetValidChatMessage(message, messageLengthLimit) {
        if (typeof message !== "object")
            return undefined;
        if (!message["messageType"] && message["messageType"] !== "chatMessage")
            return undefined;
        if (!message["message"] && typeof message["message"] !== "string")
            return undefined;
        if (message["message"].length > messageLengthLimit)
            return undefined;
        return message;
    }
}
exports.IsGameMessageValid = IsGameMessageValid;
