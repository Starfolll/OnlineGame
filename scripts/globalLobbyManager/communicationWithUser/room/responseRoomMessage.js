"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class IsRoomMessageValid {
    static GetValidChatMessage(message) {
        const validateSchema = joi_1.default.object({
            messageType: "roomChatMessage",
            message: joi_1.default.string().required()
        });
        return !!validateSchema.validate(message)["error"] ? undefined : message;
    }
    static GetValidStartGameMessage(message) {
        const validateSchema = joi_1.default.object({
            messageType: "startGame",
        });
        return !!validateSchema.validate(message)["error"] ? undefined : message;
    }
    static GetValidLeaveRoom(message) {
        const validateSchema = joi_1.default.object({
            messageType: "leaveRoom",
        });
        return !!validateSchema.validate(message)["error"] ? undefined : message;
    }
    static GetValidRemoveUser(message) {
        const validateSchema = joi_1.default.object({
            messageType: "removeUserFromRoom",
            userId: joi_1.default.string().required()
        });
        return !!validateSchema.validate(message)["error"] ? undefined : message;
    }
}
exports.default = IsRoomMessageValid;
