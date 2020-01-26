"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Chat {
    constructor(maxSavedMessages) {
        this.messages = [];
        this.maxSavedMessages = maxSavedMessages;
    }
    AddMessage(message) {
        this.messages.push(message);
        if (this.messages.length > this.maxSavedMessages)
            this.messages.pop();
    }
    GetMessages() {
        return this.messages;
    }
}
exports.default = Chat;
