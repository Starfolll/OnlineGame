import LobbyUser from "./lobbyUser";
import ChatMessage from "../chat/chatMessage";

export default class Lobby {
    public readonly lobbyId: number;
    public readonly lobbyToken: string;

    private readonly lobbyUsers: { [userId: number]: LobbyUser } = [];
    private readonly lobbyMessages: Array<ChatMessage> = [];

    private readonly messagesCountLimit: number = 30;


    constructor(lobbyId: number, lobbyToken: string) {
        this.lobbyId = lobbyId;
        this.lobbyToken = lobbyToken;
    }


    public AddUser(user: LobbyUser): void {
        this.lobbyUsers[user.userId] = user;
    }


    public AddMessage(message: ChatMessage): void {
        this.lobbyMessages.push(message);

        if (this.lobbyMessages.length > this.messagesCountLimit) this.lobbyMessages.pop();
    }
}