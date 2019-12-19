export default class Chat<T> {
    public readonly messages: Array<T> = [];
    public readonly maxSavedMessages: number;

    constructor(maxSavedMessages: number) {
        this.maxSavedMessages = maxSavedMessages;
    }

    public AddMessage(message: T): void {
        this.messages.push(message);

        if (this.messages.length > this.maxSavedMessages) this.messages.pop();
    }

    public GetMessages(): Array<T> {
        return this.messages;
    }
}