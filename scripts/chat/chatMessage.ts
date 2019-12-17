export type chatMessageInfo = {
    date: number;
    message: string;
}

export default class ChatMessage {
    public readonly messageDate: Date;
    public readonly message: string;

    constructor(message: string) {
        this.messageDate = new Date(Date.now());
        this.message = message;
    }

    protected GetInfo(): chatMessageInfo {
        return {
            "date": this.messageDate.getTime(),
            "message": this.message
        }
    }
}