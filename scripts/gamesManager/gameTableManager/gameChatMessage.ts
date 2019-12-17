import ChatMessage, {chatMessageInfo} from "../../chat/chatMessage";

export type gameChatMessageInfo = {
    playerId: number,
    messageInfo: chatMessageInfo;
}

export default class GameChatMessage extends ChatMessage {
    private readonly playerId: number;

    constructor(playerId: number, message: string) {
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