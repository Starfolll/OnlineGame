import ChatMessage, {chatMessageInfo} from "./chatMessage";

export type gameChatMessageInfo = {
    playerId: string,
    messageInfo: chatMessageInfo;
}

export default class GameChatMessage extends ChatMessage {
    private readonly playerId: string;

    constructor(playerId: string, message: string) {
        super(message);

        this.playerId = playerId;
    }

    public GetMessageInfo(): gameChatMessageInfo {
        return {
            "playerId": this.playerId,
            "messageInfo": super.GetInfo()
        }
    }
}