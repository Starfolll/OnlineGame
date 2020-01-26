"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatMessage {
    constructor(user, message, isServerMessage = false) {
        this.messageDate = new Date(Date.now());
        this.isServerMessage = isServerMessage;
        this.message = message;
        this.user = user;
    }
    GetMessageInfo() {
        return {
            "user": this.user,
            "date": this.messageDate.getTime(),
            "message": this.message,
            "isServerMessage": this.isServerMessage
        };
    }
}
exports.default = ChatMessage;
