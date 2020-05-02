import {userPublicData} from "../../models/user/user";

export type chatMessageInfo = {
    user: userPublicData;
    date: number;
    message: string;
    isServerMessage: boolean;
}

export default class ChatMessage {
    public readonly messageDate: Date;
    public readonly message: string;
    public readonly isServerMessage: boolean;

    public readonly user: userPublicData;


    constructor(user: userPublicData, message: string, isServerMessage = false) {
        this.messageDate = new Date(Date.now());
        this.isServerMessage = isServerMessage;
        this.message = message;
        this.user = user;
    }

    public GetMessageInfo(): chatMessageInfo {
        return {
            "user": this.user,
            "date": this.messageDate.getTime(),
            "message": this.message,
            "isServerMessage": this.isServerMessage
        }
    }
}