"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Chat {
    constructor(maxSavedMessages, startMessages) {
        this.messages = [];
        this.startMessages = [];
        this.maxSavedMessages = maxSavedMessages;
        this.startMessages = startMessages !== null && startMessages !== void 0 ? startMessages : [];
    }
    AddMessage(message) {
        this.messages.push(message);
        if (this.messages.length > this.maxSavedMessages)
            this.messages.shift();
    }
    GetMessages() {
        return this.messages;
    }
    GetStartMessages() {
        return this.startMessages;
    }
}
exports.default = Chat;
