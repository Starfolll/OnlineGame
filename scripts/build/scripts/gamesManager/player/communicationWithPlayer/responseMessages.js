"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseMessagesTypes_1 = require("./responseMessagesTypes");
class IsMessageValid {
    static GetValidPlayerInitialConnection(message) {
        if (typeof message !== "object")
            return undefined;
        if (!message["messageType"] && message["messageType"] !== "playerInitialConnection")
            return undefined;
        if (!message["name"] && typeof message["name"] !== "string")
            return undefined;
        if (!message["token"] && typeof message["token"] !== "string")
            return undefined;
        if (!message["id"] && typeof message["id"] !== "number")
            return undefined;
        if (!message["tableId"] && typeof message["tableId"] !== "number")
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
        if (!message["pickedOption"] && !responseMessagesTypes_1.initialHeroTurnOptions.has(message["pickedOption"]))
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
}
exports.IsMessageValid = IsMessageValid;
