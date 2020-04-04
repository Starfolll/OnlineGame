"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class IsLobbyMessageValid {
    static GetValidUserInitialConnection(message) {
        const validateSchema = joi_1.default.object({
            messageType: "userInitialConnection",
            token: joi_1.default.string().required(),
            id: joi_1.default.string().required()
        });
        return !!validateSchema.validate(message)["error"] ? undefined : message;
    }
    static GetValidChatMessage(message) {
        const validateSchema = joi_1.default.object({
            messageType: "globalLobbyChatMessage",
            message: joi_1.default.string().required(),
        });
        return !!validateSchema.validate(message)["error"] ? undefined : message;
    }
    static GetValidPublicRoomSearch(message) {
        const validateSchema = joi_1.default.object({
            messageType: "publicRoomSearch",
        });
        return !!validateSchema.validate(message)["error"] ? undefined : message;
    }
    static GetValidCreateNewPrivateRoom(message) {
        const validateSchema = joi_1.default.object({
            messageType: "createNewPrivateRoom",
        });
        return !!validateSchema.validate(message)["error"] ? undefined : message;
    }
    static GetValidConnectToPrivateRoom(message) {
        const validateSchema = joi_1.default.object({
            messageType: "connectToPrivateRoom",
            roomId: joi_1.default.string().required()
        });
        return !!validateSchema.validate(message)["error"] ? undefined : message;
    }
    static GetValidSendInviteToRoom(message) {
        const validateSchema = joi_1.default.object({
            messageType: "sendInviteToRoom",
            userId: joi_1.default.string().required(),
            roomId: joi_1.default.string().required()
        });
        return !!validateSchema.validate(message)["error"] ? undefined : message;
    }
}
exports.default = IsLobbyMessageValid;
