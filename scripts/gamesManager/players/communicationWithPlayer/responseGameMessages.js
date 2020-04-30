"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseGameMessages_types_1 = require("./responseGameMessages.types");
const joi_1 = __importDefault(require("joi"));
class IsGameMessageValid {
    static GetValidPlayerInitialConnection(message) {
        const validateSchema = joi_1.default.object({
            messageType: "playerInitialConnection",
            token: joi_1.default.string().required(),
            id: joi_1.default.string().required(),
            tableId: joi_1.default.string().required()
        });
        return !!validateSchema.validate(message)["error"] ? undefined : message;
    }
    static GetValidHeroPickedMessage(message) {
        const validateSchema = joi_1.default.object({
            messageType: "heroPicked",
            heroWeight: joi_1.default.number().required()
        });
        return !!validateSchema.validate(message)["error"] ? undefined : message;
    }
    static GetValidInitialHeroTurnOptionPicked(message) {
        const validateSchema = joi_1.default.object({
            messageType: "initialHeroTurnOptionPicked",
            pickedOption: joi_1.default.string().required()
        });
        if (!!validateSchema.validate(message)["error"])
            return undefined;
        if (!responseGameMessages_types_1.initialHeroTurnOptions.has(message["pickedOption"]))
            return undefined;
        return message;
    }
    static GetValidInitialHeroCardPicked(message) {
        const validateSchema = joi_1.default.object({
            messageType: "initialHeroCardPicked",
            cardInGameId: joi_1.default.number().required()
        });
        return !!validateSchema.validate(message)["error"] ? undefined : message;
    }
    static GetValidHeroAbilityUsed(message) {
        const validateSchema = joi_1.default.object({
            messageType: "heroAbilityUsed",
            abilityData: joi_1.default.required()
        });
        return !!validateSchema.validate(message)["error"] ? undefined : message;
    }
    static GetValidBuiltDistrict(message) {
        const validateSchema = joi_1.default.object({
            messageType: "buildDistrict",
            cardInGameId: joi_1.default.number().required()
        });
        return !!validateSchema.validate(message)["error"] ? undefined : message;
    }
    static GetValidChatMessage(message, messageLengthLimit) {
        const validateSchema = joi_1.default.object({
            messageType: "chatMessage",
            message: joi_1.default.string().max(messageLengthLimit).required()
        });
        return !!validateSchema.validate(message)["error"] ? undefined : message;
    }
}
exports.IsGameMessageValid = IsGameMessageValid;
